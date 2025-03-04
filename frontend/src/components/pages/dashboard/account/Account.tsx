import { Avatar } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import { FileUploadRoot, FileUploadTrigger } from '@/components/ui/file-upload.tsx';
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
import { FileAcceptDetails } from '@zag-js/file-upload';
import { uploadAvatar } from '@/apis/accountApi';
import { toast } from 'sonner';

export function Account() {
  const { t } = useTranslation();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);

  const onUpload = (details: FileAcceptDetails) => {
    const file = details.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const cleanBase64 = base64String.split(',')[1];
      if (userDetails) {
        try {
          uploadAvatar(cleanBase64, file.name);
          setUserDetails({ ...userDetails, avatar: cleanBase64 });
          toast.success('Avatar uploaded successfully');
        } catch (err) {
          toast.error('There was an error while uploading user details');
          console.error(err);
        }
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Heading size="2xl">{t('dashboard.tabs.account')}</Heading>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <Flex align="start" gap="4" alignItems="center" mt="4">
          <Avatar size="2xl" name={userDetails?.name} src={`data:image;base64,${userDetails?.avatar}`} />
          <FileUploadRoot accept={['image/*']} onFileAccept={onUpload}>
            <FileUploadTrigger>
              <Button variant="outline">
                <HiUpload /> Upload file
              </Button>
            </FileUploadTrigger>
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
