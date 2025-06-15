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
import CustomLoading from '@/components/elements/CustomLoading';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

type Props = {
  commentId: number | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function DeleteDialog({ open, setOpen, commentId }: Props) {
  const { t } = useTranslation();
  const { blogId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  function clickedDelete() {
    setIsSubmitting(true);
    toast.promise(deleteComment(commentId), {
      loading: CustomLoading(t('content.story.comments.toasts.delete.loading')),
      success: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['comment', blogId],
        });
        setOpen(false);
        setIsSubmitting(false);
        return t('content.story.comments.toasts.delete.success');
      },
      error: () => {
        setIsSubmitting(false);
        return t('content.story.comments.toasts.delete.error');
      },
    });
  }

  return (
    <DialogRoot placement="center" role="alertdialog" open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('content.story.comments.delete.title')}</DialogTitle>
        </DialogHeader>
        <DialogBody>{t('content.story.comments.delete.desc')}</DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" disabled={isSubmitting}>
              {t('buttons.cancel')}
            </Button>
          </DialogActionTrigger>
          <Button colorPalette="red" disabled={isSubmitting} onClick={clickedDelete}>
            {t('buttons.delete')}
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}
