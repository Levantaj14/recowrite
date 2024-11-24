import {Flex, Link, Spacer, Container, Heading, Box, Button} from "@chakra-ui/react";

const StickyNavbar = () => {
    return (
        <Box as="nav"
             position="sticky"
             top="0"
             zIndex="sticky"
             p={4}
             backdropFilter="saturate(180%) blur(5px)"
        >
            <Container mt="2" mb="2" maxW="6xl">
                <Flex align="center">
                    <Heading as="h1">recowrite</Heading>
                    <Spacer/>
                    <Flex gap={4}>
                        <Link href="#home" _hover={{textDecoration: "underline"}}>
                            Home
                        </Link>
                        <Link href="#about" _hover={{textDecoration: "underline"}}>
                            About
                        </Link>
                        <a href="#login"><Button size="xs">Login</Button></a>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

export default StickyNavbar;
