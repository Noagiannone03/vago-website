export interface Trip {
  id: string;
  title: string;
  type: 'food' | 'package' | 'document';
  from: string;
  fromCoordinates: {
    lat: number;
    lng: number;
  };
  to: string;
  toCoordinates: {
    lat: number;
    lng: number;
  };
  distance: number;
  duration: number;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  imageUrl?: string;
  events?: TripEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TripEvent {
  id: string;
  title: string;
  description: string;
  arrivalTime: string;
  departureTime: string;
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
  userName: string;
  rewardId: string;
  rewardTitle: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_preparation' | 'shipped' | 'delivered';
  shippingAddress?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppSettings {
  id: string;
  maintenanceMode: boolean;
  welcomeMessage: string;
  minAppVersion: string;
  maxTripsPerDay: number;
  rewardMultiplier: number;
  updatedAt: Date;
}

export interface DashboardStats {
  totalTrips: number;
  totalRewards: number;
  totalItems: number;
  pendingClaims: number;
  totalUsers?: number;
  activeTrips?: number;
}
