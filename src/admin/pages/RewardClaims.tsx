import { useEffect, useState } from 'react';
import {
  Stack,
  Title,
  Text,
  Paper,
  Button,
  Group,
  Badge,
  Grid,
  Modal,
  TextInput,
  Textarea,
  ScrollArea,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconClock,
  IconCheck,
  IconX,
  IconPackage,
  IconTruck,
  IconEye,
} from '@tabler/icons-react';
import { collection, getDocs, updateDoc, doc, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { RewardClaim } from '../../types';
import './RewardClaims.css';

type ClaimStatus = 'pending' | 'approved' | 'in_preparation' | 'shipped' | 'delivered' | 'rejected';

const WORKFLOW_COLUMNS = [
  { id: 'pending', title: 'Nouvelles demandes', color: '#fbbf24', icon: IconClock },
  { id: 'approved', title: 'Approuvées', color: '#3b82f6', icon: IconCheck },
  { id: 'in_preparation', title: 'En préparation', color: '#8b5cf6', icon: IconPackage },
  { id: 'shipped', title: 'Expédiées', color: '#10b981', icon: IconTruck },
];

export function RewardClaims() {
  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<RewardClaim | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [collectionName, setCollectionName] = useState('reward-claims');

  useEffect(() => {
    const possibleCollections = ['reward-claims', 'rewardClaims', 'reward_claims'];
    let unsubscribe: (() => void) | null = null;

    const setupListener = async () => {
      for (const collName of possibleCollections) {
        try {
          // Test si la collection existe
          const testSnapshot = await getDocs(collection(db, collName));
          if (!testSnapshot.empty || collName === possibleCollections[0]) {
            setCollectionName(collName);

            // Listener temps réel
            unsubscribe = onSnapshot(
              collection(db, collName),
              (snapshot) => {
                const claimsData = snapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                  createdAt: doc.data().createdAt?.toDate(),
                  updatedAt: doc.data().updatedAt?.toDate(),
                })) as RewardClaim[];

                setClaims(claimsData);
              },
              (error) => {
                console.error('Erreur listener:', error);
                notifications.show({
                  title: 'Erreur',
                  message: 'Impossible de charger les demandes',
                  color: 'red',
                });
              }
            );
            break;
          }
        } catch (err) {
          console.log(`Collection '${collName}' non trouvée`);
        }
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const updateClaimStatus = async (claimId: string, newStatus: ClaimStatus, tracking?: string, notes?: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        updatedAt: Timestamp.now(),
      };

      if (tracking) updateData.trackingNumber = tracking;
      if (notes) updateData.adminNotes = notes;

      await updateDoc(doc(db, collectionName, claimId), updateData);

      notifications.show({
        title: 'Succès',
        message: 'Statut mis à jour',
        color: 'green',
      });

      setModalOpened(false);
      setSelectedClaim(null);
      setTrackingNumber('');
      setAdminNotes('');
    } catch (error) {
      console.error('Erreur:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de mettre à jour',
        color: 'red',
      });
    }
  };

  const openClaimModal = (claim: RewardClaim) => {
    setSelectedClaim(claim);
    setTrackingNumber(claim.trackingNumber || '');
    setAdminNotes(claim.adminNotes || '');
    setModalOpened(true);
  };

  const getClaimsByStatus = (status: ClaimStatus) => {
    return claims.filter((c) => c.status === status);
  };

  const ClaimCard = ({ claim }: { claim: RewardClaim }) => {
    return (
      <Paper className="claim-card" p="md" withBorder>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={700} size="sm">{claim.rewardTitle}</Text>
            <Tooltip label="Voir détails">
              <ActionIcon
                variant="light"
                size="sm"
                onClick={() => openClaimModal(claim)}
              >
                <IconEye size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>

          <Text size="xs" c="dimmed">
            {claim.userPseudo} • {claim.pointsCost} pts
          </Text>

          {claim.personalInfo && (
            <Text size="xs" c="dimmed">
              {claim.personalInfo.ville} ({claim.personalInfo.codePostal})
            </Text>
          )}

          {claim.trackingNumber && (
            <Badge variant="light" size="xs">
              📦 {claim.trackingNumber}
            </Badge>
          )}

          <Group gap={4} mt="xs">
            {claim.status === 'pending' && (
              <>
                <Button
                  size="xs"
                  variant="light"
                  color="green"
                  fullWidth
                  onClick={() => updateClaimStatus(claim.id, 'approved')}
                >
                  ✓ Approuver
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  color="red"
                  fullWidth
                  onClick={() => {
                    const reason = prompt('Raison du rejet:');
                    if (reason) updateClaimStatus(claim.id, 'rejected', undefined, reason);
                  }}
                >
                  ✗ Rejeter
                </Button>
              </>
            )}

            {claim.status === 'approved' && (
              <Button
                size="xs"
                variant="light"
                fullWidth
                onClick={() => updateClaimStatus(claim.id, 'in_preparation')}
              >
                📦 Préparer
              </Button>
            )}

            {claim.status === 'in_preparation' && (
              <Button
                size="xs"
                variant="light"
                fullWidth
                onClick={() => openClaimModal(claim)}
              >
                🚚 Expédier
              </Button>
            )}

            {claim.status === 'shipped' && (
              <Button
                size="xs"
                variant="light"
                color="green"
                fullWidth
                onClick={() => updateClaimStatus(claim.id, 'delivered')}
              >
                ✓ Livré
              </Button>
            )}
          </Group>

          <Text size="xs" c="dimmed">
            {claim.createdAt?.toLocaleDateString('fr-FR')}
          </Text>
        </Stack>
      </Paper>
    );
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Gestion des envois</Title>
          <Text c="dimmed" size="sm" mt={4}>
            Workflow de traitement des récompenses
          </Text>
        </div>
        <Badge size="lg" variant="dot" color="green">
          Temps réel
        </Badge>
      </Group>

      <ScrollArea>
        <div className="kanban-board">
          {WORKFLOW_COLUMNS.map((column) => {
            const Icon = column.icon;
            const columnClaims = getClaimsByStatus(column.id as ClaimStatus);

            return (
              <div key={column.id} className="kanban-column">
                <div className="column-header" style={{ borderColor: column.color }}>
                  <Icon size={20} color={column.color} />
                  <Text fw={700} size="sm">{column.title}</Text>
                  <Badge size="sm" variant="filled" style={{ background: column.color }}>
                    {columnClaims.length}
                  </Badge>
                </div>

                <ScrollArea h={600} offsetScrollbars>
                  <Stack gap="sm" p="sm">
                    {columnClaims.length === 0 ? (
                      <Text size="sm" c="dimmed" ta="center" py="xl">
                        Aucune demande
                      </Text>
                    ) : (
                      columnClaims.map((claim) => (
                        <ClaimCard key={claim.id} claim={claim} />
                      ))
                    )}
                  </Stack>
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Section rejetées et livrées */}
      <Grid mt="xl">
        <Grid.Col span={6}>
          <Paper p="md" withBorder>
            <Group mb="md">
              <IconX size={20} color="red" />
              <Text fw={700}>Rejetées</Text>
              <Badge color="red">{getClaimsByStatus('rejected').length}</Badge>
            </Group>
            <Stack gap="xs">
              {getClaimsByStatus('rejected').slice(0, 5).map((claim) => (
                <Paper key={claim.id} p="xs" withBorder onClick={() => openClaimModal(claim)} style={{ cursor: 'pointer' }}>
                  <Text size="sm">{claim.rewardTitle}</Text>
                  <Text size="xs" c="dimmed">{claim.userPseudo}</Text>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={6}>
          <Paper p="md" withBorder>
            <Group mb="md">
              <IconCheck size={20} color="green" />
              <Text fw={700}>Livrées</Text>
              <Badge color="green">{getClaimsByStatus('delivered').length}</Badge>
            </Group>
            <Stack gap="xs">
              {getClaimsByStatus('delivered').slice(0, 5).map((claim) => (
                <Paper key={claim.id} p="xs" withBorder onClick={() => openClaimModal(claim)} style={{ cursor: 'pointer' }}>
                  <Text size="sm">{claim.rewardTitle}</Text>
                  <Text size="xs" c="dimmed">{claim.userPseudo}</Text>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Modal détails */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Détails de la demande"
        size="lg"
      >
        {selectedClaim && (
          <Stack gap="md">
            <Paper p="md" withBorder>
              <Stack gap="xs">
                <Text fw={700} size="lg">{selectedClaim.rewardTitle}</Text>
                <Text size="sm" c="dimmed">{selectedClaim.rewardSubtitle}</Text>
                <Badge>{selectedClaim.status}</Badge>
              </Stack>
            </Paper>

            <Paper p="md" withBorder>
              <Text fw={700} mb="xs">Utilisateur</Text>
              <Text size="sm">{selectedClaim.userPseudo}</Text>
              <Text size="xs" c="dimmed">{selectedClaim.userEmail}</Text>
              <Text size="xs" c="dimmed">Coût: {selectedClaim.pointsCost} points</Text>
            </Paper>

            {selectedClaim.personalInfo && (
              <Paper p="md" withBorder>
                <Text fw={700} mb="xs">Adresse de livraison</Text>
                <Text size="sm">
                  {selectedClaim.personalInfo.prenom} {selectedClaim.personalInfo.nom}
                </Text>
                <Text size="sm">{selectedClaim.personalInfo.adresse}</Text>
                {selectedClaim.personalInfo.batiment && (
                  <Text size="sm">{selectedClaim.personalInfo.batiment}</Text>
                )}
                <Text size="sm">
                  {selectedClaim.personalInfo.codePostal} {selectedClaim.personalInfo.ville}
                </Text>
                <Text size="sm">Tél: {selectedClaim.personalInfo.telephone}</Text>
              </Paper>
            )}

            {selectedClaim.status === 'in_preparation' && (
              <>
                <TextInput
                  label="Numéro de suivi"
                  placeholder="Ex: FR123456789"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
                <Textarea
                  label="Notes (optionnel)"
                  placeholder="Informations complémentaires..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  minRows={2}
                />
                <Button
                  fullWidth
                  onClick={() => updateClaimStatus(selectedClaim.id, 'shipped', trackingNumber, adminNotes)}
                  disabled={!trackingNumber.trim()}
                >
                  Marquer comme expédiée
                </Button>
              </>
            )}

            {selectedClaim.adminNotes && (
              <Paper p="md" withBorder bg="gray.0">
                <Text fw={700} size="sm" mb="xs">Notes admin</Text>
                <Text size="sm">{selectedClaim.adminNotes}</Text>
              </Paper>
            )}
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
