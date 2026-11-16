import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const data = JSON.parse(
  readFileSync(
    new URL('../src/components/web-sections/edificio-3d/context/contextData.json', import.meta.url)
  )
)

// Torre de la manzana de enfrente sobre Peredo, contra Av. Julio A. Roca: tapaba
// las oficinas y asomaba detrás de VIVRA. Corrección pedida por el usuario.
const BEHIND_PEREDO = { x0: -25, x1: 9, z0: 55, z1: 90 }
const LOW = 7 // m: planta baja y un piso

test('the tower across Peredo stays low', () => {
  const inside = data.buildings.filter((b) => {
    const xs = b.p.map((p) => p[0])
    const zs = b.p.map((p) => p[1])
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2
    const cz = (Math.min(...zs) + Math.max(...zs)) / 2
    const { x0, x1, z0, z1 } = BEHIND_PEREDO
    return cx > x0 && cx < x1 && cz > z0 && cz < z1
  })
  assert.ok(inside.length >= 4, 'the tower volumes must still exist')
  for (const b of inside) assert.ok(b.h <= LOW, `height ${b.h}`)
})
