import { LOT } from '../buildings/vivra-guemes/config'
import contextData from './contextData.json'

// Calles frente al lote. Las líneas municipales salen de OSM (frentes de
// edificios a ambos lados); el reparto calzada/vereda es aproximado.
export const STREETS = {
  pueyrredon: { lineNorth: -16.2, curbNorth: -13.3, curbSouth: -2.9, lineSouth: 0 },
  peredo: {
    lineNorth: LOT.depth,
    curbNorth: LOT.depth + 2.6,
    curbSouth: LOT.depth + 10.2,
    lineSouth: LOT.depth + 12.8
  }
}

export const STREET_LENGTH = 520
export const SIDEWALK_HEIGHT = 0.15

/** Distancia de un punto a la calle OSM más cercana (para no plantar árboles en esquinas). */
export function distanceToRoads(x, z) {
  let best = Infinity
  for (const road of contextData.roads) {
    for (let i = 0; i < road.p.length - 1; i++) {
      const [ax, az] = road.p[i]
      const [bx, bz] = road.p[i + 1]
      const dx = bx - ax
      const dz = bz - az
      const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1)))
      best = Math.min(best, Math.hypot(x - ax - t * dx, z - az - t * dz) - road.w / 2)
    }
  }
  return best
}

/**
 * Tramos de x donde una calle OSM cruza la franja [zMin, zMax] (esquinas).
 * Sirve para cortar las veredas de Pueyrredón y Peredo en los cruces.
 */
export function crossings(zMin, zMax) {
  const zMid = (zMin + zMax) / 2
  const intervals = []
  for (const road of contextData.roads) {
    for (let i = 0; i < road.p.length - 1; i++) {
      const [ax, az] = road.p[i]
      const [bx, bz] = road.p[i + 1]
      if ((az - zMid) * (bz - zMid) > 0 || az === bz) continue
      const x = ax + ((zMid - az) / (bz - az)) * (bx - ax)
      intervals.push([x - road.w / 2 - 1.5, x + road.w / 2 + 1.5])
    }
  }
  intervals.sort((a, b) => a[0] - b[0])
  const merged = []
  for (const iv of intervals) {
    const last = merged[merged.length - 1]
    if (last && iv[0] <= last[1]) last[1] = Math.max(last[1], iv[1])
    else merged.push([...iv])
  }
  return merged
}

/** Complemento de `crossings` dentro de [from, to]. */
export function segmentsBetween(from, to, cuts) {
  const segments = []
  let x = from
  for (const [a, b] of cuts) {
    if (a > x) segments.push([x, Math.min(a, to)])
    x = Math.max(x, b)
  }
  if (x < to) segments.push([x, to])
  return segments.filter(([a, b]) => b > a)
}
