import { Authorized, Query, Resolver } from "type-graphql";
import { Host } from "../entity/Host";

@Resolver()
export class HostResolver {
    @Authorized("admin")
    @Query(() => [Host])
    async hosts() {
        return await Host.find();
    }
}
