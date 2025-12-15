import {
  Wallet,
  RefreshCw,
  MoreHorizontal,
  Copy,
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { WalletService } from '@/services/api';

const walletTypeBadge = (isCrypto: boolean) => {
  return isCrypto ? 'warning' : 'secondary';
};

const cryptoIcons: Record<string, string> = {
  BTC: '₿',
  ETH: 'Ξ',
  USDT: '₮',
  USDC: '$',
  XAF: 'FCFA'
};

export function WalletsTable() {
  const { data: wallets, isLoading, error, refetch } = useQuery({
    queryKey: ['wallets'],
    queryFn: WalletService.getAllWallets,
  });

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard",
    });
  };

  if (isLoading) return <div>Loading wallets...</div>;
  if (error) return <div>Error loading wallets: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            System Wallets
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Refresh Balances
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Currency</TableHead>
                <TableHead className="font-semibold">Address</TableHead>
                <TableHead className="font-semibold text-right">Balance</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wallets?.map((wallet: any) => (
                <TableRow key={wallet.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{wallet.user?.username || 'Unknown'}</span>
                      <span className="text-xs text-muted-foreground">{wallet.user?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm bg-muted text-foreground`}>
                        {cryptoIcons[wallet.currency?.symbol] || wallet.currency?.symbol?.[0]}
                      </div>
                      <span className="font-medium">{wallet.currency?.symbol}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded max-w-[200px] truncate">
                        {wallet.address}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => copyAddress(wallet.address)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    {Number(wallet.balance).toLocaleString()} {wallet.currency?.symbol}
                  </TableCell>
                  <TableCell>
                    <Badge variant={walletTypeBadge(wallet.currency?.is_crypto)}>
                      {wallet.currency?.is_crypto ? 'CRYPTO' : 'FIAT'}
                    </Badge>
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
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
