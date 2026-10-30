import assert from 'node:assert/strict'
import test from 'node:test'
import { openMask } from '../src/components/web-sections/edificio-3d/interiors/planImage.js'

// Máscara de w x h con una franja vertical de `width` px en x = 4
function stripe(width, w = 16, h = 12) {
  const mask = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) for (let x = 4; x < 4 + width; x++) mask[y * w + x] = 1
  return mask
}
const count = (mask) => mask.reduce((sum, v) => sum + v, 0)

test('la apertura de 3 px borra los trazos de mobiliario de 2 px', () => {
  assert.equal(count(openMask(stripe(2), 16, 12, 3)), 0)
})

test('la apertura de 3 px conserva intactos los muros de 3 px o más', () => {
  for (const width of [3, 5]) {
    const mask = stripe(width)
    assert.deepEqual(openMask(mask, 16, 12, 3), mask)
  }
})

test('la apertura por defecto (2 px) sigue conservando los trazos de 2 px', () => {
  const mask = stripe(2)
  assert.deepEqual(openMask(mask, 16, 12), mask)
})
