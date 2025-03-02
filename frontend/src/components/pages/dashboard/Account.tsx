import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CheckboxCardIndicator, CheckboxCard } from '@/components/ui/checkbox-card';
import { FileUploadList, FileUploadRoot, FileUploadTrigger } from '@/components/ui/file-upload';
import { UserDetailContext } from '@/contexts/userDetailContext';
import { CheckboxGroup, Flex, Float, Heading, Icon, Input, SimpleGrid } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBluesky, FaInstagram, FaMastodon, FaMedium, FaXTwitter } from 'react-icons/fa6';
import { HiUpload } from 'react-icons/hi';

export function Account() {
  const { t } = useTranslation();
  const { userDetails } = useContext(UserDetailContext);

  const getSocialUrl = (socialName: string): string | undefined => {
    const social = userDetails?.socials.find(s => s.name === socialName);
    return social?.url;
  };

  const items = [
    { icon: <FaInstagram />, label: 'Instagram', checked: getSocialUrl('Instagram') },
    { icon: <FaXTwitter />, label: 'X', checked: getSocialUrl('X') },
    { icon: <FaBluesky />, label: 'Bluesky', checked: getSocialUrl('Bluesky') },
    { icon: <FaMastodon />, label: 'Mastodon', checked: getSocialUrl('Mastodon') },
    { icon: <FaMedium />, label: 'Medium', checked: getSocialUrl('Medium') },
  ];

  return (
    <>
      <Heading size="2xl">{t('dashboard.tabs.account')}</Heading>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <Flex align="start" gap="4" alignItems="center" mt="4">
          <Avatar size="2xl" name={userDetails?.name} src={userDetails?.avatar} />
          <FileUploadRoot accept={['image/*']}>
            <FileUploadTrigger>
              <Button>
                <HiUpload /> Upload file
              </Button>
            </FileUploadTrigger>
            <FileUploadList />
          </FileUploadRoot>
        </Flex>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.04 }}
      >
        <Flex align="start" justifyContent="space-between" alignItems="center" mt="4">
          <Heading size="md">Name</Heading>
          <Input width="400px" value={userDetails?.name} />
        </Flex>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.08 }}
      >
        <Flex align="start" justifyContent="space-between" alignItems="center" mt="4">
          <Heading size="md">Email</Heading>
          <Input width="400px" value={userDetails?.email} />
        </Flex>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.16 }}
      >
        <Heading size="md" mt={4} mb={4}>
          Socials
        </Heading>
        <CheckboxGroup>
          <SimpleGrid minChildWidth="200px" gap="2">
            {items.map((item) => (
              <CheckboxCard
                checked={item.checked !== undefined}
                align="center"
                key={item.label}
                icon={
                  <Icon fontSize="2xl" mb="2">
                    {item.icon}
                  </Icon>
                }
                label={item.label}
                indicator={
                  <Float placement="top-end" offset="6">
                    <CheckboxCardIndicator />
                  </Float>
                }
                addon={<Input value={item.checked} placeholder={item.label === 'Mastodon' ? 'URL' : 'Username'}/>}
              />
            ))}
          </SimpleGrid>
        </CheckboxGroup>
      </motion.div>
    </>
  );
}
