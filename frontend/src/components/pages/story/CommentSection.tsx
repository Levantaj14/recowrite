import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Textarea,
  Center,
  Spinner,
  Link,
  Field,
  MenuTrigger, MenuContent, MenuItem, MenuRoot, Spacer, MenuSelectionDetails,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { Avatar } from '@/components/ui/avatar.tsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getComments, postComment } from '@/apis/commentApi.ts';
import { NavLink, useParams } from 'react-router';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import CustomLoading from '@/components/elements/CustomLoading';
import { motion } from 'motion/react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import DeleteDialog from '@/components/pages/story/DeleteDialog.tsx';
import EditDialog from '@/components/pages/story/EditDialog.tsx';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  comment: z.string().nonempty().max(256),
});

type FormFields = z.infer<typeof schema>

export default function CommentSection() {
  const { t } = useTranslation();
  const { blogId } = useParams();
  const { userDetails } = useContext(UserDetailContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [selectedCommentContent, setSelectedCommentContent] = useState<string | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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
      loading: CustomLoading(t('story.comments.toasts.post.loading')),
      success: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['comment', blogId],
        });
        setIsSubmitting(false);
        reset();
        return t('story.comments.toasts.post.success');
      },
      error: () => {
        setIsSubmitting(false);
        return t('story.comments.toasts.post.error');
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

  const selectedItem = (menuSelectionDetails: MenuSelectionDetails,
                        selectedId: number, selectedContent: string) => {
    setSelectedCommentId(selectedId);
    setSelectedCommentContent(selectedContent);
    switch (menuSelectionDetails.value) {
      case 'edit':
        setEditDialogOpen(true);
        break;
      case 'delete':
        setDeleteDialogOpen(true);
        break;
    }
  };

  function Comments() {
    if (!data || data.length === 0) {
      return <Text>{t('story.comments.none')}</Text>;
    }

    const visibleComments = showAll ? data : [data[0]];
    const remainingComments = data.length - 1;

    return (
      <>
        <DeleteDialog open={deleteDialogOpen} setOpen={setDeleteDialogOpen} commentId={selectedCommentId} />
        <EditDialog open={editDialogOpen} setOpen={setEditDialogOpen}
                    commentId={selectedCommentId} commentContent={selectedCommentContent} />
        {visibleComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Flex mt={4} ml={2} flexDirection="row" justifyContent="start">
              <Avatar size="xs" mr={4} name={comment.authorName} src={comment.authorAvatar} />
              <Flex flexDirection="column">
                <Link asChild>
                  <NavLink to={`/user/${comment.authorId}`}>
                    <Heading size="md">{comment.authorName}</Heading>
                  </NavLink>
                </Link>
                <Text>{comment.comment}</Text>
              </Flex>
              <Spacer />
              {userDetails?.id === comment.authorId && (
                <Box position="relative">
                  <MenuRoot positioning={{ placement: 'bottom-end' }}
                            onSelect={(e) => selectedItem(e, comment.id, comment.comment)}>
                    <MenuTrigger asChild>
                      <Button variant="ghost"><HiOutlineDotsHorizontal /></Button>
                    </MenuTrigger>
                    <MenuContent zIndex="popover" position="absolute" right="0">
                      <MenuItem value="edit">{t('buttons.edit')}</MenuItem>
                      <MenuItem
                        value="delete"
                        color="fg.error"
                        _hover={{ bg: 'bg.error', color: 'fg.error' }}
                      >
                        {t('buttons.delete')}
                      </MenuItem>
                    </MenuContent>
                  </MenuRoot>
                </Box>
              )}
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
      <Heading size="3xl" mb={3}>{t('story.comments.title')}</Heading>
      {userDetails !== null && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Heading size="xl" mb={3}>{t('story.comments.new')}</Heading>
          <Field.Root invalid={!!errors.comment}>
            <Textarea {...register('comment')} />
            <Field.ErrorText>{errors.comment?.message}</Field.ErrorText>
          </Field.Root>
          <Button type="submit" mt={3} mb={3} disabled={isSubmitting}>{t('buttons.comment')}</Button>
        </form>
      )}
      {isLoading ? loadingScreen() : Comments()}
    </Box>
  );
}