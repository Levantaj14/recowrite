import { Heading, Textarea, Link, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';

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
      <HStack gap={1}>
        <Trans i18nKey="newStory.write.desc">
          Feel free to use
          <Link
            variant="underline"
            href="https://www.markdownguide.org/basic-syntax/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Markdown
          </Link>
          formatting to enhance your story
        </Trans>
      </HStack>
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
