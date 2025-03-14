import { ReactNode, useContext, useEffect } from 'react';
import {
  Alert,
  Box,
  Center,
  Flex,
  Heading,
  IconButton,
  LinkBox,
  LinkOverlay,
  Spacer,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar.tsx';
import { motion } from 'motion/react';
import BlogCard from '@/components/elements/BlogCard';
import { FaBluesky, FaInstagram, FaMedium, FaXTwitter } from 'react-icons/fa6';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/apis/userApi.ts';
import { fetchBlogsByAuthor } from '@/apis/blogApi.ts';
import { useTranslation } from 'react-i18next';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';

function User() {
  const { t } = useTranslation();
  const { userId } = useParams();
  const { userDetails } = useContext(UserDetailContext);

  const { data, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const userData = await fetchUser(Number(userId));
      const userBlogs = await fetchBlogsByAuthor(userId);
      return { userData, userBlogs };
    },
  });

  useEffect(() => {
    document.title = data?.userData.name ?? t('tabLoading');
  }, [data, t]);

  const iconMap: { [key: string]: ReactNode } = {
    Instagram: <FaInstagram />,
    X: <FaXTwitter />,
    Bluesky: <FaBluesky />,
    Medium: <FaMedium />,
  };

  const urlMap: { [key: string]: string } = {
    Instagram: 'https://www.instagram.com/',
    X: 'https://x.com/',
    Bluesky: 'https://bsky.app/profile/',
    Medium: 'https://medium.com/@',
  }

  function loading() {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  function userPage() {
    return (
      // TODO: Make it look good on phones
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {(userDetails !== null && String(userDetails.id) === userId) && (
          <Alert.Root status="info" mb={6}>
            <Alert.Indicator />
            <Alert.Title>{t('user.othersAlert')}</Alert.Title>
          </Alert.Root>
        )}
        <Flex direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Flex gap={6} alignItems="center">
              <Avatar size="2xl" name={data?.userData.name} src={`data:image;base64,${data?.userData.avatar}`} />
              <Box>
                <Heading size="4xl">{data?.userData.name}</Heading>
                <Text color={'gray'}>@{data?.userData.username}</Text>
              </Box>
            </Flex>
          </Box>
          <Spacer />
          <Box>
            <Flex direction="row">
              {data !== undefined &&
                data.userData.socials.map((data) => (
                  <LinkBox>
                    <IconButton variant="ghost">
                      <LinkOverlay href={`${urlMap[data.name]}${data.url}`} target="_blank">
                        {iconMap[data.name]}
                      </LinkOverlay>
                    </IconButton>
                  </LinkBox>
                ))}
            </Flex>
          </Box>
        </Flex>
        {data?.userData.bio && (
          <>
            <Heading mt={6} size="xl">
              {t('user.about')}
            </Heading>
            <Text>{data?.userData.bio}</Text>
          </>
        )}
        <Heading size="xl" mt={6} mb={2}>
          {t('user.articles')}
        </Heading>
        {data !== undefined && data.userBlogs.length > 0 ? (
          data.userBlogs.map((blog, index) => (
            <BlogCard
              imageUrl={blog.banner}
              title={blog.title}
              description={blog.description}
              author={data?.userData.name}
              href={`/blog/${blog.id}`}
              index={index}
            />
          ))
        ) : (
          <Text>{t('user.noArticles')}</Text>
        )}
      </motion.div>
    );
  }

  return isLoading ? loading() : userPage();
}

export default User;
