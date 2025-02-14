import {
  DialogActionTrigger,
  DialogCloseTrigger,
  DialogRoot,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteComment } from '@/apis/commentApi.ts';
import CustomLoading from '@/components/CustomLoading.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';

type Props = {
  commentId: number | null;
  open: boolean,
  setOpen: (open: boolean) => void,
}

export default function DeleteDialog({ open, setOpen, commentId }: Props) {
  const { blogId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const clickedDelete = () => {
    setIsSubmitting(true);
    toast.promise(deleteComment(commentId), {
      loading: CustomLoading('Deleting comment...'),
      success: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['comment', blogId],
        });
        setOpen(false);
        setIsSubmitting(false);
        return 'Comment deleted successfully';
      },
      error: () => {
        setIsSubmitting(false);
        return 'There was an error while deleting the comment';
      },
    });
  }

  return (
    <DialogRoot placement="center" role="alertdialog" open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <DialogBody>
          This action cannot be undone. This will permanently delete this comment.
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
          </DialogActionTrigger>
          <Button colorPalette="red" disabled={isSubmitting} onClick={clickedDelete}>Delete</Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}