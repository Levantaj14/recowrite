import { Tabs } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Login from '@/components/pages/login/Login.tsx';
import SignUp from '@/components/pages/login/SignUp.tsx';
import { useTranslation } from 'react-i18next';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {userDetails} = useContext(UserDetailContext);

  useEffect(() => {
    if (userDetails !== null) {
      navigate('/');
    }
  }, [navigate, userDetails])

  return (
    <Tabs.Root lazyMount unmountOnExit defaultValue="login">
      <Tabs.List>
        <Tabs.Trigger value="login">{t('loginPage.login.title')}</Tabs.Trigger>
        <Tabs.Trigger value="signup">{t('loginPage.signup.title')}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="login">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Login />
        </motion.div>
      </Tabs.Content>
      <Tabs.Content value="signup">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <SignUp />
        </motion.div>
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default LoginPage;
