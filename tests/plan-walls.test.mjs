import assert from 'node:assert/strict'
import test from 'node:test'
import {
  fillShafts,
  openMask
} from '../src/components/web-sections/edificio-3d/interiors/planImage.js'

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

// Dibujo de prueba de 20 x 20 px (escala 10 px/m): blanco con trazos grises
function drawing() {
  const w = 20
  const h = 20
  const data = new Uint8ClampedArray(w * h * 4).fill(255)
  const walls = new Uint8Array(w * h)
  const paint = (x0, y0, x1, y1, isWall) => {
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = y * w + x
        data.set([150, 150, 150, 255], i * 4)
        if (isWall) walls[i] = 1
      }
    }
  }
  return { w, h, data, walls, paint }
}

test('un conducto (muros en tres lados y tapa en línea fina) queda macizo', () => {
  const { w, h, data, walls, paint } = drawing()
  paint(4, 4, 7, 14, true) // muro izquierdo
  paint(13, 4, 16, 14, true) // muro derecho
  paint(4, 11, 16, 14, true) // fondo
  paint(7, 4, 13, 5, false) // tapa del pleno: línea de 1 px
  const solid = fillShafts(walls, data, w, h, 10)
  assert.equal(solid[8 * w + 10], 1, 'el interior del pleno debe quedar relleno')
})

test('un mueble dibujado en línea fina (inodoro, mesada) no se rellena', () => {
  const { w, h, data, walls, paint } = drawing()
  paint(5, 5, 12, 6, false)
  paint(5, 10, 12, 11, false)
  paint(5, 5, 6, 11, false)
  paint(11, 5, 12, 11, false)
  const solid = fillShafts(walls, data, w, h, 10)
  assert.equal(solid[8 * w + 8], 0)
})
