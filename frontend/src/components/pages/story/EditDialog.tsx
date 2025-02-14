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
import { Button, Textarea, Field } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { editComments } from '@/apis/commentApi.ts';
import CustomLoading from '@/components/CustomLoading.tsx';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type Props = {
  commentId: number | null;
  commentContent: string | undefined;
  open: boolean,
  setOpen: (open: boolean) => void,
}

const schema = z.object({
  comment: z.string().nonempty(),
});

type FormFields = z.infer<typeof schema>;

export default function EditDialog({ open, setOpen, commentId, commentContent }: Props) {
  const { blogId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    reset({
      comment: commentContent || '',
    });
  }, [commentContent, reset]);

  const clickedEdit: SubmitHandler<FormFields> = (data) => {
    setIsSubmitting(true);
    toast.promise(editComments(commentId, data.comment), {
      loading: CustomLoading('Editing comment...'),
      success: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['comment', blogId],
        });
        setOpen(false);
        setIsSubmitting(false);
        return 'Comment edited successfully';
      },
      error: () => {
        setIsSubmitting(false);
        return 'There was an error while editing the comment';
      },
    });
  };

  return (
    <DialogRoot placement="top" open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(clickedEdit)}>
          <DialogBody pb="4">
            <Field.Root invalid={!!errors.comment}>
              <Textarea {...register('comment')} />
              <Field.ErrorText>{errors.comment?.message}</Field.ErrorText>
            </Field.Root>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DialogActionTrigger>
            <Button type="submit" disabled={isSubmitting}>Save</Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}