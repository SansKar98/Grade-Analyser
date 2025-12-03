import { useStudents } from '@/context/StudentContext';
import { getOverallAnalytics } from '@/lib/analytics';
import { Layout } from '@/components/layout/Layout';
import { GradeDistributionChart } from '@/components/dashboard/GradeDistributionChart';
import { SubjectAveragesChart } from '@/components/dashboard/SubjectAveragesChart';
import { SubjectStatsTable } from '@/components/analytics/SubjectStatsTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, PieChart, Table2, Calculator } from 'lucide-react';

export default function Analytics() {
  const { students } = useStudents();
  const analytics = getOverallAnalytics(students);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Detailed statistical analysis of student performance
          </p>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.averagePercentage.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Class Average</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <BarChart3 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.passRate.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <PieChart className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.subjectAnalytics.length}</p>
                  <p className="text-sm text-muted-foreground">Subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Table2 className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{analytics.lowPerformers.length}</p>
                  <p className="text-sm text-muted-foreground">At Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Grade Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of students by grade category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GradeDistributionChart data={analytics.gradeDistribution} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Subject Performance
              </CardTitle>
              <CardDescription>
                Average scores across all subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubjectAveragesChart data={analytics.subjectAnalytics} />
            </CardContent>
          </Card>
        </div>

        {/* Subject Statistics Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Table2 className="h-5 w-5 text-primary" />
              Subject Statistics
            </CardTitle>
            <CardDescription>
              Detailed statistical measures for each subject including average, median, standard deviation, and pass rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubjectStatsTable data={analytics.subjectAnalytics} />
          </CardContent>
        </Card>

        {/* Grade Distribution Details */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Breakdown</CardTitle>
            <CardDescription>
              Number of students in each grade category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {analytics.gradeDistribution.map((grade) => (
                <div
                  key={grade.grade}
                  className="text-center p-4 rounded-lg border border-border"
                  style={{ borderColor: grade.color }}
                >
                  <p
                    className="text-2xl font-bold"
                    style={{ color: grade.color }}
                  >
                    {grade.count}
                  </p>
                  <p className="text-sm font-medium mt-1">{grade.grade}</p>
                  <p className="text-xs text-muted-foreground">{grade.percentage}%</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
