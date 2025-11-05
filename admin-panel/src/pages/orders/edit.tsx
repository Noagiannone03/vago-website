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
} from '@mui/material';
import { IOrder } from '../../types';

export const OrderEdit = () => {
  const {
    saveButtonProps,
    refineCore: { queryResult },
    register,
    formState: { errors },
  } = useForm<IOrder>();

  const orderData = queryResult?.data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box component="form">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Informations de la commande
                </Typography>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <TextField
                    {...register('orderNumber')}
                    label="N° Commande"
                    disabled
                    fullWidth
                  />

                  <TextField
                    {...register('userEmail')}
                    label="Email du client"
                    disabled
                    fullWidth
                  />

                  <TextField
                    {...register('status', {
                      required: 'Le statut est requis',
                    })}
                    select
                    label="Statut de la commande"
                    error={!!errors.status}
                    helperText={errors.status?.message}
                    fullWidth
                  >
                    <MenuItem value="pending">En attente</MenuItem>
                    <MenuItem value="processing">En traitement</MenuItem>
                    <MenuItem value="shipped">Expédié</MenuItem>
                    <MenuItem value="delivered">Livré</MenuItem>
                    <MenuItem value="cancelled">Annulé</MenuItem>
                  </TextField>

                  <TextField
                    {...register('paymentStatus', {
                      required: 'Le statut de paiement est requis',
                    })}
                    select
                    label="Statut du paiement"
                    error={!!errors.paymentStatus}
                    helperText={errors.paymentStatus?.message}
                    fullWidth
                  >
                    <MenuItem value="pending">En attente</MenuItem>
                    <MenuItem value="paid">Payé</MenuItem>
                    <MenuItem value="failed">Échoué</MenuItem>
                    <MenuItem value="refunded">Remboursé</MenuItem>
                  </TextField>

                  <TextField
                    {...register('trackingNumber')}
                    label="N° de suivi"
                    fullWidth
                    placeholder="Ex: FR123456789"
                  />

                  <TextField
                    {...register('notes')}
                    label="Notes internes"
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Ajoutez des notes sur cette commande..."
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Résumé
                </Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="primary">
                      {orderData?.total?.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Articles
                    </Typography>
                    <Typography variant="body1">
                      {orderData?.items?.length || 0} article(s)
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Créée le
                    </Typography>
                    <Typography variant="body1">
                      {new Date(orderData?.createdAt || '').toLocaleDateString('fr-FR')}
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
