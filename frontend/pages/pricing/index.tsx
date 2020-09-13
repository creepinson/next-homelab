import React from "react";
import Layout from "../../components/layout";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Button, InputGroup, Alert } from "react-bootstrap";

const Pricing = () => {
    const router = useRouter();
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = (data: { service: string; budget?: number }) => {
        fetch(`/api/pricing?service=${data.service}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.error)
                    return alert(`Error: ${res.error}, Status: ${res.status}`);
                router.push({
                    pathname: "/pricing/result",
                    query: { pricing: res.pricing || {}, budget: data.budget },
                });
            });
    };
    return (
        <Layout>
            <h2>Pricing Calculator</h2>
            <h3>Service Pricing Calculator</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputGroup>
                    <label>Select Hosting Service: </label>
                    <select name="service" ref={register({ required: true })}>
                        <option>Heimsnet</option>
                    </select>
                    {errors.service && (
                        <Alert variant="danger">This field is required!</Alert>
                    )}
                </InputGroup>
                <InputGroup>
                    <label>Budget (in USD, 0 = no budget)</label>
                    <input name="budget" placeholder="0" ref={register({})} />
                </InputGroup>
                <InputGroup>
                    <Button type="submit">Calculate</Button>
                </InputGroup>
            </form>
        </Layout>
    );
};

export default Pricing;
