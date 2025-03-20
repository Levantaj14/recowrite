import { Flex, Heading, HStack, Stat, Table } from '@chakra-ui/react';
import NumberFlow from '@number-flow/react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getGivenLikes, getReceivedLikeCount } from '@/apis/accountApi.ts';
import { useNavigate } from 'react-router';
import LoadingAnimation from '@/components/elements/LoadingAnimation.tsx';

export default function Likes() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['liked', 'posts'],
    queryFn: async () => {
      const givenLikes = await getGivenLikes();
      const receivedLikes = await getReceivedLikeCount();
      return { givenLikes, receivedLikes };
    },
  });

  function content() {
    return data && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}>
          <Flex gap="2" align="start" alignItems="center" mt="4">
            <Stat.Root maxW="240px" borderWidth="1px" p="4" rounded="md">
              <HStack justify="space-between">
                <Stat.Label>{t('dashboard.likes.received')}</Stat.Label>
              </HStack>
              <Stat.ValueText>
                <NumberFlow value={data.receivedLikes.count} />
              </Stat.ValueText>
            </Stat.Root>
            <Stat.Root maxW="240px" borderWidth="1px" p="4" rounded="md">
              <HStack justify="space-between">
                <Stat.Label>{t('dashboard.likes.given')}</Stat.Label>
              </HStack>
              <Stat.ValueText>
                <NumberFlow value={data.givenLikes.length} />
              </Stat.ValueText>
            </Stat.Root>
          </Flex>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.04 }}
        >
          <Heading size="md" mt="4">{t('dashboard.likes.given')}</Heading>
          <Table.ScrollArea borderWidth="1px" rounded="md" height="calc(100vh - 500px)" mt="2">
            <Table.Root size="sm" stickyHeader interactive>
              <Table.Header>
                <Table.Row bg="bg.subtle">
                  <Table.ColumnHeader>{t('dashboard.likes.liked.title')}</Table.ColumnHeader>
                  <Table.ColumnHeader>{t('dashboard.likes.liked.author')}</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {data.givenLikes.map((item) => (
                  <Table.Row key={item.id} onClick={() => navigate(`/blog/${item.id}`)}>
                    <Table.Cell>{item.title}</Table.Cell>
                    <Table.Cell>{item.author}</Table.Cell>
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
      <Heading size="2xl">{t('dashboard.tabs.likes')}</Heading>
      {isLoading ? <LoadingAnimation /> : content()}
    </>
  );
}
