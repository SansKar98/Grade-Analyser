import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Student } from '@/types/student';
import { sampleStudents } from '@/data/sampleStudents';

interface StudentContextType {
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  importStudents: (newStudents: Student[]) => void;
  clearAllStudents: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(sampleStudents);

  const addStudent = useCallback((studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStudents(prev => [...prev, newStudent]);
  }, []);

  const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id
          ? { ...student, ...updates, updatedAt: new Date() }
          : student
      )
    );
  }, []);

  const deleteStudent = useCallback((id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  }, []);

  const importStudents = useCallback((newStudents: Student[]) => {
    setStudents(prev => [...prev, ...newStudents]);
  }, []);

  const clearAllStudents = useCallback(() => {
    setStudents([]);
  }, []);

  return (
    <StudentContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        importStudents,
        clearAllStudents,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
}
