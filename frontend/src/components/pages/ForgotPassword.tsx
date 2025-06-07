import { Button, Field, Fieldset, Heading, Stack } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { resetPasswordWithToken, validateToken } from '@/apis/authApi.ts';
import { toast } from 'sonner';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordInput, PasswordStrengthMeter } from '@/components/ui/password-input.tsx';
import CustomLoading from '@/components/elements/CustomLoading.tsx';
import ErrorPage from '@/components/pages/ErrorPage.tsx';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { userDetails } = useContext(UserDetailContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  const schema = z.object({
    password: z.string().min(8, t('common.password.errors.minLength')),
    passwordConfirm: z.string(),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: t('common.password.errors.passwordMatch'),
    path: ['passwordConfirm'],
  });

  type FormFields = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
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
    toast.promise(resetPasswordWithToken(searchParams.get('token'), data.password), {
      loading: CustomLoading(t('common.password.toast.resetLoading')),
      success: async () => {
        navigate('/');
        setIsSubmitting(false);
        return t('common.password.toast.resetSuccess');
      },
      error: () => {
        setIsSubmitting(false);
        return t('common.password.toast.resetError');
      },
    });
  };

  useEffect(() => {
    document.title = t('auth.forgotPassword.title');
  }, [t]);

  useEffect(() => {
    if (userDetails !== null) {
      navigate('/');
    }
  }, [navigate, userDetails]);

  useEffect(() => {
    if (searchParams.get('token') != null) {
      validateToken(searchParams.get('token')).then(r => {
        if (!r) {
          toast.info(t('auth.forgotPassword.invalid'));
          navigate('/');
        }
      });
    } else {
      setShowError(true);
    }
  }, [t, navigate, searchParams]);

  return showError ? <ErrorPage code={400} /> : (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset.Root size="lg" maxW="md">
          <Stack>
            <Heading>{t('auth.forgotPassword.title')}</Heading>
          </Stack>
          <Fieldset.Content>
            <Field.Root invalid={!!errors.password}>
              <Field.Label>{t('common.fields.password')}</Field.Label>
              <PasswordInput {...register('password')} />
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
              <PasswordStrengthMeter width="xs" value={passwordStrengthMeter(watch('password'))} />
            </Field.Root>

            <Field.Root invalid={!!errors.passwordConfirm}>
              <Field.Label>{t('common.fields.confirmPassword')}</Field.Label>
              <PasswordInput {...register('passwordConfirm')} />
              <Field.ErrorText>{errors.passwordConfirm?.message}</Field.ErrorText>
            </Field.Root>
          </Fieldset.Content>

          <Button type="submit" alignSelf="flex-start" disabled={isSubmitting}>
            {t('buttons.reset')}
          </Button>
        </Fieldset.Root>
      </form>
    </>
  );
}