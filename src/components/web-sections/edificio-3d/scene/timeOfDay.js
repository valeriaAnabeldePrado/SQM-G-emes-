import * as THREE from 'three'

// Hora del día: posición real del sol en Córdoba para la fecha de hoy y un
// estado de cielo/luz continuo según su altura. Los botones Día / Atardecer /
// Noche son atajos a una hora; la barra permite elegir cualquiera.

const LATITUDE = -31.426
const LONGITUDE = -64.194
const UTC_OFFSET = -3 // Argentina, sin horario de verano

// Norte y este expresados en el sistema local del edificio (ver config.js):
// Pueyrredón corre a -19,8° respecto del este, así que la fachada principal
// mira al NNE.
const NORTH = new THREE.Vector3(-0.339, 0, -0.941)
const EAST = new THREE.Vector3(0.941, 0, -0.339)

/** Dirección hacia el sol (o la luna) a partir de azimut (desde el norte) y altura. */
export function skyDirection(azimuthDeg, elevationDeg) {
  const az = THREE.MathUtils.degToRad(azimuthDeg)
  const el = THREE.MathUtils.degToRad(elevationDeg)
  return new THREE.Vector3()
    .addScaledVector(NORTH, Math.cos(az) * Math.cos(el))
    .addScaledVector(EAST, Math.sin(az) * Math.cos(el))
    .setY(Math.sin(el))
    .normalize()
}

/** Posición del sol (algoritmo NOAA simplificado): azimut y altura en grados. */
export function sunPosition(date, hour) {
  const start = Date.UTC(date.getFullYear(), 0, 0)
  const day = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 864e5
  )
  const g = ((2 * Math.PI) / 365) * (day - 1 + (hour - 12) / 24)
  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(g) -
      0.032077 * Math.sin(g) -
      0.014615 * Math.cos(2 * g) -
      0.040849 * Math.sin(2 * g))
  const decl =
    0.006918 -
    0.399912 * Math.cos(g) +
    0.070257 * Math.sin(g) -
    0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) -
    0.002697 * Math.cos(3 * g) +
    0.00148 * Math.sin(3 * g)
  const solarMinutes = hour * 60 + eqTime + 4 * LONGITUDE - 60 * UTC_OFFSET
  const ha = THREE.MathUtils.degToRad(solarMinutes / 4 - 180)
  const lat = THREE.MathUtils.degToRad(LATITUDE)
  const cosZenith = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(ha)
  const elevation =
    90 - THREE.MathUtils.radToDeg(Math.acos(THREE.MathUtils.clamp(cosZenith, -1, 1)))
  const azimuth =
    (THREE.MathUtils.radToDeg(
      Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(lat) - Math.tan(decl) * Math.cos(lat))
    ) +
      540) %
    360
  return { azimuth, elevation }
}

/** Hora (decimal) de la puesta del sol para la fecha. */
export function sunsetHour(date) {
  for (let h = 15; h < 22; h += 1 / 60) {
    if (sunPosition(date, h).elevation <= 0) return h
  }
  return 19.5
}

/** Atajos: cada botón lleva a una hora (el atardecer, un rato antes de la puesta). */
export const TIMES = {
  // Media mañana: el sol viene del NE y pega de frente en la fachada (mira al NNE)
  dia: { label: 'Día', hour: () => 10.5 },
  atardecer: { label: 'Atardecer', hour: (date) => sunsetHour(date) - 0.35 },
  noche: { label: 'Noche', hour: (date) => sunsetHour(date) + 1.6 }
}

export const HOUR_RANGE = [6, 23]

/** Vista inicial: el atardecer (la misma hora que el atajo). */
export const initialSkyHour = (date) => TIMES.atardecer.hour(date)

