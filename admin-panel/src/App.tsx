import { Refine } from '@refinedev/core';
import {
  ErrorComponent,
  ThemedLayout,
  ThemedTitle,
  useNotificationProvider,
} from '@refinedev/mui';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from '@refinedev/react-router';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import {
  Dashboard as DashboardIcon,
  DirectionsBike as TripIcon,
  Inventory as ItemIcon,
  CardGiftcard as RewardIcon,
  Assignment as ClaimIcon,
  Build as MaintenanceIcon,
} from '@mui/icons-material';

import { firestoreDataProvider } from './providers/dataProvider';
import { authProvider } from './providers/authProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/layout/Header';

// Pages
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { TripList } from './pages/trips/list';
import { TripCreate } from './pages/trips/create';
import { ItemList } from './pages/items/list';
import { RewardList } from './pages/rewards/list';
import { ClaimList } from './pages/claims/list';
import { ClaimShow } from './pages/claims/show';
import { Maintenance } from './pages/maintenance';

// Wrapper component to use notification provider inside SnackbarProvider context
const RefineApp = () => {
  const notificationProvider = useNotificationProvider();

  return (
    <Refine
      dataProvider={firestoreDataProvider}
      authProvider={authProvider}
      notificationProvider={notificationProvider}
      routerProvider={routerBindings}
      resources={[
        {
          name: 'dashboard',
          list: '/',
          meta: {
            label: 'Dashboard',
            icon: <DashboardIcon />,
          },
        },
        {
          name: 'trips',
          list: '/trips',
          create: '/trips/create',
          edit: '/trips/edit/:id',
          show: '/trips/show/:id',
          meta: {
            label: 'Trajets',
            icon: <TripIcon />,
            canDelete: true,
          },
        },
        {
          name: 'items',
          list: '/items',
          create: '/items/create',
          edit: '/items/edit/:id',
          show: '/items/show/:id',
          meta: {
            label: 'Articles',
            icon: <ItemIcon />,
            canDelete: true,
          },
        },
        {
          name: 'rewards',
          list: '/rewards',
          create: '/rewards/create',
          edit: '/rewards/edit/:id',
          show: '/rewards/show/:id',
          meta: {
            label: 'Récompenses',
            icon: <RewardIcon />,
            canDelete: true,
          },
        },
        {
          name: 'reward_claims',
          list: '/claims',
          show: '/claims/show/:id',
          meta: {
            label: 'Réclamations',
            icon: <ClaimIcon />,
          },
        },
        {
          name: 'maintenance',
          list: '/maintenance',
          meta: {
            label: 'Maintenance',
            icon: <MaintenanceIcon />,
          },
        },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
      }}
    >
      <Routes>
        <Route
          element={
            <ThemedLayout
              Title={() => <ThemedTitle collapsed={false} text="Vago Admin" icon={<TripIcon />} />}
              Header={Header}
            >
              <Outlet />
            </ThemedLayout>
          }
        >
          <Route index element={<Dashboard />} />

          {/* Trips */}
          <Route path="/trips">
            <Route index element={<TripList />} />
            <Route path="create" element={<TripCreate />} />
          </Route>

          {/* Items */}
          <Route path="/items">
            <Route index element={<ItemList />} />
          </Route>

          {/* Rewards */}
          <Route path="/rewards">
            <Route index element={<RewardList />} />
          </Route>

          {/* Claims */}
          <Route path="/claims">
            <Route index element={<ClaimList />} />
            <Route path="show/:id" element={<ClaimShow />} />
          </Route>

          {/* Maintenance */}
          <Route path="/maintenance" element={<Maintenance />} />

          <Route path="*" element={<ErrorComponent />} />
        </Route>

        <Route element={<CatchAllNavigate to="/login" />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>

      <UnsavedChangesNotifier />
      <DocumentTitleHandler />
    </Refine>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CssBaseline />
        <GlobalStyles
          styles={{
            html: { WebkitFontSmoothing: 'auto' },
          }}
        />
        <SnackbarProvider>
          <RefineApp />
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
