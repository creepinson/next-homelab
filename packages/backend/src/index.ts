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
import { ACCESS_TOKEN_SECRET } from "./config";

(async () => {
    const app = express();

    config();

    app.use(express.json());
    app.use(cors());

    app.use(
        session({
            secret: "keyboard cat",
            resave: true,
            saveUninitialized: true,
            cookie: { secure: "auto", httpOnly: false },
        }),
    );

    await createConnection({
        type: "postgres",
        database: `${process.env.DB_NAME ?? "homelab"}`,
        username: process.env.DB_USER ?? "root",
        password: process.env.DB_PASS,
        host: process.env.DB_HOST ?? "localhost",
        synchronize: true,
        logging: true,
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

        if (user.roles?.split(",").some((role) => roles.includes(role)))
            // grant access if the roles overlap
            return true;

        // no roles matched, restrict access
        return false;
    };

    app.post("/auth", async (_req, res) => {
        try {
            const req = _req as CustomRequest;
            if (!req.userId)
                return res.status(400).json({ error: "Not authenticated" });

            const user = await User.findOne(req.userId);

            if (!user) return res.status(500).json({ error: "Invalid user" });

            const token = jwt.sign(
                req.session?.user,
                process.env.SECRET || "secret1234",
            );
            req.session!.token = token;
            req.session!.user = user;
            return req.session!.save(() => {
                res.json({ token, user });
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HealthResolver, UserResolver, HostResolver],
            authChecker: customAuthChecker,
        }),
        context: ({ req, res }: Context) => ({
            req,
            res,
            user: (req as any).session.user as User,
        }),
    });

    app.use(cookieParser());

    app.use((req, _, next) => {
        const accessToken = req.cookies["access-token"];
        try {
            const data = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as any;
            (req as any).userId = data.id;
        } catch {}
        next();
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(process.env.PORT || 8000, () => {
        console.log("express server started");
    });
})();
