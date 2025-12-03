import { SubjectAnalytics } from '@/types/student';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SubjectStatsTableProps {
  data: SubjectAnalytics[];
}

export function SubjectStatsTable({ data }: SubjectStatsTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="font-semibold">Subject</TableHead>
            <TableHead className="font-semibold text-center">Average</TableHead>
            <TableHead className="font-semibold text-center">Median</TableHead>
            <TableHead className="font-semibold text-center">Std. Dev</TableHead>
            <TableHead className="font-semibold text-center">Pass Rate</TableHead>
            <TableHead className="font-semibold text-center">Range</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((subject) => (
            <TableRow key={subject.name} className="hover:bg-secondary/30">
              <TableCell className="font-medium">{subject.name}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-mono">{subject.average.toFixed(1)}%</span>
                  {subject.average >= 60 ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center font-mono">
                {subject.median.toFixed(1)}%
              </TableCell>
              <TableCell className="text-center font-mono text-muted-foreground">
                ±{subject.standardDeviation.toFixed(1)}
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                    subject.passRate >= 80
                      ? 'bg-success/10 text-success'
                      : subject.passRate >= 60
                      ? 'bg-warning/10 text-warning'
                      : 'bg-destructive/10 text-destructive'
                  )}
                >
                  {subject.passRate.toFixed(0)}%
                </span>
              </TableCell>
              <TableCell className="text-center font-mono text-muted-foreground">
                {subject.lowestScore.toFixed(0)} - {subject.highestScore.toFixed(0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
