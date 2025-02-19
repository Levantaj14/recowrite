import { Button, Field, Fieldset, Input, Stack } from '@chakra-ui/react';
import { PasswordInput, PasswordStrengthMeter } from '@/components/ui/password-input.tsx';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signup } from '@/apis/authApi.ts';
import CustomLoading from '@/components/elements/CustomLoading';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export default function SignUp() {
  const { t } = useTranslation();

  const schema = z.object({
    name: z.string().nonempty(t('loginPage.errors.name')),
    email: z.string().email(t('loginPage.errors.email')),
    username: z.string().nonempty(t('loginPage.errors.username')),
    password: z.string().min(8, t('loginPage.errors.password')),
    passwordConfirm: z.string().min(8, t('loginPage.errors.password'))
  });
  
  type FormFields = z.infer<typeof schema>;

  const { setUserDetails } = useContext(UserDetailContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = t('loginPage.signup.title');
  }, [t]);

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
    toast.promise(signup(data), {
      loading: CustomLoading(t('loginPage.toast.signup.loading')),
      success: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['blog'],
          refetchType: 'all',
          exact: false
        });
        navigate('/');
        return t('loginPage.toast.signup.success');
      },
      error: () => {
        setIsSubmitting(false);
        return t('loginPage.toast.signup.error')
      },
    }).unwrap().then(r => {
      setIsSubmitting(false);
      setUserDetails(r);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.Legend>{t('loginPage.signup.title')}</Fieldset.Legend>
          <Fieldset.HelperText>{t('loginPage.signup.desc')}</Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field.Root invalid={!!errors.name}>
            <Field.Label>{t('loginPage.fields.name')}</Field.Label>
            <Input {...register('name')} />
            <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.email}>
            <Field.Label>{t('loginPage.fields.email')}</Field.Label>
            <Input {...register('email')} />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.username}>
            <Field.Label>{t('loginPage.fields.username')}</Field.Label>
            <Input {...register('username')} />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>

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
          {t('buttons.signup')}
        </Button>
      </Fieldset.Root>
    </form>
  );
}
