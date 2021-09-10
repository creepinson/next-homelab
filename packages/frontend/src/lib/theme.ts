import {
    extendTheme,
    theme as baseTheme,
    withDefaultColorScheme,
} from "@chakra-ui/react";

export const theme = extendTheme(
    {
        config: {
            initialColorMode: "dark",
            useSystemColorMode: false,
        },
    },
    withDefaultColorScheme({ colorScheme: "gray" }),
    baseTheme,
);
