import { Student, Subject } from '@/types/student';

// Parse CSV to students
export function parseCSV(csvContent: string): Student[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const students: Student[] = [];
  
  // Find fixed columns
  const nameIndex = headers.findIndex(h => h.toLowerCase() === 'name');
  const rollIndex = headers.findIndex(h => h.toLowerCase() === 'roll' || h.toLowerCase() === 'rollnumber' || h.toLowerCase() === 'roll_number');
  const emailIndex = headers.findIndex(h => h.toLowerCase() === 'email');
  
  // All other columns are subjects
  const subjectColumns = headers
    .map((h, i) => ({ name: h, index: i }))
    .filter(col => 
      col.index !== nameIndex && 
      col.index !== rollIndex && 
      col.index !== emailIndex &&
      !col.name.toLowerCase().includes('max')
    );
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length < 3) continue;
    
    const subjects: Subject[] = subjectColumns.map(col => ({
      name: col.name,
      marks: parseFloat(values[col.index]) || 0,
      maxMarks: 100,
    }));
    
    const student: Student = {
      id: `student-${i}-${Date.now()}`,
      name: values[nameIndex] || `Student ${i}`,
      rollNumber: values[rollIndex] || `R${i.toString().padStart(3, '0')}`,
      email: values[emailIndex] || '',
      subjects,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    students.push(student);
  }
  
  return students;
}

// Export students to CSV
export function exportToCSV(students: Student[]): string {
  if (students.length === 0) return '';
  
  // Get all unique subjects
  const allSubjects = new Set<string>();
  students.forEach(s => s.subjects.forEach(sub => allSubjects.add(sub.name)));
  const subjects = Array.from(allSubjects);
  
  // Create header
  const headers = ['Name', 'Roll Number', 'Email', ...subjects, 'Total', 'Percentage', 'Grade'];
  
  // Create rows
  const rows = students.map(student => {
    const subjectMarks = subjects.map(subName => {
      const sub = student.subjects.find(s => s.name === subName);
      return sub ? sub.marks : 0;
    });
    
    const total = student.subjects.reduce((sum, s) => sum + s.marks, 0);
    const maxTotal = student.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
    const percentage = maxTotal > 0 ? ((total / maxTotal) * 100).toFixed(2) : '0';
    
    const grade = getGradeFromPercentage(parseFloat(percentage));
    
    return [
      student.name,
      student.rollNumber,
      student.email,
      ...subjectMarks,
      total,
      percentage,
      grade,
    ].join(',');
  });
  
  return [headers.join(','), ...rows].join('\n');
}

function getGradeFromPercentage(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  if (percentage >= 33) return 'D';
  return 'F';
}

// Download CSV
export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate sample CSV content
export function generateSampleCSV(): string {
  return `Name,Roll Number,Email,Mathematics,Physics,Chemistry,English,Computer Science
John Smith,R001,john.smith@email.com,85,78,82,90,95
Emma Wilson,R002,emma.wilson@email.com,92,88,85,94,89
Michael Brown,R003,michael.brown@email.com,68,72,65,75,80
Sarah Davis,R004,sarah.davis@email.com,45,52,48,60,55
James Miller,R005,james.miller@email.com,78,82,80,72,88
Emily Johnson,R006,emily.johnson@email.com,35,42,38,55,45
Daniel Lee,R007,daniel.lee@email.com,88,90,92,85,94
Olivia Taylor,R008,olivia.taylor@email.com,72,68,75,82,70
William Anderson,R009,william.anderson@email.com,58,55,62,65,60
Sophia Martinez,R010,sophia.martinez@email.com,95,92,98,88,96`;
}
