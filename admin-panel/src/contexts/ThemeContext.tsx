import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, PaletteMode } from '@mui/material';

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved as PaletteMode) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#667eea' : '#818cf8',
            light: '#8b9cfc',
            dark: '#5568d3',
          },
          secondary: {
            main: mode === 'light' ? '#764ba2' : '#a78bfa',
            light: '#9667d6',
            dark: '#5e3a82',
          },
          background: {
            default: mode === 'light' ? '#f5f7fa' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#1e293b',
          },
          success: {
            main: mode === 'light' ? '#10b981' : '#34d399',
          },
          warning: {
            main: mode === 'light' ? '#f59e0b' : '#fbbf24',
          },
          error: {
            main: mode === 'light' ? '#ef4444' : '#f87171',
          },
          info: {
            main: mode === 'light' ? '#3b82f6' : '#60a5fa',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 700, fontSize: '2.5rem' },
          h2: { fontWeight: 700, fontSize: '2rem' },
          h3: { fontWeight: 700, fontSize: '1.75rem' },
          h4: { fontWeight: 700, fontSize: '1.5rem' },
          h5: { fontWeight: 600, fontSize: '1.25rem' },
          h6: { fontWeight: 600, fontSize: '1rem' },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 10,
                fontWeight: 600,
                padding: '8px 20px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
              },
              contained: {
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: mode === 'light'
                  ? '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)'
                  : '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: mode === 'light'
                    ? '0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.1)'
                    : '0 10px 20px rgba(0,0,0,0.4), 0 6px 6px rgba(0,0,0,0.3)',
                },
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
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 600,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 10,
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
