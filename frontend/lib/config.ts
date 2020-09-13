import { withApollo } from "next-apollo";
import ApolloClient, { InMemoryCache } from "apollo-boost";

const GRAPGQL_URI =
    process.env.GRAPHQL_URI || "http://localhost:8080/graphql"; // url from Hasura

const apolloClient = new ApolloClient({
    uri: GRAPGQL_URI,
    cache: new InMemoryCache(),
});

export default withApollo(apolloClient);
