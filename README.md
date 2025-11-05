# 🚀 Vago Admin Panel

Panel d'administration moderne et professionnel pour l'application Vago, construit avec React, Refine et Material-UI.

## 🎨 Technologies

- **React 18** - Bibliothèque UI moderne
- **TypeScript** - Typage statique robuste
- **Refine** - Framework headless pour admin panels
- **Material-UI (MUI)** - Bibliothèque de composants premium
- **Firebase** - Backend complet (Firestore, Auth, Storage)
- **Recharts** - Graphiques interactifs
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation fluide
- **Notistack** - Système de notifications élégant

## ✨ Fonctionnalités Principales

### 🎯 Dashboard Moderne
- **Vue d'ensemble interactive** avec statistiques en temps réel
- **Graphiques animés** : revenus mensuels, commandes hebdomadaires, répartition des statuts
- **Cartes statistiques** avec tendances et comparaisons
- **Indicateurs clés** : commandes totales, revenus, utilisateurs, commandes du jour
- **Design responsive** et professionnel

### 🛒 Gestion des Commandes (Nouveau !)
- **Table interactive** avec recherche avancée, filtres et tri
- **Vue détaillée** de chaque commande avec toutes les informations
- **Édition du statut** : pending, processing, shipped, delivered, cancelled
- **Gestion des paiements** : statuts et méthodes
- **Suivi d'expédition** avec numéros de tracking
- **Actions rapides** : voir, modifier, supprimer
- **Export et filtrage** par statut, paiement, période

### 👥 Gestion des Utilisateurs (Nouveau !)
- **CRUD complet** pour les utilisateurs
- **Profils détaillés** avec avatar, coordonnées et statistiques
- **Gestion des rôles** : user, moderator, admin
- **Gestion des statuts** : active, inactive, suspended
- **Suivi de l'activité** : points, commandes totales, montant dépensé
- **Système de niveaux** avec progression visuelle
- **Recherche et filtres** avancés

### 🚴 Gestion des Trajets
- Création et édition de trajets (vélo, course, marche)
- Upload d'images
- Gestion des événements sur le trajet
- Support des coordonnées GPS
- Système de difficulté et de points

### 📦 Gestion des Articles
- CRUD complet pour les articles
- Gestion du stock et des prix
- Catégorisation

### 🎁 Gestion des Récompenses
- Création de récompenses
- Système de points requis
- Gestion de la disponibilité

### 📋 Gestion des Réclamations
- Vue détaillée des demandes de récompenses
- Workflow d'approbation (pending → approved → completed)
- Affichage des informations personnelles
- Suivi de qui a traité la demande

### 🔧 Mode Maintenance
- Activation/désactivation du mode maintenance
- Configuration de la durée
- Message personnalisé pour les utilisateurs

### 🌓 Mode Dark/Light (Nouveau !)
- **Thème sombre élégant** pour réduire la fatigue oculaire
- **Switch instantané** entre les modes
- **Préférence sauvegardée** automatiquement
- **Design optimisé** pour les deux modes

## 🏗️ Structure du Projet

