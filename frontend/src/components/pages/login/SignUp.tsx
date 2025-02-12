import { Button, Field, Fieldset, Input, Stack } from '@chakra-ui/react';
import { PasswordInput, PasswordStrengthMeter } from '@/components/ui/password-input.tsx';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signup } from '@/apis/authApi.ts';
import CustomLoading from '@/components/CustomLoading.tsx';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useNavigate } from 'react-router';

const schema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  username: z.string().nonempty(),
  password: z.string().min(8),
  passwordConfirm: z.string().min(8),
});

type FormFields = z.infer<typeof schema>;

export default function SignUp() {
  const { setUserDetails } = useContext(UserDetailContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Sign Up';
  }, []);

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
      loading: CustomLoading('Signing up...'),
      success: () => {
        navigate('/');
        return 'Signed up successfully';
      },
      error: 'An error occurred',
    }).unwrap().then(r => {
      setIsSubmitting(false);
      setUserDetails(r);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.Legend>Sign Up</Fieldset.Legend>
          <Fieldset.HelperText>Invest time and to read and improve </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field.Root invalid={!!errors.name}>
            <Field.Label>Name</Field.Label>
            <Input {...register('name')} />
            <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input {...register('email')} />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.username}>
            <Field.Label>Username</Field.Label>
            <Input {...register('username')} />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <PasswordInput {...register('password')} />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            <PasswordStrengthMeter width="xs" value={passwordStrengthMeter(watch('password'))} />
          </Field.Root>

          <Field.Root invalid={!!errors.passwordConfirm}>
            <Field.Label>Confirm your password</Field.Label>
            <PasswordInput {...register('passwordConfirm')} />
            <Field.ErrorText>{errors.passwordConfirm?.message}</Field.ErrorText>
          </Field.Root>
        </Fieldset.Content>

        <Button type="submit" alignSelf="flex-start" disabled={isSubmitting}>
          {isSubmitting ? 'Signing up...' : 'Sign Up'}
        </Button>
      </Fieldset.Root>
    </form>
  );
}
