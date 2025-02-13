import { Box, Button, Flex, Heading, Text, Textarea, Center, Spinner, Link, Collapsible } from '@chakra-ui/react';
import { useContext } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { Avatar } from '@/components/ui/avatar.tsx';
import { useQuery } from '@tanstack/react-query';
import { getComments } from '@/apis/commentApi.ts';
import { NavLink } from 'react-router';

type Props = {
  blogId: string | undefined;
}

export default function CommentSection({ blogId }: Props) {
  const { userDetails } = useContext(UserDetailContext);

  const { data, isLoading } = useQuery({
    queryKey: ['comment', blogId],
    queryFn: () => getComments(blogId),
  });

  function loadingScreen() {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  function Comments() {
    return (
      <>
        {data !== undefined && data?.length > 0 ? data?.map((comment) => (
          <Flex key={comment.id} mt={4} ml={2} flexDirection="row" justifyContent="start">
            <Avatar size="xs" mr={4} name={comment.authorName} src={comment.authorAvatar} />
            <Flex flexDirection="column">
              <Link asChild>
                <NavLink to={`/user/${comment.authorId}`}>
                  <Heading size="md">{comment.authorUsername}</Heading>
                </NavLink>
              </Link>
              <Text>{comment.comment}</Text>
            </Flex>
          </Flex>
        )) : <Text>There are no comments</Text>}
      </>
    );
  }

  return (
    <Box mt={5} mb={5}>
      <Heading size="3xl" mb="5">Comments</Heading>
      {userDetails !== null && (
        <>
          <Collapsible.Root defaultOpen={true}>
            <Collapsible.Trigger><Heading size="xl" mb={3}>Add a new comment</Heading></Collapsible.Trigger>
            <Collapsible.Content>
              <Textarea />
              <Button mt={2} mb={3}>Comment</Button>
            </Collapsible.Content>
          </Collapsible.Root>
        </>
      )}
      {isLoading ? loadingScreen() : Comments()}
    </Box>
  );
}