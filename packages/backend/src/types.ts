import { Field, ObjectType } from "type-graphql";
import { User } from "./entity/User";
import { Request, Response } from "express";
import { Session } from "express-session";

@ObjectType()
export class Health {
    @Field()
    status!: string;
}

@ObjectType()
export class FieldError {
    @Field()
    field!: string;

    @Field()
    message!: string;
}

@ObjectType()
export class Result {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    constructor(errors?: FieldError[]) {
        this.errors = errors;
    }
}

@ObjectType()
export class TokenResult extends Result {
    @Field()
    accessToken?: string;

    constructor(errors?: FieldError[], accessToken?: string) {
        super(errors);
        this.accessToken = accessToken;
    }
}

@ObjectType()
export class UserResult extends Result {
    @Field({ nullable: true })
    user?: User;

    constructor(errors?: FieldError[], user?: User) {
        super(errors);
        this.user = user;
    }
}

export interface CustomRequest extends Request {
    userId?: string;
    session: {
        refreshToken?: string;
        accessToken?: string;
        user?: User;
        userId?: number;
    } & Session;
}

export type Context = {
    req: CustomRequest;
    res: Response;
};
