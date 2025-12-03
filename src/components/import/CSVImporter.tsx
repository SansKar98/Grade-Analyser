import { useState, useCallback } from 'react';
import { useStudents } from '@/context/StudentContext';
import { parseCSV, generateSampleCSV, downloadCSV, exportToCSV } from '@/lib/csv';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, Download, FileText, Trash2, FileSpreadsheet } from 'lucide-react';

export function CSVImporter() {
  const { students, importStudents, clearAllStudents } = useStudents();
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsed = parseCSV(content);
      
      if (parsed.length === 0) {
        toast.error('No valid data found in CSV');
        return;
      }

      importStudents(parsed);
      toast.success(`Imported ${parsed.length} students successfully`);
    };
    reader.readAsText(file);
  }, [importStudents]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const downloadSample = () => {
    const content = generateSampleCSV();
    downloadCSV(content, 'sample_marks.csv');
    toast.success('Sample CSV downloaded');
  };

  const exportData = () => {
    if (students.length === 0) {
      toast.error('No students to export');
      return;
    }
    const content = exportToCSV(students);
    downloadCSV(content, `student_marks_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Data exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import CSV
          </CardTitle>
          <CardDescription>
            Upload a CSV file with student marks. The file should have columns for Name, Roll Number, Email, and subject scores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-12 text-center transition-all
              ${isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
              }
            `}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <FileSpreadsheet className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">
                  Drop your CSV file here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse files
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports .csv files up to 10MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Download Sample</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get a template CSV file with example data
                </p>
                <Button variant="outline" size="sm" className="mt-3" onClick={downloadSample}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Download className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Export Data</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Download all student data as CSV
                </p>
                <Button variant="outline" size="sm" className="mt-3" onClick={exportData}>
                  <Download className="h-4 w-4 mr-1" />
                  Export {students.length} records
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <Trash2 className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Clear All Data</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Remove all students from the system
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 text-destructive hover:text-destructive" 
                  onClick={() => {
                    clearAllStudents();
                    toast.success('All data cleared');
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CSV Format Guide */}
      <Card>
        <CardHeader>
          <CardTitle>CSV Format Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-muted-foreground">
{`Name,Roll Number,Email,Mathematics,Physics,Chemistry,English,Computer Science
John Smith,R001,john@email.com,85,78,82,90,95
Emma Wilson,R002,emma@email.com,92,88,85,94,89`}
            </pre>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• First row should contain column headers</li>
            <li>• Required columns: Name, Roll Number (or RollNumber)</li>
            <li>• Optional: Email column</li>
            <li>• All other columns are treated as subject scores (max 100)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
