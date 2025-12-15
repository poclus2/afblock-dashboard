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
import { kpiData } from '@/data/mockData';

const Index = () => {
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
          value={kpiData.totalUsers.toLocaleString()}
          subtitle={`${kpiData.verifiedUsersPercent}% verified`}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 12.5, label: 'vs last month' }}
        />
        <KPICard
          title="Custodial Funds"
          value={`${kpiData.totalCustodialFunds.BTC.toLocaleString()} BTC`}
          subtitle={`+${kpiData.totalCustodialFunds.ETH.toLocaleString()} ETH`}
          icon={<Wallet className="h-6 w-6" />}
          variant="success"
          trend={{ value: 8.3, label: 'growth' }}
        />
        <KPICard
          title="Daily Volume"
          value={`$${(kpiData.dailyVolume / 1000000).toFixed(2)}M`}
          subtitle="All crypto pairs"
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 23.1, label: 'vs yesterday' }}
        />
        <KPICard
          title="Platform Revenue"
          value={`$${kpiData.platformRevenue.toLocaleString()}`}
          subtitle="Trading fees collected"
          icon={<DollarSign className="h-6 w-6" />}
          variant="success"
          trend={{ value: 15.2, label: 'this week' }}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Pending Withdrawals"
          value={kpiData.pendingWithdrawals}
          subtitle="Awaiting processing"
          icon={<Clock className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="Open Disputes"
          value={kpiData.openDisputes}
          subtitle="Requires attention"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="destructive"
        />
        <KPICard
          title="Verified Rate"
          value={`${kpiData.verifiedUsersPercent}%`}
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
