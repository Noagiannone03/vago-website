import { useState, useEffect } from 'react';
import { collection, query, getDocs, getCountFromServer, where, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  pendingOrders: number;
  completedOrders: number;
  todayOrders: number;
  monthlyRevenue: number;
  recentOrdersGrowth: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    recentOrdersGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = Timestamp.fromDate(today);

        // Get first day of current month
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthTimestamp = Timestamp.fromDate(firstDayOfMonth);

        // Fetch all orders to calculate stats
        const ordersRef = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersRef);
        const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Calculate stats
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);

        const pendingOrders = orders.filter((order: any) =>
          order.status === 'pending' || order.status === 'processing'
        ).length;

        const completedOrders = orders.filter((order: any) =>
          order.status === 'completed' || order.status === 'delivered'
        ).length;

        const todayOrders = orders.filter((order: any) => {
          const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt);
          return orderDate >= today;
        }).length;

        const monthlyRevenue = orders
          .filter((order: any) => {
            const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt);
            return orderDate >= firstDayOfMonth;
          })
          .reduce((sum: number, order: any) => sum + (order.total || 0), 0);

        // Get last month's orders for growth calculation
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthOrders = orders.filter((order: any) => {
          const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt);
          return orderDate >= lastMonth && orderDate < firstDayOfMonth;
        }).length;

        const thisMonthOrders = orders.filter((order: any) => {
          const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt);
          return orderDate >= firstDayOfMonth;
        }).length;

        const recentOrdersGrowth = lastMonthOrders > 0
          ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
          : 0;

        // Get total users count
        const usersRef = collection(db, 'users');
        const usersCount = await getCountFromServer(usersRef);
        const totalUsers = usersCount.data().count;

        setStats({
          totalOrders,
          totalRevenue,
          totalUsers,
          pendingOrders,
          completedOrders,
          todayOrders,
          monthlyRevenue,
          recentOrdersGrowth,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error, refetch: () => {} };
};
