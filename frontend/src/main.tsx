import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.tsx';
import { Provider } from './components/ui/provider.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import StickyNavbar from '@/components/Navbar.tsx';
import Story from '@/components/Story.tsx';
import { Container } from '@chakra-ui/react';
import User from '@/components/User.tsx';
import NotFound from '@/components/NotFound.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '@/components/Login.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      refetchInterval: 30000,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <StickyNavbar />
          <Container as="main" mt="4" mb="4" maxW="6xl">
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/blog/:blogId" element={<Story />} />
              <Route path="/user/:userId" element={<User />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
