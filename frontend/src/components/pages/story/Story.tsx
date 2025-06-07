import {
  Flex,
  Heading,
  Image,
  Link as ChakraLink,
  Stack,
  Text,
  Separator,
  Box,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { HoverCardArrow, HoverCardContent, HoverCardRoot, HoverCardTrigger } from '../../ui/hover-card.tsx';
import { Avatar } from '@/components/ui/avatar.tsx';
import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchBlog } from '@/apis/blogApi.ts';
import { fetchUser } from '@/apis/userApi.ts';
import { useEffect, useState } from 'react';
import LikeButton from '@/components/pages/story/LikeButton.tsx';
import { getLikeCount, getLiked } from '@/apis/likesApi.ts';
import CommentSection from '@/components/pages/story/CommentSection.tsx';
import { useTranslation } from 'react-i18next';
import { Prose } from '@/components/ui/prose.tsx';
import Markdown from 'react-markdown';
import ContinueReadingSection from '@/components/pages/story/ContinueReadingSection.tsx';
import PostOpening from '@/components/pages/story/PostOpening.tsx';
import LoadingAnimation from '@/components/elements/LoadingAnimation.tsx';
import ReportButton from '@/components/pages/story/ReportButton.tsx';
import NotFound from '@/components/pages/NotFound.tsx';

function Story() {
  const { t } = useTranslation();
  const { blogId } = useParams();
  const [date, setDate] = useState<Date>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      const blogData = await fetchBlog(blogId);
      const userData = await fetchUser(blogData.author);
      const liked = await getLiked(blogId);
      const likeCount = await getLikeCount(blogId);
      return { blogData, userData, liked, likeCount };
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = data?.blogData.title ?? 'Loading...';
  }, [data?.blogData.title]);

  function blogPost() {
    return isError ? <NotFound /> : (
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
              {t('content.story.written')}
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
          <Box>
            <LikeButton blogData={data?.blogData} liked={data?.liked} likeCount={data?.likeCount} />
            <ReportButton blogData={data?.blogData} />
          </Box>
        </Flex>
        <Image rounded="lg" maxH="300px" w="100%"
               src={data?.blogData.banner_type === 'IMAGE_URL' ? data?.blogData.banner : `data:image;base64,${data?.blogData.banner}`}
               objectFit="cover" />
        {(date && date > new Date()) || data?.blogData.content === '' ? (
          <PostOpening data={data} setDate={setDate} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Prose size="lg" maxWidth="100%" mb="6">
              <Markdown>{data?.blogData.content}</Markdown>
            </Prose>
            <Separator />
            <CommentSection />
            <ContinueReadingSection />
          </motion.div>
        )}
        <Box mb={10} />
      </motion.div>
    );
  }

  return isLoading ? <LoadingAnimation /> : blogPost();
}

export default Story;
