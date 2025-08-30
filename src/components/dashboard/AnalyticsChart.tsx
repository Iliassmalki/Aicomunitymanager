import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { month: 'Jan 1', gained: 45, lost: 12 },
  { month: 'Feb 1', gained: 52, lost: 15 },
  { month: 'Mar 1', gained: 78, lost: 8 },
  { month: 'Apr 1', gained: 85, lost: 10 },
  { month: 'May 1', gained: 95, lost: 5 },
  { month: 'Jun 1', gained: 88, lost: 7 },
  { month: 'Jul 1', gained: 92, lost: 6 },
  { month: 'Aug 1', gained: 105, lost: 4 },
  { month: 'Sep 1', gained: 98, lost: 8 },
  { month: 'Oct 1', gained: 87, lost: 12 },
  { month: 'Nov 1', gained: 94, lost: 6 },
  { month: 'Dec 1', gained: 76, lost: 9 },
];

export function AnalyticsChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">LinkedIn Network Growth</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-secondary"></div>
            <span className="text-muted-foreground">Gained</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-metric-error"></div>
            <span className="text-muted-foreground">Lost</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Bar 
              dataKey="gained" 
              fill="hsl(var(--chart-secondary))" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar 
              dataKey="lost" 
              fill="hsl(var(--metric-error))" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}