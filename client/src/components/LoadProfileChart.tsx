import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const data = [
  { hour: "00:00", load: 2.4 },
  { hour: "04:00", load: 2.1 },
  { hour: "08:00", load: 3.8 },
  { hour: "12:00", load: 4.5 },
  { hour: "16:00", load: 4.2 },
  { hour: "20:00", load: 3.5 },
  { hour: "23:59", load: 2.8 },
];

export function LoadProfileChart() {
  return (
    <div className="h-[300px] w-full bg-white rounded-xl p-6 shadow-sm border border-border/50">
      <h3 className="text-lg font-semibold mb-6">Site Load Profile (24h)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="hour" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            unit=" kW"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="load" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorLoad)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
