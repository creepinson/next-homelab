import { User } from "../entity/User";
import {
    Arg,
    Authorized,
    Ctx,
    Field,
    InputType,
    Mutation,
    Query,
    Resolver,
} from "type-graphql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { accessTokenSecret, refreshTokenSecret } from "../config";
import { Context, Result, TokenResult, UserResult } from "../types";

export const hashPassword = (password: string) => bcrypt.hashSync(password, 12);

@InputType()
export class UserInput {
    @Field()
    username!: string;

    @Field()
    password!: string;
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResult)
    // @Authorized("admin")
    async register(@Arg("options", () => UserInput) options: UserInput) {
        try {
            await User.insert({
                ...options,
                password: hashPassword(options.password),
            });
        } catch (err) {
            if ((err as { detail: string }).detail.includes("already exists")) {
                return new UserResult([
                    {
                        field: "username",
                        message: "username already taken",
                    },
                ]);
            }
        }
        const user = await User.findOne({
            username: options.username,
        });
        if (!user)
            return new UserResult([
                {
                    field: "username",
                    message: "User doesn't exist",
                },
            ]);
        return new UserResult(undefined, user);
    }

    @Query(() => UserResult)
    // @Authorized("admin")
    async profile(@Ctx() ctx: Context) {
        if (!ctx.req.session.userId)
            return new UserResult([
                {
                    field: "userId",
                    message: "Not logged in",
                },
            ]);
        const user = await User.findOne(ctx.req.session.userId);
        if (!user)
            return new UserResult([
                {
                    field: "username",
                    message: "User doesn't exist",
                },
            ]);
        return new UserResult(undefined, user);
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() ctx: Context) {
        return new Promise<boolean>((resolve) => {
            ctx.req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }

                ctx.res.clearCookie("qid");

                resolve(true);
            });
        });
    }

    @Mutation(() => UserResult)
    async refreshToken(@Ctx() ctx: Context) {
        const refreshToken = ctx.req.session.refreshToken;
        if (!refreshToken) return new UserResult();

        try {
            const payload = jwt.verify(refreshToken, refreshTokenSecret) as {
                userId: string;
            };
            const user = await User.findOne(payload.userId);
            if (!user)
                return new UserResult([
                    {
                        field: "username",
                        message: "User doesn't exist",
                    },
                ]);
            const accessToken = jwt.sign(
                { userId: user.id },
                accessTokenSecret,
                {
                    expiresIn: "15m",
                },
            );
            ctx.req.session.accessToken = accessToken;
            return new TokenResult(undefined, accessToken);
        } catch (error) {
            return new Result([
                {
                    field: "refresh-token",
                    message: "Invalid refresh token",
                },
            ]);
        }
    }

    @Mutation(() => Result)
    @Authorized()
    async deleteUser(@Ctx() ctx: Context) {
        if (!ctx.req.userId)
            return new UserResult([
                {
                    field: "userId",
                    message: "Not logged in",
                },
            ]);
        const user = await User.findOne(ctx.req.session.userId);
        if (!user)
            return new UserResult([
                {
                    field: "username",
                    message: "User doesn't exist",
                },
            ]);
        await User.delete(user.id);
        return new Result();
    }

    @Mutation(() => UserResult)
    async login(
        @Arg("options", () => UserInput) options: UserInput,
        @Ctx() ctx: Context,
    ) {
        const user = await User.findOne({ username: options.username });

        if (!user)
            return new UserResult([
                {
                    field: "username",
                    message: "User doesn't exist",
                },
            ]);
        if (!bcrypt.compareSync(options.password, user.password))
            return new UserResult([
                {
                    field: "password",
                    message: "Invalid credentials",
                },
            ]);

        const refreshToken = jwt.sign({ id: user.id }, refreshTokenSecret, {
            expiresIn: "7d",
        });

        const accessToken = jwt.sign({ id: user.id }, accessTokenSecret, {
            expiresIn: "15min",
        });

        ctx.req.session.accessToken = accessToken;
        ctx.req.session.refreshToken = refreshToken;
        ctx.req.session.userId = user.id;

        return new UserResult(undefined, user);
    }
}
