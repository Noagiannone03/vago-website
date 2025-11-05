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

export interface IOrder {
  id?: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName?: string;
  items: IOrderItem[];
  total: number;
  subtotal: number;
  tax?: number;
  shipping?: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  shippingAddress?: IAddress;
  billingAddress?: IAddress;
  trackingNumber?: string;
  notes?: string;
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
  completedAt?: string | Timestamp;
}

export interface IOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface IAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface IUser {
  id?: string;
  uid?: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  points?: number;
  totalOrders?: number;
  totalSpent?: number;
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
  lastLoginAt?: string | Timestamp;
}

export interface INotification {
  id?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  userId?: string;
  read: boolean;
  actionUrl?: string;
  createdAt?: string | Timestamp;
}
