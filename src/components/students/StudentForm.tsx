import { useState, useEffect } from 'react';
import { Student, Subject } from '@/types/student';
import { useStudents } from '@/context/StudentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';

interface StudentFormProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

const defaultSubjects: Subject[] = [
  { name: 'Mathematics', marks: 0, maxMarks: 100 },
  { name: 'Physics', marks: 0, maxMarks: 100 },
  { name: 'Chemistry', marks: 0, maxMarks: 100 },
  { name: 'English', marks: 0, maxMarks: 100 },
  { name: 'Computer Science', marks: 0, maxMarks: 100 },
];

export function StudentForm({ student, isOpen, onClose }: StudentFormProps) {
  const { addStudent, updateStudent } = useStudents();
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [email, setEmail] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setRollNumber(student.rollNumber);
      setEmail(student.email);
      setSubjects(student.subjects);
    } else {
      setName('');
      setRollNumber('');
      setEmail('');
      setSubjects(defaultSubjects.map(s => ({ ...s, marks: 0 })));
    }
  }, [student, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!rollNumber.trim()) {
      toast.error('Roll number is required');
      return;
    }

    const studentData = {
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      email: email.trim(),
      subjects,
    };

    if (student) {
      updateStudent(student.id, studentData);
      toast.success('Student updated successfully');
    } else {
      addStudent(studentData);
      toast.success('Student added successfully');
    }

    onClose();
  };

  const updateSubjectMarks = (index: number, marks: number) => {
    const newSubjects = [...subjects];
    newSubjects[index].marks = Math.min(Math.max(0, marks), newSubjects[index].maxMarks);
    setSubjects(newSubjects);
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: '', marks: 0, maxMarks: 100 }]);
  };

  const removeSubject = (index: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  const updateSubjectName = (index: number, name: string) => {
    const newSubjects = [...subjects];
    newSubjects[index].name = name;
    setSubjects(newSubjects);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {student ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter student name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number *</Label>
              <Input
                id="rollNumber"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g., R001"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@email.com"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Subject Marks</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSubject}>
                <Plus className="h-4 w-4 mr-1" />
                Add Subject
              </Button>
            </div>
            
            <div className="space-y-2">
              {subjects.map((subject, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={subject.name}
                    onChange={(e) => updateSubjectName(index, e.target.value)}
                    placeholder="Subject name"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={subject.marks}
                    onChange={(e) => updateSubjectMarks(index, parseInt(e.target.value) || 0)}
                    min={0}
                    max={subject.maxMarks}
                    className="w-24"
                  />
                  <span className="text-muted-foreground">/ {subject.maxMarks}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSubject(index)}
                    disabled={subjects.length === 1}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {student ? 'Update' : 'Add'} Student
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
