import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { newUsersData } from '@/data/mockData';

export function NewUsersChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Users (This Month)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={newUsersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [value, 'New Users']}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="hsl(142, 53%, 43%)" 
                strokeWidth={2}
                dot={{ fill: 'hsl(142, 53%, 43%)', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'hsl(142, 53%, 43%)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
