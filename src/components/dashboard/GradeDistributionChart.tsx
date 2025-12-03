import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { GradeDistribution } from '@/types/student';

interface GradeDistributionChartProps {
  data: GradeDistribution[];
}

export function GradeDistributionChart({ data }: GradeDistributionChartProps) {
  const filteredData = data.filter(d => d.count > 0);

  if (filteredData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="count"
          nameKey="grade"
          label={({ grade, percentage }) => `${grade}: ${percentage}%`}
          labelLine={false}
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value: number, name: string) => [`${value} students`, `Grade ${name}`]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
