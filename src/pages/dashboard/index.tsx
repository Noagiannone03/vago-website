import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Paper } from '@mui/material';
import {
  DirectionsBike,
  CardGiftcard,
  Inventory,
  PendingActions,
} from '@mui/icons-material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { IDashboardStats } from '../../types';

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card
    sx={{
      background: `linear-gradient(135deg, ${color}ee 0%, ${color} 100%)`,
      color: 'white',
      height: '100%',
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.9, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h3" fontWeight={700}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ fontSize: 48, opacity: 0.8 }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<IDashboardStats>({
    totalTrips: 0,
    totalItems: 0,
    totalRewards: 0,
    pendingClaims: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tripsSnap, itemsSnap, rewardsSnap, claimsSnap] = await Promise.all([
          getDocs(collection(db, 'trips')),
          getDocs(collection(db, 'items')),
          getDocs(collection(db, 'rewards')),
          getDocs(query(collection(db, 'reward_claims'), where('status', '==', 'pending'))),
        ]);

        setStats({
          totalTrips: tripsSnap.size,
          totalItems: itemsSnap.size,
          totalRewards: rewardsSnap.size,
          pendingClaims: claimsSnap.size,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Chargement des statistiques...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Vue d'ensemble de votre application Vago
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Trajets"
            value={stats.totalTrips}
            icon={<DirectionsBike />}
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Articles"
            value={stats.totalItems}
            icon={<Inventory />}
            color="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Récompenses"
            value={stats.totalRewards}
            icon={<CardGiftcard />}
            color="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Réclamations en attente"
            value={stats.pendingClaims}
            icon={<PendingActions />}
            color="#f44336"
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Bienvenue sur le panneau d'administration Vago
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Ce panneau vous permet de gérer tous les aspects de votre application :
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Trajets :</strong> Créez et gérez les parcours vélo, course et marche avec événements intégrés
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Articles :</strong> Gérez le catalogue d'articles disponibles dans l'application
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Récompenses :</strong> Créez et suivez les récompenses que les utilisateurs peuvent débloquer
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Réclamations :</strong> Traitez les demandes de récompenses des utilisateurs
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Maintenance :</strong> Activez le mode maintenance si nécessaire
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
