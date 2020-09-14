import { Authorized, Query, Resolver } from "type-graphql";
import { Host } from "../entity/Host";

@Resolver()
export class HostResolver {
    @Authorized("admin")
    @Query(() => Host)
    hosts() {
        return Host.find();
    }
}
