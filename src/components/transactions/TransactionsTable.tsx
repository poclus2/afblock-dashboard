import { useState } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Repeat, 
  ShoppingBag,
  Search,
  Filter,
  ExternalLink,
  RotateCcw,
  XCircle
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
import { mockTransactions } from '@/data/mockData';
import { Transaction } from '@/types/crypto';
import { formatDistanceToNow } from 'date-fns';

const typeIcons: Record<string, JSX.Element> = {
  deposit: <ArrowDownLeft className="h-4 w-4 text-success" />,
  withdrawal: <ArrowUpRight className="h-4 w-4 text-destructive" />,
  p2p_buy: <Repeat className="h-4 w-4 text-primary" />,
  p2p_sell: <Repeat className="h-4 w-4 text-warning" />,
  marketplace: <ShoppingBag className="h-4 w-4 text-accent-foreground" />,
  transfer: <ArrowUpRight className="h-4 w-4 text-muted-foreground" />,
  fee: <ArrowUpRight className="h-4 w-4 text-muted-foreground" />,
};

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case 'completed': return 'completed';
    case 'confirming': return 'processing';
    case 'pending': return 'pending';
    case 'failed': return 'failed';
    case 'cancelled': return 'secondary';
    default: return 'secondary';
  }
};

export function TransactionsTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.txHash?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Transaction Ledger</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search TX, user, hash..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                <SelectItem value="p2p_buy">P2P Buy</SelectItem>
                <SelectItem value="p2p_sell">P2P Sell</SelectItem>
                <SelectItem value="marketplace">Marketplace</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirming">Confirming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">TX ID</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold text-right">Amount</TableHead>
                <TableHead className="font-semibold text-right">Fee</TableHead>
                <TableHead className="font-semibold">Network</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Confirmations</TableHead>
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {typeIcons[tx.type]}
                      <span className="capitalize text-sm">{tx.type.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{tx.userName}</span>
                      <span className="text-xs text-muted-foreground">{tx.userId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <span className={tx.type === 'deposit' || tx.type === 'p2p_buy' ? 'text-success' : ''}>
                      {tx.amount.toLocaleString()} {tx.crypto}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground text-sm">
                    {tx.fee} {tx.crypto}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tx.network}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(tx.status)}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${(tx.confirmations / tx.requiredConfirmations) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {tx.confirmations}/{tx.requiredConfirmations}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {tx.txHash && (
                        <Button variant="ghost" size="icon-sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                      {tx.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="icon-sm">
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" className="text-destructive">
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
