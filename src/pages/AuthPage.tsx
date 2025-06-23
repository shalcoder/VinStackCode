import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <div className="flex items-center justify-center lg:justify-start mb-8">
            <Code2 className="w-16 h-16 text-primary-500 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-white">VinStackCode</h1>
              <p className="text-primary-400 text-lg">Collaborative Coding</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-6">
            Manage and Share Your Code Snippets
          </h2>
          
          <div className="space-y-4 text-gray-300">
            <div className="flex items-center justify-center lg:justify-start">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
              <span>Organize your code snippets efficiently</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
              <span>Collaborate with your team in real-time</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
              <span>Syntax highlighting for 20+ languages</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
              <span>Search and filter with advanced options</span>
            </div>
          </div>
        </motion.div>

        {/* Right side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;