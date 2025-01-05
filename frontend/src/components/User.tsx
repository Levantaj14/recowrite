import { ReactNode, useEffect } from 'react';
import { Box, Center, Flex, Heading, IconButton, LinkBox, LinkOverlay, Spacer, Spinner, Text } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar.tsx';
import { motion } from 'motion/react';
import BlogCard from '@/components/BlogCard.tsx';
import { FaBluesky, FaInstagram, FaMastodon, FaMedium, FaXTwitter } from 'react-icons/fa6';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/apis/userApi.ts';
import { fetchBlogsByAuthor } from '@/apis/blogApi.ts';

function User() {
  const { userId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const userData = await fetchUser(userId);
      const userBlogs = await fetchBlogsByAuthor(userId);
      return { userData, userBlogs };
    },
  });

  useEffect(() => {
    document.title = data?.userData.name ?? 'Loading...';
  }, [data])

  const iconMap: { [key: string]: ReactNode } = {
    instagram: <FaInstagram />,
    x: <FaXTwitter />,
    bluesky: <FaBluesky />,
    mastodon: <FaMastodon />,
    medium: <FaMedium />,
  };

  function loading() {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  function userPage() {
    console.log(data?.userBlogs)
    return (
      // TODO: Make it look good on phones
      <motion.div initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}>
        <Flex direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Flex gap={6} alignItems="center">
              <Avatar
                size="2xl"
                name={data?.userData.name}
                src={data?.userData.avatar}
              />
              <Box>
                <Heading size="4xl">{data?.userData.name}</Heading>
                <Text color={'gray'}>@{data?.userData.username}</Text>
              </Box>
            </Flex>
          </Box>
          <Spacer />
          <Box>
            <Flex direction="row">
              {data !== undefined && Object.entries(data.userData.socials).map(([key, value]) => (
                <LinkBox>
                  <IconButton variant="ghost">
                    <LinkOverlay href={value} target="_blank">{iconMap[key]}</LinkOverlay>
                  </IconButton>
                </LinkBox>
              ))}
            </Flex>
          </Box>
        </Flex>
        <Heading mt={6} size="xl">About me</Heading>
        <Text>{data?.userData.bio}</Text>
        <Heading size="xl" mt={6} mb={2}>Articles</Heading>
        {data?.userBlogs.map((blog, index) => (
          <BlogCard
            imageUrl={blog.banner}
            title={blog.title}
            description={blog.description}
            author={data?.userData.name}
            href={`/blog/${blog.id}`}
            index={index}
          />
        ))}
      </motion.div>
    );
  }

  return isLoading ? loading() : userPage();
}

export default User;