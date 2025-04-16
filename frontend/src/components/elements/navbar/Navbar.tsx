import { Flex, Spacer, Container, Heading, Box, Button } from '@chakra-ui/react';
import { NavLink } from 'react-router';
import { useContext, useEffect } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import LoggedInAvatar from '@/components/elements/navbar/LoggedInAvatar.tsx';
import { checkCookie } from '@/apis/authApi.ts';
import { useTranslation } from 'react-i18next';

const StickyNavbar = () => {
  const { t } = useTranslation();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);

  useEffect(() => {
    checkCookie().then(setUserDetails);
  }, [setUserDetails]);

  return (
    <Box as="nav" position="sticky" top="0" zIndex="sticky" p={4} backdropFilter="saturate(180%) blur(5px)">
      <Container mt="1" mb="1" maxW="6xl">
        <Flex align="center">
          <NavLink to="/">
            <Heading>recowrite small</Heading>
          </NavLink>
          <Spacer />
          <NavLink to="/dashboard">
            <Button variant="ghost" size="xs" mr="2">
              {t('navbar.buttons.dashboard')}
            </Button>
          </NavLink>
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

export default StickyNavbar;
