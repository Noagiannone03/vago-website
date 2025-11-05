import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Bike,
  Package,
  Gift,
  FileText,
  Wrench,
  LogOut,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Button } from './ui/button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Trajets', href: '/trips', icon: Bike },
  { name: 'Articles', href: '/items', icon: Package },
  { name: 'Récompenses', href: '/rewards', icon: Gift },
  { name: 'Réclamations', href: '/claims', icon: FileText },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
];

export function Sidebar() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Bike className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Vago</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
