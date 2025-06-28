import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

interface RegisterFormProps {
  onToggleMode: () => void;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useSupabaseAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>();

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await signUp(data.email, data.password, data.username);
      Alert.alert(
        'Account Created',
        'Your account has been created successfully. Please check your email for confirmation if required.',
        [{ text: 'OK', onPress: onToggleMode }]
      );
    } catch (err: any) {
      console.error('Registration error:', err);
      Alert.alert(
        'Registration Failed',
        err.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <View className="items-center mb-6">
        <Text className="text-white text-xl font-bold mb-1">Create Account</Text>
        <Text className="text-gray-400">Join CodeQuest today</Text>
      </View>

      <View className="space-y-4">
        {/* Username Input */}
        <View>
          <Text className="text-gray-300 text-sm mb-1">Username</Text>
          <View className="flex-row items-center bg-gray-800 border border-gray-600 rounded-lg px-3 py-2">
            <User size={18} color="#9ca3af" />
            <Controller
              control={control}
              rules={{
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 text-white ml-2"
                  placeholder="Choose a username"
                  placeholderTextColor="#9ca3af"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              )}
              name="username"
            />
          </View>
          {errors.username && (
            <Text className="text-red-500 text-xs mt-1">{errors.username.message}</Text>
          )}
        </View>

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
                  placeholder="Create a password"
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

        {/* Confirm Password Input */}
        <View>
          <Text className="text-gray-300 text-sm mb-1">Confirm Password</Text>
          <View className="flex-row items-center bg-gray-800 border border-gray-600 rounded-lg px-3 py-2">
            <Lock size={18} color="#9ca3af" />
            <Controller
              control={control}
              rules={{
                required: 'Please confirm your password',
                validate: value =>
                  value === password || 'Passwords do not match'
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 text-white ml-2"
                  placeholder="Confirm your password"
                  placeholderTextColor="#9ca3af"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPassword}
                />
              )}
              name="confirmPassword"
            />
          </View>
          {errors.confirmPassword && (
            <Text className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</Text>
          )}
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          className="bg-primary-600 rounded-lg py-3 items-center mt-2"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-bold">Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Toggle to Login */}
        <View className="items-center mt-4">
          <Text className="text-gray-400">
            Already have an account?{' '}
            <Text className="text-primary-400" onPress={onToggleMode}>
              Sign in
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RegisterForm;