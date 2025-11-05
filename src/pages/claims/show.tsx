import React from 'react';
import { useShow } from '@refinedev/core';
import { Show } from '@refinedev/mui';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Button,
  Paper,
} from '@mui/material';
import { IRewardClaim } from '../../types';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

export const ClaimShow: React.FC = () => {
  const { queryResult } = useShow<IRewardClaim>({
    resource: 'reward_claims',
  });

  const { data, isLoading } = queryResult;
  const record = data?.data;
  const navigate = useNavigate();

  const handleStatusChange = async (status: 'approved' | 'rejected' | 'completed') => {
    if (!record?.id) return;

    const claimRef = doc(db, 'reward_claims', record.id);
    await updateDoc(claimRef, {
      status,
      processedAt: Timestamp.now(),
      processedBy: auth.currentUser?.email || 'admin',
    });

    navigate('/claims');
  };

  if (isLoading) {
    return <Typography>Chargement...</Typography>;
  }

  if (!record) {
    return <Typography>Réclamation introuvable</Typography>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'info';
      case 'completed':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* Status and Actions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Statut de la réclamation
                  </Typography>
                  <Chip
                    label={record.status}
                    color={getStatusColor(record.status) as any}
                    size="large"
                  />
                </Box>
                {record.status === 'pending' && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleStatusChange('approved')}
                    >
                      Approuver
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleStatusChange('rejected')}
                    >
                      Rejeter
                    </Button>
                  </Box>
                )}
                {record.status === 'approved' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleStatusChange('completed')}
                  >
                    Marquer comme terminé
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* User Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informations utilisateur
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Nom d'utilisateur
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {record.userName}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {record.userEmail}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    User ID
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace" fontSize="0.9em">
                    {record.userId}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Reward Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informations récompense
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Récompense
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {record.rewardTitle}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Points dépensés
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
                    {record.pointsSpent} points
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Date de la demande
                  </Typography>
                  <Typography variant="body1">
                    {record.claimedAt?.toDate?.()?.toLocaleString('fr-FR') || 'N/A'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informations personnelles de livraison
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      Nom complet
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {record.personalInfo?.fullName || 'Non renseigné'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      Email de contact
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {record.personalInfo?.email || 'Non renseigné'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      Téléphone
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {record.personalInfo?.phone || 'Non renseigné'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Adresse de livraison
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                      {record.personalInfo?.address || 'Non renseignée'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Processing Information */}
          {(record.processedAt || record.processedBy) && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Informations de traitement
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    {record.processedBy && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">
                          Traité par
                        </Typography>
                        <Typography variant="body1">{record.processedBy}</Typography>
                      </Grid>
                    )}
                    {record.processedAt && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">
                          Date de traitement
                        </Typography>
                        <Typography variant="body1">
                          {record.processedAt?.toDate?.()?.toLocaleString('fr-FR') || 'N/A'}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Notes */}
          {record.notes && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Notes
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1">{record.notes}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Show>
  );
};
