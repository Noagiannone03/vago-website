import React, { useState } from 'react';
import { Create } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ITrip, IEvent } from '../../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

export const TripCreate: React.FC = () => {
  const {
    saveButtonProps,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ITrip>();

  const [events, setEvents] = useState<IEvent[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const addEvent = () => {
    setEvents([
      ...events,
      {
        title: '',
        description: '',
        type: 'info',
      },
    ]);
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const updateEvent = (index: number, field: keyof IEvent, value: any) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setEvents(newEvents);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (data: any) => {
    let imageUrl = '';

    if (imageFile) {
      setUploading(true);
      try {
        const storageRef = ref(storage, `trips/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setUploading(false);
      }
    }

    // Parse coordinates
    const fromCoords = data.fromCoordinatesStr?.split(',').map((c: string) => parseFloat(c.trim()));
    const toCoords = data.toCoordinatesStr?.split(',').map((c: string) => parseFloat(c.trim()));

    const tripData = {
      ...data,
      fromCoordinates: fromCoords ? { lat: fromCoords[0], lng: fromCoords[1] } : null,
      toCoordinates: toCoords ? { lat: toCoords[0], lng: toCoords[1] } : null,
      distance: parseFloat(data.distance),
      duration: parseInt(data.duration),
      points: parseInt(data.points),
      tripImageUrl: imageUrl,
      events: events,
    };

    return tripData;
  };

  return (
    <Create
      saveButtonProps={{
        ...saveButtonProps,
        onClick: async () => {
          const formData = watch();
          const tripData = await handleSubmit(formData);
          setValue('tripImageUrl', tripData.tripImageUrl);
          setValue('fromCoordinates', tripData.fromCoordinates);
          setValue('toCoordinates', tripData.toCoordinates);
          setValue('events', tripData.events);
          saveButtonProps.onClick?.({} as any);
        },
        disabled: uploading,
      }}
    >
      <Box component="form" sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              {...register('title', { required: 'Le titre est requis' })}
              label="Titre du trajet"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.type}>
              <InputLabel>Type de trajet</InputLabel>
              <Select
                {...register('type', { required: 'Le type est requis' })}
                label="Type de trajet"
                defaultValue="vélo"
              >
                <MenuItem value="vélo">Vélo</MenuItem>
                <MenuItem value="course">Course</MenuItem>
                <MenuItem value="marche">Marche</MenuItem>
              </Select>
              {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              {...register('from', { required: 'Le point de départ est requis' })}
              label="Point de départ"
              fullWidth
              error={!!errors.from}
              helperText={errors.from?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              {...register('to', { required: "Le point d'arrivée est requis" })}
              label="Point d'arrivée"
              fullWidth
              error={!!errors.to}
              helperText={errors.to?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              {...register('fromCoordinatesStr')}
              label="Coordonnées départ (lat, lng)"
              fullWidth
              placeholder="48.8566, 2.3522"
              helperText="Format: latitude, longitude"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              {...register('toCoordinatesStr')}
              label="Coordonnées arrivée (lat, lng)"
              fullWidth
              placeholder="48.8566, 2.3522"
              helperText="Format: latitude, longitude"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              {...register('distance', { required: 'La distance est requise' })}
              label="Distance (km)"
              type="number"
              fullWidth
              error={!!errors.distance}
              helperText={errors.distance?.message}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              {...register('duration', { required: 'La durée est requise' })}
              label="Durée (minutes)"
              type="number"
              fullWidth
              error={!!errors.duration}
              helperText={errors.duration?.message}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              {...register('points', { required: 'Les points sont requis' })}
              label="Points gagnés"
              type="number"
              fullWidth
              error={!!errors.points}
              helperText={errors.points?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Difficulté</InputLabel>
              <Select
                {...register('difficulty', { required: 'La difficulté est requise' })}
                label="Difficulté"
                defaultValue="moyen"
              >
                <MenuItem value="facile">Facile</MenuItem>
                <MenuItem value="moyen">Moyen</MenuItem>
                <MenuItem value="difficile">Difficile</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Button variant="outlined" component="label" fullWidth sx={{ height: '56px' }}>
              Choisir une image
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {imageFile && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                {imageFile.name}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              {...register('description', { required: 'La description est requise' })}
              label="Description"
              multiline
              rows={4}
              fullWidth
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>

          {/* Events Section */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Événements sur le trajet</Typography>
                  <Button startIcon={<AddIcon />} onClick={addEvent} variant="contained">
                    Ajouter un événement
                  </Button>
                </Box>

                {events.map((event, index) => (
                  <Card key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.default' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Titre de l'événement"
                          fullWidth
                          value={event.title}
                          onChange={(e) => updateEvent(index, 'title', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <FormControl fullWidth>
                          <InputLabel>Type</InputLabel>
                          <Select
                            value={event.type}
                            onChange={(e) => updateEvent(index, 'type', e.target.value)}
                            label="Type"
                          >
                            <MenuItem value="bon-plan">Bon Plan</MenuItem>
                            <MenuItem value="alerte">Alerte</MenuItem>
                            <MenuItem value="info">Info</MenuItem>
                            <MenuItem value="bonus">Bonus</MenuItem>
                            <MenuItem value="promo">Promo</MenuItem>
                            <MenuItem value="autre">Autre</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={1}>
                        <IconButton color="error" onClick={() => removeEvent(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Description"
                          fullWidth
                          multiline
                          rows={2}
                          value={event.description}
                          onChange={(e) => updateEvent(index, 'description', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Lien (optionnel)"
                          fullWidth
                          value={event.link || ''}
                          onChange={(e) => updateEvent(index, 'link', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Create>
  );
};
