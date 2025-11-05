import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bike, Package, Gift, TrendingUp } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardPage() {
  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const [tripsSnap, itemsSnap, rewardsSnap, claimsSnap] = await Promise.all([
        getDocs(collection(db, 'trips')),
        getDocs(collection(db, 'items')),
        getDocs(collection(db, 'rewards')),
        getDocs(collection(db, 'reward_claims')),
      ]);

      return {
        trips: tripsSnap.size,
        items: itemsSnap.size,
        rewards: rewardsSnap.size,
        claims: claimsSnap.size,
      };
    },
  });

  // Mock data for charts (you can replace with real data)
  const chartData = [
    { name: 'Lun', trajets: 12, articles: 8 },
    { name: 'Mar', trajets: 19, articles: 12 },
    { name: 'Mer', trajets: 15, articles: 15 },
    { name: 'Jeu', trajets: 22, articles: 18 },
    { name: 'Ven', trajets: 28, articles: 22 },
    { name: 'Sam', trajets: 32, articles: 25 },
    { name: 'Dim', trajets: 24, articles: 19 },
  ];

  const statCards = [
    {
      title: 'Total Trajets',
      value: stats?.trips || 0,
      icon: Bike,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Articles',
      value: stats?.items || 0,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Récompenses',
      value: stats?.rewards || 0,
      icon: Gift,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Réclamations',
      value: stats?.claims || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de votre application Vago
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activité Hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="trajets"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="articles"
                  stackId="2"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendances</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="trajets"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="articles"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
