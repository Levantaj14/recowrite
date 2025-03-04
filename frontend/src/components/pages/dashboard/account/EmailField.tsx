import { Flex, Heading, Input } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
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
  const [disabled, setDisabled] = useState(false);

  const onSave = () => {
    setDisabled(true);
    toast.promise(updateEmail(email), {
      loading: CustomLoading(t('dashboard.account.toast.email.loading')),
      success: () => {
        setDisabled(false);
        return t('dashboard.account.toast.email.success');
      },
      error: () => {
        if (userDetails) {
          setUserDetails({ ...userDetails, email });
        }
        setDisabled(false);
        return t('dashboard.account.toast.email.error');
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.08 }}
    >
      <Flex align="start" justifyContent="space-between" alignItems="center" mt="4">
        <Heading size="md">{t('dashboard.account.fields.email')}</Heading>
        <Flex align="start" alignItems="center" gap="2">
          <Input width="350px" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button size="sm" variant="outline" disabled={disabled} onClick={onSave}>
          {t('buttons.save')}
          </Button>
        </Flex>
      </Flex>
    </motion.div>
  );
}
