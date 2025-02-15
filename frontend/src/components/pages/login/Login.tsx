import { Button, Field, Fieldset, Input, Stack } from '@chakra-ui/react';
import { PasswordInput } from '@/components/ui/password-input.tsx';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import CustomLoading from '@/components/CustomLoading.tsx';
import { login } from '@/apis/authApi.ts';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required').min(8),
});

type FormFields = z.infer<typeof schema>;

export default function Login() {
  const { t } = useTranslation();
  const { setUserDetails } = useContext(UserDetailContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = t('loginPage.login.title');
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
    toast.promise(login(data), {
      loading: CustomLoading(t('loginPage.toast.login.loading')),
      success: async () => {
        await queryClient.invalidateQueries({
          queryKey: ['blog'],
        });
        navigate('/dashboard');
        return t('loginPage.toast.login.success');
      },
      error: () => {
        setIsSubmitting(false);
        return t('loginPage.toast.login.error');
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
          <Fieldset.Legend>{t('loginPage.login.title')}</Fieldset.Legend>
          <Fieldset.HelperText>{t('loginPage.login.desc')}</Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field.Root invalid={!!errors.username}>
            <Field.Label>{t('loginPage.fields.username')}</Field.Label>
            <Input {...register('username')} />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>{t('loginPage.fields.password')}</Field.Label>
            <PasswordInput {...register('password')} />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>
        </Fieldset.Content>

        <Button type="submit" alignSelf="flex-start" disabled={isSubmitting}>
          {t('buttons.login')}
        </Button>
      </Fieldset.Root>
    </form>
  );
}
