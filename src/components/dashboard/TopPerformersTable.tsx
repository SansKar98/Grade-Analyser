import { Student } from '@/types/student';
import { getStudentStats, gradeColors } from '@/lib/analytics';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopPerformersTableProps {
  students: Student[];
}

const rankIcons = [Trophy, Medal, Award];
const rankColors = ['text-warning', 'text-muted-foreground', 'text-amber-700'];

export function TopPerformersTable({ students }: TopPerformersTableProps) {
  if (students.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        No students available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {students.map((student, index) => {
        const stats = getStudentStats(student);
        const Icon = rankIcons[index] || null;
        
        return (
          <div
            key={student.id}
            className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 transition-all hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              {Icon ? (
                <Icon className={cn('h-5 w-5', rankColors[index])} />
              ) : (
                <span className="text-sm font-bold text-muted-foreground">
                  {index + 1}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{student.name}</p>
              <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                {stats.percentage.toFixed(1)}%
              </p>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  gradeColors[stats.grade as keyof typeof gradeColors]
                )}
              >
                {stats.grade}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
