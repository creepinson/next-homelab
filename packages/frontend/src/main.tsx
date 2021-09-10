import Layout from "./components/layout";
import React from "react";
import { render } from "react-dom";
import { Route, Router } from "wouter";
import { HomePage } from "./pages";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./lib/config";
import { RegisterPage } from "./pages/register";
import { Grid } from "@chakra-ui/react";
import { LoginPage } from "./pages/login";

const root = document.createElement("div");
document.body.appendChild(root);

render(
    <ApolloProvider client={apolloClient}>
        <Layout>
            <Router>
                <Route path="/">
                    <HomePage />
                </Route>
                <Route path="/register">
                    <RegisterPage />
                </Route>
                <Route path="/login">
                    <LoginPage />
                </Route>
            </Router>
        </Layout>
    </ApolloProvider>,
    root,
);
