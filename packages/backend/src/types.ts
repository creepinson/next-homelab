import { Field, ObjectType } from "type-graphql";
import { User } from "./entity/User";
import { Request, Response } from "express";

@ObjectType()
export class Health {
    @Field()
    status: string;
}

@ObjectType()
export class Result {
    @Field()
    message: string;

    @Field()
    status: boolean;

    @Field({ nullable: true })
    user?: User;

    constructor(status: boolean, message?: string, user?: User) {
        this.status = status;
        this.message = message ?? "";
        this.user = user;
    }
}

export interface CustomRequest extends Request {
    userId?: string;
}

export type Context = {
    req: CustomRequest;
    res: Response;
    user: User;
};

declare module "express" {
    export interface Request {
        session: any;
    }
}
