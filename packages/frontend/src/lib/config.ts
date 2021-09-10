import { ApolloClient, InMemoryCache } from "@apollo/client";

const GRAPGQL_URI = process.env.GRAPHQL_URI || "http://localhost:8080/graphql"; // url from Hasura

export const apolloClient = new ApolloClient({
    uri: GRAPGQL_URI,
    cache: new InMemoryCache(),
    credentials: "include",
});
