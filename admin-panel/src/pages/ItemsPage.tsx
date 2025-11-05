import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  location: {
    latitude: number;
    longitude: number;
  };
  imageUrl?: string;
  userId: string;
  status: 'available' | 'claimed' | 'removed';
}

export function ItemsPage() {
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, 'items'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Item[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'items', id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">Disponible</Badge>;
      case 'claimed':
        return <Badge variant="default">Récupéré</Badge>;
      case 'removed':
        return <Badge variant="destructive">Retiré</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les objets trouvés
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel article
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des articles</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : items && items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.description || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category || 'Autre'}</Badge>
                    </TableCell>
                    <TableCell>
                      {item.location ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
                          </span>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status || 'available')}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(item.id)}
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
              <p className="text-muted-foreground">Aucun article trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
