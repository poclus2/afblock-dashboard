import { DisputesTable } from '@/components/disputes/DisputesTable';
import { KPICard } from '@/components/dashboard/KPICard';
import { Scale, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { mockDisputes } from '@/data/mockData';

export default function DisputesPage() {
  const openDisputes = mockDisputes.filter(d => d.status === 'open');
  const inReview = mockDisputes.filter(d => d.status === 'in_review');
  const avgResolutionTime = '4.2h';
  const totalEscrowed = mockDisputes.reduce((sum, d) => sum + d.escrowedAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Disputes & Arbitration</h1>
        <p className="text-muted-foreground">Handle trade disputes and fund releases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Open Disputes"
          value={openDisputes.length}
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="In Review"
          value={inReview.length}
          subtitle="Being processed"
          icon={<Scale className="h-6 w-6" />}
        />
        <KPICard
          title="Avg Resolution"
          value={avgResolutionTime}
          subtitle="Time to resolve"
          icon={<Clock className="h-6 w-6" />}
          variant="success"
        />
        <KPICard
          title="Escrowed Funds"
          value={`${totalEscrowed.toLocaleString()}`}
          subtitle="In disputed trades"
          icon={<CheckCircle className="h-6 w-6" />}
          variant="destructive"
        />
      </div>

      <DisputesTable />
    </div>
  );
}
