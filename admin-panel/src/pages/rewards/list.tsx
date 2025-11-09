// @ts-nocheck
import { useDelete, useNavigation } from '@refinedev/core';
import { List, useDataGrid } from '@refinedev/mui';
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { Box, Chip, Tooltip } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { useNotification } from '@refinedev/core';

export const RewardList = () => {
  const { dataGridProps } = useDataGrid({
    resource: 'rewards',
    pagination: {
      mode: 'server',
      pageSize: 10,
    },
    sorters: {
      initial: [{ field: 'createdAt', order: 'desc' }],
    },
  });

  const { mutate: deleteReward } = useDelete();
  const { edit, show } = useNavigation();
  const { open: notify } = useNotification();

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette récompense ?')) {
      deleteReward(
        { resource: 'rewards', id },
        {
          onSuccess: () => notify?.({ message: 'Récompense supprimée avec succès', type: 'success' }),
          onError: () => notify?.({ message: 'Erreur lors de la suppression', type: 'error' }),
        }
      );
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100, filterable: false },
    { field: 'name', headerName: 'Nom', flex: 1, minWidth: 200 },
    {
      field: 'pointsCost',
      headerName: 'Coût (points)',
      width: 150,
      type: 'number',
      valueFormatter: (value) => `${value || 0} pts`,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 100,
      type: 'number',
    },
    {
      field: 'available',
      headerName: 'Disponible',
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value ? 'Oui' : 'Non'}
          color={value ? 'success' : 'default'}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
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
          icon={<Tooltip title="Voir"><Visibility /></Tooltip>}
          label="Voir"
          onClick={() => show('rewards', id)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<Tooltip title="Modifier"><Edit /></Tooltip>}
          label="Modifier"
          onClick={() => edit('rewards', id)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<Tooltip title="Supprimer"><Delete /></Tooltip>}
          label="Supprimer"
          onClick={() => handleDelete(String(id))}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  return (
    <List title="Récompenses" canCreate>
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
