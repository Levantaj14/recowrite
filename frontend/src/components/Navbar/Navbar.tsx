import { Flex, Link, Spacer, Container, Heading, Box, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router';
import { useContext } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import LoggedInAvatar from '@/components/Navbar/LoggedInAvatar.tsx';

const StickyNavbar = () => {
  const { userDetails } = useContext(UserDetailContext);

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
              recowrite
            </Heading>
          </NavLink>
          <Spacer />
          <Flex gap={4} alignItems="center">
            <NavLink to="/about">
              <Link _hover={{ textDecoration: 'underline' }}>
                About
              </Link>
            </NavLink>
            {!userDetails && (
              <NavLink to="/login">
                <Button size="xs">Login</Button>
              </NavLink>
            )}
            {userDetails && (
              <LoggedInAvatar />
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default StickyNavbar;
