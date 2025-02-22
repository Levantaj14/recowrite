import { Heading, Textarea, Text, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  content: string;
  setContent: (text: string) => void;
  isVisible: boolean;
  setNext: (next: boolean) => void;
};

export default function Write({ content, setContent, isVisible, setNext }: Props) {
  const { t } = useTranslation();
  useEffect(() => {
    setNext(content.length > 0);
  }, [setNext, content]);

  return (
    <>
      <Heading size="2xl">{t('newStory.write.title')}</Heading>
      <Text>
        {t('newStory.write.desc.pre')}{' '}
        <Link
          variant="underline"
          href="https://www.markdownguide.org/basic-syntax/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Markdown
        </Link>{' '}
        {t('newStory.write.desc.post')}
      </Text>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Textarea
            placeholder={t('newStory.write.placeholder')}
            mt="4"
            height="calc(100vh - 400px)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            resize="none"
          />
        </motion.div>
      )}
    </>
  );
}
