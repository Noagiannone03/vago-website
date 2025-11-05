import React from 'react';
import { useDataGrid, EditButton, ShowButton, DeleteButton, List } from '@refinedev/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Chip, Avatar } from '@mui/material';
import { ITrip } from '../../types';

export const TripList: React.FC = () => {
  const { dataGridProps } = useDataGrid<ITrip>({
    resource: 'trips',
  });

  const columns: GridColDef[] = [
    {
      field: 'tripImageUrl',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          variant="rounded"
          sx={{ width: 50, height: 50 }}
        />
      ),
      sortable: false,
    },
    {
      field: 'title',
      headerName: 'Titre',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'vélo'
              ? 'primary'
              : params.value === 'course'
              ? 'success'
              : 'warning'
          }
          size="small"
        />
      ),
    },
    {
      field: 'from',
      headerName: 'Départ',
      width: 150,
    },
    {
      field: 'to',
      headerName: 'Arrivée',
      width: 150,
    },
    {
      field: 'distance',
      headerName: 'Distance (km)',
      width: 120,
      type: 'number',
    },
    {
      field: 'duration',
      headerName: 'Durée (min)',
      width: 120,
      type: 'number',
    },
    {
      field: 'difficulty',
      headerName: 'Difficulté',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'facile'
              ? 'success'
              : params.value === 'moyen'
              ? 'warning'
              : 'error'
          }
          size="small"
        />
      ),
    },
    {
      field: 'points',
      headerName: 'Points',
      width: 100,
      type: 'number',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <>
          <ShowButton hideText recordItemId={params.row.id} />
          <EditButton hideText recordItemId={params.row.id} />
          <DeleteButton hideText recordItemId={params.row.id} />
        </>
      ),
    },
  ];

  return (
    <List>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25, 50, 100]}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
      />
    </List>
  );
};
