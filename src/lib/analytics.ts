import { Student, StudentStats, SubjectAnalytics, GradeDistribution, OverallAnalytics, GradeLetter } from '@/types/student';

// Calculate grade based on percentage
export function getGrade(percentage: number): GradeLetter {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  if (percentage >= 33) return 'D';
  return 'F';
}

// Calculate GPA (4.0 scale)
export function getGPA(percentage: number): number {
  if (percentage >= 90) return 4.0;
  if (percentage >= 80) return 3.7;
  if (percentage >= 70) return 3.3;
  if (percentage >= 60) return 3.0;
  if (percentage >= 50) return 2.5;
  if (percentage >= 40) return 2.0;
  if (percentage >= 33) return 1.0;
  return 0.0;
}

// Get student statistics
export function getStudentStats(student: Student): StudentStats {
  const totalMarks = student.subjects.reduce((sum, s) => sum + s.marks, 0);
  const maxMarks = student.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
  const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
  
  return {
    totalMarks,
    maxMarks,
    percentage: Math.round(percentage * 100) / 100,
    gpa: getGPA(percentage),
    grade: getGrade(percentage),
  };
}

// Calculate average
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

// Calculate median
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Calculate mode
export function calculateMode(values: number[]): number {
  if (values.length === 0) return 0;
  const frequency: Record<number, number> = {};
  let maxFreq = 0;
  let mode = values[0];
  
  for (const val of values) {
    frequency[val] = (frequency[val] || 0) + 1;
    if (frequency[val] > maxFreq) {
      maxFreq = frequency[val];
      mode = val;
    }
  }
  return mode;
}

// Calculate standard deviation
export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const avg = calculateAverage(values);
  const squareDiffs = values.map(val => Math.pow(val - avg, 2));
  const avgSquareDiff = calculateAverage(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

// Get subject analytics
export function getSubjectAnalytics(students: Student[], subjectName: string): SubjectAnalytics {
  const subjectMarks = students
    .map(s => s.subjects.find(sub => sub.name === subjectName))
    .filter(Boolean)
    .map(s => (s!.marks / s!.maxMarks) * 100);
  
  const passCount = subjectMarks.filter(m => m >= 40).length;
  
  return {
    name: subjectName,
    average: Math.round(calculateAverage(subjectMarks) * 100) / 100,
    median: Math.round(calculateMedian(subjectMarks) * 100) / 100,
    mode: Math.round(calculateMode(subjectMarks) * 100) / 100,
    standardDeviation: Math.round(calculateStandardDeviation(subjectMarks) * 100) / 100,
    passRate: subjectMarks.length > 0 ? Math.round((passCount / subjectMarks.length) * 100 * 100) / 100 : 0,
    highestScore: Math.max(...subjectMarks, 0),
    lowestScore: Math.min(...subjectMarks, 0),
  };
}

// Get grade distribution
export function getGradeDistribution(students: Student[]): GradeDistribution[] {
  const grades: Record<GradeLetter, { count: number; color: string }> = {
    'A+': { count: 0, color: 'hsl(142, 76%, 36%)' },
    'A': { count: 0, color: 'hsl(142, 76%, 46%)' },
    'B+': { count: 0, color: 'hsl(168, 76%, 42%)' },
    'B': { count: 0, color: 'hsl(168, 76%, 52%)' },
    'C+': { count: 0, color: 'hsl(38, 92%, 50%)' },
    'C': { count: 0, color: 'hsl(38, 92%, 60%)' },
    'D': { count: 0, color: 'hsl(0, 84%, 70%)' },
    'F': { count: 0, color: 'hsl(0, 84%, 60%)' },
  };
  
  students.forEach(student => {
    const stats = getStudentStats(student);
    grades[stats.grade as GradeLetter].count++;
  });
  
  const total = students.length;
  return Object.entries(grades).map(([grade, data]) => ({
    grade,
    count: data.count,
    percentage: total > 0 ? Math.round((data.count / total) * 100 * 100) / 100 : 0,
    color: data.color,
  }));
}

// Get all unique subjects
export function getAllSubjects(students: Student[]): string[] {
  const subjects = new Set<string>();
  students.forEach(s => s.subjects.forEach(sub => subjects.add(sub.name)));
  return Array.from(subjects);
}

// Get overall analytics
export function getOverallAnalytics(students: Student[]): OverallAnalytics {
  const studentStats = students.map(s => ({ student: s, stats: getStudentStats(s) }));
  const percentages = studentStats.map(s => s.stats.percentage);
  
  const passCount = studentStats.filter(s => s.stats.percentage >= 40).length;
  
  // Sort by percentage descending
  const sorted = [...studentStats].sort((a, b) => b.stats.percentage - a.stats.percentage);
  
  // Get all subjects
  const subjects = getAllSubjects(students);
  const subjectAnalytics = subjects.map(name => getSubjectAnalytics(students, name));
  
  return {
    totalStudents: students.length,
    averagePercentage: Math.round(calculateAverage(percentages) * 100) / 100,
    passRate: students.length > 0 ? Math.round((passCount / students.length) * 100 * 100) / 100 : 0,
    topPerformers: sorted.slice(0, 5).map(s => s.student),
    lowPerformers: sorted.filter(s => s.stats.percentage < 40).map(s => s.student),
    gradeDistribution: getGradeDistribution(students),
    subjectAnalytics,
  };
}

// Grade colors for UI
export const gradeColors: Record<GradeLetter, string> = {
  'A+': 'bg-success text-success-foreground',
  'A': 'bg-success/80 text-success-foreground',
  'B+': 'bg-accent text-accent-foreground',
  'B': 'bg-accent/80 text-accent-foreground',
  'C+': 'bg-warning text-warning-foreground',
  'C': 'bg-warning/80 text-warning-foreground',
  'D': 'bg-destructive/70 text-destructive-foreground',
  'F': 'bg-destructive text-destructive-foreground',
};
