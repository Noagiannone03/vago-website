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
  NumberInput,
  Switch,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconSettings, IconDeviceFloppy } from '@tabler/icons-react';
import { collection, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { AppSettings } from '../types';

export function Settings() {
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string>('');

  const form = useForm({
    initialValues: {
      maintenanceMode: false,
      maintenanceDuration: 30,
      maintenanceMessage: 'Maintenance en cours. Nous revenons bientôt !',
      welcomeMessage: 'Bienvenue sur Vago !',
      minAppVersion: '1.0.0',
      maxTripsPerDay: 10,
      rewardMultiplier: 1,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'appSettings'));

      if (!querySnapshot.empty) {
        const settingsDoc = querySnapshot.docs[0];
        const settingsData = settingsDoc.data() as AppSettings;
        setSettingsId(settingsDoc.id);

        form.setValues({
          maintenanceMode: settingsData.maintenanceMode || false,
          maintenanceDuration: settingsData.maintenanceDuration || 30,
          maintenanceMessage: settingsData.maintenanceMessage || 'Maintenance en cours. Nous revenons bientôt !',
          welcomeMessage: settingsData.welcomeMessage || 'Bienvenue sur Vago !',
          minAppVersion: settingsData.minAppVersion || '1.0.0',
          maxTripsPerDay: settingsData.maxTripsPerDay || 10,
          rewardMultiplier: settingsData.rewardMultiplier || 1,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de charger les paramètres',
        color: 'red',
      });
    } finally {
      
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setSaving(true);

      const settingsData = {
        maintenanceMode: values.maintenanceMode,
        maintenanceDuration: values.maintenanceDuration,
        maintenanceMessage: values.maintenanceMessage,
        welcomeMessage: values.welcomeMessage,
        minAppVersion: values.minAppVersion,
        maxTripsPerDay: values.maxTripsPerDay,
        rewardMultiplier: values.rewardMultiplier,
        updatedAt: Timestamp.now(),
      };

      const docRef = settingsId
        ? doc(db, 'appSettings', settingsId)
        : doc(collection(db, 'appSettings'));

      await setDoc(docRef, settingsData, { merge: true });

      notifications.show({
        title: 'Succès',
        message: 'Paramètres sauvegardés avec succès',
        color: 'green',
      });

      if (!settingsId) {
        setSettingsId(docRef.id);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de sauvegarder les paramètres',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Paramètres de l'Application</Title>
          <Text c="dimmed" size="sm" mt={4}>
            Configurez les paramètres globaux de votre application
          </Text>
        </div>
      </Group>

      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            <Paper p="md" withBorder style={{ background: form.values.maintenanceMode ? '#fff3cd' : undefined }}>
              <Stack gap="md">
                <Group justify="space-between">
                  <div>
                    <Text fw={500} size="lg" mb={4}>
                      Mode Maintenance
                    </Text>
                    <Text size="sm" c="dimmed">
                      Activer ce mode empêchera les utilisateurs d'accéder à l'application
                    </Text>
                  </div>
                  <Switch
                    size="lg"
                    onLabel="ON"
                    offLabel="OFF"
                    {...form.getInputProps('maintenanceMode', { type: 'checkbox' })}
                  />
                </Group>

                {form.values.maintenanceMode && (
                  <Stack gap="md" mt="md">
                    <NumberInput
                      label="Durée de la maintenance (en minutes)"
                      description="Durée estimée de la maintenance"
                      placeholder="30"
                      min={1}
                      max={1440}
                      {...form.getInputProps('maintenanceDuration')}
                    />

                    <Textarea
                      label="Message de maintenance"
                      description="Message affiché aux utilisateurs pendant la maintenance"
                      placeholder="Maintenance en cours. Nous revenons bientôt !"
                      minRows={2}
                      {...form.getInputProps('maintenanceMessage')}
                    />
                  </Stack>
                )}
              </Stack>
            </Paper>

            <Textarea
              label="Message de bienvenue"
              description="Message affiché aux utilisateurs lors de leur première connexion"
              placeholder="Bienvenue sur Vago !"
              minRows={3}
              {...form.getInputProps('welcomeMessage')}
            />

            <TextInput
              label="Version minimale de l'application"
              description="Les utilisateurs avec une version antérieure devront mettre à jour"
              placeholder="1.0.0"
              {...form.getInputProps('minAppVersion')}
            />

            <NumberInput
              label="Nombre maximum de trajets par jour"
              description="Limite le nombre de trajets qu'un utilisateur peut effectuer quotidiennement"
              placeholder="10"
              min={1}
              max={100}
              {...form.getInputProps('maxTripsPerDay')}
            />

            <NumberInput
              label="Multiplicateur de récompenses"
              description="Multiplie toutes les récompenses par ce facteur (événements spéciaux)"
              placeholder="1"
              min={0.1}
              max={10}
              step={0.1}
              decimalScale={1}
              {...form.getInputProps('rewardMultiplier')}
            />

            <Group justify="flex-end" mt="xl">
              <Button
                type="submit"
                loading={saving}
                leftSection={<IconDeviceFloppy size={16} />}
                gradient={{ from: '#667eea', to: '#764ba2' }}
                variant="gradient"
                size="lg"
              >
                Sauvegarder les paramètres
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <Paper shadow="sm" p="md" radius="md" withBorder>
        <Stack gap="xs">
          <Group>
            <IconSettings size={20} />
            <Text fw={500}>Informations système</Text>
          </Group>
          <Text size="sm" c="dimmed">
            Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
          </Text>
          <Text size="sm" c="dimmed">
            Version du panel admin: 2.0.0
          </Text>
          <Text size="sm" c="green" fw={500}>
            Système opérationnel
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
}
