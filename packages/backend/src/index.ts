import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { config } from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { AuthChecker, buildSchema } from "type-graphql";
import { HealthResolver } from "./resolvers/HealthResolver";
// import expressJWT from "express-jwt";
import session from "express-session";
import jwt from "jsonwebtoken";
import { User } from "./entity/User";
import { HostResolver } from "./resolvers/HostResolver";
import { hashPassword, UserResolver } from "./resolvers/UserResolver";
import { Context } from "./types";
import cors from "cors";

(async () => {
    const app = express();

    config();

    app.use(express.json());
    app.use(cors());

    app.use(
        session({
            secret: "keyboard cat",
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true },
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

    const customAuthChecker: AuthChecker<Context> = ({ context }, roles) => {
        const { user } = context;

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

    app.post("/auth", async (req, res) => {
        try {
            const user = await User.find({
                ...req.body,
                password: hashPassword(req.body.password),
            });

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

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(process.env.PORT || 8000, () => {
        console.log("express server started");
    });
})();
