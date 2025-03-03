import { Field, Fieldset, Flex, Heading } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
import { FaKey } from 'react-icons/fa';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import {
  DialogActionTrigger, DialogBody, DialogCloseTrigger,
  DialogContent,
  DialogFooter, DialogHeader,
  DialogRoot, DialogTitle,
} from '@/components/ui/dialog.tsx';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordInput, PasswordStrengthMeter } from '@/components/ui/password-input.tsx';
import { toast } from 'sonner';
import { updatePassword } from '@/apis/accountApi.ts';
import CustomLoading from '@/components/elements/CustomLoading.tsx';

export function PasswordChange() {
  const schema = z.object({
    oldPassword: z.string().nonempty(),
    newPassword: z.string().min(8, 'The password must be at least 8 characters'),
  });

  type FormFields = z.infer<typeof schema>

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
      loading: CustomLoading('Saving changes...'),
      success: () => {
        setIsSubmitting(false);
        setOpen(false);
        return 'Password changed successfully';
      },
      error: () => {
        setIsSubmitting(false);
        return 'Password change failed';
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
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Fieldset.Root>
                <Field.Root invalid={!!errors.oldPassword}>
                  <Field.Label>Old password</Field.Label>
                  <PasswordInput {...register('oldPassword')} />
                  <Field.ErrorText>{errors.oldPassword?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors.newPassword}>
                  <Field.Label>New password</Field.Label>
                  <PasswordInput {...register('newPassword')} />
                  <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
                  <PasswordStrengthMeter width="xs" value={passwordStrengthMeter(watch('newPassword'))} />
                </Field.Root>
              </Fieldset.Root>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogActionTrigger>
              <Button type="submit" disabled={isSubmitting}>Save</Button>
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
          <Heading size="md">Change password</Heading>
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}><FaKey />Change it</Button>
        </Flex>
      </motion.div>
    </>
  );
}