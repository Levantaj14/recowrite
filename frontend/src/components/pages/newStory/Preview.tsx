import { Prose } from '@/components/ui/prose';
import { Heading } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import DOMPurify from 'dompurify';

type Props = {
  content: string;
  setValidateFields: (validateFields: ('content' | 'title' | 'description' | 'date' | 'banner')[]) => void;
  isVisible: boolean;
};

export default function Preview({ content, setValidateFields, isVisible }: Readonly<Props>) {
  const { t } = useTranslation();
  const parsedContent = content ? JSON.parse(content) : { type: 'doc', content: [] };
  const html = generateHTML(parsedContent, [
    StarterKit.configure({
      heading: {
        levels: [2, 3, 4, 5],
      },
    }),
    Typography,
    Highlight,
  ]);

  useEffect(() => {
    if (isVisible) {
      setValidateFields([]);
    }
  }, [isVisible, setValidateFields]);

  return (
    <>
      <Heading size="2xl">{t('content.newStory.preview.title')}</Heading>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Prose size="lg" maxWidth="100%" mb="6">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
          </Prose>
        </motion.div>
      )}
    </>
  );
}
