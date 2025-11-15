import { useEffect, useState } from 'react';
import {
  Stack,
  Title,
  Text,
  Paper,
  Button,
  Group,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Grid,
  Badge,
  Card,
  ActionIcon,
  Modal,
  FileInput,
  Divider,

} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconRoute,
  IconEdit,
  IconTrash,
  IconUpload,
  IconX,
  IconCalendar,
} from '@tabler/icons-react';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { Trip, TripEvent } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [events, setEvents] = useState<TripEvent[]>([]);

  const form = useForm({
    initialValues: {
      title: '',
      type: 'food',
      from: '',
      fromLatitude: 0,
      fromLongitude: 0,
      to: '',
      toLatitude: 0,
      toLongitude: 0,
      distance: 0,
      duration: 0,
      reward: 0,
      difficulty: 'easy',
      description: '',
    },
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'trips'));
      const tripsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Trip[];
      setTrips(tripsData);
    } catch (error) {
      console.error('Error loading trips:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de charger les trajets',
        color: 'red',
      });
    } finally {
      
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      let imageUrl = editingTrip?.imageUrl || '';

      if (imageFile) {
        const storageRef = ref(storage, `trips/${uuidv4()}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const tripData = {
        title: values.title,
        type: values.type,
        from: values.from,
        fromCoordinates: { latitude: values.fromLatitude, longitude: values.fromLongitude },
        to: values.to,
        toCoordinates: { latitude: values.toLatitude, longitude: values.toLongitude },
        distance: values.distance,
        duration: values.duration,
        reward: values.reward,
        difficulty: values.difficulty,
        description: values.description,
        imageUrl,
        events,
        updatedAt: Timestamp.now(),
      };

      if (editingTrip) {
        await updateDoc(doc(db, 'trips', editingTrip.id), tripData);
        notifications.show({
          title: 'Succès',
          message: 'Trajet modifié avec succès',
          color: 'green',
        });
      } else {
        await addDoc(collection(db, 'trips'), {
          ...tripData,
          createdAt: Timestamp.now(),
        });
        notifications.show({
          title: 'Succès',
          message: 'Trajet ajouté avec succès',
          color: 'green',
        });
      }

      form.reset();
      setEvents([]);
      setImageFile(null);
      setEditingTrip(null);
      setModalOpened(false);
      loadTrips();
    } catch (error) {
      console.error('Error saving trip:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de sauvegarder le trajet',
        color: 'red',
      });
    }
  };

  const handleDelete = async (tripId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) return;

    try {
      await deleteDoc(doc(db, 'trips', tripId));
      notifications.show({
        title: 'Succès',
        message: 'Trajet supprimé avec succès',
        color: 'green',
      });
      loadTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de supprimer le trajet',
        color: 'red',
      });
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    form.setValues({
      title: trip.title,
      type: trip.type,
      from: trip.from,
      fromLatitude: trip.fromCoordinates.latitude,
      fromLongitude: trip.fromCoordinates.longitude,
      to: trip.to,
      toLatitude: trip.toCoordinates.latitude,
      toLongitude: trip.toCoordinates.longitude,
      distance: trip.distance,
      duration: trip.duration,
      reward: trip.reward,
      difficulty: trip.difficulty,
      description: trip.description,
    });
    setEvents(trip.events || []);
    setImageFile(null); // Reset image file when editing
    setModalOpened(true);
  };

  const addEvent = () => {
    setEvents([
      ...events,
      {
        eventId: uuidv4(),
        title: '',
        category: 'general',
        type: 'fixed',
        timing: 0,
      },
    ]);
  };

  const updateEvent = (index: number, field: keyof TripEvent, value: string | number) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setEvents(newEvents);
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const difficultyColors = {
    easy: 'green',
    medium: 'orange',
    hard: 'red',
  };

  const typeColors = {
    food: 'blue',
    package: 'orange',
    document: 'grape',
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Gestion des Trajets</Title>
          <Text c="dimmed" size="sm" mt={4}>
            Créez et gérez les trajets disponibles dans l'application
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => {
            setEditingTrip(null);
            form.reset();
            setEvents([]);
            setImageFile(null);
            setModalOpened(true);
          }}
          gradient={{ from: '#667eea', to: '#764ba2' }}
          variant="gradient"
        >
          Nouveau trajet
        </Button>
      </Group>

      <Grid>
        {trips.map((trip) => (
          <Grid.Col key={trip.id} span={{ base: 12, md: 6, lg: 4 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              {trip.imageUrl && (
                <Card.Section>
                  <img
                    src={trip.imageUrl}
                    alt={trip.title}
                    style={{ height: 160, objectFit: 'cover' }}
                  />
                </Card.Section>
              )}

              <Stack gap="xs" mt="md">
                <Group justify="space-between">
                  <Text fw={700} size="lg">
                    {trip.title}
                  </Text>
                  <Group gap={5}>
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => handleEdit(trip)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => handleDelete(trip.id)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>

                <Group gap={5}>
                  <Badge color={typeColors[trip.type]} variant="light">
                    {trip.type}
                  </Badge>
                  <Badge color={difficultyColors[trip.difficulty]} variant="light">
                    {trip.difficulty}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed" lineClamp={2}>
                  {trip.description}
                </Text>

                <Divider />

                <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    De: {trip.from}
                  </Text>
                  <IconRoute size={14} />
                  <Text size="xs" c="dimmed">
                    À: {trip.to}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text size="sm">
                    <strong>{trip.distance} km</strong>
                  </Text>
                  <Text size="sm">
                    <strong>{trip.duration} min</strong>
                  </Text>
                  <Text size="sm" c="green" fw={700}>
                    {trip.reward} miles
                  </Text>
                </Group>

                {trip.events && trip.events.length > 0 && (
                  <Badge leftSection={<IconCalendar size={12} />} variant="outline">
                    {trip.events.length} événement(s)
                  </Badge>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editingTrip ? 'Modifier le trajet' : 'Nouveau trajet'}
        size="xl"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Titre du trajet"
              placeholder="Ex: Livraison de repas à Paris"
              required
              {...form.getInputProps('title')}
            />

            <Select
              label="Type de trajet"
              data={[
                { value: 'food', label: 'Repas' },
                { value: 'package', label: 'Colis' },
                { value: 'document', label: 'Document' },
              ]}
              required
              {...form.getInputProps('type')}
            />

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Point de départ"
                  placeholder="Ex: Paris"
                  required
                  {...form.getInputProps('from')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="Latitude"
                  placeholder="48.8566"
                  required
                  decimalScale={6}
                  {...form.getInputProps('fromLatitude')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="Longitude"
                  placeholder="2.3522"
                  required
                  decimalScale={6}
                  {...form.getInputProps('fromLongitude')}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Point d'arrivée"
                  placeholder="Ex: Marseille"
                  required
                  {...form.getInputProps('to')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="Latitude"
                  placeholder="43.2965"
                  required
                  decimalScale={6}
                  {...form.getInputProps('toLatitude')}
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <NumberInput
                  label="Longitude"
                  placeholder="5.3698"
                  required
                  decimalScale={6}
                  {...form.getInputProps('toLongitude')}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={4}>
                <NumberInput
                  label="Distance (km)"
                  placeholder="100"
                  required
                  min={0}
                  decimalScale={1}
                  {...form.getInputProps('distance')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Durée (minutes)"
                  placeholder="60"
                  required
                  min={0}
                  {...form.getInputProps('duration')}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <NumberInput
                  label="Récompense (miles)"
                  placeholder="200"
                  required
                  min={0}
                  {...form.getInputProps('reward')}
                />
              </Grid.Col>
            </Grid>

            <Select
              label="Difficulté"
              data={[
                { value: 'easy', label: 'Facile' },
                { value: 'medium', label: 'Moyen' },
                { value: 'hard', label: 'Difficile' },
              ]}
              required
              {...form.getInputProps('difficulty')}
            />

            <Textarea
              label="Description"
              placeholder="Décrivez le trajet..."
              required
              minRows={3}
              {...form.getInputProps('description')}
            />

            <FileInput
              label="Image du trajet"
              placeholder="Sélectionner une image"
              leftSection={<IconUpload size={14} />}
              accept="image/*"
              value={imageFile}
              onChange={setImageFile}
            />

            <Divider label="Événements du trajet" />

            <Stack gap="md">
              {events.map((event, index) => (
                <Paper key={event.eventId} p="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text fw={500}>Événement {index + 1}</Text>
                    <ActionIcon color="red" onClick={() => removeEvent(index)}>
                      <IconX size={16} />
                    </ActionIcon>
                  </Group>
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Titre"
                        placeholder="Ex: Péage, Radar"
                        value={event.title}
                        onChange={(e) => updateEvent(index, 'title', e.target.value)}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="Catégorie"
                        placeholder="Sélectionner une catégorie"
                        value={event.category}
                        onChange={(value) => updateEvent(index, 'category', value || 'general')}
                        data={[
                          { value: 'general', label: 'Général' },
                          { value: 'bouchon', label: 'Bouchon' },
                          { value: 'pluie', label: 'Pluie' },
                          { value: 'route-barree', label: 'Route barrée' },
                          { value: 'colis-mystere', label: 'Colis mystère' },
                          { value: 'pause-fatigue', label: 'Pause fatigue' },
                          { value: 'pneu-creve', label: 'Pneu crevé' },
                          { value: 'controle-police', label: 'Contrôle de police' },
                          { value: 'feu-rouge', label: 'Feu rouge' },
                          { value: 'radar', label: 'Radar' },
                          { value: 'panneaux', label: 'Panneaux routiers' },
                          { value: 'peage', label: 'Péage automatique' },
                          { value: 'radio', label: 'Radio' },
                        ]}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="Type"
                        placeholder="Type d'événement"
                        value={event.type}
                        onChange={(value) => updateEvent(index, 'type', value || 'fixed')}
                        data={[
                          { value: 'fixed', label: 'Fixe' },
                          { value: 'random', label: 'Aléatoire' },
                        ]}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <NumberInput
                        label="Timing (minutes)"
                        placeholder="Ex: 10"
                        value={event.timing}
                        onChange={(value) => updateEvent(index, 'timing', typeof value === 'number' ? value : 0)}
                        min={0}
                      />
                    </Grid.Col>
                  </Grid>
                </Paper>
              ))}

              <Button variant="light" onClick={addEvent} leftSection={<IconPlus size={16} />}>
                Ajouter un événement
              </Button>
            </Stack>

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setModalOpened(false)}>
                Annuler
              </Button>
              <Button type="submit" gradient={{ from: '#667eea', to: '#764ba2' }} variant="gradient">
                {editingTrip ? 'Modifier' : 'Ajouter'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
