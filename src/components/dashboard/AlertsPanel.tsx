import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockAlerts } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';

export function AlertsPanel() {
  const alertIcons = {
    critical: <AlertTriangle className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  };

  const alertStyles = {
    critical: 'border-destructive/50 bg-destructive/5',
    warning: 'border-warning/50 bg-warning/5',
    info: 'border-primary/50 bg-primary/5',
  };

  const iconStyles = {
    critical: 'text-destructive',
    warning: 'text-warning',
    info: 'text-primary',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Critical Alerts
        </CardTitle>
        <Badge variant="destructive">{mockAlerts.filter(a => !a.read).length} Active</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockAlerts.map(alert => (
          <div 
            key={alert.id}
            className={`p-4 rounded-lg border ${alertStyles[alert.type]} transition-all duration-200 hover:scale-[1.01]`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={iconStyles[alert.type]}>
                  {alertIcons[alert.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    {!alert.read && (
                      <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  <span className="text-xs text-muted-foreground mt-2 block">
                    {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon-sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
