import { useState, useEffect } from 'react';
import { collection, query, where, getCountFromServer, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Stats {
  totalTrips: number;
  totalItems: number;
  totalRewards: number;
  totalClaims: number;
  pendingClaims: number;
  loading: boolean;
}

export const useFirebaseStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalTrips: 0,
    totalItems: 0,
    totalRewards: 0,
    totalClaims: 0,
    pendingClaims: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats((prev) => ({ ...prev, loading: true }));

        // Fetch all counts in parallel
        const [tripsCount, itemsCount, rewardsCount, claimsCount, pendingClaimsCount] =
          await Promise.all([
            getCountFromServer(query(collection(db, 'trips'))),
            getCountFromServer(query(collection(db, 'items'))),
            getCountFromServer(query(collection(db, 'rewards'))),
            getCountFromServer(query(collection(db, 'reward_claims'))),
            getCountFromServer(
              query(collection(db, 'reward_claims'), where('status', '==', 'pending'))
            ),
          ]);

        setStats({
          totalTrips: tripsCount.data().count,
          totalItems: itemsCount.data().count,
          totalRewards: rewardsCount.data().count,
          totalClaims: claimsCount.data().count,
          pendingClaims: pendingClaimsCount.data().count,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};

// Hook for recent activity
export const useRecentActivity = (limit: number = 10) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);

        // Fetch recent claims
        const claimsQuery = query(
          collection(db, 'reward_claims'),
          where('createdAt', '>=', Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))
        );
        const claimsSnapshot = await getDocs(claimsQuery);

        const claimsData = claimsSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: 'claim',
          ...doc.data(),
        })) as any[];

        // Sort by date and limit
        const sorted = claimsData
          .sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
          .slice(0, limit);

        setActivities(sorted);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, [limit]);

  return { activities, loading };
};
