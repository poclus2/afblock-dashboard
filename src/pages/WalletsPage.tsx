import { WalletsTable } from '@/components/wallets/WalletsTable';
import { KPICard } from '@/components/dashboard/KPICard';
import { Wallet, Lock, Flame, Snowflake } from 'lucide-react';
import { mockWallets } from '@/data/mockData';

export default function WalletsPage() {
  const hotWallets = mockWallets.filter(w => w.type === 'hot');
  const coldWallets = mockWallets.filter(w => w.type === 'cold');
  const escrowWallets = mockWallets.filter(w => w.type === 'escrow');
  
  const totalBalance = mockWallets.reduce((sum, w) => sum + w.balance, 0);
  const totalLocked = mockWallets.reduce((sum, w) => sum + w.lockedBalance, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Wallet Infrastructure</h1>
        <p className="text-muted-foreground">Manage custodial wallets, balances, and transfers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Hot Wallets"
          value={hotWallets.length}
          subtitle="Active trading wallets"
          icon={<Flame className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="Cold Storage"
          value={coldWallets.length}
          subtitle="Secure long-term storage"
          icon={<Snowflake className="h-6 w-6" />}
          variant="success"
        />
        <KPICard
          title="Escrow Wallets"
          value={escrowWallets.length}
          subtitle="P2P & marketplace holds"
          icon={<Lock className="h-6 w-6" />}
        />
        <KPICard
          title="Total Locked"
          value={`${totalLocked.toLocaleString()}`}
          subtitle="Across all wallets"
          icon={<Wallet className="h-6 w-6" />}
          variant="warning"
        />
      </div>

      <WalletsTable />
    </div>
  );
}
