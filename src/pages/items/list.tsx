import React from 'react';
import { useDataGrid, EditButton, ShowButton, DeleteButton, List } from '@refinedev/mui';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Avatar } from '@mui/material';
import { IItem } from '../../types';

export const ItemList: React.FC = () => {
  const { dataGridProps } = useDataGrid<IItem>({
    resource: 'items',
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
    { field: 'name', headerName: 'Nom', minWidth: 200, flex: 1 },
    { field: 'category', headerName: 'Catégorie', width: 150 },
    { field: 'price', headerName: 'Prix (€)', width: 100, type: 'number' },
    { field: 'stock', headerName: 'Stock', width: 100, type: 'number' },
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
