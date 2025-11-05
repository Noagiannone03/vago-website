import { useLogin } from '@refinedev/core';
import { ThemedLayoutV2 } from '@refinedev/mui';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from 'react';

export const Login: React.FC = () => {
  const { mutate: login, isLoading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography component="h1" variant="h4" fontWeight={700} sx={{ mt: 2 }}>
                Vago Admin Panel
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Connectez-vous pour accéder au panneau d'administration
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {(error as any)?.message || 'Erreur de connexion'}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Adresse Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
