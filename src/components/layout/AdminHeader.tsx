import { Bell, Search, Moon, Sun, ChevronDown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { mockAlerts } from '@/data/mockData';

const roles = [
  { id: 'super_admin', label: 'Super Admin', icon: '👑' },
  { id: 'admin_finance', label: 'Admin Finance', icon: '💰' },
  { id: 'admin_compliance', label: 'Admin Compliance', icon: '📋' },
  { id: 'support_client', label: 'Support Client', icon: '🎧' },
  { id: 'admin_marketplace', label: 'Admin Marketplace', icon: '🏪' },
];

export function AdminHeader() {
  const { theme, toggleTheme } = useTheme();
  const unreadAlerts = mockAlerts.filter(a => !a.read).length;

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users, transactions, orders..." 
              className="pl-10 bg-background/50 border-border/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Role Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="hidden sm:inline">Super Admin</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roles.map(role => (
                <DropdownMenuItem key={role.id} className="gap-2">
                  <span>{role.icon}</span>
                  <span>{role.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center animate-pulse">
                    {unreadAlerts}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary">{unreadAlerts} new</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockAlerts.slice(0, 4).map(alert => (
                <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2 w-full">
                    <span className={`h-2 w-2 rounded-full ${
                      alert.type === 'critical' ? 'bg-destructive' :
                      alert.type === 'warning' ? 'bg-warning' : 'bg-primary'
                    }`} />
                    <span className="font-medium text-sm">{alert.title}</span>
                    {!alert.read && <Badge variant="pending" className="ml-auto text-xs">New</Badge>}
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-1">{alert.message}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin Avatar */}
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">SA</span>
          </div>
        </div>
      </div>
    </header>
  );
}
