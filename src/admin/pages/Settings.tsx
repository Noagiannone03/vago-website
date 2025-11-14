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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconSettings, IconDeviceFloppy } from '@tabler/icons-react';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { AppSettings, MaintenanceStatus } from '../../types';

export function Settings() {
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string>('');
  const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceStatus>({
    isActive: false,
    estimatedDuration: '',
  });
  const [loadingMaintenance, setLoadingMaintenance] = useState(false);

  const form = useForm({
    initialValues: {
      welcomeMessage: 'Bienvenue sur Vago !',
      minAppVersion: '1.0.0',
      maxTripsPerDay: 10,
      rewardMultiplier: 1,
    },
  });

  const maintenanceForm = useForm({
    initialValues: {
      estimatedDuration: '',
    },
  });

  useEffect(() => {
    loadSettings();
    loadMaintenanceStatus();
  }, []);

  const loadSettings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'appSettings'));

      if (!querySnapshot.empty) {
        const settingsDoc = querySnapshot.docs[0];
        const settingsData = settingsDoc.data() as AppSettings;
        setSettingsId(settingsDoc.id);

        form.setValues({
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
    }
  };

  const loadMaintenanceStatus = async () => {
    try {
      const maintenanceDoc = await getDoc(doc(db, 'app_status', 'maintenance'));
      if (maintenanceDoc.exists()) {
        const data = maintenanceDoc.data() as MaintenanceStatus;
        setMaintenanceStatus(data);
        maintenanceForm.setValues({
          estimatedDuration: data.estimatedDuration || '',
        });
      }
    } catch (error) {
      console.error('Error loading maintenance status:', error);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setSaving(true);

      const settingsData = {
        welcomeMessage: values.welcomeMessage,
        minAppVersion: values.minAppVersion,
        maxTripsPerDay: values.maxTripsPerDay,
        rewardMultiplier: values.rewardMultiplier,
        updatedAt: new Date(),
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

  const setMaintenance = async (isActive: boolean) => {
    try {
      setLoadingMaintenance(true);

      const maintenanceData: MaintenanceStatus = {
        isActive,
        estimatedDuration: maintenanceForm.values.estimatedDuration,
      };

      await setDoc(doc(db, 'app_status', 'maintenance'), maintenanceData);

      setMaintenanceStatus(maintenanceData);

      notifications.show({
        title: 'Succès',
        message: isActive ? 'Maintenance activée' : 'Maintenance désactivée',
        color: isActive ? 'orange' : 'green',
      });
    } catch (error) {
      console.error('Error setting maintenance:', error);
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de modifier la maintenance',
        color: 'red',
      });
    } finally {
      setLoadingMaintenance(false);
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

      {/* Section Maintenance */}
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <Stack gap="lg">
          <div>
            <Text fw={500} size="lg" mb={4}>
              Mode Maintenance
            </Text>
            <Text size="sm" c="dimmed">
              Activer ce mode empêchera les utilisateurs d'accéder à l'application
            </Text>
          </div>

          <Paper
            p="md"
            withBorder
            style={{
              background: maintenanceStatus.isActive ? '#f8d7da' : '#d4edda',
              borderColor: maintenanceStatus.isActive ? '#f5c6cb' : '#c3e6cb',
            }}
          >
            <Text
              fw={700}
              size="lg"
              c={maintenanceStatus.isActive ? '#721c24' : '#155724'}
            >
              {maintenanceStatus.isActive
                ? `MAINTENANCE ACTIVE - Durée: ${maintenanceStatus.estimatedDuration || 'Non définie'}`
                : 'MAINTENANCE INACTIVE'}
            </Text>
          </Paper>

          <TextInput
            label="Durée estimée de la maintenance"
            description="Ce texte sera affiché aux utilisateurs sur l'écran de maintenance"
            placeholder="Ex: 2 heures, 30 minutes..."
            {...maintenanceForm.getInputProps('estimatedDuration')}
          />

          <Group grow>
            <Button
              color="red"
              onClick={() => setMaintenance(true)}
              loading={loadingMaintenance}
              disabled={maintenanceStatus.isActive}
            >
              Activer la Maintenance
            </Button>
            <Button
              color="green"
              onClick={() => setMaintenance(false)}
              loading={loadingMaintenance}
              disabled={!maintenanceStatus.isActive}
            >
              Désactiver la Maintenance
            </Button>
          </Group>
        </Stack>
      </Paper>

      {/* Section Paramètres Généraux */}
      <Paper shadow="sm" p="xl" radius="md" withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
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
