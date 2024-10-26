import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth-context';
import Layout from '@/components/layout';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '@/routes';
import '@/lib/i18n';
import ErrorBoundary from '@/components/error-boundary';
import { toast } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'An error occurred');
      },
    },
    mutations: {
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'An error occurred');
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            <Router>
              <Layout>
                <AppRoutes />
              </Layout>
            </Router>
            <Toaster position="top-center" />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;