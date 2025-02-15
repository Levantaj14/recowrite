import { Tabs } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Login from '@/components/pages/login/Login.tsx';
import SignUp from '@/components/pages/login/SignUp.tsx';
import { useTranslation } from 'react-i18next';

function LoginPage() {
  const { t } = useTranslation();
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
