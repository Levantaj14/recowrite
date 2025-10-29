import { Card, Heading, Image, Separator, Stack, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { BlogType, fetchBlogRecommendation } from '@/apis/blogApi.ts';
import { fetchUser } from '@/apis/userApi.ts';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingAnimation from '@/components/elements/LoadingAnimation.tsx';

export default function ContinueReadingSection() {
  const { t } = useTranslation();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const { blogId } = useParams();

  const {
    data: recData,
    isLoading: recIsLoading,
    isError: recIsError,
  } = useQuery({
    queryKey: ['recommendation', blogId],
    queryFn: async () => {
      const recommendationData = await fetchBlogRecommendation(blogId);
      for (const rec of recommendationData) {
        const author = await fetchUser(rec.author);
        rec.authorName = author.name;
      }
      return recommendationData;
    },
  });

  if (recData && !recIsLoading && !recIsError && !hasLoadedOnce) {
    setHasLoadedOnce(true);
  }

  const patternsToRemove = ['\\*\\*', '\\[', '\\]', '\\(.*?\\)', '#', '```'];

  function decideDescription(blog: BlogType) {
    if (new Date(blog.date) > new Date()) {
      return t('content.story.unpublished');
    }
    if (blog.description === '') {
      let auxContent = blog.content;
      patternsToRemove.forEach(pattern => {
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

  return (
    <>
      {(!!recData || hasLoadedOnce) && (
        <>
          <Separator />
          <Heading size="3xl" mt="5" mb="5">
            {t('common.actions.continue')}
          </Heading>
          {recIsLoading ? <LoadingAnimation /> : (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              viewport={{ once: true }}
            >
              <Stack direction={{ base: 'column', md: 'row' }}>
                {recData?.map((recommendation) => (
                  <motion.div
                    key={recommendation.id}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2, ease: 'easeInOut' },
                    }}
                  >
                    <Link to={`/blog/${recommendation.id}`}>
                      <Card.Root maxW="sm" overflow="hidden">
                        <Image h="2xs"
                               src={recommendation.banner_type === 'IMAGE_URL' ? recommendation.banner : `data:image;base64,${recommendation.banner}`} />
                        <Card.Body gap="2">
                          <Text>{recommendation.authorName}</Text>
                          <Card.Title>{recommendation.title}</Card.Title>
                          <Card.Description>{decideDescription(recommendation)}</Card.Description>
                        </Card.Body>
                      </Card.Root>
                    </Link>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>
          )}
        </>
      )}
    </>
  );
}