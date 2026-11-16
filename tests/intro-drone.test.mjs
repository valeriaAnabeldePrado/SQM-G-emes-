import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { SATELLITE } from '../src/components/web-sections/edificio-3d/context/satellite.js'
import { CONTEXT_FULL_HEIGHT } from '../src/components/web-sections/edificio-3d/architecture/viewCorridor.js'
import {
  FINAL_LAYERS,
  NORTH,
  introLayers,
  introPose
} from '../src/components/web-sections/edificio-3d/scene/introFlight.js'

/** Alto y ancho de un JPEG (marcadores SOF0 / SOF2). */
function jpegSize(bytes) {
  let i = 2
  while (i < bytes.length) {
    if (bytes[i] !== 0xff) throw new Error('JPEG inválido')
    const marker = bytes[i + 1]
    const length = bytes.readUInt16BE(i + 2)
    if (marker === 0xc0 || marker === 0xc2) {
      return { height: bytes.readUInt16BE(i + 5), width: bytes.readUInt16BE(i + 7) }
    }
    i += 2 + length
  }
  throw new Error('sin SOF')
}

test('satellite image is baked, square and light', () => {
  assert.equal(SATELLITE.size, 8000)
  const file = new URL('../public' + SATELLITE.url, import.meta.url)
  const bytes = fs.readFileSync(file)
  assert.ok(bytes.length <= 700 * 1024, `${bytes.length} bytes`)
  assert.deepEqual(jpegSize(bytes), { width: 1024, height: 1024 })
})

// Vista general real a 1440×900 (homeView de CameraRig)
const home = { position: [28.4, 43.2, -85.7], target: [0, 28.1, 9], fov: 35 }

test('flight starts high, near-vertical and north-up', () => {
  const p = introPose(0, home)
  assert.ok(Math.abs(p.position[1] - 6000) < 300, `altitude ${p.position[1]}`)
  const dx = p.target[0] - p.position[0]
  const dz = p.target[2] - p.position[2]
  const h = Math.hypot(dx, dz)
  assert.ok(h / p.position[1] < Math.tan((4 * Math.PI) / 180))
  assert.ok((dx * NORTH[0] + dz * NORTH[1]) / h > 0.99, 'screen top must face north')
})

test('flight lands exactly on the home view', () => {
  const p = introPose(1, home)
  for (const k of ['position', 'target']) {
    p[k].forEach((v, i) => assert.ok(Math.abs(v - home[k][i]) < 1e-6, `${k}[${i}]`))
  }
  assert.equal(p.fov, home.fov)
})

test('altitude always decreases and the tilt comes late', () => {
  let last = Infinity
  for (let i = 0; i <= 100; i++) {
    const p = introPose(i / 100, home)
    assert.ok(p.position[1] < last, `t=${i / 100}`)
    last = p.position[1]
    if (i <= 60) {
      const h = Math.hypot(p.target[0] - p.position[0], p.target[2] - p.position[2])
      assert.ok(Math.atan2(h, p.position[1] - p.target[1]) < (20 * Math.PI) / 180, `tilt t=${i / 100}`)
    }
  }
})

test('layers: photo and maquette above, real neighborhood below', () => {
  assert.deepEqual(introLayers(6000, 0), { satellite: 1, contextHeight: 0, maquette: 1, fogScale: 20 })
  assert.deepEqual(FINAL_LAYERS, {
    satellite: 0,
    contextHeight: CONTEXT_FULL_HEIGHT,
    maquette: 0,
    fogScale: 1
  })
  // La foto (10 m por píxel) se va antes de verse borrosa: el barrio modelado la reemplaza
  const mid = introLayers(1500, 0.4).satellite
  assert.ok(mid > 0 && mid < 1)
  assert.equal(introLayers(800, 0.5).satellite, 0)
  assert.equal(introLayers(2500, 0.3).satellite, 1)
})
