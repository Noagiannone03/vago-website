import { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Text,
  Title,
  Group,
  Stack,
  RingProgress,
  SimpleGrid,
  Center,
  ThemeIcon,
} from '@mantine/core';
import {
  IconRoute,
  IconGift,
  IconBox,
  IconHandGrab,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { DashboardStats } from '../types';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  gradient?: { from: string; to: string };
}

function StatCard({ title, value, icon: Icon, color, gradient }: StatCardProps) {
  return (
    <Paper withBorder p="md" radius="md" shadow="sm">
      <Group justify="space-between">
        <Stack gap={0}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Text fw={700} size="xl" mt="xs">
            {value}
          </Text>
        </Stack>
        <ThemeIcon
          color={color}
          variant="light"
          size={60}
          radius="md"
          gradient={gradient}
        >
          <Icon size={30} stroke={1.5} />
        </ThemeIcon>
      </Group>
    </Paper>
  );
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    totalRewards: 0,
    totalItems: 0,
    pendingClaims: 0,
    totalUsers: 0,
    activeTrips: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [tripsSnap, rewardsSnap, itemsSnap, claimsSnap] = await Promise.all([
        getDocs(collection(db, 'trips')),
        getDocs(collection(db, 'rewards')),
        getDocs(collection(db, 'items')),
        getDocs(query(collection(db, 'rewardClaims'), where('status', '==', 'pending'))),
      ]);

      setStats({
        totalTrips: tripsSnap.size,
        totalRewards: rewardsSnap.size,
        totalItems: itemsSnap.size,
        pendingClaims: claimsSnap.size,
        totalUsers: 0,
        activeTrips: tripsSnap.size,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Tableau de bord</Title>
          <Text c="dimmed" size="sm" mt={4}>
            Vue d'ensemble de votre application Vago
          </Text>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        <StatCard
          title="Trajets totaux"
          value={stats.totalTrips}
          icon={IconRoute}
          color="blue"
          gradient={{ from: '#667eea', to: '#764ba2' }}
        />
        <StatCard
          title="Récompenses"
          value={stats.totalRewards}
          icon={IconGift}
          color="green"
          gradient={{ from: '#56ab2f', to: '#a8e063' }}
        />
        <StatCard
          title="Objets"
          value={stats.totalItems}
          icon={IconBox}
          color="orange"
          gradient={{ from: '#f2994a', to: '#f2c94c' }}
        />
        <StatCard
          title="Demandes en attente"
          value={stats.pendingClaims}
          icon={IconHandGrab}
          color="red"
          gradient={{ from: '#eb3349', to: '#f45c43' }}
        />
        <StatCard
          title="Trajets actifs"
          value={stats.activeTrips ?? 0}
          icon={IconTrendingUp}
          color="cyan"
          gradient={{ from: '#2193b0', to: '#6dd5ed' }}
        />
        <StatCard
          title="Utilisateurs"
          value={stats.totalUsers ?? 0}
          icon={IconUsers}
          color="grape"
          gradient={{ from: '#8e2de2', to: '#4a00e0' }}
        />
      </SimpleGrid>

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md" shadow="sm">
            <Title order={4} mb="md">
              Performance globale
            </Title>
            <Center>
              <RingProgress
                size={200}
                thickness={20}
                sections={[
                  { value: stats.totalTrips && stats.activeTrips ? (stats.activeTrips ?? 0) / stats.totalTrips * 100 : 0, color: 'blue' },
                  { value: stats.totalRewards ? (stats.totalRewards / 50) * 100 : 0, color: 'green' },
                  { value: stats.totalItems ? (stats.totalItems / 30) * 100 : 0, color: 'orange' },
                ]}
                label={
                  <Center>
                    <Stack gap={0} align="center">
                      <Text fw={700} size="xl">
                        {((stats.totalTrips + stats.totalRewards + stats.totalItems) / 3).toFixed(0)}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Score moyen
                      </Text>
                    </Stack>
                  </Center>
                }
              />
            </Center>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md" shadow="sm">
            <Title order={4} mb="md">
              Activité récente
            </Title>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm">Dernière synchronisation</Text>
                <Text size="sm" c="dimmed">
                  {new Date().toLocaleString('fr-FR')}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Statut du système</Text>
                <Text size="sm" c="green" fw={500}>
                  Opérationnel
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm">Base de données</Text>
                <Text size="sm" c="green" fw={500}>
                  Connectée
                </Text>
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
