import React from 'react';
import { useDataGrid, EditButton, ShowButton, DeleteButton, List } from '@refinedev/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Avatar, Chip } from '@mui/material';
import { IReward } from '../../types';

export const RewardList: React.FC = () => {
  const { dataGridProps } = useDataGrid<IReward>({
    resource: 'rewards',
  });

  const columns: GridColDef[] = [
    {
      field: 'imageUrl',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => (
        <Avatar src={params.value} variant="rounded" sx={{ width: 50, height: 50 }} />
      ),
      sortable: false,
    },
    { field: 'title', headerName: 'Titre', minWidth: 200, flex: 1 },
    { field: 'category', headerName: 'Catégorie', width: 150 },
    { field: 'pointsRequired', headerName: 'Points requis', width: 130, type: 'number' },
    { field: 'quantity', headerName: 'Quantité', width: 100, type: 'number' },
    {
      field: 'isActive',
      headerName: 'Actif',
      width: 100,
      renderCell: (params) => (
        <Chip label={params.value ? 'Oui' : 'Non'} color={params.value ? 'success' : 'default'} size="small" />
      ),
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
      <DataGrid {...dataGridProps} columns={columns} autoHeight pageSizeOptions={[10, 25, 50]} />
    </List>
  );
};
