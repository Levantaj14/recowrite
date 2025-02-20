import { Flex, Heading, HStack, Stat, Table } from '@chakra-ui/react';
import NumberFlow from '@number-flow/react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function Likes() {
  const { t } = useTranslation();

  const items = [
    { id: 1, name: 'Laptop', category: 'Electronics' },
    { id: 2, name: 'Coffee Maker', category: 'Home Appliances' },
    { id: 3, name: 'Desk Chair', category: 'Furniture' },
  ];

  return (
    <>
      <Heading size="2xl">{t('dashboard.tabs.likes')}</Heading>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <Flex gap="2" align="start" alignItems="center" mt="4">
          <Stat.Root maxW="240px" borderWidth="1px" p="4" rounded="md">
            <HStack justify="space-between">
              <Stat.Label>Received likes</Stat.Label>
            </HStack>
            <Stat.ValueText>
              <NumberFlow value={0} />
            </Stat.ValueText>
          </Stat.Root>
          <Stat.Root maxW="240px" borderWidth="1px" p="4" rounded="md">
            <HStack justify="space-between">
              <Stat.Label>Liked posts</Stat.Label>
            </HStack>
            <Stat.ValueText>
              <NumberFlow value={items.length} />
            </Stat.ValueText>
          </Stat.Root>
        </Flex>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.04 }}
      >
        <Heading size="md" mt="4">Liked posts</Heading>
        <Table.ScrollArea borderWidth="1px" rounded="md" height="400px" mt="2">
          <Table.Root size="sm" stickyHeader>
            <Table.Header>
              <Table.Row bg="bg.subtle">
                <Table.ColumnHeader>Title</Table.ColumnHeader>
                <Table.ColumnHeader>Author</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {items.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.category}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </motion.div>
    </>
  );
}
