import React from 'react';
import { useDataGrid, List } from '@refinedev/mui';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Chip, IconButton, Tooltip } from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { IRewardClaim } from '../../types';
import { useUpdate, useNavigation } from '@refinedev/core';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

export const ClaimList: React.FC = () => {
  const { dataGridProps } = useDataGrid<IRewardClaim>({
    resource: 'reward_claims',
  });

  const { mutate: update } = useUpdate();
  const { show } = useNavigation();

  const handleApprove = async (id: string) => {
    const claimRef = doc(db, 'reward_claims', id);
    await updateDoc(claimRef, {
      status: 'approved',
      processedAt: Timestamp.now(),
      processedBy: auth.currentUser?.email || 'admin',
    });
    window.location.reload(); // Simple refresh for now
  };

  const handleReject = async (id: string) => {
    const claimRef = doc(db, 'reward_claims', id);
    await updateDoc(claimRef, {
      status: 'rejected',
      processedAt: Timestamp.now(),
      processedBy: auth.currentUser?.email || 'admin',
    });
    window.location.reload(); // Simple refresh for now
  };

  const columns: GridColDef[] = [
    {
      field: 'status',
      headerName: 'Statut',
      width: 130,
      renderCell: (params) => {
        const status = params.value;
        let color: 'warning' | 'success' | 'error' | 'default' = 'default';

        if (status === 'pending') color = 'warning';
        else if (status === 'approved') color = 'success';
        else if (status === 'rejected') color = 'error';

        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: 'userName',
      headerName: 'Utilisateur',
      width: 200,
    },
    {
      field: 'userEmail',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'rewardTitle',
      headerName: 'Récompense',
      width: 200,
      flex: 1,
    },
    {
      field: 'pointsSpent',
      headerName: 'Points dépensés',
      width: 130,
      type: 'number',
    },
    {
      field: 'claimedAt',
      headerName: 'Date de demande',
      width: 160,
      renderCell: (params) => {
        if (params.value?.toDate) {
          return params.value.toDate().toLocaleDateString('fr-FR');
        }
        return '-';
      },
    },
    {
      field: 'processedBy',
      headerName: 'Traité par',
      width: 150,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => {
        const actions = [
          <GridActionsCellItem
            icon={
              <Tooltip title="Voir les détails">
                <ViewIcon />
              </Tooltip>
            }
            label="Voir"
            onClick={() => show('reward_claims', params.row.id)}
          />,
        ];

        if (params.row.status === 'pending') {
          actions.push(
            <GridActionsCellItem
              icon={
                <Tooltip title="Approuver">
                  <ApproveIcon />
                </Tooltip>
              }
              label="Approuver"
              onClick={() => handleApprove(params.row.id)}
              sx={{ color: 'success.main' }}
            />,
            <GridActionsCellItem
              icon={
                <Tooltip title="Rejeter">
                  <RejectIcon />
                </Tooltip>
              }
              label="Rejeter"
              onClick={() => handleReject(params.row.id)}
              sx={{ color: 'error.main' }}
            />
          );
        }

        return actions;
      },
    },
  ];

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          sorting: {
            sortModel: [{ field: 'claimedAt', sort: 'desc' }],
          },
        }}
      />
    </List>
  );
};
