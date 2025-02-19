import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Container } from '@chakra-ui/react';
import { StrictMode, useEffect, useMemo, useState } from 'react';
import { Provider } from '@/components/ui/provider.tsx';
import { UserDetailContext, UserDetailContextType, UserDetailType } from '@/contexts/userDetailContext.ts';
import { BrowserRouter, Route, Routes } from 'react-router';
import StickyNavbar from '@/components/elements/navbar/Navbar.tsx';
import Story from '@/components/pages/story/Story.tsx';
import User from '@/components/pages/User.tsx';
import LoginPage from '@/components/pages/login/LoginPage.tsx';
import NotFound from '@/components/pages/NotFound.tsx';
import { Toaster } from 'sonner';
import Home from '@/components/pages/Home.tsx';
import '../i18n.ts';
import Dashboard from './pages/dashboard/Dashboard.tsx';
import { useTranslation } from 'react-i18next';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      refetchInterval: 30000,
    },
  },
});

function App() {
  const { i18n } = useTranslation();

  const [userDetails, setUserDetails] = useState<UserDetailType | null>(null);
  const userDetailsMemo: UserDetailContextType = {
    userDetails,
    setUserDetails,
  };
  const userDetailContext = useMemo(() => userDetailsMemo, [userDetails]);

  useEffect(() => {
    if (userDetails) {
      i18n.changeLanguage(userDetails.language);
      localStorage.setItem('language', userDetails.language);
    } else {
      i18n.changeLanguage(localStorage.getItem('language') || 'en');
    }
  }, [i18n, userDetails]);

  return (
    <StrictMode>
      <Provider>
        <QueryClientProvider client={queryClient}>
          <UserDetailContext.Provider value={userDetailContext}>
            <BrowserRouter>
              <StickyNavbar />
              <Container as="main" mt="4" mb="4" maxW="6xl">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog/:blogId" element={<Story />} />
                  <Route path="/user/:userId" element={<User />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Container>
            </BrowserRouter>
          </UserDetailContext.Provider>
        </QueryClientProvider>
        <Toaster theme="system" />
      </Provider>
    </StrictMode>
  );
}

export default App;
