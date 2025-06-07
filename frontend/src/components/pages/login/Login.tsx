import { Button, Field, Fieldset, Input, Link, Stack, HStack } from '@chakra-ui/react';
import { PasswordInput } from '@/components/ui/password-input.tsx';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import CustomLoading from '@/components/elements/CustomLoading';
import { login } from '@/apis/authApi.ts';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import ForgotPasswordDialog from '@/components/pages/login/ForgotPasswordDialog.tsx';

export default function Login() {
  const { t } = useTranslation();
  const schema = z.object({
    username: z.string().nonempty(t('common.errors.required.username')),
    password: z.string().min(8, t('common.errors.required.field')),
  });

  type FormFields = z.infer<typeof schema>;
  const { setUserDetails } = useContext(UserDetailContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    document.title = t('auth.login.title');
  }, [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    setIsSubmitting(true);
    toast
      .promise(login(data), {
        loading: CustomLoading(t('auth.login.toast.loading')),
        success: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['blog'],
            refetchType: 'all',
            exact: false,
          });
          navigate('/dashboard');
          return t('auth.login.toast.success');
        },
        error: () => {
          setIsSubmitting(false);
          return t('auth.login.toast.error');
        },
      })
      .unwrap()
      .then((r) => {
        setIsSubmitting(false);
        setUserDetails(r);
      });
  };

  return (
    <>
      <ForgotPasswordDialog open={openDialog} setOpen={setOpenDialog} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset.Root size="lg" maxW="md">
          <Stack>
            <Fieldset.Legend>{t('auth.login.title')}</Fieldset.Legend>
            <Fieldset.HelperText>{t('auth.login.desc')}</Fieldset.HelperText>
          </Stack>

          <Fieldset.Content>
            <Field.Root invalid={!!errors.username}>
              <Field.Label>{t('common.fields.username')}</Field.Label>
              <Input {...register('username')} />
              <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.password}>
              <Field.Label>{t('common.fields.password')}</Field.Label>
              <PasswordInput {...register('password')} />
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            </Field.Root>
          </Fieldset.Content>

          <HStack gap={1}>
            <Trans i18nKey="auth.login.forgot">
              Did you <Link onClick={() => {
              setOpenDialog(true);
            }}>forget your password</Link>?
            </Trans>
          </HStack>

          <Button type="submit" alignSelf="flex-start" disabled={isSubmitting}>
            {t('buttons.login')}
          </Button>
        </Fieldset.Root>
      </form>
    </>
  );
}
