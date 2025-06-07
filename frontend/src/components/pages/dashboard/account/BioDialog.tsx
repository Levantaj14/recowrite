import { Field, Fieldset, Flex, Heading, Textarea } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
import { motion } from 'motion/react';
import { useContext, useEffect, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { updateBio } from '@/apis/accountApi.ts';
import { toast } from 'sonner';
import CustomLoading from '@/components/elements/CustomLoading.tsx';

export function BioDialog() {
  const { t } = useTranslation();
  const { userDetails, setUserDetails } = useContext(UserDetailContext);

  const schema = z.object({
    bio: z.string().max(255, t('common.errors.validation.maxChars')),
  });

  type FormFields = z.infer<typeof schema>;

  const [open, setOpen] = useState(false);
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
    toast.promise(updateBio(data.bio), {
      loading: CustomLoading(t('user.profile.account.toast.bio.loading')),
      success: () => {
        setIsSubmitting(false);
        setOpen(false);
        if (userDetails) {
          setUserDetails({ ...userDetails, bio: data.bio });
        }
        return t('user.profile.account.toast.bio.success');
      },
      error: () => {
        setIsSubmitting(false);
        return t('user.profile.account.toast.bio.error');
      },
    });
  };

  useEffect(() => {
    reset({
      bio: userDetails?.bio,
    });
  }, [reset, open, userDetails]);

  return (
    <>
      <DialogRoot placement="top" size="lg" open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{t('user.profile.account.fields.bio')}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Fieldset.Root>
                <Field.Root invalid={!!errors.bio}>
                  <Textarea {...register('bio')} autoresize />
                  <Field.ErrorText>{errors.bio?.message}</Field.ErrorText>
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
          <Heading size="md">{t('user.profile.account.fields.bio')}</Heading>
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
            {t('buttons.edit')}
          </Button>
        </Flex>
      </motion.div>
    </>
  );
}
