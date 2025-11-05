import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Timestamp } from 'firebase/firestore';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Trip {
  id: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  duration: number;
  co2Saved: number;
  pointsEarned: number;
  userId: string;
  createdAt: Timestamp;
  status: 'completed' | 'in_progress' | 'cancelled';
}

export function TripsPage() {
  const queryClient = useQueryClient();

  // Fetch trips
  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, 'trips'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trip[];
    },
  });

  // Delete trip
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'trips', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Complété</Badge>;
      case 'in_progress':
        return <Badge variant="default">En cours</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trajets</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les trajets des utilisateurs
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau trajet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des trajets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : trips && trips.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Départ</TableHead>
                  <TableHead>Arrivée</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>CO2 économisé</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">
                      {trip.startLocation || 'N/A'}
                    </TableCell>
                    <TableCell>{trip.endLocation || 'N/A'}</TableCell>
                    <TableCell>{trip.distance ? `${(trip.distance / 1000).toFixed(1)} km` : 'N/A'}</TableCell>
                    <TableCell>{trip.co2Saved ? `${trip.co2Saved.toFixed(1)} kg` : 'N/A'}</TableCell>
                    <TableCell>{trip.pointsEarned || 0}</TableCell>
                    <TableCell>{getStatusBadge(trip.status || 'completed')}</TableCell>
                    <TableCell>
                      {trip.createdAt
                        ? format(trip.createdAt.toDate(), 'dd MMM yyyy', { locale: fr })
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(trip.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun trajet trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
