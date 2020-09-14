import React from "react";
import Layout from "../components/layout";
import withApollo from "../lib/config";
import Health from "../components/status";

export const Home = (props) => (
    <Layout>
        <h2>Dashboard</h2>
        <p>Hello, World</p>
        <Health />
    </Layout>
);

export default withApollo({ ssr: true })(Home);
