import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  DollarSign, 
  Bitcoin, 
  Shield, 
  Bell,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">System Configuration</h1>
        <p className="text-muted-foreground">Platform settings, fees, and permissions</p>
      </div>

      <Tabs defaultValue="fees" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="fees" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Fees
          </TabsTrigger>
          <TabsTrigger value="cryptos" className="gap-2">
            <Bitcoin className="h-4 w-4" />
            Cryptos
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fees" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Fees</CardTitle>
                <CardDescription>Deposit and withdrawal fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Deposit Fee (%)</Label>
                  <Input type="number" defaultValue="0" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Withdrawal Fee (%)</Label>
                  <Input type="number" defaultValue="0.1" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Min Withdrawal (USD)</Label>
                  <Input type="number" defaultValue="10" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>P2P Fees</CardTitle>
                <CardDescription>Peer-to-peer trading fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Maker Fee (%)</Label>
                  <Input type="number" defaultValue="0.1" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Taker Fee (%)</Label>
                  <Input type="number" defaultValue="0.15" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label>Escrow Lock Time (min)</Label>
                  <Input type="number" defaultValue="60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marketplace Fees</CardTitle>
                <CardDescription>Product sales fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Seller Fee (%)</Label>
                  <Input type="number" defaultValue="2.5" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Buyer Fee (%)</Label>
                  <Input type="number" defaultValue="0" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Listing Fee (USD)</Label>
                  <Input type="number" defaultValue="0" />
                </div>
              </CardContent>
            </Card>
          </div>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Fee Configuration
          </Button>
        </TabsContent>

        <TabsContent value="cryptos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supported Cryptocurrencies</CardTitle>
              <CardDescription>Enable or disable crypto assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { symbol: 'BTC', name: 'Bitcoin', network: 'Bitcoin Mainnet', enabled: true },
                  { symbol: 'ETH', name: 'Ethereum', network: 'Ethereum Mainnet', enabled: true },
                  { symbol: 'USDT', name: 'Tether', network: 'ERC-20 / TRC-20', enabled: true },
                  { symbol: 'USDC', name: 'USD Coin', network: 'ERC-20', enabled: true },
                  { symbol: 'BNB', name: 'BNB', network: 'BNB Chain', enabled: false },
                  { symbol: 'SOL', name: 'Solana', network: 'Solana Mainnet', enabled: false },
                ].map((crypto) => (
                  <div key={crypto.symbol} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                        {crypto.symbol[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{crypto.name}</span>
                          <Badge variant="secondary">{crypto.symbol}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{crypto.network}</span>
                      </div>
                    </div>
                    <Switch defaultChecked={crypto.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Roles</CardTitle>
              <CardDescription>Configure role permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { role: 'Super Admin', permissions: ['All Access'], color: 'destructive' },
                  { role: 'Admin Finance', permissions: ['Wallets', 'Transactions', 'Analytics'], color: 'warning' },
                  { role: 'Admin Compliance', permissions: ['Users', 'KYC', 'AML', 'Disputes'], color: 'success' },
                  { role: 'Support Client', permissions: ['Users (Read)', 'Disputes'], color: 'secondary' },
                  { role: 'Admin Marketplace', permissions: ['Products', 'Orders', 'Sellers'], color: 'default' },
                ].map((item) => (
                  <div key={item.role} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.role}</span>
                        <Badge variant={item.color as any}>{item.permissions.length} permissions</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {item.permissions.map((p) => (
                          <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Configure email alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'New user registration', enabled: true },
                  { label: 'Large withdrawal requests', enabled: true },
                  { label: 'New disputes opened', enabled: true },
                  { label: 'KYC submissions', enabled: false },
                  { label: 'Daily summary report', enabled: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <Switch defaultChecked={item.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>External integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input placeholder="https://your-domain.com/webhook" />
                </div>
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <Input type="password" placeholder="••••••••••••" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enable webhooks</span>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
