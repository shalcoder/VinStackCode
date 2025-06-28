import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react-native';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

interface LoginFormProps {
  onToggleMode: () => void;
}

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  const { signIn, signUp } = useSupabaseAuth();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      email: 'demo@codequest.com',
      password: 'demo123'
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await signIn(data.email, data.password);
    } catch (err: any) {
      console.error('Login error:', err);
      Alert.alert(
        'Login Failed',
        err.message?.includes('Invalid login credentials')
          ? 'Invalid email or password. If using demo credentials, you may need to create the demo account first.'
          : err.message || 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    handleSubmit(onSubmit)();
  };

  const createDemoAccount = async () => {
    try {
      setIsCreatingDemo(true);
      
      // Create the demo account
      const result = await signUp('demo@codequest.com', 'demo123', 'DemoUser');
      
      if (result.user) {
        if (result.session) {
          // User is automatically signed in
        } else {
          // Email confirmation required
          Alert.alert(
            'Demo Account Created',
            'Please check your email for confirmation, or try logging in if email confirmation is disabled.'
          );
        }
      }
      
    } catch (err: any) {
      console.error('Demo account creation error:', err);
      if (err.message?.includes('already registered') || err.message?.includes('already been registered')) {
        // Account exists, try to sign in directly
        try {
          await signIn('demo@codequest.com', 'demo123');
        } catch (signInErr: any) {
          if (signInErr.message?.includes('Email not confirmed')) {
            Alert.alert(
              'Email Confirmation Required',
              'Demo account exists but email needs confirmation. Please check your email or contact support.'
            );
          } else {
            Alert.alert(
              'Login Failed',
              'Demo account exists but login failed. Please try the login button.'
            );
          }
        }
      } else if (err.message?.includes('Email not confirmed')) {
        Alert.alert(
          'Email Confirmation Required',
          'Demo account created but email confirmation is required. Please check your email.'
        );
      } else {
        Alert.alert(
          'Account Creation Failed',
          err.message || 'Failed to create demo account.'
        );
      }
    } finally {
      setIsCreatingDemo(false);
    }
  };

  return (
    <View className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <View className="items-center mb-6">
        <Text className="text-white text-xl font-bold mb-1">Welcome Back</Text>
        <Text className="text-gray-400">Sign in to your CodeQuest account</Text>
      </View>

      <View className="space-y-4">
        {/* Email Input */}
        <View>
          <Text className="text-gray-300 text-sm mb-1">Email</Text>
          <View className="flex-row items-center bg-gray-800 border border-gray-600 rounded-lg px-3 py-2">
            <Mail size={18} color="#9ca3af" />
            <Controller
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 text-white ml-2"
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
              name="email"
            />
          </View>
          {errors.email && (
            <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>
          )}
        </View>

        {/* Password Input */}
        <View>
          <Text className="text-gray-300 text-sm mb-1">Password</Text>
          <View className="flex-row items-center bg-gray-800 border border-gray-600 rounded-lg px-3 py-2">
            <Lock size={18} color="#9ca3af" />
            <Controller
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 text-white ml-2"
                  placeholder="Enter your password"
                  placeholderTextColor="#9ca3af"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPassword}
                />
              )}
              name="password"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={18} color="#9ca3af" />
              ) : (
                <Eye size={18} color="#9ca3af" />
              )}
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>
          )}
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          className="bg-primary-600 rounded-lg py-3 items-center mt-2"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold">Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Toggle to Register */}
        <View className="items-center mt-4">
          <Text className="text-gray-400">
            Don't have an account?{' '}
            <Text className="text-primary-400" onPress={onToggleMode}>
              Sign up
            </Text>
          </Text>
        </View>

        {/* Demo Account */}
        <View className="bg-gray-800 rounded-lg p-4 mt-4 border border-gray-600">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-300 font-medium">Demo Account</Text>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                className="bg-gray-700 px-3 py-1 rounded-lg"
                onPress={handleDemoLogin}
                disabled={isLoading || isCreatingDemo}
              >
                <Text className="text-white text-sm">Use Demo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-primary-700 px-3 py-1 rounded-lg flex-row items-center"
                onPress={createDemoAccount}
                disabled={isLoading || isCreatingDemo}
              >
                {isCreatingDemo ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <UserPlus size={14} color="#fff" />
                    <Text className="text-white text-sm ml-1">Create Demo</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Text className="text-gray-400 text-xs">Email: demo@codequest.com</Text>
            <Text className="text-gray-400 text-xs">Password: demo123</Text>
            <Text className="text-blue-400 text-xs mt-2">
              💡 Click "Create Demo" to set up the demo account, then "Use Demo" to login.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginForm;