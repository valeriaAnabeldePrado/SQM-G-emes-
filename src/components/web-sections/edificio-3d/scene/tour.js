import { LOT } from '../buildings/vivra-guemes/config.js'

/**
 * Recorrido de entrada: la cámara arranca en las oficinas (Peredo), espera
 * `hold` segundos y da media vuelta al edificio por el lado de Belgrano hasta
 * la vista aérea desde Pueyrredón. Mientras gira se aleja y sube: el camino es
 * una elipse inclinada, baja sobre Peredo y alta sobre Pueyrredón, así al final
 * se ven la terraza y la pileta.
 */
export const TOUR = { hold: 1.5, duration: 10, end: 'aerea' }

// Centro del giro: el medio del lote, entre la torre y las oficinas
const CENTER = [0, LOT.depth / 2]
// A mitad de camino la cámara mira al conjunto (la torre a media altura y el
// patio), no a las oficinas ni a la avenida: así queda centrado en cuadro
const MID_TARGET = [0, 26, LOT.depth / 2]

const lerp = (a, b, t) => a + (b - a) * t
const smoothstep = (t) => t * t * (3 - 2 * t)

/** Diferencia de ángulos por el camino corto, en (-π, π]. */
function angleDelta(from, to) {
  const d = (to - from) % (2 * Math.PI)
  return d > Math.PI ? d - 2 * Math.PI : d <= -Math.PI ? d + 2 * Math.PI : d
}

/** Posición en planta respecto del centro: ángulo (desde +z hacia +x) y radio. */
function polar([x, , z]) {
  const dx = x - CENTER[0]
  const dz = z - CENTER[1]
  return { angle: Math.atan2(dx, dz), radius: Math.hypot(dx, dz) }
}

/**
 * Pose en el instante `k` (0 a 1, ya con easing) del giro de `from` a `to`
 * ({ position, target, fov }, arrays de 3).
 */
export function tourPose(k, from, to) {
  if (k <= 0) return { position: [...from.position], target: [...from.target], fov: from.fov }
  if (k >= 1) return { position: [...to.position], target: [...to.target], fov: to.fov }
  const a = polar(from.position)
  const b = polar(to.position)
  const angle = a.angle + angleDelta(a.angle, b.angle) * k
  // Se abre rápido (de costado la torre entra entera en cuadro) y sube con
  // una curva suave hasta quedar alto sobre la avenida
  const radius = lerp(a.radius, b.radius, Math.sqrt(k))
  const s = smoothstep(k)
  const position = [
    CENTER[0] + Math.sin(angle) * radius,
    lerp(from.position[1], to.position[1], s),
    CENTER[1] + Math.cos(angle) * radius
  ]
  // Bézier cuadrática por MID_TARGET
  const target = from.target.map(
    (v, i) => (1 - s) * (1 - s) * v + 2 * (1 - s) * s * MID_TARGET[i] + s * s * to.target[i]
  )
  return { position, target, fov: lerp(from.fov, to.fov, s) }
}
