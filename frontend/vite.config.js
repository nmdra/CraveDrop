import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      host: '0.0.0.0', // Use the host from the env variable or default to localhost
      port: parseInt(env.VITE_PORT) || 3000, // Optional: Add this if you want to set the port from env as well
      proxy: {
        '/api': {
          target: 'http://cravedrop.local/api', // Access VITE_API_URL using loadEnv
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
