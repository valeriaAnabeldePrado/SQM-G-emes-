import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const data = JSON.parse(
  readFileSync(
    new URL('../src/components/web-sections/edificio-3d/context/contextData.json', import.meta.url)
  )
)

// Edificios detrás de las oficinas, en la línea de vista desde VIVRA hacia Peredo:
// tapaban las oficinas y asomaban detrás de la torre. Correcciones pedidas por el
// usuario: quedan en planta baja y un piso.
const LOW = 7 // m
const BEHIND_OFFICES = [
  // Manzana de enfrente sobre Peredo, contra Av. Julio A. Roca (43,2 m)
  { name: 'tower across Peredo', x0: -25, x1: 9, z0: 55, z1: 90, volumes: 4 },
  // Cruzando Roca, la siguiente (27,5 m) y la torre de atrás (43,2 m)
  { name: 'building across Roca', x0: -15, x1: 12, z0: 97, z1: 131, volumes: 3 },
  { name: 'tower behind it', x0: -15, x1: 1, z0: 131, z1: 150, volumes: 2 }
]

const centroid = (b) => {
  const xs = b.p.map((p) => p[0])
  const zs = b.p.map((p) => p[1])
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...zs) + Math.max(...zs)) / 2]
}

for (const { name, x0, x1, z0, z1, volumes } of BEHIND_OFFICES) {
  test(`${name} stays low`, () => {
    const inside = data.buildings.filter((b) => {
      const [cx, cz] = centroid(b)
      return cx > x0 && cx < x1 && cz > z0 && cz < z1
    })
    assert.ok(inside.length >= volumes, 'the volumes must still exist')
    for (const b of inside) assert.ok(b.h <= LOW, `height ${b.h}`)
  })
}
