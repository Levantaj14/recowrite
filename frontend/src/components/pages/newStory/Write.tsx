import { Heading, Textarea, Text, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

type Props = {
  content: string;
  setContent: (text: string) => void;
  isVisible: boolean;
  setNext: (next: boolean) => void;
};

export default function Write({ content, setContent, isVisible, setNext }: Props) {
  useEffect(() => {
    setNext(content.length > 0);
  }, [setNext, content]);

  return (
    <>
      <Heading size="2xl">Write a new story</Heading>
      <Text>
        Feel free to use{' '}
        <Link
          variant="underline"
          href="https://www.markdownguide.org/basic-syntax/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Markdown
        </Link>{' '}
        formatting to enhance your story
      </Text>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Textarea
            placeholder="Write your story here..."
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
