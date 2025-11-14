import { useEffect, useState } from 'react';
import {
  Stack,
  Title,
  Text,
  Paper,
  Button,
  Group,
  Grid,
  Badge,
  Card,
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconBox, IconTrash, IconSparkles, IconEdit, IconPlus } from '@tabler/icons-react';
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Item } from '../../types';

const rarityColors = {
  common: 'gray',
  rare: 'blue',
  epic: 'purple',
  legendary: 'orange',
};

export function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      type: '',
      rarity: 'common' as Item['rarity'],
      effect: '',
      value: 0,
    },
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const itemsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Item[];
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading items:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de charger les objets',
        color: 'red',
      });
    }
  };

  const initializeBaseItems = async () => {
    try {
      const baseItems = [
        {
          name: 'Boussole Magique',
          description: 'Une boussole enchantée qui vous guide toujours dans la bonne direction',
          type: 'navigation',
          rarity: 'rare',
          effect: 'Réduit le temps de trajet de 10%',
          value: 150,
          createdAt: Timestamp.now(),
        },
        {
          name: 'Sac de Voyage Léger',
          description: 'Un sac qui semble plus léger qu\'il ne devrait l\'être',
          type: 'equipment',
          rarity: 'common',
          effect: 'Augmente la capacité de transport de 20%',
          value: 50,
          createdAt: Timestamp.now(),
        },
        {
          name: 'Carte au Trésor',
          description: 'Une carte ancienne menant à des récompenses cachées',
          type: 'special',
          rarity: 'epic',
          effect: 'Révèle des trajets bonus secrets',
          value: 300,
          createdAt: Timestamp.now(),
        },
        {
          name: 'Amulette de Vitesse',
          description: 'Une amulette mystique qui accélère vos déplacements',
          type: 'boost',
          rarity: 'legendary',
          effect: 'Augmente les récompenses de 50%',
          value: 500,
          createdAt: Timestamp.now(),
        },
        {
          name: 'Gourde Inépuisable',
          description: 'Une gourde qui ne se vide jamais',
          type: 'consumable',
          rarity: 'common',
          effect: 'Restaure 20% d\'énergie',
          value: 30,
          createdAt: Timestamp.now(),
        },
        {
          name: 'Botte de Sept Lieues',
          description: 'Des bottes légendaires qui permettent de parcourir de grandes distances',
          type: 'equipment',
          rarity: 'legendary',
          effect: 'Double la distance parcourue',
          value: 1000,
          createdAt: Timestamp.now(),
        },
      ];

      for (const item of baseItems) {
        await addDoc(collection(db, 'items'), item);
      }

      notifications.show({
        title: 'Succès',
        message: `${baseItems.length} objets initialisés avec succès`,
        color: 'green',
      });

      loadItems();
    } catch (error) {
      console.error('Error initializing items:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible d\'initialiser les objets',
        color: 'red',
      });
    }
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    form.setValues({
      name: item.name,
      description: item.description,
      type: item.type,
      rarity: item.rarity,
      effect: item.effect || '',
      value: item.value || 0,
    });
    setModalOpened(true);
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const itemData = {
        name: values.name,
        description: values.description,
        type: values.type,
        rarity: values.rarity,
        effect: values.effect || '',
        value: values.value || 0,
      };

      if (editingItem) {
        await updateDoc(doc(db, 'items', editingItem.id), itemData);
        notifications.show({
          title: 'Succès',
          message: 'Objet modifié avec succès',
          color: 'green',
        });
      } else {
        await addDoc(collection(db, 'items'), {
          ...itemData,
          createdAt: Timestamp.now(),
        });
        notifications.show({
          title: 'Succès',
          message: 'Objet ajouté avec succès',
          color: 'green',
        });
      }

      form.reset();
      setEditingItem(null);
      setModalOpened(false);
      loadItems();
    } catch (error) {
      console.error('Error saving item:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de sauvegarder l\'objet',
        color: 'red',
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet objet ?')) return;

    try {
      await deleteDoc(doc(db, 'items', itemId));
      notifications.show({
        title: 'Succès',
        message: 'Objet supprimé avec succès',
        color: 'green',
      });
      loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de supprimer l\'objet',
        color: 'red',
      });
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Gestion des Objets</Title>
          <Text c="dimmed" size="sm" mt={4}>
            Gérez les objets disponibles dans le jeu
          </Text>
        </div>
        <Group>
          <Button
            leftSection={<IconSparkles size={16} />}
            onClick={initializeBaseItems}
            variant="light"
          >
            Initialiser objets
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setEditingItem(null);
              form.reset();
              setModalOpened(true);
            }}
            gradient={{ from: '#f2994a', to: '#f2c94c' }}
            variant="gradient"
          >
            Nouvel objet
          </Button>
        </Group>
      </Group>

      {items.length === 0 ? (
        <Paper p="xl" withBorder>
          <Stack align="center" gap="md">
            <IconBox size={48} color="gray" />
            <Text c="dimmed">Aucun objet disponible</Text>
            <Button onClick={initializeBaseItems} variant="light">
              Initialiser les objets de base
            </Button>
          </Stack>
        </Paper>
      ) : (
        <Grid>
          {items.map((item) => (
            <Grid.Col key={item.id} span={{ base: 12, md: 6, lg: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text fw={700} size="lg">
                      {item.name}
                    </Text>
                    <Group gap={5}>
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleEdit(item)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDelete(item.id)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>

                  <Group gap={5}>
                    <Badge color={rarityColors[item.rarity]} variant="light">
                      {item.rarity}
                    </Badge>
                    <Badge variant="outline">{item.type}</Badge>
                  </Group>

                  <Text size="sm" c="dimmed">
                    {item.description}
                  </Text>

                  {item.effect && (
                    <Paper p="xs" withBorder>
                      <Text size="xs" fw={500} c="blue">
                        Effet: {item.effect}
                      </Text>
                    </Paper>
                  )}

                  {item.value && (
                    <Group justify="space-between">
                      <Text size="sm" fw={500}>
                        Valeur:
                      </Text>
                      <Text size="sm" c="green" fw={700}>
                        {item.value} miles
                      </Text>
                    </Group>
                  )}
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editingItem ? 'Modifier l\'objet' : 'Nouvel objet'}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Nom de l'objet"
              placeholder="Ex: Boussole Magique"
              required
              {...form.getInputProps('name')}
            />

            <Textarea
              label="Description"
              placeholder="Description de l'objet..."
              required
              minRows={3}
              {...form.getInputProps('description')}
            />

            <TextInput
              label="Type"
              placeholder="Ex: navigation, equipment, special..."
              required
              {...form.getInputProps('type')}
            />

            <Select
              label="Rareté"
              placeholder="Choisissez la rareté"
              required
              data={[
                { value: 'common', label: 'Common (Commun)' },
                { value: 'rare', label: 'Rare' },
                { value: 'epic', label: 'Epic (Épique)' },
                { value: 'legendary', label: 'Legendary (Légendaire)' },
              ]}
              {...form.getInputProps('rarity')}
            />

            <TextInput
              label="Effet (optionnel)"
              placeholder="Ex: Réduit le temps de trajet de 10%"
              {...form.getInputProps('effect')}
            />

            <NumberInput
              label="Valeur en miles"
              placeholder="0"
              min={0}
              {...form.getInputProps('value')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setModalOpened(false)}>
                Annuler
              </Button>
              <Button
                type="submit"
                gradient={{ from: '#f2994a', to: '#f2c94c' }}
                variant="gradient"
              >
                {editingItem ? 'Modifier' : 'Ajouter'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
