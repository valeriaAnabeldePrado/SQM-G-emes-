import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: parseInt(process.env.PORT) || 5173,
    strictPort: false,
    host: '0.0.0.0',
    middlewareMode: false,
    hmr: {
      host: 'localhost',
      port: 5173
    },
    allowedHosts: ['localhost', '127.0.0.1', '503a90763b0a.ngrok-free.app', '.ngrok-free.app']
  }
})
