import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Container, Flex, Spinner } from '@chakra-ui/react';
import { StrictMode, useEffect, useMemo, useState } from 'react';
import { Provider } from '@/components/ui/provider.tsx';
import { UserDetailContext, UserDetailType } from '@/contexts/userDetailContext.ts';
import { BrowserRouter, Route, Routes } from 'react-router';
import Navbar from '@/components/elements/navbar/Navbar.tsx';
import Story from '@/components/pages/story/Story.tsx';
import User from '@/components/pages/User.tsx';
import LoginPage from '@/components/pages/login/LoginPage.tsx';
import ErrorPage from '@/components/pages/ErrorPage.tsx';
import { Toaster } from 'sonner';
import Home from '@/components/pages/Home.tsx';
import '../i18n.ts';
import Dashboard from './pages/dashboard/Dashboard.tsx';
import { useTranslation } from 'react-i18next';
import NewStory from './pages/newStory/NewStory.tsx';
import ForgotPassword from '@/components/pages/ForgotPassword.tsx';
import { VerifyEmail } from '@/components/pages/VerifyEmail.tsx';
import AdminConsole from '@/components/pages/admin/AdminConsole.tsx';
import Footer from './elements/Footer.tsx';
import PendingBlog from './pages/admin/PendingBlog.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      refetchInterval: 30000,
    },
  },
});

function ThemeFavicon() {
  const lightIcon = '/icon_light.png';
  const darkIcon = '/icon_dark.png';
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSystemTheme = () => {
      const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    };

    checkSystemTheme();

    const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    // Listen for changes in the system theme and update the state and thus the favicon
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    // Change the favicon based on the system theme
    if (isDarkMode === null) return;

    const faviconPath = isDarkMode ? darkIcon : lightIcon;

    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link') as HTMLLinkElement;
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    link.href = faviconPath;
  }, [isDarkMode, darkIcon, lightIcon]);

  return null;
}

function App() {
  const { i18n } = useTranslation();

  const [userDetails, setUserDetails] = useState<UserDetailType | null>(null);
  const userDetailContext = useMemo(() => ({ userDetails, setUserDetails }), [userDetails]);

  useEffect(() => {
    if (userDetails) {
      i18n.changeLanguage(userDetails.language);
      localStorage.setItem('language', userDetails.language);
    }
  }, [i18n, userDetails]);

  return (
    <StrictMode>
      <ThemeFavicon />
      <Provider>
        <QueryClientProvider client={queryClient}>
          <UserDetailContext.Provider value={userDetailContext}>
            <BrowserRouter>
              <Navbar />
              {/* Flex column layout for footer placement */}
              <Flex direction="column" minHeight="100vh" mt="4">
                <Container as="main" maxW="6xl" flex={1}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create" element={<NewStory />} />
                    <Route path="/blog/:blogId" element={<Story />} />
                    <Route path="/user/:userId" element={<User />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/management" element={<AdminConsole />} />
                    <Route path="/pending-blog/:blogId" element={<PendingBlog />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify/email" element={<VerifyEmail />} />
                    <Route path="*" element={<ErrorPage code={404} />} />
                  </Routes>
                </Container>
                <Footer />
              </Flex>
            </BrowserRouter>
          </UserDetailContext.Provider>
        </QueryClientProvider>
        <Toaster
          theme="system"
          icons={{
            loading: <Spinner />,
          }}
        />
      </Provider>
    </StrictMode>
  );
}

export default App;
