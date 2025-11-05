import { useShow } from '@refinedev/core';
import { Show } from '@refinedev/mui';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Payment,
  LocalShipping,
  LocationOn,
  CalendarToday,
} from '@mui/icons-material';
import { IOrder } from '../../types';

export const OrderShow = () => {
  const { queryResult } = useShow<IOrder>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
      pending: 'warning',
      processing: 'info',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'warning' | 'success' | 'error'> = {
      pending: 'warning',
      paid: 'success',
      failed: 'error',
      refunded: 'default',
    };
    return colors[status] || 'default';
  };

  return (
    <Show isLoading={isLoading}>
      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    Commande {record?.orderNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Créée le {new Date(record?.createdAt || '').toLocaleString('fr-FR')}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label={record?.status}
                    color={getStatusColor(record?.status || '')}
                    sx={{ textTransform: 'capitalize' }}
                  />
                  <Chip
                    label={record?.paymentStatus}
                    color={getPaymentStatusColor(record?.paymentStatus || '')}
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Stack>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Items Table */}
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
                Articles
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produit</TableCell>
                      <TableCell align="center">Quantité</TableCell>
                      <TableCell align="right">Prix unitaire</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {record?.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            {item.imageUrl && (
                              <Avatar
                                src={item.imageUrl}
                                variant="rounded"
                                sx={{ width: 50, height: 50 }}
                              />
                            )}
                            <Typography>{item.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {item.price.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600}>
                            {(item.price * item.quantity).toLocaleString('fr-FR', {
                              style: 'currency',
                              currency: 'EUR',
                            })}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Order Totals */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ width: 300 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Sous-total:</Typography>
                      <Typography>
                        {record?.subtotal?.toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </Typography>
                    </Stack>
                    {record?.tax && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography>Taxes:</Typography>
                        <Typography>
                          {record.tax.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </Typography>
                      </Stack>
                    )}
                    {record?.shipping && (
                      <Stack direction="row" justifyContent="space-between">
                        <Typography>Livraison:</Typography>
                        <Typography>
                          {record.shipping.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          })}
                        </Typography>
                      </Stack>
                    )}
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6" fontWeight={700}>
                        Total:
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        {record?.total?.toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Notes */}
          {record?.notes && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Notes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {record.notes}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Customer Info */}
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Person color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Client
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Typography variant="body2">{record?.userName || 'N/A'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {record?.userEmail}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <Payment color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Paiement
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Méthode:
                    </Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {record?.paymentMethod || 'N/A'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Statut:
                    </Typography>
                    <Chip
                      label={record?.paymentStatus}
                      color={getPaymentStatusColor(record?.paymentStatus || '')}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {record?.shippingAddress && (
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <LocalShipping color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Adresse de livraison
                    </Typography>
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography variant="body2">{record.shippingAddress.fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {record.shippingAddress.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {record.shippingAddress.city}, {record.shippingAddress.state}{' '}
                      {record.shippingAddress.zipCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {record.shippingAddress.country}
                    </Typography>
                    {record.shippingAddress.phone && (
                      <Typography variant="body2" color="text.secondary">
                        {record.shippingAddress.phone}
                      </Typography>
                    )}
                  </Stack>
                  {record.trackingNumber && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: 'primary.lighter', borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        N° de suivi
                      </Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                        {record.trackingNumber}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Show>
  );
};
