import { useState } from 'react';
import { useDataGrid, List, EditButton, DeleteButton, ShowButton } from '@refinedev/mui';
import {
  Box,
  Chip,
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
import { Search, AccountCircle, AdminPanelSettings, SupervisorAccount } from '@mui/icons-material';
import { IUser } from '../../types';

export const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { dataGridProps } = useDataGrid<IUser>({
    resource: 'users',
    pagination: {
      pageSize: 10,
    },
  });

  const getRoleColor = (role: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      user: 'default',
      moderator: 'info',
      admin: 'error',
    };
    return colors[role] || 'default';
  };

  const getRoleIcon = (role: string) => {
    const icons: Record<string, React.ReactNode> = {
      user: <AccountCircle sx={{ fontSize: 16 }} />,
      moderator: <SupervisorAccount sx={{ fontSize: 16 }} />,
      admin: <AdminPanelSettings sx={{ fontSize: 16 }} />,
    };
    return icons[role] || null;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      active: 'success',
      inactive: 'warning',
      suspended: 'error',
    };
    return colors[status] || 'default';
  };

  const columns: GridColDef[] = [
    {
      field: 'displayName',
      headerName: 'Utilisateur',
      flex: 1,
      minWidth: 250,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={row.photoURL}
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
            }}
          >
            {row.displayName?.charAt(0).toUpperCase() || row.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.displayName || 'Utilisateur sans nom'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'role',
      headerName: 'Rôle',
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color={getRoleColor(value)}
          size="small"
          icon={getRoleIcon(value) as any}
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Statut',
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color={getStatusColor(value)}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'points',
      headerName: 'Points',
      width: 100,
      align: 'center',
      renderCell: ({ value }) => (
        <Chip
          label={value || 0}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      field: 'totalOrders',
      headerName: 'Commandes',
      width: 110,
      align: 'center',
      renderCell: ({ value }) => (
        <Typography variant="body2" fontWeight={600}>
          {value || 0}
        </Typography>
      ),
    },
    {
      field: 'totalSpent',
      headerName: 'Total dépensé',
      width: 140,
      renderCell: ({ value }) => (
        <Typography variant="body2" fontWeight={600} color="success.main">
          {(value || 0).toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          })}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Inscription',
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
          <Tooltip title="Voir profil">
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
    <List>
      {/* Filters */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 3 }}
        alignItems="center"
      >
        <TextField
          fullWidth
          placeholder="Rechercher par nom, email..."
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
          <InputLabel>Rôle</InputLabel>
          <Select
            value={roleFilter}
            label="Rôle"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="all">Tous</MenuItem>
            <MenuItem value="user">Utilisateur</MenuItem>
            <MenuItem value="moderator">Modérateur</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={statusFilter}
            label="Statut"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Tous</MenuItem>
            <MenuItem value="active">Actif</MenuItem>
            <MenuItem value="inactive">Inactif</MenuItem>
            <MenuItem value="suspended">Suspendu</MenuItem>
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