```
admin-panel/
├── src/
│   ├── components/       # Composants réutilisables
│   │   └── Header.tsx    # Header avec mode dark/light
│   ├── contexts/         # Contexts React
│   │   └── ColorModeContext.tsx  # Gestion du thème
│   ├── pages/           # Pages de l'application
│   │   ├── dashboard/   # Dashboard avec stats et graphiques
│   │   ├── orders/      # Gestion des commandes (NEW!)
│   │   │   ├── list.tsx    # Liste des commandes
│   │   │   ├── show.tsx    # Détail d'une commande
│   │   │   └── edit.tsx    # Édition d'une commande
│   │   ├── users/       # Gestion des utilisateurs (NEW!)
│   │   │   ├── list.tsx    # Liste des utilisateurs
│   │   │   ├── show.tsx    # Profil utilisateur
│   │   │   └── edit.tsx    # Édition utilisateur
│   │   ├── trips/       # Gestion des trajets
│   │   ├── items/       # Gestion des articles
│   │   ├── rewards/     # Gestion des récompenses
│   │   ├── claims/      # Gestion des réclamations
│   │   ├── maintenance/ # Mode maintenance
│   │   └── login/       # Authentification
│   ├── providers/       # Data provider et Auth provider
│   │   ├── dataProvider.ts  # Provider Firestore amélioré
│   │   └── authProvider.ts  # Provider d'authentification
│   ├── hooks/           # Custom hooks
│   │   ├── useStats.ts        # Hook pour statistiques
│   │   └── useRealtimeCollection.ts  # Hook temps réel
│   ├── config/          # Configuration
│   │   └── firebase.ts  # Config Firebase
│   ├── types/           # Types TypeScript
│   │   └── index.ts     # Tous les types (Order, User, etc.)
│   ├── App.tsx          # Application principale
│   └── main.tsx         # Point d'entrée
```

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Preview du build de production
npm run preview
```

## 🔐 Authentification

L'application utilise Firebase Authentication. Pour se connecter :
- Email: votre email Firebase autorisé
- Mot de passe: votre mot de passe Firebase

## 📦 Collections Firebase

L'application utilise les collections Firestore suivantes :

### Collections Principales
- **orders** - Commandes avec statuts, paiements et livraisons (NEW!)
- **users** - Utilisateurs avec rôles, points et statistiques (NEW!)
- **trips** - Trajets avec événements et coordonnées GPS
- **items** - Articles de la boutique avec stock et prix
- **rewards** - Récompenses disponibles avec système de points
- **reward_claims** - Réclamations de récompenses avec workflow
- **app_status** - Statut de l'application (mode maintenance)

### Structure des Données

#### Orders (Commandes)
```typescript
{
  orderNumber: string,      // Numéro unique de commande
  userId: string,           // ID de l'utilisateur
  userEmail: string,        // Email du client
  items: OrderItem[],       // Articles de la commande
  total: number,            // Total TTC
  status: string,           // pending | processing | shipped | delivered | cancelled
  paymentStatus: string,    // pending | paid | failed | refunded
  shippingAddress: Address, // Adresse de livraison
  trackingNumber?: string,  // Numéro de suivi
  createdAt: Timestamp,     // Date de création
  updatedAt: Timestamp      // Date de modification
}
```

#### Users (Utilisateurs)
```typescript
{
  uid: string,              // UID Firebase Auth
  email: string,            // Email
  displayName?: string,     // Nom d'affichage
  role: string,             // user | moderator | admin
  status: string,           // active | inactive | suspended
  points: number,           // Points de fidélité
  totalOrders: number,      // Nombre de commandes
  totalSpent: number,       // Montant total dépensé
  createdAt: Timestamp,     // Date d'inscription
  lastLoginAt: Timestamp    // Dernière connexion
}
```

## 🎨 Personnalisation

Le thème peut être personnalisé dans `src/App.tsx` :

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#667eea' },
    secondary: { main: '#764ba2' },
  },
});
```

## 🚀 Extensibilité

Pour ajouter une nouvelle ressource :

1. Créer les types dans `src/types/index.ts`
2. Créer les pages dans `src/pages/votre-ressource/`
3. Ajouter la ressource dans `src/App.tsx`
4. Le routing et le menu seront générés automatiquement

Exemple :
```typescript
{
  name: 'ma-ressource',
  list: '/ma-ressource',
  create: '/ma-ressource/create',
  edit: '/ma-ressource/edit/:id',
  show: '/ma-ressource/show/:id',
  meta: {
    label: 'Ma Ressource',
    icon: <MonIcon />,
    canDelete: true,
  },
}
```

## 📝 Scripts

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Build pour la production
- `npm run preview` - Prévisualise le build de production
- `npm run lint` - Vérifie le code

## 🤝 Contribution

Ce projet est construit de manière modulaire pour faciliter les ajouts de fonctionnalités :
- Chaque page est indépendante
- Les providers sont réutilisables
- Les types sont centralisés

## 📄 License

MIT
