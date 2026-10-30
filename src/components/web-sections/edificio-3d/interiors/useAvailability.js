import { useEffect, useState } from 'react'

let request = null

/** Lee /api/disponibilidad una sola vez por visita. */
function loadAvailability() {
  request ??= fetch('/api/disponibilidad')
    .then((response) => (response.ok ? response.json() : { units: [] }))
    .then(({ units }) => Object.fromEntries((units || []).map((u) => [`${u.piso}-${u.unidad}`, u])))
    .catch(() => ({}))
  return request
}

/**
 * Disponibilidad por unidad, con clave "piso-unidad" (ej. "7-B", "PB-Local").
 * Mientras carga (o si la planilla no responde) devuelve null y la escena
 * muestra las unidades sin estado.
 */
export function useAvailability() {
  const [availability, setAvailability] = useState(null)
  useEffect(() => {
    let alive = true
    loadAvailability().then((data) => alive && setAvailability(data))
    return () => {
      alive = false
    }
  }, [])
  return availability
}
