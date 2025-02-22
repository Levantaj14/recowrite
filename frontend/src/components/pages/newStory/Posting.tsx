import { Flex, Spinner, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { createBlog } from '@/apis/blogApi.ts';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

type Props = {
  title: string;
  description: string;
  banner: string;
  content: string;
  isVisible: boolean;
};

export default function Posting({ title, content, description, banner, isVisible }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      createBlog({ title, description, banner, content }).then(r => {
        toast.success('Post added successfully');
        navigate(`/blog/${r}`);
      });
    }
  }, [banner, content, description, isVisible, navigate, title]);

  return (
    isVisible && (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Flex flexDirection="row" justifyContent="flex-start" alignItems="center" gap="3" mt="2">
          <Spinner />
          <Text>Uploading your post</Text>
        </Flex>
      </motion.div>
    )
  );
}
