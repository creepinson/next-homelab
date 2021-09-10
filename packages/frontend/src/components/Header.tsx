import React, { useEffect } from "react";
import {
    Menu,
    MenuList,
    MenuItem,
    MenuButton,
    Button,
    Flex,
    Box,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useLocation } from "wouter";
import { useLogoutMutation, useProfileQuery } from "../generated/graphql";

const Header = () => {
    const [, setLocation] = useLocation();
    const { data, loading } = useProfileQuery();
    const [logout, { loading: logoutLoading }] = useLogoutMutation();

    let body: React.ReactNode | null = null;
    // Data is loading
    if (loading) {
        // user not logged in
    } else if (!data?.profile?.user) {
        console.log(data);
        body = (
            <>
                <MenuItem onClick={() => setLocation("/register")}>
                    Register
                </MenuItem>
                <MenuItem onClick={() => setLocation("/login")}>Login</MenuItem>
            </>
        );
        // user is logged in
    } else {
        body = (
            <Flex>
                <Box mr={2}>{data.profile.user.username}</Box>
                <MenuItem onClick={() => setLocation("/")}>Home</MenuItem>
                <Button
                    variant="link"
                    onClick={() => logout()}
                    isLoading={logoutLoading}
                >
                    Logout
                </Button>
            </Flex>
        );
    }

    return (
        <Flex p={4} w="full" h={75} bg="gray.900">
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Links
                </MenuButton>
                <MenuList>{body}</MenuList>
            </Menu>
        </Flex>
    );
};

export default Header;
