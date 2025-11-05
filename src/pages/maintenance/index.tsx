import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { IMaintenanceMode } from '../../types';

export const Maintenance: React.FC = () => {
  const [maintenance, setMaintenance] = useState<IMaintenanceMode>({
    isEnabled: false,
    duration: 60,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const docRef = doc(db, 'app_status', 'maintenance');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMaintenance(docSnap.data() as IMaintenanceMode);
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const docRef = doc(db, 'app_status', 'maintenance');
      await setDoc(docRef, maintenance, { merge: true });

      setMessage({
        type: 'success',
        text: 'Paramètres de maintenance enregistrés avec succès',
      });
    } catch (error) {
      console.error('Error saving maintenance settings:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de l\'enregistrement des paramètres',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Typography>Chargement...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        Mode Maintenance
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Gérez le mode maintenance de l'application
      </Typography>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {message && (
            <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={maintenance.isEnabled}
                  onChange={(e) =>
                    setMaintenance({ ...maintenance, isEnabled: e.target.checked })
                  }
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="h6">
                    Mode maintenance {maintenance.isEnabled ? 'activé' : 'désactivé'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {maintenance.isEnabled
                      ? "L'application est actuellement en mode maintenance"
                      : "L'application fonctionne normalement"}
                  </Typography>
                </Box>
              }
            />
          </Box>

          <TextField
            label="Durée (minutes)"
            type="number"
            fullWidth
            value={maintenance.duration}
            onChange={(e) =>
              setMaintenance({ ...maintenance, duration: parseInt(e.target.value) || 0 })
            }
            sx={{ mb: 3 }}
            helperText="Durée estimée de la maintenance en minutes"
          />

          <TextField
            label="Message personnalisé (optionnel)"
            fullWidth
            multiline
            rows={3}
            value={maintenance.message || ''}
            onChange={(e) => setMaintenance({ ...maintenance, message: e.target.value })}
            sx={{ mb: 3 }}
            helperText="Message affiché aux utilisateurs pendant la maintenance"
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleSave}
            disabled={saving}
            sx={{ mt: 2 }}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
