// @ts-nocheck
import { useDelete, useNavigation } from '@refinedev/core';
import { List, useDataGrid } from '@refinedev/mui';
import { DataGrid, GridColDef, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { Box, Chip, Tooltip } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { useNotification } from '@refinedev/core';

export const ItemList = () => {
  const { dataGridProps } = useDataGrid({
    resource: 'items',
    pagination: {
      mode: 'server',
      pageSize: 10,
    },
    sorters: {
      initial: [{ field: 'createdAt', order: 'desc' }],
    },
  });

  const { mutate: deleteItem } = useDelete();
  const { edit, show } = useNavigation();
  const { open: notify } = useNotification();

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      deleteItem(
        { resource: 'items', id },
        {
          onSuccess: () => notify?.({ message: 'Article supprimé avec succès', type: 'success' }),
          onError: () => notify?.({ message: 'Erreur lors de la suppression', type: 'error' }),
        }
      );
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100, filterable: false },
    { field: 'name', headerName: 'Nom', flex: 1, minWidth: 200 },
    { field: 'category', headerName: 'Catégorie', width: 150 },
    {
      field: 'status',
      headerName: 'Statut',
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          label={value || 'N/A'}
          color={value === 'found' ? 'success' : value === 'lost' ? 'error' : 'default'}
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
          onClick={() => show('items', id)}
        />,
        <GridActionsCellItem
          key="edit"
          icon={<Tooltip title="Modifier"><Edit /></Tooltip>}
          label="Modifier"
          onClick={() => edit('items', id)}
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
    <List title="Articles" canCreate>
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
