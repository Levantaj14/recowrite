import { Card, Heading, Image, Separator, Stack, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogRecommendation } from '@/apis/blogApi.ts';
import { fetchUser } from '@/apis/userApi.ts';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (recData && !recIsLoading && !recIsError) {
      setHasLoadedOnce(true);
    }
  }, [recData, recIsLoading, recIsError]);

  return (
    <>
      {(!!recData || hasLoadedOnce) && (
        <>
          <Separator />
          <Heading size="3xl" mt="5" mb="5">
            {t('story.continue')}
          </Heading>
          {recIsLoading ? <LoadingAnimation /> : (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              viewport={{ once: true }}
            >
              <VStack align="flex-start">
                <Stack direction="row">
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
                          <Image h="2xs" src={recommendation.banner} />
                          <Card.Body gap="2">
                            <Text>{recommendation.authorName}</Text>
                            <Card.Title>{recommendation.title}</Card.Title>
                            <Card.Description>{recommendation.description}</Card.Description>
                          </Card.Body>
                        </Card.Root>
                      </Link>
                    </motion.div>
                  ))}
                </Stack>
              </VStack>
            </motion.div>
          )}
        </>
      )}
    </>
  );
}