import { addRailing, addWallWithOpenings, addWindow } from '../../architecture/generators'
import { PANE_KIND } from '../../architecture/interiorGlass'
import { HALF, INNER, LOT, OFFICES, PATIO, TOWER } from './config'

const FRONT = LOT.depth
const BACK = LOT.depth - OFFICES.depth
const FRAME = 0.35 // canto del marco de hormigón (render)

const levels = () => {
  const list = [0, OFFICES.groundHeight]
  for (let i = 1; i < OFFICES.floors; i++) list.push(list[i] + OFFICES.floorHeight)
  return list
}

/** Bloque de oficinas sobre Pje. Ángelo de Peredo (render frenteTwoOk). */
export function buildOffices(b) {
  const ys = levels()
  const terrace = ys[ys.length - 1] + OFFICES.floorHeight

  // Laterales de hormigón que suben por encima de la terraza
  for (const side of [-1, 1]) {
    b.add('concrete', side * INNER, side * HALF, 0, terrace + OFFICES.sideWallExtra, BACK, FRONT)
  }

  // Marco de hormigón: cantos de losa sobre la fachada
  for (const y of [...ys.slice(1), terrace]) {
    b.add('concrete', -INNER, INNER, y - 0.3, y, FRONT - FRAME, FRONT)
  }
  b.add('concrete', -INNER, INNER, terrace, terrace + 0.15, FRONT - FRAME, FRONT)

  // PB vidriada con carpintería negra (local de oficinas con la escalera a la vista)
  addWindow(b, {
    from: -INNER,
    to: INNER,
    bottom: 0,
    top: ys[1] - 0.3,
    face: FRONT - 0.12,
    inward: -1,
    reveal: 0,
    frameMaterial: 'frameDark',
    glassMaterial: 'glassShop',
    mullionsAt: OFFICES.groundMullions,
    transoms: [2.6]
  })
  b.add('interior', -INNER, INNER, 0, ys[1] - 0.3, BACK + 0.2, BACK + 0.4)
  b.add('interior', -INNER, INNER, ys[1] - 0.35, ys[1] - 0.3, BACK + 0.4, FRONT - 0.2)
  // Escalera interior junto al lateral izquierdo
  for (let i = 0; i < 16; i++) {
    const y = i * 0.19
    b.add(
      'concrete',
      -INNER,
      -INNER + 1.1,
      y,
      y + 0.19,
      FRONT - 1.4 - i * 0.27,
      FRONT - 1.13 - i * 0.27
    )
  }

  // Pisos 1 y 2: vidrio retirado y paneles pivotantes de chapa por delante
  ys.slice(1).forEach((y, floor) => {
    const top = y + OFFICES.floorHeight - 0.3
    addWindow(b, {
      from: -INNER,
      to: INNER,
      bottom: y,
      top,
      face: FRONT - 0.75,
      inward: -1,
      reveal: 0,
      frameMaterial: 'frameDark',
      glassMaterial: 'glass',
      mullions: 9,
      // Oficinas iluminadas detrás de los paneles (render)
      room: {
        roomFloor: y,
        roomCeiling: top,
        depth: 5.4,
        kind: PANE_KIND.office,
        seed: 0.3 + floor * 0.2
      }
    })
    const angles = OFFICES.panelAngles[floor]
    const step = (2 * INNER) / angles.length
    angles.forEach((deg, i) => {
      const cx = -INNER + step * (i + 0.5)
      const w = step * 0.9
      b.add(
        'panel',
        cx - w / 2,
        cx + w / 2,
        y + 0.05,
        top - 0.05,
        FRONT - 0.27,
        FRONT - 0.23,
        (deg * Math.PI) / 180
      )
    })
    b.add('frameDark', -INNER, INNER, top - 0.06, top, FRONT - 0.3, FRONT - 0.2)
  })

  // Contrafrente hacia el patio
  ys.forEach((y, floor) => {
    const top = floor === 0 ? ys[1] : y + OFFICES.floorHeight
    const head = top - y - 0.4
    const openings = [
      { from: -4.6, to: -1.0, bottom: y + (floor === 0 ? 0 : 0.9), top: y + head },
      { from: 1.0, to: 4.6, bottom: y + (floor === 0 ? 0 : 0.9), top: y + head }
    ]
    addWallWithOpenings(b, 'block', {
      from: -INNER,
      to: INNER,
      bottom: y,
      top,
      planeMin: BACK,
      planeMax: BACK + 0.2,
      openings
    })
    openings.forEach((o, i) => {
      addWindow(b, {
        ...o,
        face: BACK,
        inward: 1,
        frameMaterial: 'frameDark',
        glassMaterial: 'glass',
        mullions: 2,
        room: {
          roomFloor: y,
          roomCeiling: top - 0.3,
          depth: 5.4,
          kind: PANE_KIND.office,
          seed: 0.11 + floor * 0.3 + i * 0.13
        }
      })
    })
  })

  // Terraza (ofiPisoTres: 10,70 x 6,00 m): baranda de barrotes claros, caja de
  // escalera y pérgola de listones entre los laterales (render frenteTwoOk)
  b.add('concrete', -INNER, INNER, terrace - 0.3, terrace, BACK, FRONT - FRAME)
  b.add('deck', -INNER, INNER, terrace, terrace + 0.02, BACK, FRONT - FRAME)
  addRailing(b, {
    from: -INNER,
    to: INNER,
    bottom: terrace + 0.15,
    plane: FRONT - 0.2,
    height: 0.95,
    material: 'railingLight'
  })
  addRailing(b, {
    from: -INNER,
    to: INNER,
    bottom: terrace,
    plane: BACK + 0.05,
    material: 'railingLight'
  })
  b.add('concrete', -INNER, -3.4, terrace, terrace + 2.6, BACK + 0.3, BACK + 3.9)
  b.add('frameDark', -3.42, -3.38, terrace, terrace + 2.1, BACK + 1.5, BACK + 2.4)
  const pergola = terrace + 2.5
  for (const z of [BACK + 0.4, FRONT - 0.7])
    b.add('railingLight', -3.4, INNER, pergola - 0.18, pergola, z - 0.06, z + 0.06)
  for (let z = BACK + 0.6; z < FRONT - 0.7; z += 0.28) {
    b.add('railingLight', -3.4, INNER, pergola, pergola + 0.12, z - 0.03, z + 0.03)
  }
}

/** Patios de PB entre la torre y las oficinas. */
export function buildPatio(b) {
  const z0 = TOWER.rearLow
  const z1 = z0 + PATIO.privateDepth
  b.add('patio', -INNER, INNER, 0, 0.03, z0, z1)
  b.add('block', -0.1, 0.1, 0, 1.8, z0, z1)
  b.add('hedge', -INNER, -0.7, 0, 0.9, z1, z1 + 0.6)
  b.add('hedge', 0.7, INNER, 0, 0.9, z1, z1 + 0.6)
  b.add('grass', -INNER, INNER, 0, 0.03, z1 + 0.6, BACK)
  b.add('patio', -0.6, 0.6, 0.03, 0.04, z1, BACK)
  // Muros divisorios de los patios con los vecinos
  for (const side of [-1, 1]) b.add('plaster', side * INNER, side * HALF, 0, 3, z0, BACK)
}
