import { Flex, Spacer, Container, Heading, Box, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router';
import { useContext, useEffect } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import LoggedInAvatar from '@/components/navbar/LoggedInAvatar.tsx';
import { checkCookie } from '@/apis/authApi.ts';

const StickyNavbar = () => {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);

  useEffect(() => {
    checkCookie().then(setUserDetails);
  }, [setUserDetails]);

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
          {!userDetails && (
            <NavLink to="/login">
              <Button size="xs">Login</Button>
            </NavLink>
          )}
          {userDetails && (
            <LoggedInAvatar />
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default StickyNavbar;
