import { createContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material';
import { CssBaseline } from '@mui/material';

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light' as PaletteMode,
});

interface ColorModeProviderProps {
  children: ReactNode;
}

export const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as PaletteMode) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: {
                  main: '#667eea',
                  light: '#8093f1',
                  dark: '#4c63d2',
                },
                secondary: {
                  main: '#764ba2',
                  light: '#9163bf',
                  dark: '#5c3a81',
                },
                success: {
                  main: '#4caf50',
                  light: '#81c784',
                  dark: '#388e3c',
                  lighter: '#e8f5e9',
                },
                warning: {
                  main: '#ff9800',
                  light: '#ffb74d',
                  dark: '#f57c00',
                  lighter: '#fff3e0',
                },
                error: {
                  main: '#f44336',
                  light: '#e57373',
                  dark: '#d32f2f',
                },
                info: {
                  main: '#2196f3',
                  light: '#64b5f6',
                  dark: '#1976d2',
                },
                background: {
                  default: '#f5f7fa',
                  paper: '#ffffff',
                },
              }
            : {
                primary: {
                  main: '#8093f1',
                  light: '#a0aef5',
                  dark: '#667eea',
                },
                secondary: {
                  main: '#9163bf',
                  light: '#a984cc',
                  dark: '#764ba2',
                },
                success: {
                  main: '#66bb6a',
                  light: '#81c784',
                  dark: '#4caf50',
                  lighter: '#1b5e20',
                },
                warning: {
                  main: '#ffa726',
                  light: '#ffb74d',
                  dark: '#ff9800',
                  lighter: '#e65100',
                },
                error: {
                  main: '#ef5350',
                  light: '#e57373',
                  dark: '#f44336',
                },
                info: {
                  main: '#42a5f5',
                  light: '#64b5f6',
                  dark: '#2196f3',
                },
                background: {
                  default: '#0a1929',
                  paper: '#132f4c',
                },
              }),
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 700 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 700 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
                fontWeight: 600,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === 'light'
                  ? '0 2px 8px rgba(0,0,0,0.08)'
                  : '0 2px 8px rgba(0,0,0,0.3)',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 500,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
        shape: {
          borderRadius: 8,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
