import { useState } from 'react';
import { type Screen, type Invoice } from '../App';
import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, CheckCircle, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UploadToGSTScreenProps {
  navigateTo: (screen: Screen) => void;
  invoices: Invoice[];
}

export function UploadToGSTScreen({ navigateTo, invoices }: UploadToGSTScreenProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: number;
    failed: number;
  } | null>(null);

  const totalInvoices = invoices.length;
  const validInvoices = invoices.filter((inv) => inv.status === 'validated').length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      setUploadStatus({
        success: validInvoices,
        failed: totalInvoices - validInvoices,
      });
      toast.success('Upload to GST Portal completed!');
    }, 3000);
  };

  return (
    <div className="size-full flex flex-col">
      <Header navigateTo={navigateTo} currentScreen="upload" />
      
      <main className="flex-1 overflow-auto">
        <div className="mx-auto px-6 py-8 max-w-4xl">
          <div className="mb-8">
            <h2 className="mb-2">Upload to GST Portal</h2>
            <p className="text-muted-foreground">
              Upload your validated invoices directly to the GST portal
            </p>
          </div>

          {!uploadComplete ? (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Upload Confirmation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="text-muted-foreground mb-1">Total Invoices</div>
                        <div className="text-2xl">{totalInvoices}</div>
                      </div>
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="text-muted-foreground mb-1">Ready to Upload</div>
                        <div className="text-2xl text-green-600">{validInvoices}</div>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Amount:</span>
                        <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GST Period:</span>
                        <span>January 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Return Type:</span>
                        <span>GSTR-1</span>
                      </div>
                    </div>

                    {totalInvoices - validInvoices > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {totalInvoices - validInvoices} invoice(s) have errors and will not be uploaded.
                          Please fix them first.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {isUploading ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center mb-4">
                      <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
                      <h3 className="mb-2">Uploading to GST Portal...</h3>
                      <p className="text-muted-foreground">
                        Please wait while we upload your invoices
                      </p>
                    </div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Progress: {uploadProgress}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.floor((uploadProgress / 100) * validInvoices)} / {validInvoices} invoices
                      </span>
                    </div>
                    <Progress value={uploadProgress} />
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-dashed border-primary/20 bg-muted/30">
                  <CardContent className="py-12">
                    <div className="text-center">
                      <div className="mb-4 p-4 rounded-full bg-primary/10 inline-block">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="mb-2">Ready to Upload</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Click the button below to start uploading {validInvoices} validated invoices to the GST portal
                      </p>
                      <Button size="lg" onClick={handleUpload}>
                        Upload to GST Portal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <>
              <Card className="mb-6 border-2 border-green-500/20 bg-green-500/5">
                <CardContent className="py-8">
                  <div className="text-center">
                    <div className="mb-4 p-4 rounded-full bg-green-500/10 inline-block">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="mb-2">Upload Successful!</h2>
                    <p className="text-muted-foreground mb-6">
                      Your invoices have been successfully uploaded to the GST portal
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <CardTitle>Successfully Uploaded</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl text-green-600">
                      {uploadStatus?.success || 0}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Invoices uploaded successfully
                    </p>
                  </CardContent>
                </Card>

                {uploadStatus && uploadStatus.failed > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <CardTitle>Failed</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl text-red-600">
                        {uploadStatus.failed}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Invoices with errors (not uploaded)
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={() => navigateTo('reports')}>
                  View Reports
                </Button>
                <Button variant="outline" onClick={() => navigateTo('dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </>
          )}

          {!uploadComplete && !isUploading && (
            <div className="mt-8 p-4 bg-muted/50 border border-border rounded-lg">
              <h4 className="mb-2">Important Notes</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Ensure your GST credentials are configured in Settings</li>
                <li>• Upload will be done securely using encrypted connection</li>
                <li>• You can track the upload status in real-time</li>
                <li>• Failed invoices can be fixed and re-uploaded separately</li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
