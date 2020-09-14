import Head from "next/head";
import { Container } from "react-bootstrap";
import Header from "./header";

const Layout = ({ children }) => (
    <>
        <Head>
            <title>Next Homelab</title>
            <link rel="icon" href="/favicon.ico" />
            <meta charSet="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
        </Head>

        <Header />

        <Container id="main">{children}</Container>
    </>
);
export default Layout;
