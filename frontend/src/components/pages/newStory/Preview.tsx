import { Prose } from '@/components/ui/prose';
import { Heading } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

type Props = {
  content: string;
  isVisible: boolean;
};

export default function Preview({ content, isVisible }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Heading size="2xl">{t('newStory.preview.title')}</Heading>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Prose size="lg" maxWidth="100%" mb="6">
            <Markdown>{content}</Markdown>
          </Prose>
        </motion.div>
      )}
    </>
  );
}
