import { Avatar } from '@/components/ui/avatar.tsx';
import { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { Box, MenuContent, MenuItem, MenuRoot, MenuSelectionDetails, MenuTrigger } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'sonner';
import { logout } from '@/apis/authApi.ts';
import CustomLoading from '@/components/CustomLoading.tsx';

export default function LoggedInAvatar() {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [avatarFallback, setAvatarFallback] = useState<string>('');

  useEffect(() => {
    const names = userDetails?.name.toUpperCase().split(' ');
    let aux = '';
    if (names !== undefined) {
      names.forEach((name) => {
        aux += name.charAt(0);
      });
      setAvatarFallback(aux);
    } else {
      setAvatarFallback('');
    }
  }, [userDetails]);

  const selectedItem = (something: MenuSelectionDetails) => {
    switch (something.value) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'logout':
        toast.promise(logout, {
          loading: CustomLoading('Logging out...'),
          success: () => {
            if (location.pathname === '/dashboard') {
              navigate('/');
            }
            setUserDetails(null);
            return 'Successfully logged out';
          },
          error: 'There was an error logging you out'
        });
        break;
    }
  };

  return (
    <Box position="relative">
      <MenuRoot positioning={{ placement: 'bottom-end' }} onSelect={selectedItem}>
        <MenuTrigger asChild>
          <Avatar
            size="xs"
            fallback={avatarFallback}
            src={userDetails?.avatar}
          />
        </MenuTrigger>
        <MenuContent zIndex="popover" position="absolute" right="0">
          <MenuItem value="dashboard">Dashboard</MenuItem>
          <MenuItem
            value="logout"
            color="fg.error"
            _hover={{ bg: 'bg.error', color: 'fg.error' }}
          >
            Log out
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    </Box>
  );
}