import { Timestamp } from 'firebase/firestore';

export interface ITrip {
  id?: string;
  title: string;
  type: 'vélo' | 'course' | 'marche';
  from: string;
  to: string;
  fromCoordinates: {
    lat: number;
    lng: number;
  };
  toCoordinates: {
    lat: number;
    lng: number;
  };
  distance: number;
  duration: number;
  difficulty: 'facile' | 'moyen' | 'difficile';
  description: string;
  tripImageUrl?: string;
  points: number;
  events: IEvent[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IEvent {
  id?: string;
  title: string;
  description: string;
  type: 'bon-plan' | 'alerte' | 'info' | 'bonus' | 'promo' | 'autre';
  link?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IItem {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  category: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IReward {
  id?: string;
  title: string;
  description: string;
  pointsRequired: number;
  quantity: number;
  category: string;
  imageUrl?: string;
  expiresAt?: Timestamp;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IRewardClaim {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  rewardId: string;
  rewardTitle: string;
  pointsSpent: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
  };
  notes?: string;
  claimedAt: Timestamp;
  processedAt?: Timestamp;
  processedBy?: string;
}

export interface IMaintenanceMode {
  isEnabled: boolean;
  duration: number;
  startedAt?: Timestamp;
  message?: string;
}

export interface IDashboardStats {
  totalTrips: number;
  totalItems: number;
  totalRewards: number;
  pendingClaims: number;
  activeUsers?: number;
}
