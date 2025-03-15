import { Button, Field, Fieldset, Heading, Stack } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { resetPasswordwithToken, validateToken } from '@/apis/authApi.ts';
import { toast } from 'sonner';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordInput, PasswordStrengthMeter } from '@/components/ui/password-input.tsx';
import CustomLoading from '@/components/elements/CustomLoading.tsx';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { userDetails } = useContext(UserDetailContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = z.object({
    password: z.string().min(8, t('loginPage.errors.password')),
    passwordConfirm: z.string().min(8, t('loginPage.errors.password'))
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
    toast.promise(resetPasswordwithToken(searchParams.get('token'), data.password), {
      loading: CustomLoading("Resetting your password"),
      success: async () => {
        navigate('/');
        setIsSubmitting(false);
        return "Your password has been reset!";
      },
      error: () => {
        setIsSubmitting(false);
        return "The password could not be reset.";
      },
    })
  }

  useEffect(() => {
    document.title = 'Forgot Password';
  }, []);

  useEffect(() => {
    if (userDetails !== null) {
      navigate('/');
    }
  }, [navigate, userDetails]);

  useEffect(() => {
    if (searchParams.get('token') != null) {
      validateToken(searchParams.get('token')).then(r => {
        if (!r) {
          toast.info('The link is invalid or expired');
          navigate('/');
        }
      });
    }
  }, [navigate, searchParams]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset.Root size="lg" maxW="md">
          <Stack>
            <Heading>Forgot your password</Heading>
          </Stack>
          <Fieldset.Content>
            <Field.Root invalid={!!errors.password}>
              <Field.Label>{t('loginPage.fields.password')}</Field.Label>
              <PasswordInput {...register('password')} />
              <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
              <PasswordStrengthMeter width="xs" value={passwordStrengthMeter(watch('password'))} />
            </Field.Root>

            <Field.Root invalid={!!errors.passwordConfirm}>
              <Field.Label>{t('loginPage.fields.confPassword')}</Field.Label>
              <PasswordInput {...register('passwordConfirm')} />
              <Field.ErrorText>{errors.passwordConfirm?.message}</Field.ErrorText>
            </Field.Root>
          </Fieldset.Content>

          <Button type="submit" alignSelf="flex-start" disabled={isSubmitting}>
            Reset password
          </Button>
        </Fieldset.Root>
      </form>
    </>
  );
}