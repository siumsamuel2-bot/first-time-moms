import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Role } from '@firstweeks/shared';
import {
  Calendar,
  ClipboardList,
  Heart,
  Home,
  LogOut,
  Shield,
  Stethoscope,
  User,
  Users,
} from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

export function Layout() {
  const { user, logout } = useAuth();
  const isClinician = user?.role === Role.CLINICIAN || user?.role === Role.ADMIN;

  const navItems = isClinician
    ? [
        { path: '/clinician', label: 'Dashboard', icon: Stethoscope },
        { path: '/clinician/patients', label: 'Patients', icon: ClipboardList },
      ]
    : [
        { path: '/dashboard', label: 'Today', icon: Home },
        { path: '/check-in', label: 'Check-in', icon: Heart },
        { path: '/history', label: 'History', icon: Calendar },
        { path: '/providers', label: 'Providers', icon: Shield },
        { path: '/referrals', label: 'Referrals', icon: Users },
        { path: '/profile', label: 'Profile', icon: User },
      ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <NavLink
            to={isClinician ? '/clinician' : '/dashboard'}
            className="flex items-center gap-2 text-xl font-bold text-primary-600"
          >
            <span className="text-2xl">🌱</span>
            <span>Firstweeks</span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.email} alt={user?.email ?? ''} />
                    <AvatarFallback>{user?.email?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user?.role?.toLowerCase()}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-20 safe-area-inset-bottom">
        <Outlet />
      </main>
    </div>
  );
}
