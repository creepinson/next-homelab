import { useQuery } from "@apollo/client";
import { gql } from "apollo-boost";
import React from "react";
import { Container, Button } from "react-bootstrap";

const hostsPerPage = 10;

const GET_HOSTS = gql`
    query health {
        health {
            status
        }
    }
`;

function Health() {
    const { loading, error, data } = useQuery(GET_HOSTS, {
        variables: {},
        notifyOnNetworkStatusChange: true,
    });
    if (data && data.health) return <p>Status: {data.health.status}</p>;
    return <div>Loading...</div>;
}

export default Health;
