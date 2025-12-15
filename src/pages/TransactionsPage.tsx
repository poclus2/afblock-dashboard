import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { KPICard } from '@/components/dashboard/KPICard';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';
import { mockTransactions } from '@/data/mockData';

export default function TransactionsPage() {
  const deposits = mockTransactions.filter(t => t.type === 'deposit');
  const withdrawals = mockTransactions.filter(t => t.type === 'withdrawal');
  const pending = mockTransactions.filter(t => t.status === 'pending' || t.status === 'confirming');
  const completed = mockTransactions.filter(t => t.status === 'completed');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Transactions Ledger</h1>
        <p className="text-muted-foreground">Complete transaction history and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Deposits Today"
          value={deposits.length}
          icon={<ArrowDownLeft className="h-6 w-6" />}
          variant="success"
        />
        <KPICard
          title="Withdrawals Today"
          value={withdrawals.length}
          icon={<ArrowUpRight className="h-6 w-6" />}
        />
        <KPICard
          title="Pending"
          value={pending.length}
          subtitle="Awaiting confirmation"
          icon={<Clock className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="Completed"
          value={completed.length}
          icon={<CheckCircle className="h-6 w-6" />}
          variant="success"
        />
      </div>

      <TransactionsTable />
    </div>
  );
}
