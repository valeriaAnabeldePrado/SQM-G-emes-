import assert from 'node:assert/strict'
import test from 'node:test'
import { tourPose } from '../src/components/web-sections/edificio-3d/scene/tour.js'

// Vistas Oficinas y Aérea (PRESETS de CameraRig)
const from = { position: [-9, 4.5, 64.5], target: [0, 9, 37.5], fov: 58 }
const to = { position: [30, 88, -78], target: [0, 23, 12], fov: 35 }

test('tour starts on the offices and lands exactly on the aerial view', () => {
  assert.deepEqual(tourPose(0, from, to), from)
  assert.deepEqual(tourPose(1, from, to), to)
})

test('tour goes around the Belgrano side (+x), rising all the way', () => {
  let lastY = -Infinity
  for (let k = 0.05; k < 1; k += 0.05) {
    const { position } = tourPose(k, from, to)
    assert.ok(position[1] >= lastY, `height at ${k.toFixed(2)}`)
    lastY = position[1]
  }
  const mid = tourPose(0.5, from, to).position
  assert.ok(mid[0] > 30, `mid x ${mid[0]}`)
})
