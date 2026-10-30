import { INNER, TOP_FLOOR, TOWER, levelBase } from './config'
import { BANDED_FLOORS } from './tower'

export function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Macetas en parte de los balcones del frente (las dibuja BalconyPlants). */
export function plantLayout() {
  const rand = seeded(11)
  const plants = []
  for (let n = 1; n <= TOP_FLOOR; n++) {
    if (rand() > 0.6) continue
    const depth = n <= BANDED_FLOORS ? TOWER.bandDepth : TOWER.upperBalconyDepth
    const count = 1 + Math.floor(rand() * 2.6)
    const start = -INNER + 0.5 + rand() * (INNER * 2 - 2.6)
    for (let k = 0; k < count; k++) {
      const tall = rand() < 0.6
      plants.push({
        x: start + k * (0.55 + rand() * 0.3),
        y: levelBase(n),
        z: -depth + 0.35 + rand() * 0.15,
        pot: tall ? 0.5 : 0.38,
        crown: tall ? 0.45 + rand() * 0.15 : 0.32 + rand() * 0.12,
        lift: tall ? 1.35 : 1.0
      })
    }
  }
  return plants
}

const FABRICS = ['fabricWhite', 'fabricBlue', 'fabricTerracotta', 'fabricSand']

/** Silla de exterior mirando a la calle (asiento, respaldo contra el vidrio, patas). */
function chair(b, x, y, z, frame) {
  b.add(frame, x - 0.22, x + 0.22, y + 0.42, y + 0.46, z - 0.2, z + 0.2)
  b.add(frame, x - 0.22, x + 0.22, y + 0.46, y + 0.86, z + 0.18, z + 0.22)
  for (const sx of [-0.2, 0.2]) {
    b.add(frame, x + sx - 0.015, x + sx + 0.015, y, y + 0.42, z - 0.19, z - 0.16)
    b.add(frame, x + sx - 0.015, x + sx + 0.015, y, y + 0.42, z + 0.16, z + 0.19)
  }
}

/** Dos sillas y una mesita redonda (de lejos, una caja baja alcanza). */
function bistro(b, x, y, z, rand) {
  const frame = rand() < 0.5 ? 'frameDark' : 'frameLight'
  chair(b, x - 0.5, y, z, frame)
  chair(b, x + 0.5, y, z, frame)
  b.add(frame, x - 0.25, x + 0.25, y + 0.7, y + 0.73, z - 0.25, z + 0.25)
  b.add(frame, x - 0.02, x + 0.02, y, y + 0.7, z - 0.02, z + 0.02)
}

/** Tendedero plegable con ropa: lo único que asoma sobre el antepecho de hormigón. */
function dryingRack(b, x, y, z, rand) {
  const w = 0.65
  const top = y + 1.32
  for (const sx of [-w, w])
    b.add('frameLight', x + sx - 0.012, x + sx + 0.012, y, top, z - 0.012, z + 0.012)
  for (const h of [top, top - 0.18])
    b.add('frameLight', x - w, x + w, h - 0.01, h, z - 0.01, z + 0.01)
  let cursor = x - w + 0.05
  while (cursor < x + w - 0.2) {
    const width = 0.22 + rand() * 0.3
    const drop = 0.3 + rand() * 0.35
    const bar = rand() < 0.5 ? top : top - 0.18
    const fabric = FABRICS[Math.floor(rand() * FABRICS.length)]
    b.add(
      fabric,
      cursor,
      Math.min(cursor + width, x + w - 0.04),
      bar - drop,
      bar,
      z - 0.008,
      z + 0.008
    )
    cursor += width + 0.04 + rand() * 0.1
  }
}

/**
 * Objetos de uso diario en parte de los balcones del frente: sillas con mesita
 * y tendederos con ropa. Se fusionan con el resto del edificio (no suman draw
 * calls salvo las telas) y no se superponen con las macetas de BalconyPlants.
 */
export function buildBalconyLife(b) {
  const rand = seeded(29)
  const plants = plantLayout()
  for (let n = 1; n <= TOP_FLOOR; n++) {
    if (rand() > 0.5) continue
    const y = levelBase(n)
    const depth = n <= BANDED_FLOORS ? TOWER.bandDepth : TOWER.upperBalconyDepth
    const z = -depth + 0.15 + (depth - 0.15) / 2 + 0.05
    const width = 1.6
    // Busca un tramo libre de macetas en ese piso
    const busy = plants.filter((p) => p.y === y).map((p) => p.x)
    const candidates = [-3.3, -1.1, 1.1, 3.3].filter(
      (c) =>
        Math.abs(c) + width / 2 < INNER && busy.every((px) => Math.abs(px - c) > width / 2 + 0.3)
    )
    if (!candidates.length) continue
    const x = candidates[Math.floor(rand() * candidates.length)]
    if (rand() < 0.55) dryingRack(b, x, y, z, rand)
    else bistro(b, x, y, z, rand)
  }
}
