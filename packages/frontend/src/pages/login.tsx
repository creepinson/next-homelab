import { Button, Box } from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../lib/toErrorMap";
import { useLocation } from "wouter";

// interface registerProps {}
type loginProps = Record<string, unknown>;

export const LoginPage: React.FC<loginProps> = ({}) => {
    const [login] = useLoginMutation();
    const [, setLocation] = useLocation();

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login({
                        variables: { options: values },
                    });
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response?.data?.login.user) {
                        setLocation("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            placeholder="username"
                            label="Username"
                        />

                        <Box mt="4">
                            <InputField
                                name="password"
                                placeholder="password"
                                label="Password"
                                type="password"
                            />
                        </Box>

                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            colorScheme="teal"
                        >
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};
