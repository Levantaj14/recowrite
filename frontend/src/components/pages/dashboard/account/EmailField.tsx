import { Flex, Heading, Input } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useContext, useState } from 'react';
import { toast } from 'sonner';
import { updateEmail } from '@/apis/accountApi.ts';
import CustomLoading from '@/components/elements/CustomLoading.tsx';
import { useTranslation } from 'react-i18next';

export function EmailField() {
  const { t } = useTranslation();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const [email, setEmail] = useState(userDetails ? userDetails.email : '');

  function onSave() {
    toast.promise(updateEmail(email), {
      loading: CustomLoading(t('user.profile.account.toast.email.loading')),
      success: () => {
        return t('user.profile.account.toast.email.success');
      },
      error: () => {
        if (userDetails) {
          setUserDetails({ ...userDetails, email });
        }
        return t('user.profile.account.toast.email.error');
      },
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.08 }}
    >
      <Flex align="start" justifyContent="space-between" alignItems="center" mt="4">
        <Heading size="md">{t('user.profile.account.fields.email')}</Heading>
        <Input width="350px" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={onSave} />
      </Flex>
    </motion.div>
  );
}
