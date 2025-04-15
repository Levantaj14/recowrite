import { Avatar } from '@/components/ui/avatar.tsx';
import { useContext } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { Box, MenuContent, MenuItem, MenuRoot, MenuSelectionDetails, MenuTrigger } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { logout } from '@/apis/authApi.ts';
import CustomLoading from '@/components/elements/CustomLoading';
import { useTranslation } from 'react-i18next';

export default function LoggedInAvatar() {
  const { t } = useTranslation();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const navigate = useNavigate();

  const selectedItem = (menuSelectionDetails: MenuSelectionDetails) => {
    switch (menuSelectionDetails.value) {
      case 'profile':
        navigate(`/user/${userDetails?.id}`);
        break;
      case 'logout':
        toast.promise(logout, {
          loading: CustomLoading(t('navbar.toast.logout.loading')),
          success: () => {
            setUserDetails(null);
            return t('navbar.toast.logout.success');
          },
          error: t('navbar.toast.logout.error'),
        });
        break;
    }
  };

  return (
    <Box position="relative">
      <MenuRoot positioning={{ placement: 'bottom-end' }} onSelect={selectedItem}>
        <MenuTrigger asChild>
          <Avatar size="xs" name={userDetails?.name} src={`data:image;base64,${userDetails?.avatar}`} />
        </MenuTrigger>
        <MenuContent zIndex="popover" position="absolute" right="0">
          <MenuItem value="newBlog">{t('dashboard.posts.create')}</MenuItem>
          <MenuItem value="profile">{t('navbar.buttons.profile')}</MenuItem>
          <MenuItem value="logout" color="fg.error" _hover={{ bg: 'bg.error', color: 'fg.error' }}>
            {t('navbar.buttons.logout')}
          </MenuItem>
        </MenuContent>
      </MenuRoot>
    </Box>
  );
}
