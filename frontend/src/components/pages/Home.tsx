import { useQuery } from '@tanstack/react-query';
import { BlogType, fetchAllBlogs } from '@/apis/blogApi.ts';
import { fetchAllUsers } from '@/apis/userApi.ts';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingAnimation from '@/components/elements/LoadingAnimation.tsx';
import { Card, Grid, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

function Home() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const blogData = await fetchAllBlogs();
      const userData = await fetchAllUsers();
      return { blogData, userData };
    },
  });

  useEffect(() => {
    document.title = 'recowrite';
  }, [data]);

  function blogList() {
    return (
      <Grid
        templateColumns="repeat(auto-fit, minmax(350px, 1fr))"
        gap="20px"
        maxW="100%"
        px="4"
      >
        {data?.blogData.map((blog: BlogType, index) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut', delay: index / 25 }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2, ease: 'easeInOut' },
            }}
          >
            <Link to={`/blog/${blog.id}`}>
              <Card.Root overflow="hidden" h="500px" w="full" display="flex" flexDirection="column">
                <Image h="2xs" src={blog.banner} objectFit="cover" />
                <Card.Body gap="2" display="flex" flexDirection="column" flex="1" overflow="hidden" p="5">
                  <Text fontSize="sm">
                    {data?.userData.find((u) => u.id === blog.author)?.name ?? 'unknown'}
                  </Text>
                  <Card.Title>
                    {blog.title}
                  </Card.Title>
                  <Card.Description>
                    {new Date(blog.date) > new Date() ? t('story.like.unavailable') : blog.description}
                  </Card.Description>
                </Card.Body>
              </Card.Root>
            </Link>
          </motion.div>
        ))}
      </Grid>
    );
  }

  return isLoading ? <LoadingAnimation /> : blogList();
}

export default Home;