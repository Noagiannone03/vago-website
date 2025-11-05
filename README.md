# Vago Admin Panel

Panel d'administration professionnel pour l'application Vago, construit avec React, Refine et Material-UI.

## 🚀 Technologies

- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Refine** - Framework headless pour admin panels
- **Material-UI (MUI)** - Bibliothèque de composants
- **Firebase** - Backend (Firestore, Auth, Storage)
- **Vite** - Build tool rapide
- **React Router** - Navigation

## ✨ Fonctionnalités

### Dashboard
- Vue d'ensemble avec statistiques en temps réel
- Nombre de trajets, articles, récompenses
- Suivi des réclamations en attente

### Gestion des Trajets
- Création et édition de trajets (vélo, course, marche)
- Upload d'images
- Gestion des événements sur le trajet
- Support des coordonnées GPS
- Système de difficulté et de points

### Gestion des Articles
- CRUD complet pour les articles
- Gestion du stock et des prix
- Catégorisation

### Gestion des Récompenses
- Création de récompenses
- Système de points requis
- Gestion de la disponibilité

### Gestion des Réclamations (Amélioré)
- Vue détaillée des demandes de récompenses
- Workflow d'approbation (pending → approved → completed)
- Affichage des informations personnelles
- Suivi de qui a traité la demande
- Interface intuitive pour accepter/refuser

### Mode Maintenance
- Activation/désactivation du mode maintenance
- Configuration de la durée
- Message personnalisé pour les utilisateurs

## 🏗️ Structure du Projet

```
src/
├── components/       # Composants réutilisables
├── pages/           # Pages de l'application
│   ├── dashboard/   # Dashboard principal
│   ├── trips/       # Gestion des trajets
│   ├── items/       # Gestion des articles
│   ├── rewards/     # Gestion des récompenses
│   ├── claims/      # Gestion des réclamations
│   ├── maintenance/ # Mode maintenance
│   └── login/       # Authentification
├── providers/       # Data provider et Auth provider
├── config/          # Configuration (Firebase)
├── types/           # Types TypeScript
├── utils/           # Utilitaires
└── hooks/           # Custom hooks
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

- **trips** - Trajets avec événements
- **items** - Articles de la boutique
- **rewards** - Récompenses disponibles
- **reward_claims** - Réclamations de récompenses
- **app_status** - Statut de l'application (maintenance)

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
