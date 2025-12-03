import { Student } from '@/types/student';
import { getStudentStats, gradeColors } from '@/lib/analytics';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { User, Mail, Hash, Calendar, Award } from 'lucide-react';

interface StudentDetailsModalProps {
  student: Student | null;
  onClose: () => void;
}

export function StudentDetailsModal({ student, onClose }: StudentDetailsModalProps) {
  if (!student) return null;

  const stats = getStudentStats(student);

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" /> Name
              </p>
              <p className="font-medium">{student.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Hash className="h-3 w-3" /> Roll Number
              </p>
              <p className="font-mono">{student.rollNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email
              </p>
              <p>{student.email || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Added
              </p>
              <p>{new Date(student.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="rounded-lg border border-border p-4 bg-secondary/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold">{stats.percentage.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">Overall Percentage</p>
              </div>
              <div className="text-center">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-4 py-1.5 text-lg font-bold',
                    gradeColors[stats.grade as keyof typeof gradeColors]
                  )}
                >
                  <Award className="h-5 w-5 mr-1" />
                  {stats.grade}
                </span>
                <p className="text-sm text-muted-foreground mt-1">GPA: {stats.gpa.toFixed(2)}</p>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Total Marks</span>
                <span className="font-mono">{stats.totalMarks} / {stats.maxMarks}</span>
              </div>
              <Progress value={stats.percentage} className="h-2" />
            </div>
          </div>

          {/* Subject-wise Marks */}
          <div>
            <h3 className="font-semibold mb-3">Subject-wise Performance</h3>
            <div className="space-y-3">
              {student.subjects.map((subject) => {
                const percentage = (subject.marks / subject.maxMarks) * 100;
                const isPass = percentage >= 40;
                return (
                  <div key={subject.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{subject.name}</span>
                      <span className={cn(
                        'font-mono',
                        !isPass && 'text-destructive'
                      )}>
                        {subject.marks} / {subject.maxMarks} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className={cn('h-2', !isPass && '[&>div]:bg-destructive')}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
