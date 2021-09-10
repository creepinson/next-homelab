import React, { InputHTMLAttributes } from "react";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
} from "@chakra-ui/react";
import { useField } from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
};

export const InputField: React.FC<InputFieldProps> = ({
    label,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    size: _,
    ...props
}) => {
    const [field, { error }] = useField(props);

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input {...props} {...field} id={field.name} />

            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
};
