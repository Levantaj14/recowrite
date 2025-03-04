import { updatePreferences } from '@/apis/accountApi';
import { Checkbox } from '@/components/ui/checkbox';
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select';
import { UserDetailContext } from '@/contexts/userDetailContext';
import { createListCollection, Flex, Heading, SelectValueChangeDetails, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Preferences() {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);
  const [receiveEmails, setReceiveEmails] = useState<boolean | undefined>(userDetails?.getEmail);

  const languages = createListCollection({
    items: [
      { label: 'English', value: 'en' },
      { label: 'Magyar', value: 'hu' },
      { label: 'Română', value: 'ro' },
    ],
  });

  useEffect(() => {
    if (userDetails?.getEmail !== undefined) {
      setReceiveEmails(userDetails.getEmail);
    }
  }, [userDetails]);

  useEffect(() => {
    document.title = t('dashboard.tabs.preferences');
  }, [t]);

  useEffect(() => {
    if (userDetails && receiveEmails !== undefined) {
      setUserDetails({ ...userDetails, getEmail: receiveEmails });
      updatePreferences(selectedLanguage, receiveEmails);
    }
  }, [selectedLanguage, receiveEmails, userDetails, setUserDetails]);

  const languageChanged = (e: SelectValueChangeDetails) => {
    i18n.changeLanguage(e.value[0]);
    localStorage.setItem('language', e.value[0]);
    if (userDetails) {
      setUserDetails({ ...userDetails, language: e.value[0] });
    }
    setSelectedLanguage(e.value[0]);
  };

  return (
    <>
      <Heading size="2xl">{t('dashboard.tabs.preferences')}</Heading>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <Flex align="start" justifyContent="space-between" alignItems="center" mt="4">
          <Flex direction="column">
            <Heading size="md">{t('dashboard.preferences.language.title')}</Heading>
            <Text>{t('dashboard.preferences.language.desc')}</Text>
          </Flex>
          <SelectRoot collection={languages} width="200px" value={[selectedLanguage]} onValueChange={languageChanged}>
            <SelectTrigger>
              <SelectValueText placeholder={t('dashboard.preferences.language.select')} />
            </SelectTrigger>
            <SelectContent>
              {languages.items.map((language) => (
                <SelectItem item={language} key={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Flex>
      </motion.div>
      {userDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.04 }}
        >
          <Flex align="start" justifyContent="space-between" alignItems="center" mt="4">
            <Flex direction="column">
              <Heading size="md">{t('dashboard.preferences.notifications.title')}</Heading>
              <Text>{t('dashboard.preferences.notifications.desc')}</Text>
            </Flex>
            <Checkbox checked={receiveEmails} onCheckedChange={(e) => setReceiveEmails(!!e.checked)} />
          </Flex>
        </motion.div>
      )}
    </>
  );
}
