import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import { UserDetailContext } from '@/contexts/userDetailContext';
import { createListCollection, Flex, Heading, Text } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export default function Preferences() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { userDetails } = useContext(UserDetailContext);

  const languages = createListCollection({
    items: [
      { label: 'English', value: 'en' },
      { label: 'Magyar', value: 'hu' },
      { label: 'Română', value: 'ro' },
    ],
  });
  const themes = createListCollection({
    items: [
      { label: t('dashboard.preferences.theme.themes.light'), value: 'light' },
      { label: t('dashboard.preferences.theme.themes.dark'), value: 'dark' },
      { label: t('dashboard.preferences.theme.themes.system'), value: 'system' },
    ],
  });

  useEffect(() => {
    if (!userDetails) {
      navigate('/');
    }
  }, [navigate, userDetails]);

  return (
    <>
      <Heading size="2xl">{t('dashboard.tabs.preferences')}</Heading>
      <Flex align="start" justifyContent="space-between" mt="4">
        <Flex direction="column">
          <Heading size="md">{t('dashboard.preferences.language.title')}</Heading>
          <Text>{t('dashboard.preferences.language.desc')}</Text>
        </Flex>
        <SelectRoot collection={languages} width="200px" value={[i18n.language]} onValueChange={(e) => i18n.changeLanguage(e.value[0])}>
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
      <Flex align="start" justifyContent="space-between" mt="4">
        <Flex direction="column">
          <Heading size="md">{t('dashboard.preferences.theme.title')}</Heading>
          <Text>{t('dashboard.preferences.theme.desc')}</Text>
        </Flex>
        <SelectRoot collection={themes} width="200px">
          <SelectTrigger>
            <SelectValueText placeholder={t('dashboard.preferences.theme.select')} />
          </SelectTrigger>
          <SelectContent>
            {themes.items.map((theme) => (
              <SelectItem item={theme} key={theme.value}>
                {theme.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </Flex>
    </>
  );
}
