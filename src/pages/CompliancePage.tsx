import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/dashboard/KPICard';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Globe, 
  FileText,
  Eye,
  Ban,
  CheckCircle
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const kycPending = [
  { id: 'KYC-001', user: 'Sofia Rodriguez', level: 'basic', submitted: '2h ago', documents: 3 },
  { id: 'KYC-002', user: 'New User 1', level: 'advanced', submitted: '5h ago', documents: 5 },
  { id: 'KYC-003', user: 'New User 2', level: 'full', submitted: '1d ago', documents: 8 },
];

const amlFlags = [
  { id: 'AML-001', user: 'Elena Petrova', type: 'Large Withdrawal', amount: '$25,000', risk: 'high' },
  { id: 'AML-002', user: 'Unknown', type: 'Multiple Small Deposits', amount: '$9,500', risk: 'medium' },
];

const suspiciousPatterns = [
  { pattern: 'Rapid buy/sell cycles', users: 3, severity: 'medium' },
  { pattern: 'Cross-border transfers', users: 7, severity: 'low' },
  { pattern: 'New account large deposits', users: 2, severity: 'high' },
];

export default function CompliancePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Compliance & Risk</h1>
        <p className="text-muted-foreground">KYC verification, AML monitoring, and risk management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="KYC Pending"
          value={kycPending.length}
          subtitle="Documents to review"
          icon={<FileText className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="AML Flags"
          value={amlFlags.length}
          subtitle="Active alerts"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="destructive"
        />
        <KPICard
          title="Verification Rate"
          value="68.5%"
          subtitle="Users verified"
          icon={<ShieldCheck className="h-6 w-6" />}
          variant="success"
        />
        <KPICard
          title="Geo Blocked"
          value="5"
          subtitle="Restricted regions"
          icon={<Globe className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KYC Pending */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending KYC Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Docs</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kycPending.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.id}</TableCell>
                      <TableCell className="font-medium">{item.user}</TableCell>
                      <TableCell>
                        <Badge variant="pending">{item.level}</Badge>
                      </TableCell>
                      <TableCell>{item.documents}</TableCell>
                      <TableCell className="text-muted-foreground">{item.submitted}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Eye className="h-3 w-3" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* AML Flags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              AML Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Alert ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amlFlags.map((flag) => (
                    <TableRow key={flag.id}>
                      <TableCell className="font-mono text-sm">{flag.id}</TableCell>
                      <TableCell className="font-medium">{flag.user}</TableCell>
                      <TableCell className="text-muted-foreground">{flag.type}</TableCell>
                      <TableCell className="font-mono">{flag.amount}</TableCell>
                      <TableCell>
                        <Badge variant={flag.risk === 'high' ? 'destructive' : 'warning'}>
                          {flag.risk}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-1 text-success">
                          <CheckCircle className="h-3 w-3" />
                          Clear
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 text-destructive">
                          <Ban className="h-3 w-3" />
                          Block
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suspicious Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Detected Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suspiciousPatterns.map((pattern, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-lg border ${
                  pattern.severity === 'high' ? 'border-destructive/50 bg-destructive/5' :
                  pattern.severity === 'medium' ? 'border-warning/50 bg-warning/5' :
                  'border-border bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={pattern.severity === 'high' ? 'destructive' : pattern.severity === 'medium' ? 'warning' : 'secondary'}>
                    {pattern.severity}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{pattern.users} users</span>
                </div>
                <p className="font-medium">{pattern.pattern}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
