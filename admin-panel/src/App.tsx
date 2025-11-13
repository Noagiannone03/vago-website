import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Trips } from './pages/Trips';
import { Items } from './pages/Items';
import { Rewards } from './pages/Rewards';
import { RewardClaims } from './pages/RewardClaims';
import { Settings } from './pages/Settings';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/items" element={<Items />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/reward-claims" element={<RewardClaims />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <MantineProvider
      theme={{
        primaryColor: 'violet',
        fontFamily: 'Inter, sans-serif',
        headings: { fontFamily: 'Inter, sans-serif' },
      }}
      defaultColorScheme="light"
    >
      <ColorSchemeScript defaultColorScheme="light" />
      <Notifications position="top-right" />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
