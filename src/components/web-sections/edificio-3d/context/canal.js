import contextData from './contextData.json'

// Geometría de La Cañada a partir del eje OSM (ver bake-osm-context.py).
export const CANAL = contextData.canal
export const CANAL_DEPTH = 3.5 // fondo del canal bajo el nivel de vereda
export const CANAL_WALL = 0.6
export const CANAL_PARAPET = 0.75 // pretil de piedra sobre la vereda
export const CANAL_HALF = CANAL ? CANAL.width / 2 : 0

/** x del eje del canal a la altura z (el arroyo corre casi paralelo a z). */
export function canalAxisX(z) {
  const axis = CANAL.axis
  if (z <= axis[0][1]) return axis[0][0]
  for (let i = 0; i < axis.length - 1; i++) {
    const [ax, az] = axis[i]
    const [bx, bz] = axis[i + 1]
    if (z <= bz) return ax + ((bx - ax) * (z - az)) / (bz - az || 1)
  }
  return axis[axis.length - 1][0]
}

export const canalZRange = () => [CANAL.axis[0][1], CANAL.axis[CANAL.axis.length - 1][1]]

/** ¿z cae sobre un puente (con un margen opcional)? */
export const onBridge = (z, margin = 0) =>
  CANAL.bridges.some(([a, b]) => z >= a - margin && z <= b + margin)

/** Tramos del canal a cielo abierto (entre puentes). */
export function openStretches() {
  const [start, end] = canalZRange()
  const stretches = []
  let z = start
  for (const [a, b] of CANAL.bridges) {
    if (a > z) stretches.push([z, Math.min(a, end)])
    z = Math.max(z, b)
  }
  if (z < end) stretches.push([z, end])
  return stretches
}

/** Puntos del eje dentro de [z0, z1], con los extremos incluidos. */
export function axisPoints(z0, z1) {
  const inner = CANAL.axis.filter(([, z]) => z > z0 && z < z1)
  return [[canalAxisX(z0), z0], ...inner, [canalAxisX(z1), z1]]
}
