import { useContext } from 'react';
import { useGetIdentity } from '@refinedev/core';
import {
  AppBar,
  Avatar,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Tooltip,
} from '@mui/material';
import { DarkModeOutlined, LightModeOutlined } from '@mui/icons-material';
import { ColorModeContext } from '../contexts/ColorModeContext';

export const Header = () => {
  const { data: user } = useGetIdentity<{ email: string }>();
  const { mode, toggleColorMode } = useContext(ColorModeContext);

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar>
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
          spacing={2}
        >
          <Tooltip title={mode === 'light' ? 'Mode sombre' : 'Mode clair'}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />}
            </IconButton>
          </Tooltip>
          <Stack direction="row" gap={2} alignItems="center">
            {user?.email && (
              <Typography variant="subtitle2" color="text.primary">
                {user.email}
              </Typography>
            )}
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.email?.[0]?.toUpperCase()}
            </Avatar>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
