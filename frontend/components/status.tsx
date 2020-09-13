import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import React from "react";
import { Container, Button } from "react-bootstrap";

const HOSTS_PER_PAGE = 10;

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
