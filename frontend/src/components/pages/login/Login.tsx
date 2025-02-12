import { Button, Field, Fieldset, Input, Stack } from '@chakra-ui/react';
import { PasswordInput } from '@/components/ui/password-input.tsx';
import { useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import CustomLoading from '@/components/CustomLoading.tsx';
import { login } from '@/apis/authApi.ts';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';

const schema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required').min(8),
});

type FormFields = z.infer<typeof schema>;

export default function Login() {
  const { setUserDetails } = useContext(UserDetailContext);

  useEffect(() => {
    document.title = 'Login';
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    toast.promise(login(data), {
      loading: CustomLoading('Logging in...'),
      success: 'Logged in successfully',
      error: 'An error occurred',
    }).unwrap().then(r => setUserDetails(r));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.Legend>Login</Fieldset.Legend>
          <Fieldset.HelperText>Welcome back! Just a few more steps for a better experience</Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field.Root invalid={!!errors.username}>
            <Field.Label>Username</Field.Label>
            <Input {...register('username')} />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <PasswordInput {...register('password')} />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>
        </Fieldset.Content>

        <Button type="submit" alignSelf="flex-start" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </Fieldset.Root>
    </form>
  );
}
