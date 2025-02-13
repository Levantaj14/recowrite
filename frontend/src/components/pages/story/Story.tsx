import {
  Flex,
  Heading,
  Image,
  Link as ChakraLink,
  Stack,
  Text,
  Box,
  Separator,
  Card,
  LinkBox,
  VStack, Center, Spinner,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { HoverCardArrow, HoverCardContent, HoverCardRoot, HoverCardTrigger } from '../../ui/hover-card.tsx';
import { Avatar } from '@/components/ui/avatar.tsx';
import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchBlog, fetchBlogRecommendation } from '@/apis/blogApi.ts';
import { fetchUser } from '@/apis/userApi.ts';
import { useEffect } from 'react';
import LikeButton from '@/components/pages/story/LikeButton.tsx';

function Story() {
  const { blogId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      const blogData = await fetchBlog(blogId);
      const userData = await fetchUser(blogData.author);
      const recommendationData = await fetchBlogRecommendation(blogId);
      for (const rec of recommendationData) {
        const author = await fetchUser(rec.author);
        rec.author = author.name;
      }
      return { blogData, userData, recommendationData };
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = data?.blogData.title ?? 'Loading...';
  }, [data]);

  function loading() {
    return (
      <Center>
        <Spinner />
      </Center>
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
        <Heading size="4xl" mb="1">{data?.blogData.title}</Heading>
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Flex flexDirection="row" justifyContent="flex-start" alignItems="center">
            <Text textStyle="md" mr={1}>Written by</Text>
            <HoverCardRoot>
              <HoverCardTrigger>
                <Link to={`/user/${data?.blogData.author}`}>
                  <ChakraLink>@{data?.userData.username}</ChakraLink>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent>
                <HoverCardArrow />
                <Stack gap="4" direction="row">
                  <Avatar
                    name={data?.userData.name}
                    src={data?.userData.avatar}
                  />
                  <Stack gap={3}>
                    <Stack gap="1">
                      <Text textStyle="sm" fontWeight="semibold">{data?.userData.name}</Text>
                      <Text textStyle="sm" color="fg.muted">{data?.userData.bio}</Text>
                    </Stack>
                  </Stack>
                </Stack>
              </HoverCardContent>
            </HoverCardRoot>
          </Flex>
          <LikeButton userData={data?.userData} blogData={data?.blogData} />
        </Flex>
        <Image
          rounded="lg"
          maxH="300px"
          w="100%"
          src={data?.blogData.banner}
          objectFit="cover"
        />
        <Box mb={10}>
          <Text mt={15}>{data?.blogData.content}</Text>
        </Box>
        <Separator />
        <Heading size="3xl" mt="5" mb="5">
          Continue reading
        </Heading>
        <motion.div initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }}
                    viewport={{ once: true }}>
          <VStack align="flex-start">
            <Stack direction="row" mb={10}>
              {data?.recommendationData.map((recommendation) => (
                <motion.div
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2, ease: 'easeInOut' },
                  }}
                >
                  <LinkBox flexShrink="0" as="article">
                    <Link to={`/blog/${recommendation.id}`}>
                      <Card.Root maxW="sm" overflow="hidden">
                        <Image src={recommendation.banner} />
                        <Card.Body gap="2">
                          <Text>{recommendation.author}</Text>
                          <Card.Title>{recommendation.title}</Card.Title>
                          <Card.Description>{recommendation.description}</Card.Description>
                        </Card.Body>
                      </Card.Root>
                    </Link>
                  </LinkBox>
                </motion.div>
              ))}
            </Stack>
          </VStack>
        </motion.div>
      </motion.div>
    );
  }

  return isLoading ? loading() : blogPost();
}

export default Story;