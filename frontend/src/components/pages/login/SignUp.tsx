import { Button, Field, Fieldset, Input, Stack } from '@chakra-ui/react';
import { PasswordInput, PasswordStrengthMeter } from '@/components/ui/password-input.tsx';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormFields = {
  name: string;
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function SignUp() {
  useEffect(() => {
    document.title = 'Sign Up';
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
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
            <Input {...register('name', { required: 'Name is required' })} />
            <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input
              {...register('email', {
                required: 'Email is required',
                validate: (value) => {
                  if (!value.includes('@')) {
                    return 'Not a valid email';
                  }
                  return true;
                },
              })}
            />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.username}>
            <Field.Label>Username</Field.Label>
            <Input {...register('username', { required: 'Username is required' })} />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <PasswordInput
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
            <PasswordStrengthMeter width="xs" value={1} />
          </Field.Root>

          <Field.Root invalid={!!errors.passwordConfirm}>
            <Field.Label>Confirm your password</Field.Label>
            <PasswordInput {...register('passwordConfirm', { required: 'Password confirmation is required' })} />
            <Field.ErrorText>{errors.passwordConfirm?.message}</Field.ErrorText>
          </Field.Root>
        </Fieldset.Content>

        <Button type="submit" alignSelf="flex-start">
          Sign Up
        </Button>
      </Fieldset.Root>
    </form>
  );
}
