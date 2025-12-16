import { useState } from 'react';
import {
  Eye,
  Lock,
  Snowflake,
  RefreshCw,
  Ban,
  MoreHorizontal,
  ArrowUpDown,
  Search
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AdminUser } from '@/services/api';
import { format } from 'date-fns';

interface UsersTableProps {
  users: AdminUser[];
}

const roleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin': return 'verified';
    case 'user': return 'success';
    default: return 'warning';
  }
};

export function UsersTable({ users }: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user =>
    (user.userMeta?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    (user.userMeta?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toString().includes(searchQuery)
  );

  const getUserName = (user: AdminUser) => {
    if (user.userMeta?.first_name || user.userMeta?.last_name) {
      return `${user.userMeta.first_name || ''} ${user.userMeta.last_name || ''}`.trim();
    }
    return user.username || user.email.split('@')[0];
  };

  const getInitials = (user: AdminUser) => {
    const name = getUserName(user);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getTotalBalance = (user: AdminUser) => {
    if (!user.wallets || user.wallets.length === 0) return 0;
    return user.wallets.reduce((sum, w) => sum + Number(w.balance || 0), 0);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Users</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">
                  <Button variant="ghost" size="sm" className="gap-1 -ml-3">
                    ID
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold text-right">Balance</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-sm">{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {getInitials(user)}
                          </span>
                        </div>
                        <span className="font-medium">{getUserName(user)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleBadgeVariant(user.role || 'unknown')}>
                        {(user.role || 'unknown').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${getTotalBalance(user).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {user.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Snowflake className="h-4 w-4" />
                            Freeze Account
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Lock className="h-4 w-4" />
                            Freeze Funds
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Force KYC Review
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                            <Ban className="h-4 w-4" />
                            Ban User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
