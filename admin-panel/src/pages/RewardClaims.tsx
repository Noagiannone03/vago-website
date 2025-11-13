import { useEffect, useState } from 'react';
import {
  Stack,
  Title,
  Text,
  Paper,
  Button,
  Group,
  Badge,
  Card,
  Grid,
  Select,

  Modal,
  Divider,
  SimpleGrid,
  ThemeIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconHandGrab,
  IconClock,
  IconCheck,
  IconX,
  IconPackage,
  IconTruck,
  IconHome,
  IconFilter,
} from '@tabler/icons-react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { RewardClaim } from '../types';

const statusConfig = {
  pending: {
    label: 'En attente',
    color: 'yellow',
    icon: IconClock,
  },
  approved: {
    label: 'Approuvée',
    color: 'blue',
    icon: IconCheck,
  },
  rejected: {
    label: 'Rejetée',
    color: 'red',
    icon: IconX,
  },
  in_preparation: {
    label: 'En préparation',
    color: 'cyan',
    icon: IconPackage,
  },
  shipped: {
    label: 'Expédiée',
    color: 'grape',
    icon: IconTruck,
  },
  delivered: {
    label: 'Livrée',
    color: 'green',
    icon: IconHome,
  },
};

export function RewardClaims() {
  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<RewardClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<RewardClaim | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    in_preparation: 0,
    shipped: 0,
    delivered: 0,
  });

  useEffect(() => {
    loadClaims();
  }, []);

  useEffect(() => {
    filterClaims();
  }, [claims, statusFilter]);

  const loadClaims = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rewardClaims'));
      const claimsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as RewardClaim[];

      setClaims(claimsData);

      // Calculate stats
      const newStats = {
        pending: claimsData.filter((c) => c.status === 'pending').length,
        approved: claimsData.filter((c) => c.status === 'approved').length,
        rejected: claimsData.filter((c) => c.status === 'rejected').length,
        in_preparation: claimsData.filter((c) => c.status === 'in_preparation').length,
        shipped: claimsData.filter((c) => c.status === 'shipped').length,
        delivered: claimsData.filter((c) => c.status === 'delivered').length,
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error loading claims:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de charger les demandes',
        color: 'red',
      });
    } finally {
      
    }
  };

  const filterClaims = () => {
    if (statusFilter === 'all') {
      setFilteredClaims(claims);
    } else {
      setFilteredClaims(claims.filter((claim) => claim.status === statusFilter));
    }
  };

  const updateClaimStatus = async (
    claimId: string,
    newStatus: RewardClaim['status'],
    trackingNumber?: string
  ) => {
    try {
      const updateData: any = {
        status: newStatus,
        updatedAt: new Date(),
      };

      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }

      await updateDoc(doc(db, 'rewardClaims', claimId), updateData);

      notifications.show({
        title: 'Succès',
        message: 'Statut mis à jour avec succès',
        color: 'green',
      });

      loadClaims();
      setModalOpened(false);
    } catch (error) {
      console.error('Error updating claim:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de mettre à jour le statut',
        color: 'red',
      });
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Demandes de Récompenses</Title>
          <Text c="dimmed" size="sm" mt={4}>
            Gérez les demandes de récompenses des utilisateurs
          </Text>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} spacing="md">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <Paper
              key={status}
              p="md"
              withBorder
              style={{ cursor: 'pointer' }}
              onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
              bg={statusFilter === status ? 'gray.0' : undefined}
            >
              <Stack gap="xs" align="center">
                <ThemeIcon size="lg" variant="light" color={config.color}>
                  <Icon size={20} />
                </ThemeIcon>
                <Text fw={700} size="xl">
                  {stats[status as keyof typeof stats]}
                </Text>
                <Text size="xs" c="dimmed" ta="center">
                  {config.label}
                </Text>
              </Stack>
            </Paper>
          );
        })}
      </SimpleGrid>

      <Group>
        <Select
          leftSection={<IconFilter size={16} />}
          placeholder="Filtrer par statut"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value || 'all')}
          data={[
            { value: 'all', label: 'Tous' },
            ...Object.entries(statusConfig).map(([value, config]) => ({
              value,
              label: config.label,
            })),
          ]}
          clearable
        />
        <Text size="sm" c="dimmed">
          {filteredClaims.length} demande(s)
        </Text>
      </Group>

      {filteredClaims.length === 0 ? (
        <Paper p="xl" withBorder>
          <Stack align="center" gap="md">
            <IconHandGrab size={48} color="gray" />
            <Text c="dimmed">Aucune demande à afficher</Text>
          </Stack>
        </Paper>
      ) : (
        <Stack gap="md">
          {filteredClaims.map((claim) => {
            const StatusIcon = statusConfig[claim.status].icon;
            return (
              <Card
                key={claim.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedClaim(claim);
                  setModalOpened(true);
                }}
              >
                <Grid>
                  <Grid.Col span={{ base: 12, md: 8 }}>
                    <Stack gap="xs">
                      <Group>
                        <Text fw={700} size="lg">
                          {claim.rewardTitle}
                        </Text>
                        <Badge
                          color={statusConfig[claim.status].color}
                          variant="light"
                          leftSection={<StatusIcon size={12} />}
                        >
                          {statusConfig[claim.status].label}
                        </Badge>
                      </Group>

                      <Grid>
                        <Grid.Col span={6}>
                          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                            Utilisateur
                          </Text>
                          <Text size="sm">{claim.userName || 'N/A'}</Text>
                          <Text size="xs" c="dimmed">
                            {claim.userEmail}
                          </Text>
                        </Grid.Col>

                        {claim.shippingAddress && (
                          <Grid.Col span={6}>
                            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                              Adresse de livraison
                            </Text>
                            <Text size="sm">{claim.shippingAddress.street}</Text>
                            <Text size="xs" c="dimmed">
                              {claim.shippingAddress.zipCode} {claim.shippingAddress.city}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {claim.shippingAddress.country}
                            </Text>
                          </Grid.Col>
                        )}

                        {claim.trackingNumber && (
                          <Grid.Col span={6}>
                            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                              Numéro de suivi
                            </Text>
                            <Text size="sm" fw={500}>
                              {claim.trackingNumber}
                            </Text>
                          </Grid.Col>
                        )}
                      </Grid>
                    </Stack>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Stack gap="xs">
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                        Date de demande
                      </Text>
                      <Text size="sm">
                        {claim.createdAt?.toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>

                      {claim.updatedAt && claim.updatedAt !== claim.createdAt && (
                        <>
                          <Text size="xs" c="dimmed" tt="uppercase" fw={700} mt="xs">
                            Dernière mise à jour
                          </Text>
                          <Text size="sm">
                            {claim.updatedAt?.toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </>
                      )}
                    </Stack>
                  </Grid.Col>
                </Grid>

                {claim.notes && (
                  <>
                    <Divider mt="md" mb="xs" />
                    <Paper p="xs" withBorder>
                      <Text size="xs" fw={700} mb={4}>
                        Notes:
                      </Text>
                      <Text size="sm" c="dimmed">
                        {claim.notes}
                      </Text>
                    </Paper>
                  </>
                )}
              </Card>
            );
          })}
        </Stack>
      )}

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Gérer la demande"
        size="lg"
      >
        {selectedClaim && (
          <Stack gap="md">
            <Paper p="md" withBorder>
              <Stack gap="xs">
                <Text fw={700} size="lg">
                  {selectedClaim.rewardTitle}
                </Text>
                <Group>
                  <Text size="sm" c="dimmed">
                    Statut actuel:
                  </Text>
                  <Badge color={statusConfig[selectedClaim.status].color}>
                    {statusConfig[selectedClaim.status].label}
                  </Badge>
                </Group>
              </Stack>
            </Paper>

            <Divider label="Changer le statut" />

            <Group grow>
              <Button
                variant="light"
                color="blue"
                onClick={() => updateClaimStatus(selectedClaim.id, 'approved')}
                disabled={selectedClaim.status === 'approved'}
              >
                Approuver
              </Button>
              <Button
                variant="light"
                color="red"
                onClick={() => updateClaimStatus(selectedClaim.id, 'rejected')}
                disabled={selectedClaim.status === 'rejected'}
              >
                Rejeter
              </Button>
            </Group>

            <Group grow>
              <Button
                variant="light"
                color="cyan"
                onClick={() => updateClaimStatus(selectedClaim.id, 'in_preparation')}
                disabled={selectedClaim.status === 'in_preparation'}
              >
                En préparation
              </Button>
              <Button
                variant="light"
                color="grape"
                onClick={() => {
                  const tracking = prompt('Numéro de suivi:');
                  if (tracking) {
                    updateClaimStatus(selectedClaim.id, 'shipped', tracking);
                  }
                }}
                disabled={selectedClaim.status === 'shipped'}
              >
                Expédier
              </Button>
            </Group>

            <Button
              variant="light"
              color="green"
              fullWidth
              onClick={() => updateClaimStatus(selectedClaim.id, 'delivered')}
              disabled={selectedClaim.status === 'delivered'}
            >
              Marquer comme livrée
            </Button>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
