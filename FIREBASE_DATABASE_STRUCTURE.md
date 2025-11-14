# Structure de la Base de Données Firebase - Vago

Ce document décrit la structure exacte des collections Firebase pour le projet Vago.

## 📍 Emplacement de la Base de Données
**Région:** `eur3` (Europe)

---

## 🚗 Collection: `trips`

Structure d'un document Trip:

```javascript
{
  // Identifiants et métadonnées
  id: "auto-generated-id",                    // (string) ID Firestore auto-généré

  // Informations générales
  title: "voyage en europe de l'est",         // (string) Titre du trajet
  type: "food",                                // (string) Type: "food" | "package" | "document"
  description: "plongez dans un trajet...",   // (string) Description détaillée
  difficulty: "hard",                          // (string) Difficulté: "easy" | "medium" | "hard"

  // Localisation de départ
  from: "Vienne",                              // (string) Ville de départ
  fromCoordinates: {
    latitude: 48.203856,                       // (number) Latitude du point de départ
    longitude: 16.327972                       // (number) Longitude du point de départ
  },

  // Localisation d'arrivée
  to: "Moscou",                                // (string) Ville d'arrivée
  toCoordinates: {
    latitude: 49.730287,                       // (number) Latitude du point d'arrivée
    longitude: 26.509587                       // (number) Longitude du point d'arrivée
  },

  // Métriques du trajet
  distance: 60,                                // (number) Distance en kilomètres
  duration: 25,                                // (number) Durée en minutes
  reward: 40,                                  // (number) Récompense en points/miles

  // Média
  imageUrl: "https://...",                     // (string, optionnel) URL de l'image du trajet

  // Événements du trajet
  events: [                                    // (array, optionnel) Liste des événements
    {
      eventId: "52f72d1c-bbcc-446f-b490...",  // (string) ID unique de l'événement (UUID)
      title: "peage",                          // (string) Titre de l'événement
      category: "peage",                       // (string) Catégorie: "peage", "radar", etc.
      type: "fixed",                           // (string) Type: "fixed" | "random"
      timing: 1                                // (number) Timing en minutes depuis le départ
    },
    {
      eventId: "7e54ad93-3c8e-4361-b6f0...",
      title: "radar",
      category: "radar",
      type: "fixed",
      timing: 4
    }
  ],

  // Timestamps
  createdAt: Timestamp,                        // (Timestamp) Date de création
  updatedAt: Timestamp                         // (Timestamp) Date de dernière modification
}
```

### Valeurs possibles:
- **type:** `"food"`, `"package"`, `"document"`
- **difficulty:** `"easy"`, `"medium"`, `"hard"`
- **event.category:** `"peage"`, `"radar"`, etc.
- **event.type:** `"fixed"`, `"random"`

---

## 🎁 Collection: `reward-claims` (avec tiret !)

**⚠️ Important:** Le nom de la collection est `reward-claims` avec un tiret, pas underscore.

Structure d'un document RewardClaim:

```javascript
{
  // Identifiants
  id: "5AKmLqscYC8SGJUYEIFv",                 // (string) ID Firestore auto-généré

  // Informations utilisateur
  userId: "NtqQAWYpH8fk47SKX5pqcxQ9WNu2",     // (string) ID de l'utilisateur
  userEmail: "sed@gmail.com",                 // (string) Email de l'utilisateur
  userPseudo: "Utilisateur",                  // (string) Pseudo de l'utilisateur

  // Informations de la récompense
  rewardId: "9ARA9HUv15UOyP3ccxOF",           // (string) ID de la récompense
  rewardTitle: "RÉCOMPENSE ARGENT",           // (string) Titre de la récompense
  rewardSubtitle: "Un niveau supérieur atteint !", // (string) Sous-titre
  rewardDescription: "Excellente progression ! Vous montrez...", // (string) Description
  pointsCost: 400,                            // (number) Coût en points

  // Statut de la demande
  status: "rejected",                         // (string) Statut de la demande

  // Informations personnelles de livraison
  personalInfo: {
    nom: "Oooo",                              // (string) Nom de famille
    prenom: "Oooo",                           // (string) Prénom
    adresse: "56 fofofo",                     // (string) Adresse
    ville: "Marseille",                       // (string) Ville
    codePostal: "13014",                      // (string) Code postal
    telephone: "06229292960",                 // (string) Numéro de téléphone
    batiment: "",                             // (string, optionnel) Bâtiment/Résidence
    informationsComplementaires: ""           // (string, optionnel) Informations supplémentaires
  },

  // Suivi et notes
  trackingNumber: "FR123456789",              // (string, optionnel) Numéro de suivi colis
  adminNotes: "Demande approuvée automatiquement", // (string, optionnel) Notes de l'admin

  // Timestamps
  createdAt: Timestamp,                       // (Timestamp) Date de création de la demande
  updatedAt: Timestamp                        // (Timestamp) Date de dernière modification
}
```

