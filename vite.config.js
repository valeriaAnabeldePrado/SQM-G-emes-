import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// En desarrollo, /api/disponibilidad y /api/contacto se sirven con el mismo
// código que las funciones serverless de Vercel (api/*.js)
const devApi = () => ({
  name: 'dev-api',
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
    // /api/contacto usa SMTP_USER / SMTP_PASS del entorno (ej. .env.local)
    server.middlewares.use('/api/contacto', async (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      if (req.method !== 'POST') {
        res.statusCode = 405
        return res.end(JSON.stringify({ ok: false, error: 'Método no permitido' }))
      }
      let raw = ''
      for await (const chunk of req) raw += chunk
      let body = null
      try {
        body = JSON.parse(raw)
      } catch {
        /* body inválido: handleContact responde 400 */
      }
      const { default: nodemailer } = await import('nodemailer')
      const { handleContact, smtpTransport } = await import('./api/_lib/contacto.js')
      const env = { ...loadEnv('development', process.cwd(), 'SMTP_'), ...process.env }
      const { status, json } = await handleContact(body, env, () => smtpTransport(nodemailer, env))
      res.statusCode = status
      res.end(JSON.stringify(json))
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
