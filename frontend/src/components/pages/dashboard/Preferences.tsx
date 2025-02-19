import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select';
import { createListCollection, Flex, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Preferences() {
  const { i18n, t } = useTranslation();

  const languages = createListCollection({
    items: [
      { label: 'English', value: 'en' },
      { label: 'Magyar', value: 'hu' },
      { label: 'Română', value: 'ro' },
    ],
  });

  useEffect(() => {
    document.title = t('dashboard.tabs.preferences');
    localStorage.setItem('language', i18n.language);
  }, [i18n.language, t]);

  return (
    <>
      <Heading size="2xl">{t('dashboard.tabs.preferences')}</Heading>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <Flex align="start" justifyContent="space-between" mt="4">
          <Flex direction="column">
            <Heading size="md">{t('dashboard.preferences.language.title')}</Heading>
            <Text>{t('dashboard.preferences.language.desc')}</Text>
          </Flex>
          <SelectRoot
            collection={languages}
            width="200px"
            value={[i18n.language]}
            onValueChange={(e) => i18n.changeLanguage(e.value[0])}
          >
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
    </>
  );
}
