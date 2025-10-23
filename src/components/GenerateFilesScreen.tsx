import { useState } from 'react';
import { type Screen, type Invoice } from '../App';
import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileSpreadsheet, FileJson, Download, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface GenerateFilesScreenProps {
  navigateTo: (screen: Screen) => void;
  invoices: Invoice[];
}

export function GenerateFilesScreen({ navigateTo, invoices }: GenerateFilesScreenProps) {
  const [tallyGenerated, setTallyGenerated] = useState(false);
  const [gstGenerated, setGstGenerated] = useState(false);
  const [isGeneratingTally, setIsGeneratingTally] = useState(false);
  const [isGeneratingGST, setIsGeneratingGST] = useState(false);

  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const validInvoices = invoices.filter((inv) => inv.status === 'validated').length;

  const handleGenerateTally = () => {
    setIsGeneratingTally(true);
    setTimeout(() => {
      setIsGeneratingTally(false);
      setTallyGenerated(true);
      toast.success('Tally-ready file generated successfully!');
    }, 1500);
  };

  const handleGenerateGST = () => {
    setIsGeneratingGST(true);
    setTimeout(() => {
      setIsGeneratingGST(false);
      setGstGenerated(true);
      toast.success('GST-ready JSON file generated successfully!');
    }, 1500);
  };

  const handleDownloadTally = () => {
    toast.success('Tally file downloaded!');
  };

  const handleDownloadGST = () => {
    toast.success('GST JSON file downloaded!');
  };

  const handleUploadToGST = () => {
    navigateTo('gst-upload');
  };

  return (
    <div className="size-full flex flex-col">
      <Header navigateTo={navigateTo} currentScreen="upload" />
      
      <main className="flex-1 overflow-auto">
        <div className="mx-auto px-6 py-8 max-w-5xl">
          <div className="mb-8">
            <h2 className="mb-2">Generate Tally & GST Files</h2>
            <p className="text-muted-foreground">
              Create export-ready files for Tally and GST portal
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>File Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-muted-foreground mb-1">Total Invoices</div>
                  <div className="text-2xl">{totalInvoices}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Validated</div>
                  <div className="text-2xl text-green-600">{validInvoices}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Total Amount</div>
                  <div className="text-2xl">₹{totalAmount.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Tally-Ready File</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Excel format for direct import to Tally
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <span>Excel (.xlsx)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Records:</span>
                    <span>{totalInvoices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>
                      {tallyGenerated ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Ready
                        </span>
                      ) : (
                        'Not generated'
                      )}
                    </span>
                  </div>
                </div>

                {!tallyGenerated ? (
                  <Button
                    className="w-full"
                    onClick={handleGenerateTally}
                    disabled={isGeneratingTally}
                  >
                    {isGeneratingTally ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Tally File'
                    )}
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" onClick={handleDownloadTally}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Tally File
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <FileJson className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>GST-Ready JSON</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      JSON format for GST portal upload
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Format:</span>
                    <span>JSON (.json)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Records:</span>
                    <span>{totalInvoices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>
                      {gstGenerated ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Ready
                        </span>
                      ) : (
                        'Not generated'
                      )}
                    </span>
                  </div>
                </div>

                {!gstGenerated ? (
                  <Button
                    className="w-full"
                    onClick={handleGenerateGST}
                    disabled={isGeneratingGST}
                  >
                    {isGeneratingGST ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate GST JSON'
                    )}
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" onClick={handleDownloadGST}>
                    <Download className="h-4 w-4 mr-2" />
                    Download GST JSON
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

         

          <div className="mt-8 flex gap-3">
            <Button variant="outline" onClick={() => navigateTo('validation')}>
              Back to Validation
            </Button>
            <Button variant="outline" onClick={() => navigateTo('reports')}>
              View Reports
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
