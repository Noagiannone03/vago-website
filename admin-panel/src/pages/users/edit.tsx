import { Edit } from '@refinedev/mui';
import { useForm } from '@refinedev/react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Stack,
  Avatar,
} from '@mui/material';
import { IUser } from '../../types';

export const UserEdit = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult },
    register,
    formState: { errors },
  } = useForm<IUser>();

  const userData = queryResult?.data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box component="form">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Informations de l'utilisateur
                </Typography>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <TextField
                    {...register('displayName')}
                    label="Nom d'affichage"
                    fullWidth
                  />

                  <TextField
                    {...register('email', {
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide',
                      },
                    })}
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                  />

                  <TextField
                    {...register('phoneNumber')}
                    label="Téléphone"
                    fullWidth
                  />

                  <TextField
                    {...register('role', {
                      required: 'Le rôle est requis',
                    })}
                    select
                    label="Rôle"
                    error={!!errors.role}
                    helperText={errors.role?.message}
                    fullWidth
                  >
                    <MenuItem value="user">Utilisateur</MenuItem>
                    <MenuItem value="moderator">Modérateur</MenuItem>
                    <MenuItem value="admin">Administrateur</MenuItem>
                  </TextField>

                  <TextField
                    {...register('status', {
                      required: 'Le statut est requis',
                    })}
                    select
                    label="Statut"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    fullWidth
                  >
                    <MenuItem value="active">Actif</MenuItem>
                    <MenuItem value="inactive">Inactif</MenuItem>
                    <MenuItem value="suspended">Suspendu</MenuItem>
                  </TextField>

                  <TextField
                    {...register('points')}
                    label="Points"
                    type="number"
                    fullWidth
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Profil
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }} alignItems="center">
                  <Avatar
                    src={userData?.photoURL}
                    sx={{
                      width: 100,
                      height: 100,
                      border: 3,
                      borderColor: 'primary.main',
                    }}
                  >
                    {userData?.displayName?.charAt(0).toUpperCase() || userData?.email?.charAt(0).toUpperCase()}
                  </Avatar>
                  <TextField
                    {...register('photoURL')}
                    label="URL de la photo"
                    fullWidth
                    placeholder="https://..."
                  />
                </Stack>

                <Stack spacing={2} sx={{ mt: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Commandes
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {userData?.totalOrders || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total dépensé
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="success.main">
                      {(userData?.totalSpent || 0).toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Edit>
  );
};
