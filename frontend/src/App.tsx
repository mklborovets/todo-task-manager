import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <p className="text-sm font-medium text-slate-600">
                    Task Manager Frontend Initialized
                  </p>
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;