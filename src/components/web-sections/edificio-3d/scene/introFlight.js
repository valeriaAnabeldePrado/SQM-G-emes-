import { CONTEXT_FULL_HEIGHT } from '../architecture/viewCorridor.js'
import { LOT } from '../buildings/vivra-guemes/config.js'

/**
 * Entrada tipo drone: arranca casi cenital a `startAltitude` con el norte
 * arriba, sobre el barrio modelado visto como un mapa (huellas planas); baja
 * con la altura en escala logarítmica (como el zoom de un mapa), el barrio
 * crece, se inclina en el último tramo y aterriza en la vista general.
 * A 1.000 m todo lo que se ve está dentro del barrio modelado (±800 m).
 */
export const INTRO = { duration: 5, startAltitude: 1000, startPolarDeg: 3, sweepDeg: 25 }

/** Norte geográfico en el plano local (x, z) de la escena (ver bake-osm-context.py). */
export const NORTH = [-0.3389946, -0.9407883]

const START_TARGET = [0, 0, LOT.depth / 2]
const DEG = Math.PI / 180

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const smootherstep = (t) => t * t * t * (t * (6 * t - 15) + 10)
const lerp = (a, b, t) => a + (b - a) * t
/** Diferencia de ángulos por el camino corto, en (-π, π]. */
const angleDelta = (from, to) => {
  const d = (to - from) % (2 * Math.PI)
  return d > Math.PI ? d - 2 * Math.PI : d <= -Math.PI ? d + 2 * Math.PI : d
}

/**
 * Pose de la cámara en el instante `t` (0 a 1) del vuelo hacia `home`
 * ({ position, target, fov }, arrays de 3).
 */
export function introPose(t, home) {
  if (t >= 1) {
    return { position: [...home.position], target: [...home.target], fov: home.fov }
  }
  const offset = home.position.map((v, i) => v - home.target[i])
  const homeRadius = Math.hypot(...offset)
  const homePolar = Math.acos(offset[1] / homeRadius)
  const homeAzimuth = Math.atan2(offset[0], offset[2])

  const startPolar = INTRO.startPolarDeg * DEG
  const startRadius = INTRO.startAltitude / Math.cos(startPolar)
  // Cámara al sur del punto de mira: la parte de arriba de la pantalla mira al norte
  const startAzimuth = Math.atan2(-NORTH[0], -NORTH[1])

  const k = smootherstep(t)
  const target = START_TARGET.map((v, i) => lerp(v, home.target[i], k))
  const radius = Math.exp(lerp(Math.log(startRadius), Math.log(homeRadius), k))
  const polar = lerp(startPolar, homePolar, smoothstep(0.55, 1, t))
  const azimuth =
    startAzimuth +
    angleDelta(startAzimuth, homeAzimuth) * k +
    INTRO.sweepDeg * DEG * Math.sin(Math.PI * t)

  const position = [
    target[0] + radius * Math.sin(polar) * Math.sin(azimuth),
    target[1] + radius * Math.cos(polar),
    target[2] + radius * Math.sin(polar) * Math.cos(azimuth)
  ]
  return { position, target, fov: home.fov }
}

/**
 * Capas de la escena según la altura de la cámara:
 *   contextHeight: altura de corte del barrio (crece entre 700 y 200 m)
 *   fogScale:      cuánto se aleja la niebla
 */
export function introLayers(altitude) {
  const rise = smoothstep(Math.log(700), Math.log(200), Math.log(Math.max(altitude, 1)))
  return {
    contextHeight: rise >= 1 ? CONTEXT_FULL_HEIGHT : 120 * rise ** 3,
    fogScale: Math.max(1, altitude / 300)
  }
}

export const FINAL_LAYERS = introLayers(0)
