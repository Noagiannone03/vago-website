# Vago Admin Panel

Panel d'administration moderne et professionnel pour l'application Vago, construit avec React, TypeScript et Mantine UI.

## 🚀 Fonctionnalités

### Tableau de bord
- Vue d'ensemble avec statistiques en temps réel
- Graphiques et métriques visuelles
- Performance globale de l'application

### Gestion des Trajets
- Création et modification de trajets
- Support des coordonnées GPS
- Upload d'images
- Gestion des événements du trajet
- Types de trajets : Repas, Colis, Document
- Niveaux de difficulté : Facile, Moyen, Difficile

### Gestion des Objets
- Bibliothèque d'objets du jeu
- Différents niveaux de rareté (Common, Rare, Epic, Legendary)
- Effets et valeurs personnalisables
- Initialisation automatique d'objets de base

### Gestion des Récompenses
- Création de récompenses échangeables
- Configuration des coûts en points
- Upload d'images pour les récompenses
- Initialisation de récompenses par défaut

### Demandes de Récompenses
- Suivi des demandes utilisateurs
- Multiples statuts : En attente, Approuvée, Rejetée, En préparation, Expédiée, Livrée
- Filtrage par statut
- Gestion des adresses de livraison
- Numéros de suivi

### Paramètres de l'App
- Mode maintenance
- Message de bienvenue personnalisable
- Gestion des versions minimales
- Limites de trajets quotidiens
- Multiplicateur de récompenses

## 🛠️ Technologies

- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool rapide
- **Mantine UI 7** - Composants UI modernes
- **Firebase** - Backend (Auth, Firestore, Storage)
- **React Router** - Navigation
- **Tabler Icons** - Icônes
- **Recharts** - Graphiques

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Builder pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

## 🔧 Configuration Firebase

Le projet est configuré avec Firebase pour :
- **Authentication** : Gestion des utilisateurs administrateurs
- **Firestore** : Base de données NoSQL pour les trajets, récompenses, etc.
- **Storage** : Stockage des images

Les identifiants Firebase sont déjà configurés dans `src/config/firebase.ts`.

## 🎨 Design

Le panel admin utilise un design moderne avec :
- Mode clair/sombre
- Gradients colorés
- Animations fluides
- Interface responsive
- Notifications en temps réel

## 📱 Pages

1. **Dashboard** (`/`) - Vue d'ensemble
2. **Trajets** (`/trips`) - Gestion des trajets
3. **Objets** (`/items`) - Gestion des objets
4. **Récompenses** (`/rewards`) - Gestion des récompenses
5. **Demandes** (`/reward-claims`) - Gestion des demandes
6. **Paramètres** (`/settings`) - Configuration de l'app

## 🔐 Authentification

Le panel requiert une authentification via email/mot de passe. Seuls les administrateurs autorisés peuvent accéder à l'interface.

## 🚀 Déploiement

```bash
# Build de production
npm run build

# Le dossier dist/ contient les fichiers prêts pour le déploiement
```

Peut être déployé sur :
- Firebase Hosting
- Netlify
- Vercel
- N'importe quel hébergeur statique

## 📄 License

MIT

## 👨‍💻 Développé avec

- React + TypeScript
- Mantine UI pour un design professionnel
- Firebase pour le backend
- Amour et café ☕
