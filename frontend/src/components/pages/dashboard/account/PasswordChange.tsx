import { Field, Fieldset, Flex, Heading } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
import { FaKey } from 'react-icons/fa';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordInput, PasswordStrengthMeter } from '@/components/ui/password-input.tsx';
import { toast } from 'sonner';
import { updatePassword } from '@/apis/accountApi.ts';
import CustomLoading from '@/components/elements/CustomLoading.tsx';
import { useTranslation } from 'react-i18next';

export function PasswordChange() {
  const { t } = useTranslation();

  const schema = z.object({
    oldPassword: z.string().nonempty(t('common.password.errors.required')),
    newPassword: z.string().min(8, t('common.password.errors.minLength')),
    passwordConfirm: z.string(),
  }).refine((data) => data.newPassword === data.passwordConfirm, {
    message: t('common.password.errors.passwordMatch'),
    path: ['passwordConfirm'],
  });

  type FormFields = z.infer<typeof schema>;

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const passwordStrengthMeter = (password: string) => {
    let score = 0;
    if (password !== undefined) {
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;
    }
    return score;
  };

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    setIsSubmitting(true);
    toast.promise(updatePassword(data.oldPassword, data.newPassword), {
      loading: CustomLoading(t('common.password.toast.loading')),
      success: () => {
        setIsSubmitting(false);
        setOpen(false);
        return t('common.password.toast.success');
      },
      error: () => {
        setIsSubmitting(false);
        return t('common.password.toast.error');
      },
    });
  };

  useEffect(() => {
    reset({
      oldPassword: '',
      newPassword: '',
    });
  }, [reset, open]);

  return (
    <>
      <DialogRoot placement="center" open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{t('user.profile.account.fields.changePassword')}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Fieldset.Root>
                <Field.Root invalid={!!errors.oldPassword}>
                  <Field.Label>{t('common.password.oldPassword')}</Field.Label>
                  <PasswordInput {...register('oldPassword')} />
                  <Field.ErrorText>{errors.oldPassword?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.newPassword}>
                  <Field.Label>{t('common.password.newPassword')}</Field.Label>
                  <PasswordInput {...register('newPassword')} />
                  <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
                  <PasswordStrengthMeter width="xs" value={passwordStrengthMeter(watch('newPassword'))} />
                </Field.Root>

                <Field.Root invalid={!!errors.passwordConfirm}>
                  <Field.Label>{t('common.password.confirmPassword')}</Field.Label>
                  <PasswordInput {...register('passwordConfirm')} />
                  <Field.ErrorText>{errors.passwordConfirm?.message}</Field.ErrorText>
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
                {t('buttons.save')}
              </Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </form>
        </DialogContent>
      </DialogRoot>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.12 }}
      >
        <Flex align="start" justifyContent="space-between" alignItems="center" mt="4">
          <Heading size="md">{t('user.profile.account.fields.changePassword')}</Heading>
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
            <FaKey />
            {t('buttons.change')}
          </Button>
        </Flex>
      </motion.div>
    </>
  );
}
