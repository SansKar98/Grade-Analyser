import { useStudents } from '@/context/StudentContext';
import { getOverallAnalytics } from '@/lib/analytics';
import { Layout } from '@/components/layout/Layout';
import { StatCard } from '@/components/dashboard/StatCard';
import { GradeDistributionChart } from '@/components/dashboard/GradeDistributionChart';
import { SubjectAveragesChart } from '@/components/dashboard/SubjectAveragesChart';
import { TopPerformersTable } from '@/components/dashboard/TopPerformersTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, TrendingUp, AlertTriangle, Award, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const { students } = useStudents();
  const analytics = getOverallAnalytics(students);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of student performance and analytics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Students"
            value={analytics.totalStudents}
            subtitle="Enrolled in system"
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Class Average"
            value={`${analytics.averagePercentage.toFixed(1)}%`}
            subtitle="Overall performance"
            icon={GraduationCap}
            variant="accent"
          />
          <StatCard
            title="Pass Rate"
            value={`${analytics.passRate.toFixed(1)}%`}
            subtitle="Above 40% threshold"
            icon={TrendingUp}
            variant="success"
          />
          <StatCard
            title="Need Attention"
            value={analytics.lowPerformers.length}
            subtitle="Below passing marks"
            icon={AlertTriangle}
            variant={analytics.lowPerformers.length > 0 ? 'warning' : 'default'}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-fade-in stagger-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Grade Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GradeDistributionChart data={analytics.gradeDistribution} />
            </CardContent>
          </Card>

          <Card className="animate-fade-in stagger-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Subject Averages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SubjectAveragesChart data={analytics.subjectAnalytics} />
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card className="animate-fade-in stagger-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TopPerformersTable students={analytics.topPerformers} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
