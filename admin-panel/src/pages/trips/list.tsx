// @ts-nocheck
import { useList, useDelete, useNavigation } from '@refinedev/core';
import { List, useDataGrid, DateField } from '@refinedev/mui';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridToolbar,
} from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { useNotification } from '@refinedev/core';

export const TripList = () => {
  const { dataGridProps } = useDataGrid({
    resource: 'trips',
    pagination: {
      mode: 'server',
      pageSize: 10,
    },
    sorters: {
      initial: [
        {
          field: 'createdAt',
          order: 'desc',
        },
      ],
    },
  });

  const { mutate: deleteTrip } = useDelete();
  const { edit, show } = useNavigation();
  const { open: notify } = useNotification();

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
      deleteTrip(
        {
          resource: 'trips',
          id,
        },
        {
          onSuccess: () => {
            notify?.({
              message: 'Trajet supprimé avec succès',
              type: 'success',
            });
          },
          onError: () => {
            notify?.({
              message: 'Erreur lors de la suppression',
              type: 'error',
            });
          },
        }
      );
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      filterable: false,
    },
    {
      field: 'userId',
      headerName: 'Utilisateur',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'startLocation',
      headerName: 'Départ',
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => {
        return row.startLocation?.address || 'N/A';
      },
    },
    {
      field: 'endLocation',
      headerName: 'Arrivée',
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => {
        return row.endLocation?.address || 'N/A';
      },
    },
    {
      field: 'distance',
      headerName: 'Distance (km)',
      width: 130,
      type: 'number',
      valueFormatter: (value) => {
        return value ? `${(value / 1000).toFixed(2)} km` : 'N/A';
      },
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 130,
      renderCell: ({ value }) => {
        const getColor = (status: string) => {
          switch (status) {
            case 'completed':
              return 'success';
            case 'in_progress':
              return 'info';
            case 'cancelled':
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
      width: 120,
      getActions: ({ id }) => [
        <GridActionsCellItem
          key="view"
          icon={
            <Tooltip title="Voir">
              <Visibility />
            </Tooltip>
          }
          label="Voir"
          onClick={() => show('trips', id)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={
            <Tooltip title="Modifier">
              <Edit />
            </Tooltip>
          }
          label="Modifier"
          onClick={() => edit('trips', id)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={
            <Tooltip title="Supprimer">
              <Delete />
            </Tooltip>
          }
          label="Supprimer"
          onClick={() => handleDelete(String(id))}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  return (
    <List
      title="Trajets"
      canCreate
      createButtonProps={{
        onClick: () => {
          window.location.href = '/trips/create';
        },
      }}
    >
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          {...dataGridProps}
          columns={columns}
          autoHeight={false}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            '& .MuiDataGrid-cell:hover': {
              cursor: 'pointer',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        />
      </Box>
    </List>
  );
};
