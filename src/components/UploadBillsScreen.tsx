import { useState } from 'react';
import { type Screen, type Invoice } from '../App';
import { Header } from './Header';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Upload, FileSpreadsheet, FileImage, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UploadBillsScreenProps {
  navigateTo: (screen: Screen) => void;
  onFileUpload: (invoices: Invoice[]) => void;
}

export function UploadBillsScreen({ navigateTo, onFileUpload }: UploadBillsScreenProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate file processing
    setTimeout(() => {
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          invoiceNo: 'INV-2025-001',
          vendor: 'Tech Solutions Pvt Ltd',
          gstin: '29ABCDE1234F1Z5',
          total: 25000,
          status: 'validated',
          date: '2025-01-15',
        },
        {
          id: '2',
          invoiceNo: 'INV-2025-002',
          vendor: 'Office Supplies Co',
          gstin: '27XYZAB5678G2W4',
          total: 8500,
          status: 'validated',
          date: '2025-01-16',
        },
        {
          id: '3',
          invoiceNo: 'INV-2025-003',
          vendor: 'Software Services Inc',
          gstin: 'INVALID_GSTIN',
          total: 45000,
          status: 'error',
          errors: ['Invalid GSTIN format'],
          date: '2025-01-17',
        },
        {
          id: '4',
          invoiceNo: 'INV-2025-004',
          vendor: 'Marketing Agency',
          gstin: '19PQRST9012H3K6',
          total: 32000,
          status: 'validated',
          date: '2025-01-18',
        },
        {
          id: '5',
          invoiceNo: 'INV-2025-005',
          vendor: 'Consulting Partners',
          gstin: '',
          total: 0,
          status: 'error',
          errors: ['Missing GSTIN', 'Invalid total amount'],
          date: '2025-01-19',
        },
      ];

      setIsUploading(false);
      toast.success(`Successfully uploaded ${files.length} file(s)`);
      onFileUpload(mockInvoices);
    }, 2500);
  };

  const supportedFormats = [
    { name: 'Excel', icon: FileSpreadsheet, formats: '.xlsx, .xls' },
    { name: 'CSV', icon: FileText, formats: '.csv' },
    { name: 'PDF', icon: FileText, formats: '.pdf' },
    { name: 'Images', icon: FileImage, formats: '.jpg, .png' },
  ];

  return (
    <div className="size-full flex flex-col">
      <Header navigateTo={navigateTo} currentScreen="upload" />
      
      <main className="flex-1 overflow-auto">
        <div className="mx-auto px-6 py-8 max-w-4xl">
          <div className="mb-8">
            <h2 className="mb-2">Upload Bills</h2>
            <p className="text-muted-foreground">
              Upload your invoices and Billzy will automatically extract GST data
            </p>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border bg-muted/30'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <div className="mb-4 p-4 rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2">Drag & Drop Files Here</h3>
              <p className="text-muted-foreground mb-6">
                or click the button below to select files
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".xlsx,.xls,.csv,.pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Select Files
                </label>
              </Button>
            </div>
          </div>

          {isUploading && (
            <div className="mt-6 p-6 bg-card border border-border rounded-lg">
              <div className="mb-2 flex items-center justify-between">
                <span>Uploading files...</span>
                <span className="text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <div className="mt-8">
            <h4 className="mb-4">Supported Formats</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {supportedFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <div
                    key={format.name}
                    className="p-4 bg-card border border-border rounded-lg text-center"
                  >
                    <Icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <div className="mb-1">{format.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {format.formats}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted/50 border border-border rounded-lg">
            <h4 className="mb-2">Instructions</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Upload all your invoices in supported formats</li>
              <li>• AI will automatically extract invoice number, vendor, GSTIN, and amounts</li>
              <li>• You can review and edit the extracted data before generating files</li>
              <li>• Multiple files can be uploaded at once</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
