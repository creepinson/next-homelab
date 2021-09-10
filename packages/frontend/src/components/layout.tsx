import React from "react";
import Header from "./Header";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
    ChakraProvider,
    ColorModeProvider,
    CSSReset,
    Flex,
    VStack,
    Grid,
} from "@chakra-ui/react";
import { theme } from "../lib/theme";

const Layout: React.FC<Record<string, unknown>> = ({ children }) => (
    <HelmetProvider>
        <ChakraProvider theme={theme}>
            <ColorModeProvider options={theme.config}>
                <Grid minH="100vh">
                    <VStack spacing={8}>
                        <CSSReset />
                        <Helmet>
                            <title>Homelab Panel</title>
                            <link rel="icon" href="/favicon.ico" />
                            <meta charSet="UTF-8" />
                            <meta
                                name="viewport"
                                content="width=device-width, initial-scale=1.0"
                            />
                        </Helmet>

                        <Header />

                        {children}
                    </VStack>
                </Grid>
            </ColorModeProvider>
        </ChakraProvider>
    </HelmetProvider>
);
export default Layout;
