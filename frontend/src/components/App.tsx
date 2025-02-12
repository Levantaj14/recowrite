import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Container } from '@chakra-ui/react';
import { StrictMode, useMemo, useState } from 'react';
import { Provider } from '@/components/ui/provider.tsx';
import { UserDetailContext, UserDetailContextType, UserDetailType } from '@/contexts/userDetailContext.ts';
import { BrowserRouter, Route, Routes } from 'react-router';
import StickyNavbar from '@/components/Navbar/Navbar.tsx';
import Story from '@/components/Story.tsx';
import User from '@/components/User.tsx';
import LoginPage from '@/components/pages/login/LoginPage.tsx';
import NotFound from '@/components/NotFound.tsx';
import { Toaster } from 'sonner';
import Home from '@/components/Home.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      refetchInterval: 30000,
    },
  },
});

function App() {
  const [userDetails, setUserDetails] = useState<UserDetailType | null>(null);
  const userDetailsMemo: UserDetailContextType = {
    userDetails,
    setUserDetails,
  };
  const userDetailContext = useMemo(() => userDetailsMemo, [userDetails]);

  return (<StrictMode>
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Container>
          </BrowserRouter>
        </UserDetailContext.Provider>
      </QueryClientProvider>
      <Toaster theme="system" />
    </Provider>
  </StrictMode>);
}

export default App;
