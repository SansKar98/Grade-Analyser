import { useState } from 'react';
import { Student } from '@/types/student';
import { useStudents } from '@/context/StudentContext';
import { Layout } from '@/components/layout/Layout';
import { StudentTable } from '@/components/students/StudentTable';
import { StudentForm } from '@/components/students/StudentForm';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

export default function Students() {
  const { students } = useStudents();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingStudent(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-1">
              Manage student records and marks
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{students.length} students registered</span>
        </div>

        {/* Table */}
        <StudentTable onEdit={handleEdit} />

        {/* Form Modal */}
        <StudentForm
          student={editingStudent}
          isOpen={isFormOpen}
          onClose={handleClose}
        />
      </div>
    </Layout>
  );
}
