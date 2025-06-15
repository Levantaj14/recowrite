import { useContext, useEffect, useState } from 'react';
import { testAdmin } from '@/apis/adminApi.ts';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import ErrorPage from '@/components/pages/ErrorPage.tsx';
import { Heading, Tabs } from '@chakra-ui/react';
import Preferences from '@/components/pages/dashboard/Preferences.tsx';
import ReportsTab from '@/components/pages/admin/tabs/ReportsTab.tsx';
import { useTranslation } from 'react-i18next';
import UsersTab from '@/components/pages/admin/tabs/UsersTab.tsx';

export default function AdminConsole() {
  const { t } = useTranslation();
  const { userDetails } = useContext(UserDetailContext);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [tabs, setTabs] = useState('reports');

  useEffect(() => {
    if (!userDetails) {
      setIsAuthorized(false);
      return;
    }
    testAdmin().then((response) => {
      if (response) {
        document.title = t('admin.title');
        setIsAuthorized(true);
        return;
      }
      setIsAuthorized(false);
    });
  }, [t, userDetails]);

  // If the user is not an admin, we do show a 404 error page.
  return isAuthorized ? (
    <>
      <Heading size="4xl" mb="6">
        {t('admin.title')}
      </Heading>
      <Tabs.Root lazyMount unmountOnExit defaultValue="preferences" value={tabs}
                 onValueChange={(e) => setTabs(e.value)}>
        <Tabs.List>
          <Tabs.Trigger value="reports">{t('admin.report.title')}</Tabs.Trigger>
          <Tabs.Trigger value="users">{t('admin.users.title')}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="preferences">
          <Preferences />
        </Tabs.Content>
        <Tabs.Content value="reports"><ReportsTab setIsAuthorized={setIsAuthorized} /></Tabs.Content>
        <Tabs.Content value="users"><UsersTab setIsAuthorized={setIsAuthorized} /></Tabs.Content>
      </Tabs.Root>
    </>
  ) : (
    <ErrorPage code={404} />
  );
}