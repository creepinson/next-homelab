import { User } from "../entity/User";
import { Arg, Field, InputType, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcrypt";

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
    async createUser(@Arg("options", () => UserInput) options: UserInput) {
        await User.insert({
            ...options,
            password: hashPassword(options.password),
        });

        return true;
    }
}
