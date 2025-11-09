// @ts-nocheck
import { Box, Typography, Grid, Card, CardContent, Paper, Chip } from '@mui/material';
import {
  DirectionsBike,
  Inventory,
  CardGiftcard,
  Assignment,
  TrendingUp,
} from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { StatCard } from '../../components/common/StatCard';
import { useFirebaseStats, useRecentActivity } from '../../hooks/useFirebaseStats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard = () => {
  const theme = useTheme();
  const stats = useFirebaseStats();
  const { activities, loading: activitiesLoading } = useRecentActivity(5);

  const chartData = [
    { name: 'Lun', trajets: 12 },
    { name: 'Mar', trajets: 19 },
    { name: 'Mer', trajets: 15 },
    { name: 'Jeu', trajets: 25 },
    { name: 'Ven', trajets: 22 },
    { name: 'Sam', trajets: 30 },
    { name: 'Dim', trajets: 28 },
  ];

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Dashboard</Typography>
        <Typography variant="body1" color="text.secondary">Vue d'ensemble de votre application Vago</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Trajets" value={stats.totalTrips} icon={<DirectionsBike />} color={theme.palette.primary.main} loading={stats.loading} trend={{ value: 12.5, isPositive: true }} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Articles" value={stats.totalItems} icon={<Inventory />} color={theme.palette.info.main} loading={stats.loading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Récompenses" value={stats.totalRewards} icon={<CardGiftcard />} color={theme.palette.success.main} loading={stats.loading} trend={{ value: 8.2, isPositive: true }} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Réclamations en attente" value={stats.pendingClaims} icon={<Assignment />} color={theme.palette.warning.main} loading={stats.loading} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>Activité de la semaine</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip contentStyle={{ backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="trajets" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ fill: theme.palette.primary.main, r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Activité récente</Typography>
              {activitiesLoading ? (
                <Typography color="text.secondary">Chargement...</Typography>
              ) : activities.length === 0 ? (
                <Typography color="text.secondary">Aucune activité récente</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {activities.map((activity) => (
                    <Paper key={activity.id} elevation={0} sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600}>Réclamation</Typography>
                        {activity.status && <Chip label={activity.status} size="small" color={getStatusColor(activity.status)} />}
                      </Box>
                      <Typography variant="caption" color="text.secondary">{formatDate(activity.createdAt)}</Typography>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
