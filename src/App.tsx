import React from 'react';
import { useAuthStore } from './store/authStore';
import AuthPage from './pages/AuthPage';
import MainPage from './pages/MainPage';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="App">
      {isAuthenticated ? <MainPage /> : <AuthPage />}
    </div>
  );
}

export default App;