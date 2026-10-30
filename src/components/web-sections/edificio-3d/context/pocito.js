import { createBoxList } from '../architecture/boxes.js'

// Huellas OSM 689232652 (predio) y 1352630863 (torre construida, height=105).
// Estado de obra: reporte Proaco de septiembre de 2026, torre 2 en nivel +29.
// La torre 2 y los detalles del basamento son aproximaciones desde fotos aéreas.
export const POCITO = {
  site: [[212.69, 246.9], [154.42, 247.52], [153.02, 6.75], [191.61, 62.37], [214.35, 61.59]],
  main: { x0: 161.8, x1: 207.7, z0: 80.2, z1: 101.2, base: 8.2, top: 102, roof: 105, floors: 33 },
  second: { x0: 162, x1: 207.5, z0: 176, z1: 197, base: 8.2, top: 85.5, floors: 27 }
}

/** Sustituye las viejas masas dentro del predio, sin borrar la escuela lindera. */
export function replacesPocitoVolume({ p }) {
  if (p.length < 3) return false
  const x = p.reduce((sum, v) => sum + v[0], 0) / p.length
  const z = p.reduce((sum, v) => sum + v[1], 0) / p.length
  let inside = false
  const polygon = POCITO.site
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [ax, az] = polygon[i]
    const [bx, bz] = polygon[j]
    if ((az > z) !== (bz > z) && x < ((bx - ax) * (z - az)) / (bz - az) + ax) inside = !inside
  }
  return inside
}

function podium(b) {
  b.add('pocitoVoid', 155.5, 212.5, 0, 8, 64, 240)
  b.add('pocitoConcrete', 154.8, 213.2, 7.8, 8.2, 63.5, 240.5)
  for (const x of [155.25, 212.7]) {
    b.add('pocitoGlass', x, x + 0.12, 0.3, 7.7, 64.2, 239.8)
    for (let z = 65; z < 240; z += 14) b.add('pocitoStone', x - 0.2, x + 0.4, 0, 8, z, z + 0.7)
    b.add('pocitoStone', x - 0.25, x + 0.45, 3.8, 4.1, 64, 240)
    b.add('pocitoStone', x - 0.3, x + 0.5, 6.6, 8, 64, 240)
  }
  // El sector B1 sobre Pueyrredón todavía está en obra.
  b.add('pocitoSoil', 156, 169, 0.01, 0.08, 13, 61)
  b.add('pocitoConcrete', 154.7, 155, 0, 2.1, 9, 64)
  b.add('pocitoConcrete', 155, 179, 0, 2.1, 61.5, 61.8)
}

function glazedTower(b) {
  const t = POCITO.main
  const step = (t.top - t.base) / t.floors
  b.add('pocitoGlass', t.x0 + 0.6, t.x1 - 0.6, t.base, t.top - 0.6, t.z0 + 0.6, t.z1 - 0.6)
  // Pórticos claros, bandas finas de losas y montantes del muro cortina.
  for (const x of [t.x0, t.x1 - 0.65]) {
    for (const z of [t.z0, t.z1 - 0.65]) b.add('pocitoStone', x, x + 0.65, t.base, t.top, z, z + 0.65)
  }
  for (let i = 0; i <= t.floors; i++) {
    const y = t.base + step * i
    const thickness = i === t.floors ? 0.65 : 0.16
    for (const z of [t.z0, t.z1 - 0.6]) b.add('pocitoStone', t.x0, t.x1, y - thickness, y, z, z + 0.6)
    for (const x of [t.x0, t.x1 - 0.6]) b.add('pocitoStone', x, x + 0.6, y - thickness, y, t.z0, t.z1)
    if (i === t.floors) continue
    for (const z of [t.z0 + 0.2, t.z1 - 0.4]) {
      for (const x of [t.x0 + 0.8, t.x1 - 5.4]) {
        b.add('pocitoVoid', x, x + 4.6, y + 0.16, y + step - 0.2, z, z + 0.2)
        b.add('pocitoConcrete', x, x + 4.6, y + 0.2, y + 0.9, z - 0.08, z + 0.28)
      }
    }
  }
  for (let x = t.x0 + 5.7; x < t.x1 - 4; x += 2.85) {
    for (const z of [t.z0 + 0.48, t.z1 - 0.56]) b.add('pocitoConcrete', x, x + 0.09, t.base, t.top, z, z + 0.08)
  }
  for (let z = t.z0 + 2.8; z < t.z1 - 1; z += 2.85) {
    for (const x of [t.x0 + 0.48, t.x1 - 0.56]) b.add('pocitoConcrete', x, x + 0.08, t.base, t.top, z, z + 0.09)
  }
  b.add('pocitoStone', 178.8, 191, t.top, t.roof, 86.5, 95.5)
}

function unfinishedTower(b) {
  const t = POCITO.second
  const step = (t.top - t.base) / t.floors
  for (let n = 0; n <= t.floors; n++) {
    const y = t.base + n * step
    b.add('pocitoConcrete', t.x0, t.x1, y - 0.22, y, t.z0, t.z1)
  }
  for (const x of [t.x0 + 0.6, 173.5, 185, 196.5, t.x1 - 0.6]) {
    for (const z of [t.z0 + 0.6, 186.5, t.z1 - 0.6]) {
      b.add('pocitoConcrete', x - 0.3, x + 0.3, t.base, t.top, z - 0.3, z + 0.3)
    }
  }
  b.add('pocitoConcrete', 182, 188.5, t.base, t.top, 183.5, 189.5)
  for (let n = 0; n < 10; n++) {
    const y = t.base + n * step
    b.add('pocitoSoil', 174, 181.5, y + 0.1, y + step - 0.2, t.z1 - 0.8, t.z1 - 0.55)
  }
}

/** Grúa estática: silueta de obra sin movimientos ni geometría de cables cara. */
function crane(b, { x, z, base, top, left, right }) {
  for (const dx of [-0.4, 0.4]) {
    for (const dz of [-0.4, 0.4]) b.add('pocitoCrane', x + dx - 0.06, x + dx + 0.06, base, top, z + dz - 0.06, z + dz + 0.06)
  }
  for (let y = base; y < top; y += 1.8) {
    for (const dz of [-0.4, 0.4]) b.add('pocitoCrane', x - 0.46, x + 0.46, y, y + 0.09, z + dz - 0.05, z + dz + 0.05)
  }
  for (const dz of [-0.45, 0.45]) {
    for (const y of [top - 1.8, top - 0.7]) b.add('pocitoCrane', x - left, x + right, y, y + 0.12, z + dz - 0.06, z + dz + 0.06)
  }
  for (let dx = -left; dx < right; dx += 4) b.add('pocitoCrane', x + dx, x + dx + 0.1, top - 1.8, top - 0.6, z - 0.5, z + 0.5)
  b.add('pocitoConcrete', x - left, x - left + 3, top - 1.8, top - 0.4, z - 1, z + 1)
  b.add('pocitoVoid', x + right - 4, x + right - 3.92, top - 15, top - 1, z - 0.04, z + 0.04)
}

export function buildPocito() {
  const b = createBoxList()
  podium(b)
  glazedTower(b)
  unfinishedTower(b)
  crane(b, { x: 197, z: 94, base: 102, top: 124, left: 15, right: 32 })
  crane(b, { x: 168, z: 186, base: 85.5, top: 108, left: 12, right: 38 })
  return b
}
