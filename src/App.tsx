/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import Landing from './pages/Landing';
import Analyze from './pages/Analyze';
import Processing from './pages/Processing';
import Result from './pages/Result';
import Library from './pages/Library';
import Export from './pages/Export';
import Subscription from './pages/Subscription';
import Prompts from './pages/Prompts';
import Plans from './pages/Plans';
import Profile from './pages/Profile';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#f3f3f4] dark:bg-[#121212] flex flex-col items-center justify-center p-8 transition-colors">
      <div className="w-16 h-16 border-4 border-[#1a1c1c] dark:border-[#f9f9f9] border-t-[#b1241a] animate-spin mb-6"></div>
      <h1 className="text-2xl font-black uppercase tracking-tighter dark:text-[#f9f9f9]">DIGERIA</h1>
    </div>
  );
  if (!user) return <Navigate to="/" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/analyze" element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
            <Route path="/processing" element={<ProtectedRoute><Processing /></ProtectedRoute>} />
            <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
            <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
            <Route path="/export" element={<ProtectedRoute><Export /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
            <Route path="/prompts" element={<ProtectedRoute><Prompts /></ProtectedRoute>} />
            <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

