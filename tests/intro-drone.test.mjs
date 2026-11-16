import assert from 'node:assert/strict'
import test from 'node:test'
import {
  CONTEXT_FULL_HEIGHT,
  contextTone
} from '../src/components/web-sections/edificio-3d/architecture/viewCorridor.js'
import {
  FINAL_LAYERS,
  NORTH,
  introLayers,
  introPose
} from '../src/components/web-sections/edificio-3d/scene/introFlight.js'

// Vista general real a 1440×900 (homeView de CameraRig)
const home = { position: [28.4, 43.2, -85.7], target: [0, 28.1, 9], fov: 35 }

test('flight starts high, near-vertical and north-up', () => {
  const p = introPose(0, home)
  assert.ok(Math.abs(p.position[1] - 1000) < 50, `altitude ${p.position[1]}`)
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
      assert.ok(
        Math.atan2(h, p.position[1] - p.target[1]) < (20 * Math.PI) / 180,
        `tilt t=${i / 100}`
      )
    }
  }
})

test('layers: flat map at the start, full neighborhood on landing', () => {
  assert.deepEqual(introLayers(1000, 0), { contextHeight: 0, fogScale: 1000 / 300 })
  assert.deepEqual(FINAL_LAYERS, { contextHeight: CONTEXT_FULL_HEIGHT, fogScale: 1 })
  const mid = introLayers(400, 0.5).contextHeight
  assert.ok(mid > 0 && mid < 120, `rising at 400 m: ${mid}`)
})

const close = (a, b) =>
  Object.keys(b).forEach((k) => assert.ok(Math.abs(a[k] - b[k]) < 1e-9, `${k}: ${a[k]}`))

test('maquette tone: 0 keeps today, 1 is white, night as before', () => {
  close(contextTone(0, 0), { wash: 0.14, saturation: 0.55 })
  close(contextTone(0, 1), { wash: 0.5, saturation: 0 })
  close(contextTone(1, 0), { wash: 0.14 * 0.06, saturation: 0.8 })
})
