import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, useAuthStore } from './store/authStore';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import SnippetEditorPage from './pages/SnippetEditorPage';
import SnippetViewPage from './pages/SnippetViewPage';
import TeamManagementPage from './pages/TeamManagementPage';
import IntegrationsPage from './pages/IntegrationsPage';
import PricingPage from './components/payment/PricingPage';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();
  const { isInitialized, setInitialized } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      setInitialized(true);
    }
  }, [loading, setInitialized]);

  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/editor" element={<SnippetEditorPage />} />
        <Route path="/editor/:id" element={<SnippetEditorPage />} />
        <Route path="/snippet/:id" element={<SnippetViewPage />} />
        <Route path="/teams" element={<TeamManagementPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/pricing" element={<PricingPage onBack={() => window.history.back()} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;