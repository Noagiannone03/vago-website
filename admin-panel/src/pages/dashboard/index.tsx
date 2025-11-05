import { Box, Typography, Card, CardContent } from '@mui/material';

export const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Dashboard Vago Admin</Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Bienvenue sur le panneau d administration Vago</Typography>
          <Typography color="text.secondary">
            Ce panneau professionnel vous permet de gérer tous les aspects de votre application : trajets, articles, récompenses et réclamations.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
