import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/components',
      '@screens': '/src/screens',
      '@hooks': '/src/hooks',
      '@services': '/src/services',
      '@store': '/src/store',
      '@utils': '/src/utils',
      '@lib': '/src/lib',
      '@types': '/src/types',
      '@assets': '/assets'
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-native-web'],
          ui: ['react-native-safe-area-context', 'react-native-screens'],
          navigation: ['@react-navigation/native', '@react-navigation/bottom-tabs', '@react-navigation/native-stack']
        }
      }
    }
  }
});