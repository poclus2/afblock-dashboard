import { 
  Scale, 
  Clock, 
  MessageSquare,
  Paperclip,
  Send,
  RotateCcw,
  Split
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { mockDisputes } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case 'open': return 'warning';
    case 'in_review': return 'processing';
    case 'resolved': return 'completed';
    case 'escalated': return 'destructive';
    default: return 'secondary';
  }
};

const formatSLA = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
};

export function DisputesTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Active Disputes
          </CardTitle>
          <Badge variant="warning">{mockDisputes.length} Open</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Dispute ID</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Party A</TableHead>
                <TableHead className="font-semibold">Party B</TableHead>
                <TableHead className="font-semibold text-right">Amount</TableHead>
                <TableHead className="font-semibold text-right">Escrowed</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">SLA Timer</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDisputes.map((dispute) => (
                <TableRow key={dispute.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-sm">{dispute.id}</TableCell>
                  <TableCell>
                    <Badge variant={dispute.type === 'p2p' ? 'escrowed' : 'secondary'}>
                      {dispute.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{dispute.partyA}</TableCell>
                  <TableCell className="font-medium">{dispute.partyB}</TableCell>
                  <TableCell className="text-right font-mono">
                    {dispute.amount.toLocaleString()} {dispute.crypto}
                  </TableCell>
                  <TableCell className="text-right font-mono text-warning">
                    {dispute.escrowedAmount.toLocaleString()} {dispute.crypto}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(dispute.status)}>
                      {dispute.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className={`h-4 w-4 ${dispute.slaTimer < 7200 ? 'text-destructive' : 'text-warning'}`} />
                      <span className={`font-mono text-sm ${dispute.slaTimer < 7200 ? 'text-destructive' : ''}`}>
                        {formatSLA(dispute.slaTimer)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs text-success">
                        <Send className="h-3 w-3" />
                        Release
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs text-warning">
                        <RotateCcw className="h-3 w-3" />
                        Refund
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                        <Split className="h-3 w-3" />
                        Split
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
