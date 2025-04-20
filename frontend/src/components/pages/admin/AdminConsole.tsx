import { useContext, useEffect, useState } from 'react';
import { testAdmin } from '@/apis/adminApi.ts';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import NotFound from '@/components/pages/NotFound.tsx';
import { Alert, Heading, Tabs } from '@chakra-ui/react';
import Preferences from '@/components/pages/dashboard/Preferences.tsx';
import StrikesTab from '@/components/pages/admin/tabs/StrikesTab.tsx';
import ReportsTab from '@/components/pages/admin/tabs/ReportsTab.tsx';
import DismissedTab from '@/components/pages/admin/tabs/DismissedTab.tsx';

export default function AdminConsole() {
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
        document.title = "Admin console";
        setIsAuthorized(true);
        return;
      }
      setIsAuthorized(false);
    });
  }, [userDetails]);

  return isAuthorized ? (
    <>
      <Heading size="4xl" mb="6">
        Admin Console
      </Heading>
      <Alert.Root mb={3}>
        <Alert.Indicator />
        <Alert.Title>
          The admin console is currently in beta. Currently the only supported language is English. We are deeply sorry for the inconvenience.
        </Alert.Title>
      </Alert.Root>
      <Tabs.Root lazyMount unmountOnExit defaultValue="preferences" value={tabs}
                 onValueChange={(e) => setTabs(e.value)}>
        <Tabs.List>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
          <Tabs.Trigger value="strikes" disabled>Strikes</Tabs.Trigger>
          <Tabs.Trigger value="dismissed" disabled>Dismissed</Tabs.Trigger>
          <Tabs.Trigger value="dismissed" disabled>Users</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="preferences">
          <Preferences />
        </Tabs.Content>
        <Tabs.Content value="reports"><ReportsTab setIsAuthorized={setIsAuthorized} /></Tabs.Content>
        <Tabs.Content value="strikes"><StrikesTab /></Tabs.Content>
        <Tabs.Content value="dismissed"><DismissedTab /></Tabs.Content>
      </Tabs.Root>
    </>
  ) : (
    <NotFound />
  );
}