import { Heading, Tabs } from '@chakra-ui/react';
import Preferences from './Preferences';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <>
      <Heading size="4xl" mb="6">{t('dashboard.title')}</Heading>
      <Tabs.Root lazyMount unmountOnExit defaultValue="preferences">
        <Tabs.List>
          <Tabs.Trigger value="preferences">{t('dashboard.tabs.preferences')}</Tabs.Trigger>
          <Tabs.Trigger value="account">{t('dashboard.tabs.account')}</Tabs.Trigger>
          <Tabs.Trigger value="comments">{t('dashboard.tabs.comments')}</Tabs.Trigger>
          <Tabs.Trigger value="likes">{t('dashboard.tabs.likes')}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="preferences">
          <Preferences />
        </Tabs.Content>
        <Tabs.Content value="account">Account</Tabs.Content>
        <Tabs.Content value="comments">Comments</Tabs.Content>
        <Tabs.Content value="likes">Likes</Tabs.Content>
      </Tabs.Root>
    </>
  );
}
