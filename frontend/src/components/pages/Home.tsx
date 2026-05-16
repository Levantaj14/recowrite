import { useQuery } from '@tanstack/react-query';
import { BlogType, fetchAllBlogs } from '@/apis/blogApi.ts';
import { fetchAllUsers } from '@/apis/userApi.ts';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingAnimation from '@/components/elements/LoadingAnimation.tsx';
import { Box, Card, Grid, Image, Text } from '@chakra-ui/react';
import { Link, NavLink } from 'react-router';
import { motion } from 'motion/react';
import { EmptyState } from '@/components/ui/empty-state.tsx';
import { IoSadOutline } from 'react-icons/io5';
import { Button } from '../ui/button';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';

function Home() {
  const { t } = useTranslation();
  const { userDetails } = useContext(UserDetailContext);
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const blogData = await fetchAllBlogs();
      const userData = await fetchAllUsers();
      return { blogData, userData };
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'recowrite';
  }, [data]);

  const patternsToRemove = [String.raw`\*\*`, String.raw`\[`, String.raw`\]`, String.raw`\(.*?\)`, '#', '```'];

  function decideDescription(blog: BlogType) {
    if (new Date(blog.date) > new Date()) {
      return t('content.story.unpublished');
    }
    if (blog.description === '') {
      let auxContent = blog.content;
      patternsToRemove.forEach((pattern) => {
        auxContent = auxContent.replace(new RegExp(pattern, 'g'), '');
      });
      auxContent = auxContent.slice(0, 100);
      if (blog.content.length > 100) {
        auxContent = auxContent + '...';
      }
      return auxContent;
    }
    return blog.description;
  }

  function blogList() {
    return data?.blogData.length === 0 ? (
      <motion.div key="no-blog-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <EmptyState
          icon={<IoSadOutline />}
          title={t('content.noBlogs.title')}
          description={userDetails === null ? t('content.noBlogs.desc.noAuth') : t('content.noBlogs.desc.auth')}
          size="lg"
        >
          {userDetails !== null && (
            <NavLink to="/create">
              <Button size="sm">{t('content.noBlogs.button')}</Button>
            </NavLink>
          )}
        </EmptyState>
      </motion.div>
    ) : (
      <>
        <Grid templateColumns="repeat(auto-fit, minmax(350px, 1fr))" gap="20px" maxW="100%" px="4">
          {data?.blogData.map((blog: BlogType) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2, ease: 'easeInOut' },
              }}
            >
              <Link to={`/blog/${blog.id}`}>
                <Card.Root overflow="hidden" h="500px" w="full" display="flex" flexDirection="column">
                  <Image
                    h="2xs"
                    src={blog.bannerType === 'IMAGE_URL' ? blog.banner : `data:image;base64,${blog.banner}`}
                    objectFit="cover"
                  />
                  <Card.Body gap="2" display="flex" flexDirection="column" flex="1" overflow="hidden" p="5">
                    <Text fontSize="sm">{data?.userData.find((u) => u.id === blog.author)?.name ?? 'unknown'}</Text>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Description>{decideDescription(blog)}</Card.Description>
                  </Card.Body>
                </Card.Root>
              </Link>
            </motion.div>
          ))}
        </Grid>
        <Box mt="10" />
      </>
    );
  }

  return isLoading ? <LoadingAnimation /> : blogList();
}

export default Home;
