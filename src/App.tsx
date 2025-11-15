import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { WebsiteApp } from './website/WebsiteApp';
import { AdminApp } from './admin/AdminApp';
import { MyDataPrivacy } from './website/pages/MyDataPrivacy';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/charts/styles.css';

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
      <Router>
        <Routes>
          {/* Site vitrine à la racine */}
          <Route path="/" element={<WebsiteApp />} />

          {/* Page de gestion des données personnelles */}
          <Route path="/mydataprivacy" element={<MyDataPrivacy />} />

          {/* Panel admin sur /admin/* */}
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
