import { CheckboxGroup, Float, Heading, Icon, Input, SimpleGrid } from '@chakra-ui/react';
import { CheckboxCard, CheckboxCardIndicator } from '@/components/ui/checkbox-card.tsx';
import { motion } from 'motion/react';
import { FaBluesky, FaInstagram, FaMedium, FaXTwitter } from 'react-icons/fa6';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { updateSocial } from '@/apis/accountApi.ts';
import CustomLoading from '@/components/elements/CustomLoading.tsx';

interface SocialInput {
  [key: string]: string;
}

interface SocialItem {
  icon: JSX.Element;
  label: string;
  name: string;
}

export function SocialsBoxes() {
  const { t } = useTranslation();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const [socialInputs, setSocialInputs] = useState<SocialInput>({});

  useEffect(() => {
    if (userDetails?.socials) {
      const initialInputs = userDetails.socials.reduce<SocialInput>((acc, social) => ({
        ...acc,
        [social.name]: social.url || ''
      }), {});

      setSocialInputs(initialInputs);
    }
  }, [userDetails]);

  const handleInputChange = (socialName: string, value: string) => {
    setSocialInputs(prev => ({
      ...prev,
      [socialName]: value
    }));
  };

  const handleInputBlur = (socialName: string, value: string) => {
    if (!setUserDetails || !userDetails) return;

    const socialExists = userDetails.socials.some(social => social.name === socialName);

    let updatedSocials;
    if (socialExists) {
      updatedSocials = userDetails.socials.map(social => {
        if (social.name === socialName) {
          return { ...social, url: value };
        }
        return social;
      });
    } else {
      updatedSocials = [
        ...userDetails.socials,
        { name: socialName, url: value }
      ];
    }

    setUserDetails({ ...userDetails, socials: updatedSocials });
    toast.promise(updateSocial(value, socialName), {
      loading: CustomLoading(t('dashboard.account.toast.socials.loading')),
      success: t('dashboard.account.toast.socials.success'),
      error: t('dashboard.account.toast.socials.error')
    })
  };

  const getSocialUrl = (socialName: string): string => {
    return socialInputs[socialName] !== undefined ? socialInputs[socialName] : '';
  };

  const isSocialChecked = (socialName: string): boolean => {
    return socialInputs[socialName] !== undefined && socialInputs[socialName] !== '';
  };

  const items: SocialItem[] = [
    { icon: <FaInstagram />, label: 'Instagram', name: 'Instagram' },
    { icon: <FaXTwitter />, label: 'X', name: 'X' },
    { icon: <FaBluesky />, label: 'Bluesky', name: 'Bluesky' },
    { icon: <FaMedium />, label: 'Medium', name: 'Medium' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.16 }}
    >
      <Heading size="md" mt={4} mb={4}>
        {t('dashboard.account.socials')}
      </Heading>
      <CheckboxGroup>
        <SimpleGrid minChildWidth="200px" gap="2">
          {items.map((item) => (
            <CheckboxCard
              checked={isSocialChecked(item.name)}
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
              addon={
                <Input
                  value={getSocialUrl(item.name)}
                  onChange={(e) => handleInputChange(item.name, e.target.value)}
                  onBlur={(e) => handleInputBlur(item.name, e.target.value)}
                  placeholder={t('dashboard.account.username')}
                />
              }
            />
          ))}
        </SimpleGrid>
      </CheckboxGroup>
    </motion.div>
  );
}