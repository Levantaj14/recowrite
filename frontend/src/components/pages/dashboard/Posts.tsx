import { Button } from '@/components/ui/button';
import { Flex, Heading, HStack, Stat, Text } from '@chakra-ui/react';
import NumberFlow from '@number-flow/react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogsByAuthor } from '@/apis/blogApi.ts';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useContext } from 'react';
import BlogCard from '@/components/elements/BlogCard.tsx';
import LoadingAnimation from '@/components/elements/LoadingAnimation.tsx';

export default function Posts() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userDetails } = useContext(UserDetailContext);

  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetchBlogsByAuthor(String(userDetails?.id)),
  });

  function content() {
    return data && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
        <Flex gap="2" align="start" alignItems="center" mt="4" mb="4">
          <Stat.Root maxW="240px" borderWidth="1px" p="4" rounded="md">
            <HStack justify="space-between">
              <Stat.Label>{t('dashboard.posts.postCount')}</Stat.Label>
            </HStack>
            <Stat.ValueText>
              <NumberFlow value={data?.length} />
            </Stat.ValueText>
          </Stat.Root>
        </Flex>
        {data.length > 0 ? (
          data.map((blog, index) => (
            <BlogCard
              imageUrl={blog.banner}
              title={blog.title}
              description={new Date(blog.date) > new Date() ? t('story.like.unavailable') : blog.description}
              author={''}
              href={`/blog/${blog.id}`}
              index={index}
            />
          ))
        ) : (
          <Text>{t('user.noArticles')}</Text>
        )}
      </motion.div>
    );
  }

  return (
    <>
      <Flex align="start" alignItems="center" justifyContent="space-between">
        <Heading size="2xl">{t('dashboard.tabs.posts')}</Heading>
        <Button size="xs" onClick={() => navigate('/blog/create')}>{t('dashboard.posts.create')}</Button>
      </Flex>
      {isLoading ? <LoadingAnimation /> : content()}
    </>
  );
}
