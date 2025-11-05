# Vago Admin Panel

🚴 Modern, professional admin panel for the Vago application - built with the latest web technologies.

## ✨ Features

- **🎨 Beautiful Design**: Modern UI with Tailwind CSS and custom components
- **🔐 Secure Authentication**: Firebase authentication integration
- **📊 Interactive Dashboard**: Real-time stats and charts
- **🚀 Fast & Responsive**: Built with Vite and React for optimal performance
- **💾 Data Management**: Full CRUD operations for all entities
- **📱 Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Powerful data fetching and caching
- **React Router** - Client-side routing
- **Firebase** - Backend services (Auth, Firestore, Storage)
- **Recharts** - Beautiful charts and graphs
- **Lucide React** - Modern icon library

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Firestore and Authentication enabled

### Installation

1. Clone the repository
2. Navigate to the admin-panel directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

5. Fill in your Firebase credentials in the `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📂 Project Structure

```
admin-panel/
├── src/
│   ├── components/       # Reusable components
│   │   ├── ui/          # UI components (Button, Card, etc.)
│   │   ├── Layout.tsx   # Main layout wrapper
│   │   └── Sidebar.tsx  # Navigation sidebar
│   ├── config/          # Configuration files
│   │   └── firebase.ts  # Firebase configuration
│   ├── hooks/           # Custom React hooks
│   │   └── useAuth.ts   # Authentication hook
│   ├── lib/             # Utility functions
│   │   └── utils.ts     # Helper functions
│   ├── pages/           # Page components
│   │   ├── DashboardPage.tsx
│   │   ├── TripsPage.tsx
│   │   ├── ItemsPage.tsx
│   │   ├── RewardsPage.tsx
│   │   ├── ClaimsPage.tsx
│   │   ├── MaintenancePage.tsx
│   │   └── LoginPage.tsx
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔐 Authentication

The admin panel uses Firebase Authentication. To create an admin user:

1. Go to your Firebase Console
2. Navigate to Authentication > Users
3. Add a new user with email and password
4. Use these credentials to log in to the admin panel

## 📊 Features Overview

### Dashboard
- Real-time statistics for trips, items, rewards, and claims
- Interactive charts showing weekly activity and trends
- Beautiful card-based layout

### Trips Management
- View all user trips
- Filter and sort trips
- Edit and delete trips
- See trip details (distance, CO2 saved, points earned)

### Items Management
- Manage found items
- View item locations on map
- Update item status (available, claimed, removed)
- Category-based organization

### Rewards Management
- Create and manage rewards
- Set point costs
- Toggle availability
- Organize by category

### Claims Management
- Review reward claims
- Approve or reject claims
- Track claim status
- View claim history

### Maintenance
- Database management tools
- Data export/import
- System statistics
- Cleanup utilities

## 🎨 Customization

### Theme Colors

Edit `src/index.css` to customize the color scheme:

```css
:root {
  --primary: 262 83% 58%;  /* Purple */
  /* Add more custom colors */
}
```

### UI Components

All UI components are located in `src/components/ui/` and can be customized to match your brand.

## 📝 License

This project is private and proprietary.

## 🤝 Support

For support, please contact the development team.
