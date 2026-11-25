import assert from 'node:assert/strict'
import test from 'node:test'
import { contextTone } from '../src/components/web-sections/edificio-3d/architecture/viewCorridor.js'

const close = (a, b) =>
  Object.keys(b).forEach((k) => assert.ok(Math.abs(a[k] - b[k]) < 1e-9, `${k}: ${a[k]}`))

test('maquette tone: 0 keeps today, 1 is white, night as before', () => {
  close(contextTone(0, 0), { wash: 0.14, saturation: 0.55 })
  close(contextTone(0, 1), { wash: 0.5, saturation: 0 })
  close(contextTone(1, 0), { wash: 0.14 * 0.06, saturation: 0.8 })
})
