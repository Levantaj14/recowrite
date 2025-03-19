import { Flex, Spinner, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { createBlog } from '@/apis/blogApi.ts';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  description: string;
  banner: string;
  content: string;
  date: string;
  isVisible: boolean;
};

export default function Posting({ title, content, description, banner, date, isVisible }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      createBlog({ title, description, banner, date, content }).then((r) => {
        toast.success(t('newStory.posting.success'));
        navigate(`/blog/${r}`);
      });
    }
  }, [t, banner, content, description, isVisible, navigate, title, date]);

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
