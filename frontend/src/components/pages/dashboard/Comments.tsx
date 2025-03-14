import { Center, Heading, Spinner, Table } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getUserComments } from '@/apis/accountApi.ts';
import { motion } from 'motion/react';

export default function Comments() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['account', 'comments'],
    queryFn: () => getUserComments(),
  });

  function loading() {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  function content() {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Table.ScrollArea borderWidth="1px" rounded="md" height="calc(100vh - 350px)" mt="4">
            <Table.Root size="sm" stickyHeader interactive>
              <Table.Header>
                <Table.Row bg="bg.subtle">
                  <Table.ColumnHeader>{t('dashboard.comments.comment')}</Table.ColumnHeader>
                  <Table.ColumnHeader>{t('dashboard.likes.liked.title')}</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {data && data.map((item) => (
                  <Table.Row key={item.id} onClick={() => navigate(`/blog/${item.blogId}`)}>
                    <Table.Cell>{item.comment}</Table.Cell>
                    <Table.Cell>{item.title}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <Heading size="2xl">{t('dashboard.tabs.comments')}</Heading>
      {isLoading ? loading() : content()}
    </>
  );
}
