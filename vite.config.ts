import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // This is crucial for Cloud Run/Docker builds. 
      // It replaces 'process.env.API_KEY' in your code with the actual value at build time.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env': {} // Fallback to prevent crashes if other process.env props are accessed
    },
    build: {
      target: 'esnext', // Support top-level await if necessary
    }
  };
});