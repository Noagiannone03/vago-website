import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Trash2, Download, Upload, RefreshCw } from 'lucide-react';

export function MaintenancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
        <p className="text-muted-foreground mt-2">
          Outils de maintenance et gestion de la base de données
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Base de données
            </CardTitle>
            <CardDescription>
              Gérez les données de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser les données
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Exporter les données
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Importer les données
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Nettoyage
            </CardTitle>
            <CardDescription>
              Supprimez les données obsolètes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              Nettoyer les trajets anciens
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Supprimer les articles récupérés
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <Trash2 className="w-4 h-4 mr-2" />
              Réinitialiser toutes les données
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Espace utilisé</p>
              <p className="text-2xl font-bold">2.4 GB</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Dernière sauvegarde</p>
              <p className="text-2xl font-bold">Il y a 2h</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Santé du système</p>
              <p className="text-2xl font-bold text-green-600">Excellent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
