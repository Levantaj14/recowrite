import { Flex, Heading, Input } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { useContext, useState } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { toast } from 'sonner';
import { updateName } from '@/apis/accountApi.ts';
import CustomLoading from '@/components/elements/CustomLoading.tsx';
import { useTranslation } from 'react-i18next';

export function NameField() {
  const { t } = useTranslation();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const [name, setName] = useState(userDetails ? userDetails.name : '');

  function saveName() {
    toast.promise(updateName(name), {
      loading: CustomLoading(t('user.profile.account.toast.name.loading')),
      success: () => {
        if (userDetails) {
          setUserDetails({ ...userDetails, name });
        }
        return t('user.profile.account.toast.name.success');
      },
      error: () => {
        return t('user.profile.account.toast.name.error');
      },
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.04 }}
    >
      <Flex align="start" justifyContent="space-between" alignItems="center" mt="4">
        <Heading size="md">{t('user.profile.account.fields.name')}</Heading>
        <Input width="350px" value={name} onChange={(e) => setName(e.target.value)} onBlur={saveName} />
      </Flex>
    </motion.div>
  );
}
