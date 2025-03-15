import {
  DialogActionTrigger,
  DialogBody, DialogCloseTrigger,
  DialogContent, DialogDescription,
  DialogFooter,
  DialogHeader, DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Field, Fieldset, Input } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { forgotPassword } from '@/apis/authApi.ts';
import CustomLoading from '@/components/elements/CustomLoading.tsx';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ForgotPasswordDialog({ open, setOpen }: Props) {
  const { t } = useTranslation();

  const schema = z.object({
    email: z.string().email(t('forgotPasswordDialog.error.email.incorrect')).nonempty(t('forgotPasswordDialog.error.email.mandatory')),
  });

  type FormFields = z.infer<typeof schema>;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    setIsSubmitting(true);
    toast.promise(forgotPassword(data.email), {
      loading: CustomLoading(t('forgotPasswordDialog.toast.loading')),
      success: () => {
        setIsSubmitting(false);
        setOpen(false);
        return t('forgotPasswordDialog.toast.success');
      },
      error: () => {
        setIsSubmitting(false);
        return t('forgotPasswordDialog.toast.error');
      }
    })
  };

  useEffect(() => {
    reset({
      email: '',
    });
  }, [reset, open]);

  return (
    <>
      <DialogRoot placement="center" open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{t('forgotPassword.title')}</DialogTitle>
              <DialogDescription>{t('forgotPasswordDialog.desc')}</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <Fieldset.Root>
                <Field.Root invalid={!!errors.email}>
                  <Field.Label>{t('forgotPasswordDialog.email')}</Field.Label>
                  <Input {...register('email')} />
                  <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                </Field.Root>
              </Fieldset.Root>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline" disabled={isSubmitting}>
                  {t('buttons.cancel')}
                </Button>
              </DialogActionTrigger>
              <Button type="submit" disabled={isSubmitting}>
                {t('buttons.submit')}
              </Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </form>
        </DialogContent>
      </DialogRoot>
    </>
  );
}