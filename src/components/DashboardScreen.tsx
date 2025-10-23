import { type Screen } from '../App';
import { Header } from './Header';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FileText, AlertCircle, CheckCircle, Upload } from 'lucide-react';

interface DashboardScreenProps {
  navigateTo: (screen: Screen) => void;
  invoiceCount: number;
}

export function DashboardScreen({ navigateTo, invoiceCount }: DashboardScreenProps) {
  const stats = [
    {
      title: 'Invoices Processed',
      value: invoiceCount.toString(),
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Errors Found',
      value: Math.floor(invoiceCount * 0.15).toString(),
      icon: AlertCircle,
      color: 'text-red-600',
    },
    {
      title: 'Validated',
      value: Math.floor(invoiceCount * 0.85).toString(),
      icon: CheckCircle,
      color: 'text-green-600',
    },
  ];

  return (
    <div className="size-full flex flex-col">
      <Header navigateTo={navigateTo} currentScreen="dashboard" />
      
      <main className="flex-1 overflow-auto">
        <div className="mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-8">
            <h2 className="mb-2">Welcome to Billzy</h2>
            <p className="text-muted-foreground">
              Automate your GST filing process with AI-powered data extraction and validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="border-2 border-dashed border-primary/20 bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 p-4 rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2">Ready to process invoices?</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Upload your bills and let Billzy automatically extract and validate GST data
              </p>
              <Button size="lg" onClick={() => navigateTo('upload')}>
                Upload Bills
              </Button>
            </CardContent>
          </Card>

          {invoiceCount > 0 && (
            <div className="mt-8">
              <h3 className="mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => navigateTo('validation')}
                >
                  <div className="text-left">
                    <div className="mb-1">View & Validate Data</div>
                    <div className="text-sm text-muted-foreground">
                      Review extracted invoice data
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 justify-start"
                  onClick={() => navigateTo('reports')}
                >
                  <div className="text-left">
                    <div className="mb-1">View Reports</div>
                    <div className="text-sm text-muted-foreground">
                      See processing summary and download files
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
