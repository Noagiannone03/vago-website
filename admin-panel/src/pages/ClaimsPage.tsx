import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Claim {
  id: string;
  userId: string;
  rewardId: string;
  rewardName?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
}

export function ClaimsPage() {
  const queryClient = useQueryClient();

  const { data: claims, isLoading } = useQuery({
    queryKey: ['claims'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, 'reward_claims'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Claim[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await updateDoc(doc(db, 'reward_claims', id), { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default">En attente</Badge>;
      case 'approved':
        return <Badge variant="success">Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejetée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Réclamations</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les demandes de récompenses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des réclamations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : claims && claims.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Utilisateur</TableHead>
                  <TableHead>ID Récompense</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-mono text-xs">
                      {claim.userId.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {claim.rewardId.substring(0, 8)}...
                    </TableCell>
                    <TableCell>{getStatusBadge(claim.status)}</TableCell>
                    <TableCell>
                      {claim.createdAt
                        ? format(claim.createdAt.toDate(), 'dd MMM yyyy HH:mm', { locale: fr })
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {claim.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: claim.id,
                                status: 'approved',
                              })
                            }
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: claim.id,
                                status: 'rejected',
                              })
                            }
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucune réclamation trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
