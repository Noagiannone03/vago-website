import { useShow } from '@refinedev/core';
import { Show } from '@refinedev/mui';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  Avatar,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Email,
  Phone,
  CalendarToday,
  Stars,
  ShoppingBag,
  AttachMoney,
  Person,
} from '@mui/icons-material';
import { IUser } from '../../types';

export const UserShow = () => {
  const { queryResult } = useShow<IUser>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const getRoleColor = (role: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      user: 'default',
      moderator: 'info',
      admin: 'error',
    };
    return colors[role] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      active: 'success',
      inactive: 'warning',
      suspended: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <Show isLoading={isLoading}>
      <Grid container spacing={3}>
        {/* User Profile */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={3} alignItems="center">
                <Avatar
                  src={record?.photoURL}
                  sx={{
                    width: 120,
                    height: 120,
                    border: 4,
                    borderColor: 'primary.main',
                  }}
                >
                  {record?.displayName?.charAt(0).toUpperCase() || record?.email?.charAt(0).toUpperCase()}
                </Avatar>
                <Box textAlign="center" sx={{ width: '100%' }}>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {record?.displayName || 'Utilisateur sans nom'}
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                    <Chip
                      label={record?.role}
                      color={getRoleColor(record?.role || '')}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                    <Chip
                      label={record?.status}
                      color={getStatusColor(record?.status || '')}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Stack>
                </Box>

                <Divider sx={{ width: '100%' }} />

                {/* Contact Info */}
                <Stack spacing={2} sx={{ width: '100%' }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Email color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body2">{record?.email}</Typography>
                    </Box>
                  </Stack>
                  {record?.phoneNumber && (
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Phone color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Téléphone
                        </Typography>
                        <Typography variant="body2">{record.phoneNumber}</Typography>
                      </Box>
                    </Stack>
                  )}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CalendarToday color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Membre depuis
                      </Typography>
                      <Typography variant="body2">
                        {new Date(record?.createdAt || '').toLocaleDateString('fr-FR')}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* User Stats & Activity */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Stats Cards */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #667eea15 0%, #667eea05 100%)',
                    border: '1px solid',
                    borderColor: 'primary.light',
                  }}
                >
                  <Stars sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {record?.points || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Points
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #4caf5015 0%, #4caf5005 100%)',
                    border: '1px solid',
                    borderColor: 'success.light',
                  }}
                >
                  <ShoppingBag sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {record?.totalOrders || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Commandes
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #ff980015 0%, #ff980005 100%)',
                    border: '1px solid',
                    borderColor: 'warning.light',
                  }}
                >
                  <AttachMoney sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {(record?.totalSpent || 0).toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 0,
                    })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total dépensé
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Additional Info */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Informations du compte
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      UID Firebase
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {record?.uid || record?.id}
                    </Typography>
                  </Box>
                  {record?.lastLoginAt && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Dernière connexion
                      </Typography>
                      <Typography variant="body2">
                        {new Date(record.lastLoginAt).toLocaleString('fr-FR')}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Activity Level */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Niveau d'activité
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progression
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {Math.min(((record?.totalOrders || 0) / 10) * 100, 100).toFixed(0)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(((record?.totalOrders || 0) / 10) * 100, 100)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {record?.totalOrders || 0} / 10 commandes pour atteindre le niveau suivant
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Show>
  );
};
