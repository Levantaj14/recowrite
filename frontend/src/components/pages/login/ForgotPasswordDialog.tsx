import { Dialog, Field, Fieldset, Input, Portal, Stack } from '@chakra-ui/react';
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
    email: z.string().email(t('auth.forgotPassword.dialog.error.email.incorrect')).nonempty(t('auth.forgotPassword.dialog.error.email.mandatory')),
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
      loading: CustomLoading(t('auth.forgotPassword.dialog.toast.loading')),
      success: () => {
        setIsSubmitting(false);
        setOpen(false);
        return t('auth.forgotPassword.dialog.toast.success');
      },
      error: () => {
        setIsSubmitting(false);
        return t('auth.forgotPassword.dialog.toast.error');
      },
    });
  };

  useEffect(() => {
    reset({
      email: '',
    });
  }, [reset, open]);

  return (
    <>
      <Dialog.Root placement="center" open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Dialog.Header>
                  <Stack gap={2}>
                    <Dialog.Title>{t('auth.forgotPassword.title')}</Dialog.Title>
                    <Dialog.Description>{t('auth.forgotPassword.dialog.desc')}</Dialog.Description>
                  </Stack>
                </Dialog.Header>
                <Dialog.Body>
                  <Fieldset.Root>
                    <Field.Root invalid={!!errors.email}>
                      <Field.Label>{t('auth.forgotPassword.dialog.email')}</Field.Label>
                      <Input {...register('email')} />
                      <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Root>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline" disabled={isSubmitting}>
                      {t('buttons.cancel')}
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button type="submit" disabled={isSubmitting}>
                    {t('buttons.submit')}
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger />
              </form>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}