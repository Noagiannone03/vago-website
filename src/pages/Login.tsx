import { useState } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
  Center,
  Box,
  rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCar, IconAlertCircle } from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalide'),
      password: (value) => (value.length >= 6 ? null : 'Mot de passe trop court'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setLoading(true);
      setError('');
      await signIn(values.email, values.password);
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: rem(20),
      }}
    >
      <Container size={420}>
        <Paper radius="lg" p="xl" withBorder shadow="xl">
          <Center mb="lg">
            <IconCar size={60} color="#667eea" />
          </Center>

          <Title order={2} ta="center" mb="xs">
            Vago Admin
          </Title>

          <Text c="dimmed" size="sm" ta="center" mb="xl">
            Connectez-vous pour accéder au panel d'administration
          </Text>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Erreur" color="red" mb="md">
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                required
                label="Email"
                placeholder="votre@email.com"
                {...form.getInputProps('email')}
              />

              <PasswordInput
                required
                label="Mot de passe"
                placeholder="Votre mot de passe"
                {...form.getInputProps('password')}
              />

              <Button
                fullWidth
                type="submit"
                loading={loading}
                gradient={{ from: '#667eea', to: '#764ba2' }}
                variant="gradient"
              >
                Se connecter
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
