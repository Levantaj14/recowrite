import {
  Badge, ButtonGroup,
  Table,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAllUsers } from '@/apis/userApi.ts';
import LoadingAnimation from '@/components/elements/LoadingAnimation.tsx';
import { Button } from '@/components/ui/button.tsx';
import { changeRole, deleteAccount, fetchAllAdmins } from '@/apis/adminApi.ts';
import { toast } from 'sonner';
import CustomLoading from '@/components/elements/CustomLoading.tsx';
import { motion } from 'motion/react';

type Props = {
  setIsAuthorized: (isAuthorized: boolean) => void;
};

export default function UsersTab({ setIsAuthorized }: Props) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const users = await fetchAllUsers();
        const admins = await fetchAllAdmins();
        return { users, admins };
      } catch {
        setIsAuthorized(false);
      }
    },
  });

  function pressedChange(userId: number) {
    toast.promise(
      changeRole(userId),
      {
        loading: CustomLoading('Changing role...'),
        success: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['users'],
          });
          return 'Role changed successfully';
        },
        error: () => {
          return 'Failed to change role';
        },
      },
    );
  }

  function pressedDelete(userId: number) {
    toast.promise(
      deleteAccount(userId),
      {
        loading: CustomLoading('Deleting account...'),
        success: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['users'],
          });
          return 'Account deleted successfully';
        },
        error: () => {
          return 'Failed to delete account';
        },
      },
    );
  }

  function content() {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <Table.ScrollArea borderWidth="1px" rounded="sm" height="calc(100vh - 300px)">
          <Table.Root size="sm" stickyHeader interactive>
            <Table.Header>
              <Table.Row bg="bg.subtle">
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>Username</Table.ColumnHeader>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data?.users.map((user) => (
                <Table.Row
                  key={user.id}
                >
                  <Table.Cell>{user.id}</Table.Cell>
                  <Table.Cell>{user.username} {(data?.admins.find((u) => u.id === user.id)) !== undefined && (
                    <Badge variant="surface">Admin</Badge>
                  )}</Table.Cell>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell textAlign="right">
                    <ButtonGroup size="xs">
                      <Button onClick={() => pressedChange(user.id)}>Change Role</Button>
                      <Button colorPalette="red" onClick={() => pressedDelete(user.id)}>Delete</Button>
                    </ButtonGroup>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </motion.div>
    );
  }

  return (
    <>
      {isLoading ? <LoadingAnimation /> : content()}
    </>
  );
}
