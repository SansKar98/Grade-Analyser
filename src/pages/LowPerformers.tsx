import { useStudents } from '@/context/StudentContext';
import { getOverallAnalytics, getStudentStats, gradeColors } from '@/lib/analytics';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { downloadCSV, exportToCSV } from '@/lib/csv';
import { cn } from '@/lib/utils';
import { AlertTriangle, Download, Mail, User, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function LowPerformers() {
  const { students } = useStudents();
  const analytics = getOverallAnalytics(students);
  const lowPerformers = analytics.lowPerformers;

  const exportLowPerformers = () => {
    if (lowPerformers.length === 0) {
      toast.error('No low performers to export');
      return;
    }
    const content = exportToCSV(lowPerformers);
    downloadCSV(content, `remediation_list_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Remediation list exported');
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-warning" />
              Low Performers
            </h1>
            <p className="text-muted-foreground mt-1">
              Students scoring below 40% who need additional support
            </p>
          </div>
          <Button onClick={exportLowPerformers} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
        </div>

        {/* Summary Card */}
        <Card className={cn(
          lowPerformers.length > 0 ? 'border-warning' : 'border-success'
        )}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                'flex h-14 w-14 items-center justify-center rounded-xl',
                lowPerformers.length > 0 ? 'gradient-warning' : 'gradient-success'
              )}>
                <AlertTriangle className="h-7 w-7 text-warning-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold">
                  {lowPerformers.length} {lowPerformers.length === 1 ? 'Student' : 'Students'}
                </p>
                <p className="text-muted-foreground">
                  {lowPerformers.length > 0
                    ? 'require immediate attention and remediation'
                    : 'All students are performing above the passing threshold!'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        {lowPerformers.length > 0 ? (
          <div className="grid gap-4">
            {lowPerformers.map((student) => {
              const stats = getStudentStats(student);
              const failingSubjects = student.subjects.filter(
                (s) => (s.marks / s.maxMarks) * 100 < 40
              );

              return (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Student Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                          <User className="h-6 w-6 text-destructive" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold">{student.name}</h3>
                          <p className="text-sm text-muted-foreground font-mono">
                            {student.rollNumber}
                          </p>
                          {student.email && (
                            <a
                              href={`mailto:${student.email}`}
                              className="flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                            >
                              <Mail className="h-3 w-3" />
                              {student.email}
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-destructive">
                            {stats.percentage.toFixed(1)}%
                          </p>
                          <p className="text-xs text-muted-foreground">Overall</p>
                        </div>
                        <div className="text-center">
                          <span
                            className={cn(
                              'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
                              gradeColors[stats.grade as keyof typeof gradeColors]
                            )}
                          >
                            {stats.grade}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">Grade</p>
                        </div>
                      </div>
                    </div>

                    {/* Failing Subjects */}
                    {failingSubjects.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Failing Subjects ({failingSubjects.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {failingSubjects.map((subject) => {
                            const pct = (subject.marks / subject.maxMarks) * 100;
                            return (
                              <div
                                key={subject.name}
                                className="p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                              >
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="font-medium">{subject.name}</span>
                                  <span className="text-destructive font-mono">
                                    {subject.marks}/{subject.maxMarks}
                                  </span>
                                </div>
                                <Progress
                                  value={pct}
                                  className="h-1.5 [&>div]:bg-destructive"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold">Excellent Performance!</h3>
              <p className="text-muted-foreground mt-2">
                All students are performing above the passing threshold of 40%.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
