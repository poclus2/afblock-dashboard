import { useState, useEffect } from 'react';
import {
  Users,
  Wallet,
  TrendingUp,
  Clock,
  AlertTriangle,
  DollarSign,
  ShieldCheck
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { VolumeChart } from '@/components/dashboard/VolumeChart';
import { CryptoDistributionChart } from '@/components/dashboard/CryptoDistributionChart';
import { PlatformTypeChart } from '@/components/dashboard/PlatformTypeChart';
import { NewUsersChart } from '@/components/dashboard/NewUsersChart';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { StatsService, DashboardStats } from '@/services/api';

const Index = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await StatsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
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
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">Real-time platform metrics and alerts</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Users"
          value={stats?.totalUsers?.toLocaleString() || '0'}
          subtitle={`${stats?.verifiedUsersPercent || 0}% verified`}
          icon={<Users className="h-6 w-6" />}
        />
        <KPICard
          title="Custodial Funds"
          value="$0"
          subtitle="Coming soon"
          icon={<Wallet className="h-6 w-6" />}
          variant="success"
        />
        <KPICard
          title="Daily Volume"
          value={`$${((stats?.dailyVolume || 0) / 1000000).toFixed(2)}M`}
          subtitle="All crypto pairs"
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <KPICard
          title="Platform Revenue"
          value="$0"
          subtitle="Coming soon"
          icon={<DollarSign className="h-6 w-6" />}
          variant="success"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Pending Withdrawals"
          value={stats?.pendingWithdrawals || 0}
          subtitle="Awaiting processing"
          icon={<Clock className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="Open Disputes"
          value={stats?.openDisputes || 0}
          subtitle="Requires attention"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="destructive"
        />
        <KPICard
          title="Verified Rate"
          value={`${stats?.verifiedUsersPercent || 0}%`}
          subtitle="KYC completion"
          icon={<ShieldCheck className="h-6 w-6" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VolumeChart />
        <CryptoDistributionChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PlatformTypeChart />
        <NewUsersChart />
        <AlertsPanel />
      </div>
    </div>
  );
};

export default Index;
