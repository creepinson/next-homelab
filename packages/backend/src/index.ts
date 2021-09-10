import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { config } from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { AuthChecker, buildSchema } from "type-graphql";
import { HealthResolver } from "./resolvers/HealthResolver";
import cookieParser from "cookie-parser";
import session from "express-session";
import jwt from "jsonwebtoken";
import { User } from "./entity/User";
import { HostResolver } from "./resolvers/HostResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { Context, CustomRequest } from "./types";
import cors from "cors";
import { accessTokenSecret, cookieName } from "./config";

(async () => {
    const app = express();

    config();

    app.use(express.json());
    app.use(
        cors({
            credentials: true,
            origin: process.env.FRONTEND_URI ?? "http://localhost:3000",
        }),
    );

    app.use(
        session({
            name: cookieName,
            secret: process.env.SESSION_SECRET ?? "keyboard cat",
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                secure: false,
                httpOnly: true,
                sameSite: "lax",
            },
        }),
    );

    await createConnection({
        type: "postgres",
        database: `${process.env.DB_NAME ?? "homelab"}`,
        username: process.env.DB_USER ?? "root",
        password: process.env.DB_PASS,
        host: process.env.DB_HOST ?? "localhost",
        synchronize: true,
        logging: process.env.DB_DEBUG === "true",
        entities: ["src/entity/**/*.ts"],
        migrations: ["src/migration/**/*.ts"],
        subscribers: ["src/subscriber/**/*.ts"],
        cli: {
            entitiesDir: "src/entity",
            migrationsDir: "src/migration",
            subscribersDir: "src/subscriber",
        },
    });

    const customAuthChecker: AuthChecker<Context> = async (
        { context },
        roles,
    ) => {
        const { req } = context;
        if (!req.userId) return false;

        const user = await User.findOne(req.userId);

        if (roles.length === 0)
            // if `@Authorized()`, check only is user exist
            return user !== undefined;

        // there are some roles defined now

        if (!user)
            // and if no user, restrict access
            return false;

        if (user.roles?.some((role) => roles.includes(role)))
            // grant access if the roles overlap
            return true;

        // no roles matched, restrict access
        return false;
    };

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HealthResolver, UserResolver, HostResolver],
            authChecker: customAuthChecker,
        }),
        context: ({ req, res }: Context) => ({
            req,
            res,
        }),
    });
    await apolloServer.start();

    app.use(cookieParser());

    app.use((req: CustomRequest, res, next) => {
        const accessToken = req.cookies["access-token"];
        try {
            const data = jwt.verify(accessToken, accessTokenSecret) as any;
            req.session.userId = data.userId;
        } catch {}
        next();
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(process.env.PORT || 8080, () => {
        console.log("express server started");
    });
})();
