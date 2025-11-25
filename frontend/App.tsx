import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './src/stores/authStore';
import { ProtectedRoute } from './src/components/auth/ProtectedRoute';
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

const queryClient = new QueryClient();

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resume/new" element={<ResumeBuilder />} />
            <Route path="/resume/:id" element={<ResumeBuilder />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/coach" element={<CareerCoach />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;