### Valeurs possibles pour status:
- `"pending"` - En attente
- `"approved"` - Approuvée
- `"rejected"` - Rejetée
- `"in_preparation"` - En préparation
- `"shipped"` - Expédiée
- `"delivered"` - Livrée

---

## 🏆 Collection: `rewards`

Structure d'un document Reward:

```javascript
{
  id: "auto-generated-id",                    // (string) ID Firestore
  title: "Récompense Bronze",                 // (string) Titre
  subtitle: "Première récompense",            // (string) Sous-titre
  description: "Description de la récompense", // (string) Description
  cost: 100,                                  // (number) Coût en points
  imageUrl: "https://...",                    // (string, optionnel) URL de l'image
  available: true,                            // (boolean) Disponibilité
  createdAt: Timestamp                        // (Timestamp) Date de création
}
```

---

## 🎒 Collection: `items`

Structure d'un document Item:

```javascript
{
  id: "auto-generated-id",                    // (string) ID Firestore
  name: "Carte d'autoroute",                  // (string) Nom de l'item
  description: "Une carte pour naviguer",     // (string) Description
  type: "tool",                               // (string) Type d'item
  rarity: "common",                           // (string) Rareté
  effect: "Réduit les erreurs de navigation", // (string, optionnel) Effet
  value: 50,                                  // (number, optionnel) Valeur
  imageUrl: "https://...",                    // (string, optionnel) URL de l'image
  createdAt: Timestamp                        // (Timestamp) Date de création
}
```

### Valeurs possibles pour rarity:
- `"common"` - Commun
- `"rare"` - Rare
- `"epic"` - Épique
- `"legendary"` - Légendaire

---

## ⚙️ Collection: `app_status`

Collection pour les paramètres de l'application:

```javascript
{
  id: "settings",
  welcomeMessage: "Bienvenue sur Vago !",     // (string) Message de bienvenue
  minAppVersion: "1.0.0",                     // (string) Version minimale de l'app
  maxTripsPerDay: 10,                         // (number) Nombre max de trajets/jour
  rewardMultiplier: 1.0,                      // (number) Multiplicateur de récompenses
  updatedAt: Timestamp                        // (Timestamp) Dernière modification
}
```

---

## 📝 Notes Importantes

### Conventions de nommage:
1. **Coordonnées:** Toujours utiliser `latitude` et `longitude` (pas `lat`/`lng`)
2. **Collections:**
   - `reward-claims` utilise un **tiret** (pas underscore)
   - Les autres collections utilisent le camelCase
3. **IDs:** Tous les eventId utilisent des UUID v4
4. **Timestamps:** Utiliser `Timestamp.now()` pour les dates

### Champs optionnels courants:
- `imageUrl` - URL d'image (trips, rewards, items)
- `events` - Liste d'événements (trips)
- `trackingNumber` - Numéro de suivi (reward-claims)
- `adminNotes` - Notes admin (reward-claims)
- `batiment` - Bâtiment (personalInfo)
- `informationsComplementaires` - Info supplémentaires (personalInfo)

### Types TypeScript correspondants:
Voir `/src/types/index.ts` pour les interfaces TypeScript exactes.

---

**Dernière mise à jour:** 2025-01-14