// Estados de referencia según la altura del sol (grados). Entre ellos se interpola.
const KEYS = [
  {
    elevation: -8,
    light: ['#9fb6de', 0.5],
    hemisphere: ['#3b5482', '#10141c', 0.34],
    fog: '#1a2234',
    fogRange: [110, 520],
    sky: [2, 3.2, 0.004, 0.7],
    envIntensity: 0.35,
    night: 1
  },
  {
    elevation: -1,
    light: ['#a9b5d6', 0.25],
    hemisphere: ['#5b5f86', '#1d1a1f', 0.28],
    fog: '#3b3a4f',
    fogRange: [180, 680],
    sky: [4, 3, 0.006, 0.8],
    envIntensity: 0.45,
    night: 0.75
  },
  {
    elevation: 2,
    light: ['#ff9a52', 1.6],
    hemisphere: ['#f0b48f', '#4f4038', 0.36],
    fog: '#cf9a80',
    fogRange: [260, 780],
    sky: [10, 3, 0.008, 0.92],
    envIntensity: 0.7,
    night: 0.35
  },
  {
    elevation: 9,
    light: ['#ffb06a', 2.8],
    hemisphere: ['#f3c7a2', '#5a4a3e', 0.42],
    fog: '#d7ab8f',
    fogRange: [260, 780],
    sky: [9, 2.6, 0.007, 0.9],
    envIntensity: 0.85,
    night: 0.12
  },
  {
    elevation: 25,
    light: ['#fff3e2', 2.7],
    hemisphere: ['#dce7f1', '#8f877b', 0.3],
    fog: '#d6dee4',
    fogRange: [260, 780],
    sky: [6, 0.7, 0.004, 0.8],
    envIntensity: 0.7,
    night: 0
  }
]

const MOON = skyDirection(110, 40)
const mixColor = (a, b, t) => `#${new THREE.Color(a).lerp(new THREE.Color(b), t).getHexString()}`
const mix = (a, b, t) => a + (b - a) * t

/**
 * Estado completo de cielo y luz para una hora. Devuelve lo mismo que usan
 * Lighting, SceneEnvironment y los materiales (night = 0 día … 1 noche).
 */
export function skyState(date, hour) {
  const { azimuth, elevation } = sunPosition(date, hour)
  const e = THREE.MathUtils.clamp(elevation, KEYS[0].elevation, KEYS[KEYS.length - 1].elevation)
  let i = 0
  while (i < KEYS.length - 2 && e > KEYS[i + 1].elevation) i++
  const a = KEYS[i]
  const b = KEYS[i + 1]
  const t = (e - a.elevation) / (b.elevation - a.elevation)

  const sun = skyDirection(azimuth, elevation)
  // Con el sol abajo del horizonte la luz pasa a ser la luna (la intensidad
  // en ese momento es mínima, así el cambio de dirección no se nota)
  const direction = elevation > 0 ? skyDirection(azimuth, Math.max(elevation, 3)) : MOON
  // El mapa de entorno se regenera solo al cambiar de tramo (es lo caro)
  const envKey = elevation >= 12 ? 'dia' : elevation >= -2 ? 'atardecer' : 'noche'
  return {
    hour,
    elevation,
    light: {
      direction,
      color: mixColor(a.light[0], b.light[0], t),
      intensity: mix(a.light[1], b.light[1], t)
    },
    sky: {
      sun,
      turbidity: mix(a.sky[0], b.sky[0], t),
      rayleigh: mix(a.sky[1], b.sky[1], t),
      mie: mix(a.sky[2], b.sky[2], t),
      mieG: mix(a.sky[3], b.sky[3], t)
    },
    hemisphere: [
      mixColor(a.hemisphere[0], b.hemisphere[0], t),
      mixColor(a.hemisphere[1], b.hemisphere[1], t),
      mix(a.hemisphere[2], b.hemisphere[2], t)
    ],
    environment: {
      key: envKey,
      file: envKey === 'dia' ? '/edificio-3d/cielo.hdr' : null,
      intensity: mix(a.envIntensity, b.envIntensity, t),
      cityGlow: envKey === 'noche'
    },
    fog: mixColor(a.fog, b.fog, t),
    fogRange: [mix(a.fogRange[0], b.fogRange[0], t), mix(a.fogRange[1], b.fogRange[1], t)],
    night: Math.round(mix(a.night, b.night, t) * 50) / 50
  }
}

export const LIGHT_TARGET = new THREE.Vector3(0, 18, 14)

/** Hora "13:05" a partir de horas decimales. */
export function formatHour(hour) {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  return `${String(m === 60 ? h + 1 : h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
