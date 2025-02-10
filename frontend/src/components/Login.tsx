import { Button, Field, Fieldset, Input, Stack, Tabs } from '@chakra-ui/react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PasswordInput, PasswordStrengthMeter } from '@/components/ui/password-input.tsx';

function Login() {
  useEffect(() => {
    document.title = 'Login';
  }, []);

  return (
    <Tabs.Root lazyMount unmountOnExit defaultValue="login">
      <Tabs.List>
        <Tabs.Trigger value="login">Login</Tabs.Trigger>
        <Tabs.Trigger value="signup">Sign Up</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="login">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Fieldset.Root size="lg" maxW="md">
            <Stack>
              <Fieldset.Legend>Login</Fieldset.Legend>
              <Fieldset.HelperText>Welcome back! Just a few more steps for a better experience</Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
              <Field.Root>
                <Field.Label>Username</Field.Label>
                <Input />
              </Field.Root>

              <Field.Root>
                <Field.Label>Password</Field.Label>
                <PasswordInput />
              </Field.Root>
            </Fieldset.Content>

            <Button type="submit" alignSelf="flex-start">
              Login
            </Button>
          </Fieldset.Root>
        </motion.div>
      </Tabs.Content>
      <Tabs.Content value="signup">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Fieldset.Root size="lg" maxW="md">
            <Stack>
              <Fieldset.Legend>Sign Up</Fieldset.Legend>
              <Fieldset.HelperText>Invest time and to read and improve </Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input />
              </Field.Root>

              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input type="email" />
              </Field.Root>

              <Field.Root>
                <Field.Label>Username</Field.Label>
                <Input />
              </Field.Root>

              <Field.Root>
                <Field.Label>Password</Field.Label>
                <PasswordInput />
                <PasswordStrengthMeter width="xs" value={1} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Reenter password</Field.Label>
                <PasswordInput />
              </Field.Root>
            </Fieldset.Content>

            <Button type="submit" alignSelf="flex-start">
              Sign Up
            </Button>
          </Fieldset.Root>
        </motion.div>
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default Login;
