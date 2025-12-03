export interface Subject {
  name: string;
  marks: number;
  maxMarks: number;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  subjects: Subject[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentStats {
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  gpa: number;
  grade: string;
}

export interface SubjectAnalytics {
  name: string;
  average: number;
  median: number;
  mode: number;
  standardDeviation: number;
  passRate: number;
  highestScore: number;
  lowestScore: number;
}

export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
  color: string;
}

export interface OverallAnalytics {
  totalStudents: number;
  averagePercentage: number;
  passRate: number;
  topPerformers: Student[];
  lowPerformers: Student[];
  gradeDistribution: GradeDistribution[];
  subjectAnalytics: SubjectAnalytics[];
}

export type GradeLetter = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
