import { CheckboxGroup, Float, Heading, Icon, Input, SimpleGrid } from '@chakra-ui/react';
import { CheckboxCard, CheckboxCardIndicator } from '@/components/ui/checkbox-card.tsx';
import { motion } from 'motion/react';
import { FaBluesky, FaInstagram, FaMedium, FaXTwitter } from 'react-icons/fa6';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

export function SocialsBoxes() {
  const { t } = useTranslation();
  const { userDetails } = useContext(UserDetailContext);

  const getSocialUrl = (socialName: string): string | undefined => {
    const social = userDetails?.socials.find((s) => s.name === socialName);
    return social?.url;
  };

  const items = [
    { icon: <FaInstagram />, label: 'Instagram', checked: getSocialUrl('Instagram') },
    { icon: <FaXTwitter />, label: 'X', checked: getSocialUrl('X') },
    { icon: <FaBluesky />, label: 'Bluesky', checked: getSocialUrl('Bluesky') },
    { icon: <FaMedium />, label: 'Medium', checked: getSocialUrl('Medium') },
  ];

  return (
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
              addon={<Input value={item.checked} placeholder={t('dashboard.account.username')} />}
            />
          ))}
        </SimpleGrid>
      </CheckboxGroup>
    </motion.div>
  );
}
