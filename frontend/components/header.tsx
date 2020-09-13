import Link from "next/link";
import React from "react";
import { Container, Nav, Navbar, NavItem } from "react-bootstrap";

const Header = () => {
    return (
        <header>
            <Navbar>
                <Nav>
                    <NavItem>
                        <a href="/" className="logo">
                            <h1>Next Homelab</h1>
                        </a>
                    </NavItem>
                </Nav>
            </Navbar>
        </header>
    );
};

export default Header;
