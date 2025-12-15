import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/dashboard/KPICard';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Wallet
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VolumeChart } from '@/components/dashboard/VolumeChart';
import { CryptoDistributionChart } from '@/components/dashboard/CryptoDistributionChart';
import { NewUsersChart } from '@/components/dashboard/NewUsersChart';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">Platform performance metrics and exports</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="7d">
            <SelectTrigger className="w-36">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value="$125,430"
          subtitle="Trading fees"
          icon={<DollarSign className="h-6 w-6" />}
          trend={{ value: 15.2, label: 'vs last period' }}
          variant="success"
        />
        <KPICard
          title="Trading Volume"
          value="$13.2M"
          subtitle="All pairs"
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 23.1, label: 'vs last period' }}
        />
        <KPICard
          title="Active Users"
          value="8,234"
          subtitle="Traded this period"
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 8.5, label: 'vs last period' }}
        />
        <KPICard
          title="Avg Transaction"
          value="$1,602"
          subtitle="Per trade"
          icon={<Wallet className="h-6 w-6" />}
          trend={{ value: -2.3, label: 'vs last period' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VolumeChart />
        <CryptoDistributionChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NewUsersChart />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Trading Fees', amount: '$78,250', percent: 62.4 },
                { name: 'P2P Fees', amount: '$32,180', percent: 25.7 },
                { name: 'Marketplace Fees', amount: '$12,500', percent: 10.0 },
                { name: 'Withdrawal Fees', amount: '$2,500', percent: 1.9 },
              ].map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.amount}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
