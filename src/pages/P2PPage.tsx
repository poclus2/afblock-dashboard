import { P2PTradesTable } from '@/components/p2p/P2PTradesTable';
import { KPICard } from '@/components/dashboard/KPICard';
import { Repeat, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { mockP2PTrades } from '@/data/mockData';

export default function P2PPage() {
  const activeTrades = mockP2PTrades.filter(t => t.escrowStatus === 'funded' || t.escrowStatus === 'pending');
  const escrowedAmount = mockP2PTrades
    .filter(t => t.escrowStatus === 'funded')
    .reduce((sum, t) => sum + t.amount, 0);
  const disputed = mockP2PTrades.filter(t => t.escrowStatus === 'disputed');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">P2P Exchange</h1>
        <p className="text-muted-foreground">Manage peer-to-peer trades and escrow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Active Trades"
          value={activeTrades.length}
          icon={<Repeat className="h-6 w-6" />}
        />
        <KPICard
          title="In Escrow"
          value={`${escrowedAmount.toLocaleString()}`}
          subtitle="Crypto locked in trades"
          icon={<Lock className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="Disputed"
          value={disputed.length}
          subtitle="Requires arbitration"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="destructive"
        />
        <KPICard
          title="Success Rate"
          value="94.5%"
          subtitle="Last 30 days"
          icon={<CheckCircle className="h-6 w-6" />}
          variant="success"
        />
      </div>

      <P2PTradesTable />
    </div>
  );
}
