import assert from 'node:assert/strict'
import test from 'node:test'
import { buildBoxGeometries } from '../src/components/web-sections/edificio-3d/architecture/boxes.js'
import { buildPocito, replacesPocitoVolume } from '../src/components/web-sections/edificio-3d/context/pocito.js'

test('Pocito replaces its old generic tower but keeps the school and Belgrano neighbors', () => {
  assert.equal(replacesPocitoVolume({ p: [[162, 80], [208, 80], [208, 101], [162, 101]] }), true)
  assert.equal(replacesPocitoVolume({ p: [[171, 65], [202, 65], [202, 72], [171, 72]] }), true)
  // The northern school is L-shaped: its bounding box overlaps the site.
  assert.equal(replacesPocitoVolume({ p: [[196.5,59.8],[211.7,59.9],[212.2,13.6],[202.4,3.3],[162.1,2.5],[161.9,13.1],[191.2,13.7],[200.8,22.6],[200.6,49],[196.6,48.9]] }), false)
  assert.equal(replacesPocitoVolume({ p: [[90, 80], [110, 80], [110, 110], [90, 110]] }), false)
})

test('the actual glazed tower reaches 105 m at its mapped location and the second stays unfinished', () => {
  const { items } = buildPocito()
  const glass = items.filter((item) => item.material === 'pocitoGlass')
  assert.ok(glass.some((item) => item.max[1] - item.min[1] > 80), 'a tall glazed body must be present')
  for (const item of glass) {
    if (item.max[1] < 20) continue // commercial podium
    assert.ok(item.min[0] >= 161.7 && item.max[0] <= 207.8)
    assert.ok(item.min[2] >= 80.1 && item.max[2] <= 101.3)
  }
  assert.equal(Math.max(...items.filter((item) => item.material === 'pocitoStone').map((item) => item.max[1])), 105)
  const unfinished = items.filter((item) => item.material === 'pocitoConcrete' && item.min[2] >= 175 && item.min[0] >= 162 && item.max[0] <= 207.5)
  assert.ok(unfinished.length > 40, 'the second tower must have open slabs and columns')
  assert.ok(Math.max(...unfinished.map((item) => item.max[1])) < 90)
  assert.ok(items.every((item) => item.material !== 'pocitoGlass' || item.max[2] < 175 || item.max[1] < 20))
})

test('landmark geometry stays inside a small material and vertex budget', () => {
  const geometries = buildBoxGeometries(buildPocito())
  assert.ok(geometries.size <= 6)
  let vertices = 0
  for (const geometry of geometries.values()) {
    const positions = geometry.getAttribute('position')
    vertices += positions.count
    assert.ok(positions.array.every(Number.isFinite))
    assert.equal(geometry.getAttribute('aBuildingMin'), undefined, 'no per-building fade buffers')
    geometry.dispose()
  }
  assert.ok(vertices < 50000, `geometry budget exceeded: ${vertices} vertices`)
})
