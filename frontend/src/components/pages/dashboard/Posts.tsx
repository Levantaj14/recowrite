import { Button } from '@/components/ui/button';
import { Flex, Heading, HStack, Stat } from '@chakra-ui/react';
import NumberFlow from '@number-flow/react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function Posts() {
  const { t } = useTranslation();
  return (
    <>
      <Flex align="start" alignItems="center" justifyContent="space-between">
        <Heading size="2xl">{t('dashboard.tabs.posts')}</Heading>
        <Button size="xs">Create post</Button>
      </Flex>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <Flex gap="2" align="start" alignItems="center" mt="4">
          <Stat.Root maxW="240px" borderWidth="1px" p="4" rounded="md">
            <HStack justify="space-between">
              <Stat.Label>Number of posts</Stat.Label>
            </HStack>
            <Stat.ValueText>
              <NumberFlow value={15} />
            </Stat.ValueText>
          </Stat.Root>
        </Flex>
      </motion.div>
    </>
  );
}
