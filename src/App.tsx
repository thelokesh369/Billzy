import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { UploadBillsScreen } from './components/UploadBillsScreen';
import { DataValidationScreen } from './components/DataValidationScreen';
import { GenerateFilesScreen } from './components/GenerateFilesScreen';
import { UploadToGSTScreen } from './components/UploadToGSTScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { Toaster } from './components/ui/sonner';

export type Screen = 'login' | 'dashboard' | 'upload' | 'validation' | 'generate' | 'gst-upload' | 'reports';

export interface Invoice {
  id: string;
  invoiceNo: string;
  vendor: string;
  gstin: string;
  total: number;
  status: 'validated' | 'error';
  errors?: string[];
  date: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleFileUpload = (files: Invoice[]) => {
    setInvoices(files);
    setCurrentScreen('validation');
  };

  const handleUpdateInvoices = (updatedInvoices: Invoice[]) => {
    setInvoices(updatedInvoices);
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="size-full bg-background">
      {currentScreen === 'dashboard' && (
        <DashboardScreen 
          navigateTo={navigateTo} 
          invoiceCount={invoices.length}
        />
      )}
      {currentScreen === 'upload' && (
        <UploadBillsScreen 
          navigateTo={navigateTo}
          onFileUpload={handleFileUpload}
        />
      )}
      {currentScreen === 'validation' && (
        <DataValidationScreen 
          navigateTo={navigateTo}
          invoices={invoices}
          onUpdateInvoices={handleUpdateInvoices}
        />
      )}
      {currentScreen === 'generate' && (
        <GenerateFilesScreen 
          navigateTo={navigateTo}
          invoices={invoices}
        />
      )}
      {currentScreen === 'gst-upload' && (
        <UploadToGSTScreen 
          navigateTo={navigateTo}
          invoices={invoices}
        />
      )}
      {currentScreen === 'reports' && (
        <ReportsScreen 
          navigateTo={navigateTo}
          invoices={invoices}
        />
      )}
      <Toaster />
    </div>
  );
}
