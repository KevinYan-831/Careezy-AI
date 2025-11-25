import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './src/stores/authStore';
import { ProtectedRoute } from './src/components/auth/ProtectedRoute';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

// Pages
import { Home } from './src/pages/Home';
import { Login } from './src/pages/Login';
import { Signup } from './src/pages/Signup';
import { Dashboard } from './src/pages/Dashboard';
import { ResumeBuilder } from './src/pages/ResumeBuilder';
import { Internships } from './src/pages/Internships';
import { CareerCoach } from './src/pages/CareerCoach';
import { Pricing } from './src/pages/Pricing';
import { Profile } from './src/pages/Profile';
import { Templates } from './src/pages/Templates';
import { Features } from './src/pages/Features';
import { Onboarding } from './src/pages/Onboarding';

const queryClient = new QueryClient();

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/features" element={<Features />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resume/new" element={<ResumeBuilder />} />
              <Route path="/resume/:id" element={<ResumeBuilder />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/coach" element={<CareerCoach />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/onboarding" element={<Onboarding />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;