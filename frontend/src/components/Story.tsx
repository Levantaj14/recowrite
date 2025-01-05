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
import { HoverCardArrow, HoverCardContent, HoverCardRoot, HoverCardTrigger } from './ui/hover-card.tsx';
import { Avatar } from '@/components/ui/avatar.tsx';
import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchBlog } from '@/apis/blogApi.ts';
import { fetchUser } from '@/apis/userApi.ts';
import { useEffect } from 'react';

function Story() {
  const { blogId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      const blogData = await fetchBlog(blogId);
      const userData = await fetchUser(blogData.author);
      return { blogData, userData };
    },
  });

  useEffect(() => {
    document.title = data?.blogData.title ?? 'Loading...';
  }, [data])

  function loading() {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  function blogPost() {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}>
        <Heading size="4xl" mb="3">{data?.blogData.title}</Heading>
        <Flex flexDirection="row" justifyContent="flex-start" mb={5} alignItems="center">
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
                    <Text textStyle="sm" fontWeight="semibold">
                      Brent Denton
                    </Text>
                    <Text textStyle="sm" color="fg.muted">{data?.userData.bio}</Text>
                  </Stack>
                </Stack>
              </Stack>
            </HoverCardContent>
          </HoverCardRoot>
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
              <LinkBox
                flexShrink="0"
                as="article"
                _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}
              >
                <Link to="/story/2">
                  <Card.Root maxW="sm" overflow="hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1642783770696-5ce1b9e24263?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    />
                    <Card.Body gap="2">
                      <Text>Regina Grimes</Text>
                      <Card.Title>Embracing Digital Detox: Rediscovering Balance in a Hyperconnected
                        World</Card.Title>
                      <Card.Description>
                        Technology dominates our lives, leading to stress and burnout. Digital detoxes,
                        periods of intentional disconnection, can improve focus, mental health, and
                        well-being.
                      </Card.Description>
                    </Card.Body>
                  </Card.Root>
                </Link>
              </LinkBox>
              <LinkBox
                flexShrink="0"
                as="article"
                _hover={{ transform: 'scale(1.02)', transition: '0.2s' }}
              >
                <Link to="/story/3">
                  <Card.Root maxW="sm" overflow="hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1664575198308-3959904fa430?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    />
                    <Card.Body gap="2">
                      <Text>Bernadette Underwood</Text>
                      <Card.Title>The Rise of Remote Work: Transforming Our Approach to Work and
                        Life</Card.Title>
                      <Card.Description>
                        Remote work, initially a temporary solution, has become a long-term arrangement
                        reshaping modern work culture. This shift influences both professional and
                        personal lives.
                      </Card.Description>
                    </Card.Body>
                  </Card.Root>
                </Link>
              </LinkBox>
            </Stack>
          </VStack>
        </motion.div>
      </motion.div>
    );
  }

  return isLoading ? loading() : blogPost();
}

export default Story;