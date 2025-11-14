export interface Trip {
  id: string;
  title: string;
  type: 'food' | 'package' | 'document';
  from: string;
  fromCoordinates: {
    latitude: number;
    longitude: number;
  };
  to: string;
  toCoordinates: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: number;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  imageUrl?: string;
  events?: TripEvent[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TripEvent {
  eventId: string;
  category: string;
  title: string;
  type: string;
  timing: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effect?: string;
  value?: number;
  imageUrl?: string;
  createdAt: Date;
}

export interface Reward {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cost: number;
  imageUrl?: string;
  available: boolean;
  createdAt: Date;
}

export interface RewardClaim {
  id: string;
  userId: string;
  userEmail: string;
  userPseudo: string;
  rewardId: string;
  rewardTitle: string;
  rewardSubtitle: string;
  rewardDescription: string;
  pointsCost: number;
  status: 'pending' | 'approved' | 'rejected' | 'in_preparation' | 'shipped' | 'delivered';
  personalInfo: {
    nom: string;
    prenom: string;
    adresse: string;
    ville: string;
    codePostal: string;
    telephone: string;
    batiment?: string;
    informationsComplementaires?: string;
  };
  trackingNumber?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppSettings {
  id: string;
  welcomeMessage: string;
  minAppVersion: string;
  maxTripsPerDay: number;
  rewardMultiplier: number;
  updatedAt: Date;
}

export interface MaintenanceStatus {
  isActive: boolean;
  estimatedDuration?: string; // Ex: "2 heures", "30 minutes"
}

export interface DashboardStats {
  totalTrips: number;
  totalRewards: number;
  totalItems: number;
  pendingClaims: number;
  totalUsers?: number;
  activeTrips?: number;
}
