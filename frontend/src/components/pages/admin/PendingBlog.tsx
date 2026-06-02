import { motion } from 'motion/react';
import ErrorPage from '../ErrorPage';
import {
  Box,
  Flex,
  Heading,
  HoverCardRoot,
  Stack,
  Text,
  Image,
  Link as ChakraLink,
  Alert,
  ActionBar,
  Portal,
  Button,
} from '@chakra-ui/react';
import { HoverCardArrow, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Avatar } from '@/components/ui/avatar';
import { Link, useNavigate, useParams } from 'react-router';
import { FaBan, FaCheck } from 'react-icons/fa6';
import { Prose } from '@/components/ui/prose';
import Markdown from 'react-markdown';
import LoadingAnimation from '@/components/elements/LoadingAnimation';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import DOMPurify from 'dompurify';
import { getPendingBlog, setStateOfPendingBlog } from '@/apis/adminApi';
import { fetchUser } from '@/apis/userApi';
import { FaInfoCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}

export default function PendingBlog() {
  const { t } = useTranslation();
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [buttonsOpen, setButtonsOpen] = useState(true);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['pending-blog', blogId],
    queryFn: async () => {
      const blogData = await getPendingBlog(blogId);
      const userData = await fetchUser(blogData.author);
      return { blogData, userData };
    },
    retry: false,
  });

  function handleButtonPressed(state: "APPROVED" | "REJECTED") {
    setButtonsOpen(false);
    toast.promise(
      setStateOfPendingBlog(blogId, state),
      {
        loading: t('admin.pendingBlogs.blogPage.toast.loading'),
        success: () => {
            navigate(state === "APPROVED" ? `/blog/${data?.blogData.id}` : '/management');
            return t('admin.pendingBlogs.blogPage.toast.success')
        },
        error: t('admin.pendingBlogs.blogPage.toast.error'),
      },
    );
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = data ? `${data?.blogData.title} | In review` : 'Loading...';
    if (data && data.blogData.approveStatus !== 'PENDING') {
      navigate(data.blogData.approveStatus === 'APPROVED' ? `/blog/${data.blogData.id}` : '/management');
    }
  }, [data, data?.blogData.title, navigate]);

  function blogPost() {
    return isError ? (
      <ErrorPage code={404} />
    ) : (
      <>
        <motion.div
          key={blogId}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Heading size="4xl" mb="1">
            {data?.blogData.title}
          </Heading>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box>
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
              {data?.blogData.ai && (
                <Flex flexDirection="row" alignItems="center" mt={1}>
                  <FaInfoCircle color="gray" />
                  <Text ml={2} color="fg.muted">
                    {t('content.story.ai')}
                  </Text>
                </Flex>
              )}
            </Box>
          </Flex>
          <Box mb={3} />
          {data?.blogData.bannerType === 'IMAGE_UPLOAD' && (
            <Image rounded="lg" w="100%" src={`data:image;base64,${data?.blogData.banner}`} />
          )}
          {data?.blogData.bannerType === 'IMAGE_URL' && (
            <>
              <Alert.Root status="error" mb={2}>
                <Alert.Indicator />
                <Alert.Title>{t('admin.pendingBlogs.blogPage.imageAlert')}</Alert.Title>
              </Alert.Root>
              <Text mt={2} textStyle="sm" color="fg.muted">
                {t('content.story.image_source')}:{' '}
                <ChakraLink href={data?.blogData.banner} color="fg.muted" variant="underline" target="_blank">
                  {data?.blogData.banner}
                </ChakraLink>
              </Text>
            </>
          )}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
            <Prose size="lg" maxWidth="100%" mb="6">
              {isJsonString(data?.blogData.content ?? '{}') ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      generateHTML(JSON.parse(data?.blogData.content ?? '{}'), [
                        StarterKit.configure({
                          heading: {
                            levels: [2, 3, 4, 5],
                          },
                        }),
                        Typography,
                        Highlight,
                      ]),
                    ),
                  }}
                />
              ) : (
                <Markdown>{data?.blogData.content ?? ''}</Markdown>
              )}
            </Prose>
          </motion.div>
          <Box mb={10} />
        </motion.div>

        <ActionBar.Root open={buttonsOpen} placement="bottom-end">
          <Portal>
            <ActionBar.Positioner>
              <ActionBar.Content>
                <Button variant="surface" colorPalette="green" size="sm" onClick={() => {handleButtonPressed("APPROVED")}}>
                  <FaCheck />
                  {t('admin.pendingBlogs.blogPage.buttons.approve')}
                </Button>
                <Button variant="surface" colorPalette="red" size="sm" onClick={() => {handleButtonPressed("REJECTED")}}>
                  <FaBan />
                  {t('admin.pendingBlogs.blogPage.buttons.reject')}
                </Button>
              </ActionBar.Content>
            </ActionBar.Positioner>
          </Portal>
        </ActionBar.Root>
      </>
    );
  }
  return isLoading ? <LoadingAnimation /> : blogPost();
}
