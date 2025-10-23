import { type Screen, type Invoice } from '../App';
import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, FileSpreadsheet, FileJson, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ReportsScreenProps {
  navigateTo: (screen: Screen) => void;
  invoices: Invoice[];
}

export function ReportsScreen({ navigateTo, invoices }: ReportsScreenProps) {
  const totalInvoices = invoices.length;
  const validInvoices = invoices.filter((inv) => inv.status === 'validated').length;
  const errorInvoices = invoices.filter((inv) => inv.status === 'error').length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const avgAmount = totalInvoices > 0 ? totalAmount / totalInvoices : 0;

  const statusData = [
    { name: 'Validated', value: validInvoices, color: '#22c55e' },
    { name: 'Errors', value: errorInvoices, color: '#ef4444' },
  ];

  const vendorData = invoices.reduce((acc, inv) => {
    const existing = acc.find((v) => v.vendor === inv.vendor);
    if (existing) {
      existing.amount += inv.total;
      existing.count += 1;
    } else {
      acc.push({ vendor: inv.vendor, amount: inv.total, count: 1 });
    }
    return acc;
  }, [] as { vendor: string; amount: number; count: number }[]);

  const topVendors = vendorData
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const downloadHistory = [
    { file: 'tally_export_jan_2025.xlsx', type: 'Tally', date: '2025-10-20', size: '245 KB' },
    { file: 'gst_data_jan_2025.json', type: 'GST JSON', date: '2025-10-20', size: '128 KB' },
  ];

  const handleDownload = (filename: string) => {
    toast.success(`Downloaded ${filename}`);
  };

  return (
    <div className="size-full flex flex-col">
      <Header navigateTo={navigateTo} currentScreen="reports" />
      
      <main className="flex-1 overflow-auto">
        <div className="mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-8">
            <h2 className="mb-2">Summary & Reports</h2>
            <p className="text-muted-foreground">
              View processing summary and download generated files
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Total Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{totalInvoices}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Validated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-green-600">{validInvoices}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Total Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">₹{(totalAmount / 1000).toFixed(1)}K</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Avg. Invoice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">₹{(avgAmount / 1000).toFixed(1)}K</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {totalInvoices > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No data to display
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Vendors by Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {topVendors.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topVendors}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="vendor"
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No data to display
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Download History</CardTitle>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {downloadHistory.length > 0 ? (
                    downloadHistory.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="flex items-center gap-2">
                          {item.type === 'Tally' ? (
                            <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                          ) : (
                            <FileJson className="h-4 w-4 text-green-600" />
                          )}
                          {item.file}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(item.file)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No files generated yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={() => navigateTo('dashboard')}>
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigateTo('upload')}>
              Upload More Invoices
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
