import { Button, Box } from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../lib/toErrorMap";
import { useLocation } from "wouter";

// interface registerProps {}
type registerProps = Record<string, unknown>;

export const RegisterPage: React.FC<registerProps> = ({}) => {
    const [register] = useRegisterMutation();
    const [, setLocation] = useLocation();

    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register({ variables: values });
                    if (response.data?.register.errors) {
                        setErrors(toErrorMap(response.data.register.errors));
                    } else if (response?.data?.register.user) {
                        setLocation("/login");
                    }
                }}
            >
                {({ values, handleChange, isSubmitting }) => (
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
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};
