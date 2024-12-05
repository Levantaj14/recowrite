import {Flex, Link, Spacer, Container, Heading, Box, Button} from "@chakra-ui/react";
import {NavLink} from "react-router";

const StickyNavbar = () => {
    return (
        <Box as="nav"
             position="sticky"
             top="0"
             zIndex="sticky"
             p={4}
             backdropFilter="saturate(180%) blur(5px)"
        >
            <Container mt="1" mb="1" maxW="6xl">
                <Flex align="center">
                    <NavLink to="/">
                        <Heading>
                            <Link color="white" _hover={{textDecoration: "underline"}}>
                                recowrite
                            </Link>
                        </Heading>
                    </NavLink>
                    <Spacer/>
                    <Flex gap={4} alignItems="center">
                        <NavLink to="/about">
                            <Link _hover={{textDecoration: "underline"}}>
                                About
                            </Link>
                        </NavLink>
                        <NavLink to="/login"><Button size="xs">Login</Button></NavLink>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

export default StickyNavbar;
