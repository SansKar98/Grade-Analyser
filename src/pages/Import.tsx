import { Layout } from '@/components/layout/Layout';
import { CSVImporter } from '@/components/import/CSVImporter';

export default function Import() {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Import Data</h1>
          <p className="text-muted-foreground mt-1">
            Import student marks from CSV files or export existing data
          </p>
        </div>

        {/* CSV Importer */}
        <CSVImporter />
      </div>
    </Layout>
  );
}
