import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// En desarrollo, /api/disponibilidad se sirve con el mismo código que la
// función serverless de Vercel (api/disponibilidad.js)
const devApi = () => ({
  name: 'dev-api-disponibilidad',
  configureServer(server) {
    server.middlewares.use('/api/disponibilidad', async (req, res) => {
      const { fetchAvailability } = await import('./api/_lib/disponibilidad.js')
      res.setHeader('Content-Type', 'application/json')
      try {
        res.end(JSON.stringify({ units: await fetchAvailability() }))
      } catch {
        res.statusCode = 502
        res.end(JSON.stringify({ units: [], error: 'No se pudo leer la disponibilidad' }))
      }
    })
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), devApi()],
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
