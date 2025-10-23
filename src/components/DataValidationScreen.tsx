import { useState } from 'react';
import { type Screen, type Invoice } from '../App';
import { Header } from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { CheckCircle, AlertCircle, Wand2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DataValidationScreenProps {
  navigateTo: (screen: Screen) => void;
  invoices: Invoice[];
  onUpdateInvoices: (invoices: Invoice[]) => void;
}

export function DataValidationScreen({
  navigateTo,
  invoices,
  onUpdateInvoices,
}: DataValidationScreenProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);

  const errorCount = invoices.filter((inv) => inv.status === 'error').length;
  const validCount = invoices.filter((inv) => inv.status === 'validated').length;

  const handleAutoFix = () => {
    const fixed = invoices.map((invoice) => {
      if (invoice.status === 'error') {
        // Simulate auto-fix
        return {
          ...invoice,
          gstin: invoice.gstin || '29ABCDE1234F1Z5',
          total: invoice.total || 10000,
          status: 'validated' as const,
          errors: undefined,
        };
      }
      return invoice;
    });
    onUpdateInvoices(fixed);
    toast.success('All errors auto-fixed successfully!');
  };

  const handleRowClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setEditedInvoice({ ...invoice });
  };

  const handleSaveEdit = () => {
    if (!editedInvoice) return;

    const updated = invoices.map((inv) =>
      inv.id === editedInvoice.id ? { ...editedInvoice, status: 'validated' as const, errors: undefined } : inv
    );
    onUpdateInvoices(updated);
    setSelectedInvoice(null);
    setEditedInvoice(null);
    toast.success('Invoice updated successfully!');
  };

  const handleContinue = () => {
    if (errorCount > 0) {
      toast.error('Please fix all errors before continuing');
      return;
    }
    navigateTo('generate');
  };

  return (
    <div className="size-full flex flex-col">
      <Header navigateTo={navigateTo} currentScreen="upload" />
      
      <main className="flex-1 overflow-auto">
        <div className="mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="mb-2">Data Extraction & Validation</h2>
              <p className="text-muted-foreground">
                Review and validate the extracted invoice data
              </p>
            </div>
            <div className="flex gap-3">
              {errorCount > 0 && (
                <Button variant="outline" onClick={handleAutoFix}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Auto-Fix Errors
                </Button>
              )}
              <Button onClick={handleContinue}>
                Continue to Generate Files
              </Button>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Validated</span>
              </div>
              <div className="text-2xl">{validCount}</div>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span>Errors</span>
              </div>
              <div className="text-2xl">{errorCount}</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>GSTIN</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total (₹)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className={`cursor-pointer ${
                      invoice.status === 'error' ? 'bg-red-500/5' : ''
                    }`}
                    onClick={() => handleRowClick(invoice)}
                  >
                    <TableCell>{invoice.invoiceNo}</TableCell>
                    <TableCell>{invoice.vendor}</TableCell>
                    <TableCell className={invoice.status === 'error' ? 'text-red-600' : ''}>
                      {invoice.gstin || 'Missing'}
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell className="text-right">
                      {invoice.total.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      {invoice.status === 'validated' ? (
                        <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                          Validated
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Error</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <Dialog open={selectedInvoice !== null} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedInvoice?.status === 'error' ? 'Fix Invoice Error' : 'Invoice Details'}
            </DialogTitle>
          </DialogHeader>

          {editedInvoice && (
            <div className="space-y-4">
              {selectedInvoice?.errors && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <div className="mb-1">Errors Found:</div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedInvoice.errors.map((error, i) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Number</Label>
                  <Input
                    value={editedInvoice.invoiceNo}
                    onChange={(e) =>
                      setEditedInvoice({ ...editedInvoice, invoiceNo: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={editedInvoice.date}
                    onChange={(e) =>
                      setEditedInvoice({ ...editedInvoice, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Vendor Name</Label>
                <Input
                  value={editedInvoice.vendor}
                  onChange={(e) =>
                    setEditedInvoice({ ...editedInvoice, vendor: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input
                  value={editedInvoice.gstin}
                  onChange={(e) =>
                    setEditedInvoice({ ...editedInvoice, gstin: e.target.value })
                  }
                  placeholder="29ABCDE1234F1Z5"
                />
              </div>

              <div className="space-y-2">
                <Label>Total Amount (₹)</Label>
                <Input
                  type="number"
                  value={editedInvoice.total}
                  onChange={(e) =>
                    setEditedInvoice({ ...editedInvoice, total: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
