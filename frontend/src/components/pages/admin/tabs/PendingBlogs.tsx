import { Badge, Table } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getAllPendingBlogs } from '@/apis/adminApi.ts';
import { fetchAllUsers } from '@/apis/userApi.ts';
import LoadingAnimation from '@/components/elements/LoadingAnimation.tsx';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

type Props = {
  setIsAuthorized: (isAuthorized: boolean) => void;
};

export default function PendingBlogs({ setIsAuthorized }: Readonly<Props>) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['pending-blogs'],
    queryFn: async () => {
      try {
        const pendingBlogs = await getAllPendingBlogs();
        const users = await fetchAllUsers();
        return { pendingBlogs, users };
      } catch {
        setIsAuthorized(false);
      }
    },
  });

  const badges = {
    APPROVED: { color: 'green', label: t('admin.pendingBlogs.table.badge.approved') },
    PENDING: { color: 'orange', label: t('admin.pendingBlogs.table.badge.pending') },
    REJECTED: { color: 'red', label: t('admin.pendingBlogs.table.badge.rejected') },
  };

  function content() {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <Table.ScrollArea borderWidth="1px" rounded="sm" height="calc(100vh - 300px)">
          <Table.Root size="sm" stickyHeader interactive>
            <Table.Header>
              <Table.Row bg="bg.subtle">
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>{t('admin.pendingBlogs.table.header.author')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('admin.pendingBlogs.table.header.title')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('admin.pendingBlogs.table.header.status')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('admin.pendingBlogs.table.header.reason')}</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data?.pendingBlogs.map((pendingBlog) => (
                <Table.Row
                  cursor={pendingBlog.approveStatus === 'REJECTED' ? 'default' : 'pointer'}
                  key={pendingBlog.id}
                  onClick={() => {
                    switch (pendingBlog.approveStatus) {
                      case 'APPROVED':
                        navigate(`/blog/${pendingBlog.blog.id}`);
                        break;
                      case 'PENDING':
                        navigate(`/pending-blog/${pendingBlog.id}`);
                        break;
                    }
                  }}
                >
                  <Table.Cell>{pendingBlog.id}</Table.Cell>
                  <Table.Cell>
                    {data?.users.find((u) => u.id === pendingBlog.blog.author)?.name ?? 'unknown'}
                  </Table.Cell>
                  <Table.Cell>{pendingBlog.blog.title}</Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={badges[pendingBlog.approveStatus].color}>
                      {badges[pendingBlog.approveStatus].label}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{pendingBlog.reason}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </motion.div>
    );
  }

  return <>{isLoading ? <LoadingAnimation /> : content()}</>;
}
