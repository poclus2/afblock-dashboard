import { useState, useEffect } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Repeat,
  Search,
  RefreshCw,
  Eye
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TransactionAdminService, AdminTransaction } from '@/services/api';
import { formatDistanceToNow } from 'date-fns';

const typeIcons: Record<string, JSX.Element> = {
  'Send Crypto': <ArrowUpRight className="h-4 w-4 text-destructive" />,
  'Receive Crypto': <ArrowDownLeft className="h-4 w-4 text-success" />,
  'Conversion': <Repeat className="h-4 w-4 text-primary" />,
  'Deposit Fiat': <ArrowDownLeft className="h-4 w-4 text-success" />,
  'Withdraw Fiat': <ArrowUpRight className="h-4 w-4 text-warning" />,
};

const statusBadgeVariant = (statusName: string) => {
  switch (statusName?.toLowerCase()) {
    case 'completed': return 'completed';
    case 'new': return 'pending';
    case 'in progress': return 'processing';
    case 'rejected':
    case 'cancelled': return 'failed';
    default: return 'secondary';
  }
};

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await TransactionAdminService.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch =
      tx.id.toString().includes(searchQuery) ||
      (tx.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (tx.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || tx.transactionStatus?.name?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading transactions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Transaction Ledger</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ID, user..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-2" onClick={fetchTransactions}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold text-right">Amount</TableHead>
                <TableHead className="font-semibold">Currency</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx) => (
                  <TableRow key={tx.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {typeIcons[tx.transactionType?.name || ''] || <Repeat className="h-4 w-4" />}
                        <span className="text-sm">{tx.transactionType?.name || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{tx.user?.username || 'Unknown'}</span>
                        <span className="text-xs text-muted-foreground">{tx.user?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {Number(tx.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{tx.startCurrency?.symbol || '-'}</span>
                      {tx.endCurrency?.symbol && tx.endCurrency.symbol !== tx.startCurrency?.symbol && (
                        <span className="text-muted-foreground"> → {tx.endCurrency.symbol}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(tx.transactionStatus?.name || '')}>
                        {tx.transactionStatus?.name || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {tx.created_at ? formatDistanceToNow(new Date(tx.created_at), { addSuffix: true }) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm">
                        <Eye className="h-4 w-4" />
                      </Button>
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
