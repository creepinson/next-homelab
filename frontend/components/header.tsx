import Link from "next/link";
import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

const Header = () => {
    return (
        <header>
            <Navbar>
                <Nav>
                    <li>
                        <a href="/" className="logo">
                            <h1>Next Homelab</h1>
                        </a>
                    </li>
                    <li>
                        <p>
                            <button className="signInButton">Sign in</button>
                        </p>
                    </li>
                </Nav>
            </Navbar>
        </header>
    );
};

export default Header;
