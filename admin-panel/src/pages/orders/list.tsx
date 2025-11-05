import { useState } from 'react';
import {
  useDataGrid,
  List,
  EditButton,
  DeleteButton,
  ShowButton,
} from '@refinedev/mui';
import {
  Box,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Avatar,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Search, FilterList, LocalShipping, CheckCircle, Cancel, AccessTime } from '@mui/icons-material';
import { IOrder } from '../../types';

export const OrderList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const { dataGridProps } = useDataGrid<IOrder>({
    resource: 'orders',
    pagination: {
      pageSize: 10,
    },
  });

  // Status color mapping
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

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      pending: <AccessTime sx={{ fontSize: 16 }} />,
      processing: <FilterList sx={{ fontSize: 16 }} />,
      shipped: <LocalShipping sx={{ fontSize: 16 }} />,
      delivered: <CheckCircle sx={{ fontSize: 16 }} />,
      cancelled: <Cancel sx={{ fontSize: 16 }} />,
    };
    return icons[status] || null;
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

  const columns: GridColDef[] = [
    {
      field: 'orderNumber',
      headerName: 'N° Commande',
      width: 140,
      renderCell: ({ value }) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
          {value}
        </Typography>
      ),
    },
    {
      field: 'userEmail',
      headerName: 'Client',
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              fontSize: 14,
            }}
          >
            {row.userEmail?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {row.userName || 'N/A'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.userEmail}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'items',
      headerName: 'Articles',
      width: 100,
      align: 'center',
      renderCell: ({ value }) => (
        <Chip
          label={`${value?.length || 0} items`}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 120,
      renderCell: ({ value }) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          {value?.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          })}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 140,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color={getStatusColor(value)}
          size="small"
          icon={getStatusIcon(value) as any}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'paymentStatus',
      headerName: 'Paiement',
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color={getPaymentStatusColor(value)}
          size="small"
          variant="outlined"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 120,
      renderCell: ({ value }) => {
        const date = new Date(value);
        return (
          <Typography variant="caption" color="text.secondary">
            {date.toLocaleDateString('fr-FR')}
          </Typography>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Voir détails">
            <ShowButton hideText recordItemId={row.id} size="small" />
          </Tooltip>
          <Tooltip title="Modifier">
            <EditButton hideText recordItemId={row.id} size="small" />
          </Tooltip>
          <Tooltip title="Supprimer">
            <DeleteButton hideText recordItemId={row.id} size="small" />
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <List
      headerButtons={({ defaultButtons }) => (
        <Stack direction="row" spacing={2} alignItems="center">
          {defaultButtons}
        </Stack>
      )}
    >
      {/* Filters */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 3 }}
        alignItems="center"
      >
        <TextField
          fullWidth
          placeholder="Rechercher par N° commande, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { sm: 400 } }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={statusFilter}
            label="Statut"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Tous</MenuItem>
            <MenuItem value="pending">En attente</MenuItem>
            <MenuItem value="processing">En traitement</MenuItem>
            <MenuItem value="shipped">Expédié</MenuItem>
            <MenuItem value="delivered">Livré</MenuItem>
            <MenuItem value="cancelled">Annulé</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Paiement</InputLabel>
          <Select
            value={paymentFilter}
            label="Paiement"
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <MenuItem value="all">Tous</MenuItem>
            <MenuItem value="pending">En attente</MenuItem>
            <MenuItem value="paid">Payé</MenuItem>
            <MenuItem value="failed">Échoué</MenuItem>
            <MenuItem value="refunded">Remboursé</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* DataGrid */}
      <Box sx={{ height: 650 }}>
        <DataGrid
          {...dataGridProps}
          columns={columns}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'action.hover',
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
          }}
        />
      </Box>
    </List>
  );
};
