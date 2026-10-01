import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, GuestRoute } from './components/RouteGuards';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function DashboardPlaceholder() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <p className="text-sm font-medium text-slate-700">
        Signed in as <span className="font-semibold text-slate-900">{user?.email}</span>
      </p>
      <button
        onClick={logout}
        className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition cursor-pointer"
      >
        Sign out
      </button>
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPlaceholder />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;