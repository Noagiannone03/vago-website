import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Trips } from './pages/Trips';
import { Items } from './pages/Items';
import { Rewards } from './pages/Rewards';
import { RewardClaims } from './pages/RewardClaims';
import { Settings } from './pages/Settings';

function AdminRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="trips" element={<Trips />} />
        <Route path="items" element={<Items />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="reward-claims" element={<RewardClaims />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Layout>
  );
}

export function AdminApp() {
  return (
    <AuthProvider>
      <AdminRoutes />
    </AuthProvider>
  );
}
