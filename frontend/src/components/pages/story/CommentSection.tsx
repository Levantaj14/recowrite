import { Box, Button, Flex, Heading, Text, Textarea, Center, Spinner, Link, Field } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { Avatar } from '@/components/ui/avatar.tsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getComments, postComment } from '@/apis/commentApi.ts';
import { NavLink } from 'react-router';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import CustomLoading from '@/components/CustomLoading.tsx';
import { motion } from 'motion/react';

type Props = {
  blogId: string | undefined;
}

const schema = z.object({
  comment: z.string().nonempty().max(256),
});

type FormFields = z.infer<typeof schema>

export default function CommentSection({ blogId }: Props) {
  const { userDetails } = useContext(UserDetailContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['comment', blogId],
    queryFn: () => getComments(blogId),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormFields>({
    defaultValues: { comment: '' },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    setIsSubmitting(true);
    toast.promise(postComment(blogId, data.comment), {
      loading: CustomLoading('Posting comment...'),
      success: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['comment', blogId],
        });
        setIsSubmitting(false);
        reset();
        return 'Comment posted successfully';
      },
      error: () => {
        setIsSubmitting(false);
        return 'There was an error while posting comment';
      },
    });
  };

  function loadingScreen() {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  function Comments() {
    if (!data || data.length === 0) {
      return <Text>There are no comments</Text>;
    }

    const visibleComments = showAll ? data : [data[0]];
    const remainingComments = data.length - 1;

    return (
      <>
        {visibleComments.map((comment) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Flex key={comment.id} mt={4} ml={2} flexDirection="row" justifyContent="start">
              <Avatar size="xs" mr={4} name={comment.authorName} src={comment.authorAvatar} />
              <Flex flexDirection="column">
                <Link asChild>
                  <NavLink to={`/user/${comment.authorId}`}>
                    <Heading size="md">{comment.authorName}</Heading>
                  </NavLink>
                </Link>
                <Text>{comment.comment}</Text>
              </Flex>
            </Flex>
          </motion.div>
        ))}

        {remainingComments > 0 && !showAll && (
          <Button
            mt={4}
            onClick={() => setShowAll(true)}
          >
            Show {remainingComments} more {remainingComments === 1 ? 'comment' : 'comments'}
          </Button>
        )}
      </>
    );
  }

  return (
    <Box mt={5} mb={7}>
      <Heading size="3xl" mb={3}>Comments</Heading>
      {userDetails !== null && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Heading size="xl" mb={3}>Add a new comment</Heading>
          <Field.Root invalid={!!errors.comment}>
            <Textarea {...register('comment')} />
            <Field.ErrorText>{errors.comment?.message}</Field.ErrorText>
          </Field.Root>
          <Button type="submit" mt={3} mb={3} disabled={isSubmitting}>Comment</Button>
        </form>
      )}
      {isLoading ? loadingScreen() : Comments()}
    </Box>
  );
}