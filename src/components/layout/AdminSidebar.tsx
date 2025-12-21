import { useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Wallet,
  ArrowLeftRight,
  Repeat,
  ShoppingBag,
  Scale,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bitcoin,
  Construction
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { AuthService } from '@/services/api';
import { LogOut } from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  comingSoon?: boolean;
}

const navigationItems: NavigationItem[] = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Wallet Infrastructure', href: '/wallets', icon: Wallet },
  { name: 'Transactions Ledger', href: '/transactions', icon: ArrowLeftRight },
  { name: 'P2P Exchange', href: '/p2p', icon: Repeat, comingSoon: true },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag, comingSoon: true },
  { name: 'Disputes & Arbitration', href: '/disputes', icon: Scale, comingSoon: true },
  { name: 'Compliance & Risk', href: '/compliance', icon: ShieldCheck, comingSoon: true },
  { name: 'Analytics & Reports', href: '/analytics', icon: BarChart3, comingSoon: true },
  { name: 'System Configuration', href: '/settings', icon: Settings },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleComingSoonClick = (e: React.MouseEvent, itemName: string) => {
    e.preventDefault();
    toast({
      title: "🚧 Coming Soon",
      description: `${itemName} is currently under development and will be available soon.`,
    });
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Ensure local cleanup happens even if API call fails
      localStorage.removeItem('auth_token');
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-50 flex flex-col",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Bitcoin className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sidebar-foreground">Afblock</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;

            if (item.comingSoon) {
              return (
                <li key={item.name}>
                  <button
                    onClick={(e) => handleComingSoonClick(e, item.name)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      "text-muted-foreground hover:bg-sidebar-accent cursor-pointer opacity-70"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                    {!collapsed && (
                      <>
                        <span className="font-medium text-sm truncate">{item.name}</span>
                        <Construction className="h-3 w-3 ml-auto text-warning" />
                      </>
                    )}
                  </button>
                </li>
              );
            }

            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
                    isActive && "text-primary-foreground"
                  )} />
                  {!collapsed && (
                    <span className="font-medium text-sm truncate">{item.name}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="px-3 pb-2">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
            "text-destructive hover:bg-destructive/10 cursor-pointer"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110" />
          {!collapsed && (
            <span className="font-medium text-sm truncate">Logout</span>
          )}
        </button>
      </div>

      {/* Collapse Button */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-2">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
