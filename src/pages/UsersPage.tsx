import { UsersTable } from '@/components/users/UsersTable';
import { KPICard } from '@/components/dashboard/KPICard';
import { Users, ShieldCheck, AlertTriangle, Ban } from 'lucide-react';
import { mockUsers } from '@/data/mockData';

export default function UsersPage() {
  const totalUsers = mockUsers.length;
  const verifiedUsers = mockUsers.filter(u => u.verified).length;
  const highRiskUsers = mockUsers.filter(u => u.riskScore === 'high' || u.riskScore === 'critical').length;
  const frozenUsers = mockUsers.filter(u => u.status === 'frozen' || u.status === 'banned').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage platform users, KYC, and account status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          icon={<Users className="h-6 w-6" />}
        />
        <KPICard
          title="Verified Users"
          value={verifiedUsers}
          subtitle={`${((verifiedUsers / totalUsers) * 100).toFixed(1)}% of total`}
          icon={<ShieldCheck className="h-6 w-6" />}
          variant="success"
        />
        <KPICard
          title="High Risk"
          value={highRiskUsers}
          subtitle="Requires monitoring"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="Frozen/Banned"
          value={frozenUsers}
          icon={<Ban className="h-6 w-6" />}
          variant="destructive"
        />
      </div>

      <UsersTable />
    </div>
  );
}
