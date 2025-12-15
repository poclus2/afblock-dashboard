import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames: Record<string, string> = {
  '': 'Overview',
  'users': 'Users',
  'wallets': 'Wallet Infrastructure',
  'transactions': 'Transactions Ledger',
  'p2p': 'P2P Exchange',
  'marketplace': 'Marketplace',
  'disputes': 'Disputes & Arbitration',
  'compliance': 'Compliance & Risk',
  'analytics': 'Analytics & Reports',
  'settings': 'System Configuration',
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link 
        to="/" 
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
      
      {pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;
        
        return (
          <div key={path} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="text-foreground font-medium">
                {routeNames[segment] || segment}
              </span>
            ) : (
              <Link 
                to={path}
                className="hover:text-foreground transition-colors"
              >
                {routeNames[segment] || segment}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
