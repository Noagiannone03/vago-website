import { useEffect, useState } from 'react';
import {
  Stack,
  Title,
  Text,
  Paper,
  Button,
  Group,
  Grid,
  Card,
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Image,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconGift, IconPlus, IconEdit, IconTrash, IconSparkles } from '@tabler/icons-react';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Reward } from '../types';

export function Rewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      subtitle: '',
      description: '',
      cost: 0,
      imageUrl: '',
    },
  });

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rewards'));
      const rewardsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Reward[];

      // Trier par coût croissant (du moins cher au plus cher)
      const sortedRewards = rewardsData.sort((a, b) => a.cost - b.cost);
      setRewards(sortedRewards);
    } catch (error) {
      console.error('Error loading rewards:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de charger les récompenses',
        color: 'red',
      });
    } finally {
      
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const rewardData = {
        title: values.title,
        subtitle: values.subtitle,
        description: values.description,
        cost: values.cost,
        imageUrl: values.imageUrl || '',
        available: true,
      };

      if (editingReward) {
        await updateDoc(doc(db, 'rewards', editingReward.id), rewardData);
        notifications.show({
          title: 'Succès',
          message: 'Récompense modifiée avec succès',
          color: 'green',
        });
      } else {
        await addDoc(collection(db, 'rewards'), {
          ...rewardData,
          createdAt: Timestamp.now(),
        });
        notifications.show({
          title: 'Succès',
          message: 'Récompense ajoutée avec succès',
          color: 'green',
        });
      }

      form.reset();
      setEditingReward(null);
      setModalOpened(false);
      loadRewards();
    } catch (error) {
      console.error('Error saving reward:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de sauvegarder la récompense',
        color: 'red',
      });
    }
  };

  const handleDelete = async (rewardId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette récompense ?')) return;

    try {
      await deleteDoc(doc(db, 'rewards', rewardId));
      notifications.show({
        title: 'Succès',
        message: 'Récompense supprimée avec succès',
        color: 'green',
      });
      loadRewards();
    } catch (error) {
      console.error('Error deleting reward:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de supprimer la récompense',
        color: 'red',
      });
    }
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    form.setValues({
      title: reward.title,
      subtitle: reward.subtitle,
      description: reward.description,
      cost: reward.cost,
      imageUrl: reward.imageUrl || '',
    });
    setModalOpened(true);
  };

  const initializeDefaultRewards = async () => {
    try {
      const defaultRewards = [
        {
          title: 'RÉCOMPENSE BRONZE',
          subtitle: 'Débloquez cette récompense exclusive',
          description:
            'Un magnifique trophée bronze pour célébrer vos premiers succès dans Vago. Parfait pour commencer votre collection !',
          cost: 200,
          imageUrl: 'https://images.unsplash.com/photo-1624023430689-9017b0f2d579?w=400',
          available: true,
          createdAt: Timestamp.now(),
        },
        {
          title: 'RÉCOMPENSE ARGENT',
          subtitle: 'Une récompense prestigieuse',
          description:
            'Trophée en argent symbolisant votre détermination et vos efforts constants. Un symbole de progression remarquable.',
          cost: 500,
          imageUrl: 'https://images.unsplash.com/photo-1611329532992-99e896dc6a1e?w=400',
          available: true,
          createdAt: Timestamp.now(),
        },
        {
          title: 'RÉCOMPENSE OR',
          subtitle: 'L\'excellence incarnée',
          description:
            'Le trophée ultime en or massif. Réservé aux meilleurs voyageurs de Vago. Un chef-d\'œuvre à exposer fièrement.',
          cost: 1000,
          imageUrl: 'https://images.unsplash.com/photo-1579541929006-e4c67c8d1d13?w=400',
          available: true,
          createdAt: Timestamp.now(),
        },
        {
          title: 'BON CADEAU 50€',
          subtitle: 'Shopping à volonté',
          description:
            'Un bon d\'achat de 50€ valable dans de nombreuses enseignes partenaires. Faites-vous plaisir !',
          cost: 750,
          imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400',
          available: true,
          createdAt: Timestamp.now(),
        },
        {
          title: 'CASQUE BLUETOOTH',
          subtitle: 'Son de qualité supérieure',
          description:
            'Casque bluetooth haut de gamme avec réduction de bruit active. Profitez de vos trajets avec style.',
          cost: 1200,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
          available: true,
          createdAt: Timestamp.now(),
        },
        {
          title: 'WEEKEND PARIS',
          subtitle: 'Escapade romantique',
          description:
            'Un weekend tout compris pour 2 personnes à Paris. Hôtel 4 étoiles inclus. Vivez la ville lumière !',
          cost: 2500,
          imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
          available: true,
          createdAt: Timestamp.now(),
        },
      ];

      for (const reward of defaultRewards) {
        await addDoc(collection(db, 'rewards'), reward);
      }

      notifications.show({
        title: 'Succès',
        message: `${defaultRewards.length} récompenses initialisées avec succès`,
        color: 'green',
      });

      loadRewards();
    } catch (error) {
      console.error('Error initializing rewards:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible d\'initialiser les récompenses',
        color: 'red',
      });
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Gestion des Récompenses</Title>
          <Text c="dimmed" size="sm" mt={4}>
            Configurez les récompenses disponibles pour les joueurs
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconSparkles size={16} />}
            onClick={initializeDefaultRewards}
            variant="light"
          >
            Initialiser récompenses
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setEditingReward(null);
              form.reset();
              setModalOpened(true);
            }}
            gradient={{ from: '#56ab2f', to: '#a8e063' }}
            variant="gradient"
          >
            Nouvelle récompense
          </Button>
        </Group>
      </Group>

      {rewards.length === 0 ? (
        <Paper p="xl" withBorder>
          <Stack align="center" gap="md">
            <IconGift size={48} color="gray" />
            <Text c="dimmed">Aucune récompense disponible</Text>
            <Button onClick={initializeDefaultRewards} variant="light">
              Initialiser les récompenses par défaut
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Stack gap="md">
          <Paper p="md" withBorder style={{ background: 'linear-gradient(135deg, #56ab2f 20%, #a8e063 100%)' }}>
            <Group justify="space-between" align="center">
              <div>
                <Text c="white" fw={700} size="lg">
                  📊 Catalogue des récompenses
                </Text>
                <Text c="white" size="sm" opacity={0.9}>
                  Triées du moins coûteux au plus coûteux en points
                </Text>
              </div>
              <Text c="white" fw={700} size="xl">
                {rewards.length} récompenses
              </Text>
            </Group>
          </Paper>

          <Grid>
          {rewards.map((reward, index) => (
            <Grid.Col key={reward.id} span={{ base: 12, md: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder style={{ position: 'relative' }}>
                <Box
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    background: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                >
                  <Text c="white" fw={700} size="lg">
                    #{index + 1}
                  </Text>
                </Box>

                {reward.imageUrl && (
                  <Card.Section>
                    <Image
                      src={reward.imageUrl}
                      alt={reward.title}
                      height={200}
                      fit="cover"
                    />
                  </Card.Section>
                )}

                <Stack gap="xs" mt="md">
                  <Group justify="space-between">
                    <Text fw={700} size="lg">
                      {reward.title}
                    </Text>
                    <Group gap={5}>
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleEdit(reward)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDelete(reward.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>

                  <Text size="sm" c="blue" fw={500}>
                    {reward.subtitle}
                  </Text>

                  <Text size="sm" c="dimmed" lineClamp={3}>
                    {reward.description}
                  </Text>

                  <Box
                    p="sm"
                    style={{
                      background: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
                      borderRadius: '8px',
                    }}
                  >
                    <Text ta="center" c="white" fw={700} size="lg">
                      {reward.cost} miles
                    </Text>
                  </Box>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
          </Grid>
        </Stack>
      )}

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editingReward ? 'Modifier la récompense' : 'Nouvelle récompense'}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Titre de la récompense"
              placeholder="Ex: RÉCOMPENSE BRONZE"
              required
              {...form.getInputProps('title')}
            />

            <TextInput
              label="Sous-titre"
              placeholder="Ex: Débloquez cette récompense exclusive"
              required
              {...form.getInputProps('subtitle')}
            />

            <Textarea
              label="Description"
              placeholder="Description détaillée de la récompense..."
              required
              minRows={4}
              {...form.getInputProps('description')}
            />

            <NumberInput
              label="Coût en points"
              placeholder="200"
              required
              min={1}
              {...form.getInputProps('cost')}
            />

            <TextInput
              label="URL de l'image (optionnel)"
              placeholder="https://..."
              {...form.getInputProps('imageUrl')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setModalOpened(false)}>
                Annuler
              </Button>
              <Button
                type="submit"
                gradient={{ from: '#56ab2f', to: '#a8e063' }}
                variant="gradient"
              >
                {editingReward ? 'Modifier' : 'Ajouter'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
