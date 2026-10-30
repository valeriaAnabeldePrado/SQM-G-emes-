import { fetchAvailability } from './_lib/disponibilidad.js'

/** GET /api/disponibilidad -> { units: [{ piso, unidad, tipo, m2, orientacion, disponible }] } */
export default async function handler(req, res) {
  try {
    const units = await fetchAvailability()
    // La planilla se edita a mano: 5 minutos de caché en el CDN alcanzan
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=900')
    res.status(200).json({ units })
  } catch {
    res.status(502).json({ units: [], error: 'No se pudo leer la disponibilidad' })
  }
}
