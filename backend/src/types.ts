import { Field, ObjectType } from "type-graphql";
import { User } from "./entity/User";
import { Request, Response } from "express";

@ObjectType()
export class Health {
    @Field()
    status: string;
}

export type Context = {
    req: Request;
    res: Response;
    user: User;
};
