import { Tabs } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Login from '@/components/pages/login/Login.tsx';
import SignUp from '@/components/pages/login/SignUp.tsx';
import { useTranslation } from 'react-i18next';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { EmptyState } from '@/components/ui/empty-state.tsx';
import { MdOutlineMarkEmailUnread } from 'react-icons/md';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {userDetails} = useContext(UserDetailContext);
  const [verify, setVerify] = useState<boolean>(false);

  useEffect(() => {
    if (userDetails !== null) {
      navigate('/');
    }
  }, [navigate, userDetails])

  function showVerify() {
    return (
      <EmptyState
        icon={<MdOutlineMarkEmailUnread />}
        title={t('auth.emailVerification.title')}
        description={t('auth.emailVerification.desc')}
        size="lg"
      />
    )
  }

  function showLogin() {
    return (
      <Tabs.Root lazyMount unmountOnExit defaultValue="login">
        <Tabs.List>
          <Tabs.Trigger value="login">{t('auth.login.title')}</Tabs.Trigger>
          <Tabs.Trigger value="signup">{t('auth.signup.title')}</Tabs.Trigger>
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
            <SignUp setVerify={setVerify} />
          </motion.div>
        </Tabs.Content>
      </Tabs.Root>
    );
  }

  return verify ? showVerify() : showLogin();
}

export default LoginPage;
