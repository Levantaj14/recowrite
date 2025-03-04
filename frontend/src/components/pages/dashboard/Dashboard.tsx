import { Heading, Tabs } from '@chakra-ui/react';
import Preferences from './Preferences';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext';
import { Account } from './account/Account.tsx';
import Likes from './Likes';
import Posts from './Posts';
import Comments from './Comments';

export default function Dashboard() {
  const { t } = useTranslation();
  const { userDetails } = useContext(UserDetailContext);
  const [tabs, setTabs] = useState('preferences');

  useEffect(() => {
    document.title = t('dashboard.title');
    if (userDetails === null) {
      setTabs('preferences');
    }
  }, [t, userDetails]);

  return (
    <>
      <Heading size="4xl" mb="6">
        {t('dashboard.title')}
      </Heading>
      <Tabs.Root lazyMount unmountOnExit defaultValue="preferences" value={tabs}
                 onValueChange={(e) => setTabs(e.value)}>
        <Tabs.List>
          <Tabs.Trigger value="preferences">{t('dashboard.tabs.preferences')}</Tabs.Trigger>
          {userDetails && (
            <>
              <Tabs.Trigger value="account">{t('dashboard.tabs.account')}</Tabs.Trigger>
              <Tabs.Trigger value="posts">{t('dashboard.tabs.posts')}</Tabs.Trigger>
              <Tabs.Trigger value="likes">{t('dashboard.tabs.likes')}</Tabs.Trigger>
              <Tabs.Trigger value="comments">{t('dashboard.tabs.comments')}</Tabs.Trigger>
            </>
          )}
        </Tabs.List>
        <Tabs.Content value="preferences">
          <Preferences />
        </Tabs.Content>
        <Tabs.Content value="account"><Account /></Tabs.Content>
        <Tabs.Content value="posts"><Posts /></Tabs.Content>
        <Tabs.Content value="comments"><Comments /></Tabs.Content>
        <Tabs.Content value="likes"><Likes /></Tabs.Content>
      </Tabs.Root>
    </>
  )
    ;
}
