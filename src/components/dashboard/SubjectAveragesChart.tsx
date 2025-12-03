import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SubjectAnalytics } from '@/types/student';

interface SubjectAveragesChartProps {
  data: SubjectAnalytics[];
}

const colors = [
  'hsl(234, 89%, 54%)',
  'hsl(168, 76%, 42%)',
  'hsl(38, 92%, 50%)',
  'hsl(142, 76%, 36%)',
  'hsl(280, 65%, 60%)',
  'hsl(0, 84%, 60%)',
];

export function SubjectAveragesChart({ data }: SubjectAveragesChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="name"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          label={{
            value: 'Average %',
            angle: -90,
            position: 'insideLeft',
            fill: 'hsl(var(--muted-foreground))',
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Average']}
        />
        <Bar dataKey="average" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
