import { useState, useEffect } from 'react';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { KPICard } from '@/components/dashboard/KPICard';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';
import { TransactionAdminService, TransactionStats } from '@/services/api';

export default function TransactionsPage() {
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await TransactionAdminService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching transaction stats:', error);
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
        <h1 className="text-2xl font-bold">Transactions Ledger</h1>
        <p className="text-muted-foreground">Complete transaction history and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Total Transactions"
          value={stats?.totalTransactions || 0}
          icon={<Activity className="h-6 w-6" />}
        />
        <KPICard
          title="Completed"
          value={stats?.completedTransactions || 0}
          icon={<CheckCircle className="h-6 w-6" />}
          variant="success"
        />
        <KPICard
          title="Pending"
          value={stats?.pendingTransactions || 0}
          subtitle="Awaiting confirmation"
          icon={<Clock className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="Failed"
          value={stats?.failedTransactions || 0}
          icon={<XCircle className="h-6 w-6" />}
          variant="destructive"
        />
      </div>

      <TransactionsTable />
    </div>
  );
}
