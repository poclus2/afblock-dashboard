import { useState, useEffect } from 'react';
import { UsersTable } from '@/components/users/UsersTable';
import { KPICard } from '@/components/dashboard/KPICard';
import { Users, ShieldCheck, AlertTriangle, Ban } from 'lucide-react';
import { AdminUserService, AdminUser } from '@/services/api';

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await AdminUserService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const verifiedUsers = users.filter(u => u.role === 'user').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

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
          title="Regular Users"
          value={verifiedUsers}
          subtitle={totalUsers > 0 ? `${((verifiedUsers / totalUsers) * 100).toFixed(1)}% of total` : '0%'}
          icon={<ShieldCheck className="h-6 w-6" />}
          variant="success"
        />
        <KPICard
          title="Admins"
          value={adminUsers}
          subtitle="Platform administrators"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="Frozen/Banned"
          value={0}
          icon={<Ban className="h-6 w-6" />}
          variant="destructive"
        />
      </div>

      <UsersTable users={users} />
    </div>
  );
}
