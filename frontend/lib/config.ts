import { withData } from "next-apollo";
import { HttpLink } from "apollo-link-http";

const GRAPGQL_URI = "http://localhost:8080/v1/graphql"; // url from Hasura

export default withData({
    link: new HttpLink({ uri: GRAPGQL_URI }),
});
