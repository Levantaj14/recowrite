import {
  Flex,
  Heading,
  Image,
  Link as ChakraLink,
  Stack,
  Text,
  Separator,
  Card,
  VStack,
  Center,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { HoverCardArrow, HoverCardContent, HoverCardRoot, HoverCardTrigger } from '../../ui/hover-card.tsx';
import { Avatar } from '@/components/ui/avatar.tsx';
import { Link, useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchBlog, fetchBlogRecommendation } from '@/apis/blogApi.ts';
import { fetchUser } from '@/apis/userApi.ts';
import { useEffect, useState } from 'react';
import LikeButton from '@/components/pages/story/LikeButton.tsx';
import { getLikeCount, getLiked } from '@/apis/likesApi.ts';
import CommentSection from '@/components/pages/story/CommentSection.tsx';
import { useTranslation } from 'react-i18next';
import { Prose } from '@/components/ui/prose.tsx';
import Markdown from 'react-markdown';
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';

function Story() {
  const { t } = useTranslation();
  const { blogId } = useParams();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [date, setDate] = useState<Date>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      const blogData = await fetchBlog(blogId);
      const userData = await fetchUser(blogData.author);
      const liked = await getLiked(blogId);
      const likeCount = await getLikeCount(blogId);
      return { blogData, userData, liked, likeCount };
    },
  });

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
    if (data?.blogData.date) {
      const timer = setInterval(() => {
        const diff = new Date(data.blogData.date).getTime() - Date.now();
        if (diff <= 0) {
          clearInterval(timer);
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          queryClient.invalidateQueries({
            queryKey: ['blog', blogId],
          });
          return;
        }
        const totalSecs = Math.floor(diff / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor((totalSecs % 86400) / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;
        setCountdown({ days, hours, minutes, seconds });
      }, 1000);
      setDate(new Date(data.blogData.date));
      return () => clearInterval(timer);
    }
  }, [blogId, data?.blogData.date, queryClient]);

  useEffect(() => {
    if (recData && !recIsLoading && !recIsError) {
      setHasLoadedOnce(true);
    }
  }, [recData, recIsLoading, recIsError]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = data?.blogData.title ?? 'Loading...';
  }, [data?.blogData.title]);

  function loading() {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  function recommendations() {
    return (
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
    );
  }

  function blogPost() {
    return (
      <motion.div
        key={blogId}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Heading size="4xl" mb="1">
          {data?.blogData.title}
        </Heading>
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Flex flexDirection="row" justifyContent="flex-start" alignItems="center">
            <Text textStyle="md" mr={1}>
              {t('story.written')}
            </Text>
            <HoverCardRoot>
              <HoverCardTrigger>
                <Link to={`/user/${data?.blogData.author}`}>
                  <ChakraLink>@{data?.userData.username}</ChakraLink>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent>
                <HoverCardArrow />
                <Stack gap="4" direction="row">
                  <Avatar name={data?.userData.name} src={`data:image;base64,${data?.userData.avatar}`} />
                  <Stack gap={3}>
                    <Stack gap="1">
                      <Text textStyle="sm" fontWeight="semibold">
                        {data?.userData.name}
                      </Text>
                      <Text textStyle="sm" color="fg.muted">
                        {data?.userData.bio}
                      </Text>
                    </Stack>
                  </Stack>
                </Stack>
              </HoverCardContent>
            </HoverCardRoot>
          </Flex>
          <LikeButton blogData={data?.blogData} liked={data?.liked} likeCount={data?.likeCount} />
        </Flex>
        <Image rounded="lg" maxH="300px" w="100%" src={data?.blogData.banner} objectFit="cover" />
        {(date && date > new Date()) || data?.blogData.content === '' ? (
          animatedCountdown()
        ) : (
          <>
            <Prose size="lg" maxWidth="100%" mb="6">
              <Markdown>{data?.blogData.content}</Markdown>
            </Prose>
            <Separator />
            <CommentSection />
            {(!!recData || hasLoadedOnce) && (
              <>
                <Separator />
                <Heading size="3xl" mt="5" mb="5">
                  {t('story.continue')}
                </Heading>
                {recIsLoading ? loading() : recommendations()}
              </>
            )}
          </>
        )}
        <Box mb={10} />
      </motion.div>
    );
  }

  function animatedCountdown() {
    return (
      <Flex mt={5} flexDirection="column" alignItems="center">
        <Text fontSize="2xl">{t('story.unavailable')}</Text>
        <Flex flexDirection="row" alignItems="center">
          <NumberFlowGroup>
            <Text fontSize="2xl" fontWeight="semibold">
              <NumberFlow trend={-1} value={countdown.days} format={{ minimumIntegerDigits: 2 }} />
            </Text>
            <Text fontSize="2xl" fontWeight="semibold">
              <NumberFlow prefix=":" trend={-1} value={countdown.hours} format={{ minimumIntegerDigits: 2 }} />
            </Text>
            <Text fontSize="2xl" fontWeight="semibold">
              <NumberFlow prefix=":" trend={-1} value={countdown.minutes} format={{ minimumIntegerDigits: 2 }} />
            </Text>
            <Text fontSize="2xl" fontWeight="semibold">
              <NumberFlow prefix=":" trend={-1} value={countdown.seconds} format={{ minimumIntegerDigits: 2 }} />
            </Text>
          </NumberFlowGroup>
        </Flex>
      </Flex>
    );
  }

  return isLoading ? loading() : blogPost();
}

export default Story;
