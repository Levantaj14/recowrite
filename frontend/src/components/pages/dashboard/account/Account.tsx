import { Avatar } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import { FileUploadList, FileUploadRoot, FileUploadTrigger } from '@/components/ui/file-upload.tsx';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { Flex, Heading } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { HiUpload } from 'react-icons/hi';
import { NameField } from '@/components/pages/dashboard/account/NameField.tsx';
import { EmailField } from '@/components/pages/dashboard/account/EmailField.tsx';
import { PasswordChange } from '@/components/pages/dashboard/account/PasswordChange.tsx';
import { SocialsBoxes } from '@/components/pages/dashboard/account/SocialsBoxes.tsx';

export function Account() {
  const { t } = useTranslation();
  const { userDetails } = useContext(UserDetailContext);
  return (
    <>
      <Heading size="2xl">{t('dashboard.tabs.account')}</Heading>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <Flex align="start" gap="4" alignItems="center" mt="4">
          <Avatar size="2xl" name={userDetails?.name} src={userDetails?.avatar} />
          <FileUploadRoot accept={['image/*']}>
            <FileUploadTrigger>
              <Button variant="outline">
                <HiUpload /> Upload file
              </Button>
            </FileUploadTrigger>
            <FileUploadList />
          </FileUploadRoot>
        </Flex>
      </motion.div>
      <NameField />
      <EmailField />
      <PasswordChange />
      <SocialsBoxes />
    </>
  );
}
