import { useState, useEffect } from 'react';
import { UsersTable } from '@/components/users/UsersTable';
import { KPICard } from '@/components/dashboard/KPICard';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Ban,
  Building,
  MoreHorizontal,
  Eye,
  Trash2,
  Wallet
} from 'lucide-react';
import { AdminUserService, AdminUser, BusinessUserService, BusinessUser } from '@/services/api';
import { AddFundModal } from '@/components/users/AddFundModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState('individual');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [businessUsers, setBusinessUsers] = useState<BusinessUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<BusinessUser | null>(null);
  const [userToView, setUserToView] = useState<BusinessUser | null>(null);
  const [userToAddFund, setUserToAddFund] = useState<BusinessUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'individual') {
        const data = await AdminUserService.getAllUsers();
        setUsers(data);
      } else {
        const data = await BusinessUserService.getAllBusinessUsers();
        setBusinessUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBusinessUser = async () => {
    if (!userToDelete) return;
    try {
      await BusinessUserService.deleteBusinessUser(userToDelete.id);
      toast({
        title: "User deleted",
        description: `Business user for ${userToDelete.enterprise?.company_name} has been deleted.`,
      });
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive"
      });
    } finally {
      setUserToDelete(null);
    }
  };

  const totalUsers = activeTab === 'individual' ? users.length : businessUsers.length;

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
          icon={activeTab === 'individual' ? <Users className="h-6 w-6" /> : <Building className="h-6 w-6" />}
        />
        {/* Simplified stats for now */}
      </div>

      <Tabs defaultValue="individual" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="individual">Individual Users</TabsTrigger>
          <TabsTrigger value="business">Business Users</TabsTrigger>
        </TabsList>
        <TabsContent value="individual">
          {loading ? <div>Loading...</div> : <UsersTable users={users} />}
        </TabsContent>
        <TabsContent value="business">
          {loading ? <div>Loading...</div> : (
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="p-4 text-left font-medium">Company</th>
                    <th className="p-4 text-left font-medium">Email</th>
                    <th className="p-4 text-left font-medium">Country</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Created</th>
                    <th className="p-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businessUsers.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No business users found</td></tr>
                  ) : (
                    businessUsers.map(u => (
                      <tr key={u.id} className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">{u.enterprise?.company_name || 'N/A'}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">{u.enterprise?.country}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${u.enterprise?.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                            u.enterprise?.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                              u.enterprise?.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700' // ONBOARDING or Default
                            }`}>
                            {u.enterprise?.status}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setUserToView(u)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setUserToAddFund(u)}>
                                <Wallet className="mr-2 h-4 w-4" />
                                Add Funds
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setUserToDelete(u)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the account for
              <strong> {userToDelete?.enterprise?.company_name} </strong>
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBusinessUser} className="bg-destructive hover:bg-destructive/90">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Profile Modal */}
      <Dialog open={!!userToView} onOpenChange={(open) => !open && setUserToView(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Business Profile</DialogTitle>
            <DialogDescription>
              User ID: {userToView?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Company Name</h4>
                <div className="p-2 border rounded-md bg-muted/50 text-sm">
                  {userToView?.enterprise?.company_name}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Country</h4>
                <div className="p-2 border rounded-md bg-muted/50 text-sm">
                  {userToView?.enterprise?.country}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Email</h4>
                <div className="p-2 border rounded-md bg-muted/50 text-sm">
                  {userToView?.email}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Role</h4>
                <div className="p-2 border rounded-md bg-muted/50 text-sm">
                  {userToView?.role}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Status</h4>
                <div className="p-2 border rounded-md bg-muted/50 text-sm">
                  {userToView?.enterprise?.status}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Join Date</h4>
                <div className="p-2 border rounded-md bg-muted/50 text-sm">
                  {userToView ? new Date(userToView.created_at).toLocaleString() : ''}
                </div>
              </div>
            </div>
            {/* Add more sections as needed */}
          </div>
        </DialogContent >
      </Dialog >

      {userToAddFund && (
        <AddFundModal
          isOpen={!!userToAddFund}
          onClose={() => setUserToAddFund(null)}
          userId={userToAddFund.id}
          userName={userToAddFund.enterprise?.company_name || 'Business User'}
        />
      )}
    </div >
  );
}
