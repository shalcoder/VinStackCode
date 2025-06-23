import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface LoginFormProps {
  onToggleMode: () => void;
}

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  const { signIn, signUp } = useSupabaseAuth();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      email: 'developer@vinstack.com',
      password: 'password123'
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      setIsLoading(true);
      await signIn(data.email, data.password);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. If using demo credentials, you may need to create the demo account first.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Auto-fill demo credentials
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
      const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
      if (emailInput && passwordInput) {
        emailInput.value = 'developer@vinstack.com';
        passwordInput.value = 'password123';
        form.requestSubmit();
      }
    }
  };

  const createDemoAccount = async () => {
    try {
      setError('');
      setIsCreatingDemo(true);
      
      // First try to create the demo account
      await signUp('developer@vinstack.com', 'password123', 'developer');
      
      // If successful, automatically sign in
      setTimeout(async () => {
        try {
          await signIn('developer@vinstack.com', 'password123');
        } catch (signInErr: any) {
          console.error('Auto sign-in after demo creation failed:', signInErr);
          setError('Demo account created! Please try logging in now.');
        }
      }, 1000);
      
    } catch (err: any) {
      console.error('Demo account creation error:', err);
      if (err.message?.includes('already registered')) {
        // Account exists, try to sign in directly
        try {
          await signIn('developer@vinstack.com', 'password123');
        } catch (signInErr: any) {
          setError('Demo account exists but login failed. Please check your Supabase email confirmation settings.');
        }
      } else {
        setError(err.message || 'Failed to create demo account.');
      }
    } finally {
      setIsCreatingDemo(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your VinStackCode account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            icon={<Mail className="w-4 h-4" />}
            placeholder="Enter your email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={<Lock className="w-4 h-4" />}
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-800 rounded-lg p-3">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary-400 hover:text-primary-300 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>

        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-300">Demo Account</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDemoLogin}
                disabled={isLoading || isCreatingDemo}
              >
                Use Demo
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={createDemoAccount}
                disabled={isLoading || isCreatingDemo}
                isLoading={isCreatingDemo}
              >
                <UserPlus className="w-3 h-3 mr-1" />
                Create Demo
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <p><strong>Email:</strong> developer@vinstack.com</p>
            <p><strong>Password:</strong> password123</p>
            <p className="text-blue-400 mt-2">
              💡 Click "Create Demo" to set up the demo account, then "Use Demo" to login.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;