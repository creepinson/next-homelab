import { Query, Resolver } from "type-graphql";
import { Health } from "../types";
@Resolver()
export class HealthResolver {
    @Query(() => Health)
    health(): Health {
        return {
            status: "ok",
        };
    }
}
