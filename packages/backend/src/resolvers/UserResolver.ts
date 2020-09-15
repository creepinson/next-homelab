import { User } from "../entity/User";
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    Query,
    Resolver,
} from "type-graphql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config";
import { Context, Result } from "../types";

export const hashPassword = (password: string) => bcrypt.hashSync(password, 12);

@InputType()
class UserInput {
    @Field()
    username: string;

    @Field()
    password: string;
}

@Resolver()
export class UserResolver {
    @Mutation(() => Boolean)
    // @Authorized("admin")
    async register(@Arg("options", () => UserInput) options: UserInput) {
        await User.insert({
            ...options,
            password: hashPassword(options.password),
        });

        return true;
    }

    @Query(() => Result)
    // @Authorized("admin")
    async profile(@Ctx() ctx: Context) {
        if (!ctx.req.userId) return new Result(false, "Not authenticated");
        const user = await User.findOne(ctx.req.userId);
        if (!user) return new Result(false, "Invalid user");
        return new Result(true, "", user);
    }

    @Mutation(() => Result)
    async login(
        @Arg("options", () => UserInput) options: UserInput,
        @Ctx() ctx: Context,
    ) {
        const { res } = ctx;
        try {
            const user = await User.findOne({ username: options.username });

            if (!user) return new Result(false, "Invalid user");

            if (!bcrypt.compareSync(options.password, user.password))
                return new Result(false, "Invalid credentials");

            const refreshToken = jwt.sign(
                { id: user.id },
                REFRESH_TOKEN_SECRET,
                {
                    expiresIn: "7d",
                },
            );

            const accessToken = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, {
                expiresIn: "15min",
            });

            res.cookie("refresh-token", refreshToken);

            res.cookie("access-token", accessToken);
            return new Result(true, "", user);
        } catch (error) {
            return new Result(false, error.message);
        }
    }
}
