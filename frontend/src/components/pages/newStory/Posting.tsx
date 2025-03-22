import { Flex, Spinner, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

type Props = {
  isVisible: boolean;
};

export default function Posting({ isVisible }: Props) {
  const { t } = useTranslation();

  return (
    isVisible && (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Flex flexDirection="row" justifyContent="flex-start" alignItems="center" gap="3" mt="2">
          <Spinner />
          <Text>{t('newStory.posting.loading')}</Text>
        </Flex>
      </motion.div>
    )
  );
}
