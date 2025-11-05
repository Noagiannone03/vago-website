import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Coins } from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  imageUrl?: string;
  category: string;
  available: boolean;
}

export function RewardsPage() {
  const queryClient = useQueryClient();

  const { data: rewards, isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, 'rewards'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reward[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'rewards', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Récompenses</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les récompenses disponibles
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle récompense
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des récompenses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : rewards && rewards.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Coût</TableHead>
                  <TableHead>Disponibilité</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell className="font-medium">{reward.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {reward.description || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{reward.category || 'Autre'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className="font-semibold">{reward.pointsCost}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {reward.available ? (
                        <Badge variant="success">Disponible</Badge>
                      ) : (
                        <Badge variant="destructive">Indisponible</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(reward.id)}
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
              <p className="text-muted-foreground">Aucune récompense trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
