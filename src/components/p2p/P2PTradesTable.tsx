import { useState } from 'react';
import { 
  Clock, 
  XCircle, 
  Send, 
  RotateCcw,
  AlertTriangle,
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { mockP2PTrades } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';

const escrowBadgeVariant = (status: string) => {
  switch (status) {
    case 'funded': return 'escrowed';
    case 'pending': return 'pending';
    case 'released': return 'completed';
    case 'refunded': return 'warning';
    case 'disputed': return 'failed';
    default: return 'secondary';
  }
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function P2PTradesTable() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrades = mockP2PTrades.filter(trade => 
    trade.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trade.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trade.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Active P2P Trades</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search trades..." 
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
                <TableHead className="font-semibold">Trade ID</TableHead>
                <TableHead className="font-semibold">Seller</TableHead>
                <TableHead className="font-semibold">Buyer</TableHead>
                <TableHead className="font-semibold">Crypto</TableHead>
                <TableHead className="font-semibold text-right">Amount</TableHead>
                <TableHead className="font-semibold text-right">Fiat</TableHead>
                <TableHead className="font-semibold">Payment</TableHead>
                <TableHead className="font-semibold">Escrow</TableHead>
                <TableHead className="font-semibold">Time Left</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map((trade) => (
                <TableRow key={trade.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-sm">{trade.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{trade.sellerName}</span>
                      <span className="text-xs text-muted-foreground">{trade.sellerId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{trade.buyerName}</span>
                      <span className="text-xs text-muted-foreground">{trade.buyerId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{trade.crypto}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {trade.amount.toLocaleString()} {trade.crypto}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    €{trade.fiatAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm">{trade.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge variant={escrowBadgeVariant(trade.escrowStatus)}>
                      {trade.escrowStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {trade.timeRemaining ? (
                      <div className="flex items-center gap-2 text-warning">
                        <Clock className="h-4 w-4" />
                        <span className="font-mono text-sm">{formatTime(trade.timeRemaining)}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <XCircle className="h-3 w-3" />
                        Cancel
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs text-success">
                        <Send className="h-3 w-3" />
                        Release
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs text-warning">
                        <RotateCcw className="h-3 w-3" />
                        Refund
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        Penalize
                      </Button>
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
