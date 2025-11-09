// @ts-nocheck
import { useNavigation, useUpdate } from '@refinedev/core';
import { List, useDataGrid } from '@refinedev/mui';
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { Box, Chip, Tooltip, Button } from '@mui/material';
import { Visibility, CheckCircle, Cancel } from '@mui/icons-material';
import { useNotification } from '@refinedev/core';

export const ClaimList = () => {
  const { dataGridProps } = useDataGrid({
    resource: 'reward_claims',
    pagination: {
      mode: 'server',
      pageSize: 10,
    },
    sorters: {
      initial: [{ field: 'createdAt', order: 'desc' }],
    },
  });

  const { show } = useNavigation();
  const { mutate: updateClaim } = useUpdate();
  const { open: notify } = useNotification();

  const handleStatusChange = (id: string, newStatus: string) => {
    const action = newStatus === 'approved' ? 'approuver' : 'rejeter';
    if (window.confirm(`Êtes-vous sûr de vouloir ${action} cette réclamation ?`)) {
      updateClaim(
        {
          resource: 'reward_claims',
          id,
          values: { status: newStatus },
        },
        {
          onSuccess: () => {
            notify?.({
              message: `Réclamation ${newStatus === 'approved' ? 'approuvée' : 'rejetée'} avec succès`,
              type: 'success',
            });
          },
          onError: () => {
            notify?.({
              message: 'Erreur lors de la mise à jour',
              type: 'error',
            });
          },
        }
      );
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100, filterable: false },
    { field: 'userId', headerName: 'Utilisateur', flex: 1, minWidth: 150 },
    { field: 'rewardId', headerName: 'Récompense', flex: 1, minWidth: 150 },
    {
      field: 'status',
      headerName: 'Statut',
      width: 130,
      renderCell: ({ value }) => {
        const getColor = (status: string) => {
          switch (status) {
            case 'pending':
              return 'warning';
            case 'approved':
              return 'success';
            case 'rejected':
              return 'error';
            default:
              return 'default';
          }
        };

        return (
          <Chip
            label={value || 'N/A'}
            color={getColor(value)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Date de création',
      width: 180,
      renderCell: ({ value }) => {
        if (!value?.seconds) return 'N/A';
        return new Date(value.seconds * 1000).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 180,
      getActions: ({ id, row }) => {
        const actions = [
          <GridActionsCellItem
            key="view"
            icon={
              <Tooltip title="Voir">
                <Visibility />
              </Tooltip>
            }
            label="Voir"
            onClick={() => show('reward_claims', id)}
          />,
        ];

        if (row.status === 'pending') {
          actions.push(
            <GridActionsCellItem
              key="approve"
              icon={
                <Tooltip title="Approuver">
                  <CheckCircle />
                </Tooltip>
              }
              label="Approuver"
              onClick={() => handleStatusChange(String(id), 'approved')}
              sx={{ color: 'success.main' }}
            />,
            <GridActionsCellItem
              key="reject"
              icon={
                <Tooltip title="Rejeter">
                  <Cancel />
                </Tooltip>
              }
              label="Rejeter"
              onClick={() => handleStatusChange(String(id), 'rejected')}
              sx={{ color: 'error.main' }}
            />
          );
        }

        return actions;
      },
    },
  ];

  return (
    <List title="Réclamations">
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          {...dataGridProps}
          columns={columns}
          autoHeight={false}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Box>
    </List>
  );
};
