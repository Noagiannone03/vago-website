import { Box, Typography, Card, CardContent } from '@mui/material';

export const Maintenance = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>Mode Maintenance</Typography>
      <Card>
        <CardContent>
          <Typography>Page de gestion du mode maintenance - En développement</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
