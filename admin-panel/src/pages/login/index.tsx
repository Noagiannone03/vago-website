import { useLogin } from '@refinedev/core';
import { Box, Container, Card, CardContent, TextField, Button, Typography, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from 'react';

export const Login = () => {
  const { mutate: login } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)', borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                <LockOutlinedIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography component="h1" variant="h4" fontWeight={700} sx={{ mt: 2 }}>Vago Admin Panel</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Connectez-vous pour accéder au panneau d administration</Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField margin="normal" required fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
              <TextField margin="normal" required fullWidth label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 3 }} />
              <Button type="submit" fullWidth variant="contained" size="large" sx={{ py: 1.5 }}>Se connecter</Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
