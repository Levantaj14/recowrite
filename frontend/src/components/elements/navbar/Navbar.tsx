import { Flex, Spacer, Container, Heading, Box, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import LoggedInAvatar from '@/components/elements/navbar/LoggedInAvatar.tsx';
import { checkCookie } from '@/apis/authApi.ts';
import { useTranslation } from 'react-i18next';
import { testAdmin } from '@/apis/adminApi.ts';

export default function Navbar() {
  const { t } = useTranslation();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkCookie().then(setUserDetails);
  }, [setUserDetails]);

  const [prevUserDetails, setPrevUserDetails] = useState(userDetails);
  if (prevUserDetails !== userDetails) {
    setPrevUserDetails(userDetails);
    if (!userDetails) {
      setIsAdmin(false);
    } else {
      testAdmin().then((response) => setIsAdmin(response));
    }
  }

  return (
    <Box as="nav" position="sticky" top="0" zIndex="sticky" p={4} backdropFilter="saturate(180%) blur(5px)">
      <Container mt="1" mb="1" maxW="6xl">
        <Flex align="center">
          <NavLink to="/">
            <Heading>recowrite</Heading>
          </NavLink>
          <Spacer />
          {/*The admin button should only show up if an admin is logged in*/}
          {isAdmin && (
            <NavLink to="/management">
              <Button variant="ghost" size="xs" mr="2">
                {t('admin.title')}
              </Button>
            </NavLink>
          )}
          <NavLink to="/dashboard">
            <Button variant="ghost" size="xs" mr="2">
              {t('navigation.navbar.buttons.dashboard')}
            </Button>
          </NavLink>
          {/*The login button should only show up if no one is logged in*/}
          {!userDetails && (
            <NavLink to="/login">
              <Button size="xs">{t('buttons.login')}</Button>
            </NavLink>
          )}
          {userDetails && <LoggedInAvatar />}
        </Flex>
      </Container>
    </Box>
  );
};
