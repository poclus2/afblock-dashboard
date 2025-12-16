import { useState, useEffect } from 'react';
import { WalletsTable } from '@/components/wallets/WalletsTable';
import { KPICard } from '@/components/dashboard/KPICard';
import { Wallet, Users, DollarSign, Coins } from 'lucide-react';
import { WalletService, WalletStats } from '@/services/api';

export default function WalletsPage() {
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await WalletService.getWalletStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching wallet stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Wallet Infrastructure</h1>
        <p className="text-muted-foreground">Manage user wallets, balances, and currencies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Total Wallets"
          value={stats?.totalWallets || 0}
          subtitle={`${stats?.activeUsers || 0} active users`}
          icon={<Wallet className="h-6 w-6" />}
        />
        <KPICard
          title="Crypto Wallets"
          value={stats?.cryptoWallets || 0}
          subtitle="USDT + USDC"
          icon={<Coins className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="Fiat Wallets"
          value={stats?.fiatWallets || 0}
          subtitle="XAF"
          icon={<DollarSign className="h-6 w-6" />}
          variant="success"
        />
        <KPICard
          title="Active Users"
          value={stats?.activeUsers || 0}
          subtitle="With wallets"
          icon={<Users className="h-6 w-6" />}
        />
      </div>

      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Total USDT"
          value={`${(stats?.totalUSDT || 0).toLocaleString()} USDT`}
          subtitle="Tether balance"
          icon={<span className="text-lg font-bold">₮</span>}
        />
        <KPICard
          title="Total USDC"
          value={`${(stats?.totalUSDC || 0).toLocaleString()} USDC`}
          subtitle="USD Coin balance"
          icon={<span className="text-lg font-bold">$</span>}
        />
        <KPICard
          title="Total XAF"
          value={`${(stats?.totalXAF || 0).toLocaleString()} XAF`}
          subtitle="CFA Franc balance"
          icon={<span className="text-lg font-bold">FCFA</span>}
        />
      </div>

      <WalletsTable />
    </div>
  );
}
