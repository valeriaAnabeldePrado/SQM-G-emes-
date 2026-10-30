import {
  addGlassRailing,
  addRailing,
  addWallWithOpenings,
  addWindow
} from '../../architecture/generators'
import { PANE_KIND } from '../../architecture/interiorGlass'
import {
  AMENITIES_HEIGHT,
  AMENITIES_LEVEL,
  BAND_JOINTS,
  FLOOR_HEIGHT,
  FRONT_OPENINGS,
  GROUND_DOOR,
  GROUND_HEIGHT,
  GROUND_MULLIONS,
  HALF,
  INNER,
  REAR_BALCONY_OPENINGS,
  REAR_BAND_OPENINGS,
  SLAB,
  TANK,
  TOP_FLOOR,
  TOWER,
  UPPER_BALCONIES,
  WINDOW_HEAD,
  levelBase
} from './config'

const WALL = 0.2
const BANDED_FLOORS = 13 // P1-P13 con antepecho de hormigón; P14-P15 con baranda
const CEILING = FLOOR_HEIGHT - SLAB

/** Semilla estable por vano: misma habitación en cada carga. */
const seedFor = (...keys) => {
  const v = Math.sin(keys.reduce((acc, k, i) => acc + k * (i * 37.1 + 11.3), 0)) * 43758.5453
  return (v - Math.floor(v)) * 0.98
}

/**
 * Muro de fachada con sus carpinterías. `face` es la cara exterior, `level` el
 * piso terminado (para dimensionar la habitación que se ve por el vidrio).
 */
function facadeWall(
  b,
  {
    face,
    inward,
    level,
    bottom = level,
    top,
    openings,
    kind = PANE_KIND.home,
    frameMaterial = 'frameMetal',
    mullions = 1,
    lintels = false,
    key = 0
  }
) {
  const planeMin = Math.min(face, face + inward * WALL)
  const planeMax = Math.max(face, face + inward * WALL)
  const holes = openings.map((o) => ({
    from: o.from,
    to: o.to,
    bottom: level + o.sill,
    top: level + (o.head ?? WINDOW_HEAD),
    mullions: o.mullions
  }))
  addWallWithOpenings(b, 'block', {
    from: -INNER,
    to: INNER,
    bottom,
    top,
    planeMin,
    planeMax,
    openings: holes
  })
  holes.forEach((o, i) => {
    addWindow(b, {
      from: o.from,
      to: o.to,
      bottom: o.bottom,
      top: o.top,
      face,
      inward,
      frameMaterial,
      glassMaterial: 'glass',
      mullions: o.mullions ?? (o.to - o.from > 1.1 ? mullions : 0),
      room: {
        roomFloor: level,
        roomCeiling: level + CEILING,
        depth: 3.6,
        kind,
        seed: seedFor(key, i, face)
      }
    })
    // Dintel claro sobre cada ventana (foto de fachada)
    if (lintels) {
      b.add('lintel', o.from - 0.06, o.to + 0.06, o.top, o.top + 0.1, face - inward * 0.05, face)
    }
  })
}

function groundFloor(b) {
  const glassFace = 0.3
  const glassTop = GROUND_HEIGHT - 0.5

  // Vidriado del local y el acceso (foto): parantes de aluminio natural, puerta
  // doble alta y travesaño bajo
  addWindow(b, {
    from: -INNER,
    to: INNER,
    bottom: 0,
    top: glassTop,
    face: glassFace,
    inward: 1,
    reveal: 0,
    profile: 0.06,
    frameMaterial: 'frameMetal',
    mullionsAt: GROUND_MULLIONS,
    transoms: [1.4],
    room: { roomFloor: 0, roomCeiling: glassTop, depth: 6.3, kind: PANE_KIND.shop, seed: 0.42 }
  })
  const doorSplit = (GROUND_DOOR.from + GROUND_DOOR.to) / 2
  b.add(
    'frameMetal',
    GROUND_DOOR.from,
    GROUND_DOOR.to,
    3.37,
    3.43,
    glassFace - 0.01,
    glassFace + 0.07
  )
  b.add(
    'frameMetal',
    doorSplit - 0.03,
    doorSplit + 0.03,
    0,
    3.4,
    glassFace - 0.01,
    glassFace + 0.07
  )
  for (const x of [doorSplit - 0.12, doorSplit + 0.12]) {
    b.add('frameMetal', x - 0.015, x + 0.015, 0.9, 1.9, glassFace - 0.06, glassFace - 0.03)
  }
  b.add('concrete', -INNER, INNER, glassTop, GROUND_HEIGHT, 0, 0.45)

  // Contrafrente de PB hacia los patios privados
  facadeWall(b, {
    face: TOWER.rearLow,
    inward: -1,
    level: 0,
    top: GROUND_HEIGHT,
    kind: PANE_KIND.curtains,
    key: 99,
    openings: [
      { from: -4.2, to: -1.4, sill: 0, head: 2.4 },
      { from: 1.4, to: 4.2, sill: 0, head: 2.4 }
    ]
  })
}

function bandedFront(b, n) {
  const y0 = levelBase(n)
  const d = TOWER.bandDepth
  const bandTop = y0 + TOWER.parapetHeight
  b.add('concrete', -INNER, INNER, y0 - SLAB, y0, -d, 0)
  b.add('concrete', -INNER, INNER, y0, bandTop, -d, -d + 0.15)
  // Juntas de encofrado en el frente de la banda (foto)
  for (const x of BAND_JOINTS) {
    b.add('groove', x - 0.01, x + 0.01, y0 - SLAB, bandTop, -d - 0.004, -d + 0.02)
  }
  facadeWall(b, {
    face: 0,
    inward: 1,
    level: y0,
    top: y0 + FLOOR_HEIGHT,
    openings: FRONT_OPENINGS,
    lintels: true,
    key: n
  })
}

function railedFront(b, n) {
  const y0 = levelBase(n)
  const d = TOWER.upperBalconyDepth
  b.add('concrete', -INNER, INNER, y0 - 0.35, y0, -d, 0)
  addRailing(b, { from: -INNER, to: INNER, bottom: y0, plane: -d + 0.05, material: 'railing' })
  facadeWall(b, {
    face: 0,
    inward: 1,
    level: y0,
    top: y0 + FLOOR_HEIGHT,
    openings: UPPER_BALCONIES.map((c) => ({ from: c - 1, to: c + 1, sill: 0 })),
    lintels: true,
    key: n
  })
}

/**
 * Contrafrente (render completo desde Peredo): los pisos bajos tienen balcón
 * corrido con baranda clara y cortinas; desde P7, bandas de hormigón como el
 * frente pero con otra modulación de ventanas.
 */
function rearFloor(b, n) {
  const y0 = levelBase(n)
  const y1 = y0 + FLOOR_HEIGHT
  const depth = TOWER.rearBalconyDepth

  if (n <= 6) {
    const face = n <= 5 ? TOWER.rearLow : TOWER.rearHigh
    const edge = TOWER.rearLow + depth // P6: la terraza llega al borde de los balcones de P5
    facadeWall(b, {
      face,
      inward: -1,
      level: y0,
      top: y1,
      openings: REAR_BALCONY_OPENINGS,
      kind: PANE_KIND.curtains,
      key: 100 + n
    })
    b.add('concrete', -INNER, INNER, y0 - SLAB, y0, face, edge)
    b.add('deck', -INNER, INNER, y0, y0 + 0.02, face, edge)
    addRailing(b, {
      from: -INNER,
      to: INNER,
      bottom: y0,
      plane: edge - 0.04,
      material: 'railingLight'
    })
    if (n === 6) b.add('block', -0.1, 0.1, y0, y0 + 1.8, face, edge)
    return
  }

  const face = TOWER.rearHigh
  const edge = face + depth
  b.add('concrete', -INNER, INNER, y0 - SLAB, y0, face, edge)
  b.add('concrete', -INNER, INNER, y0, y0 + TOWER.parapetHeight, edge - 0.15, edge)
  for (const x of BAND_JOINTS) {
    b.add(
      'groove',
      x - 0.01,
      x + 0.01,
      y0 - SLAB,
      y0 + TOWER.parapetHeight,
      edge - 0.02,
      edge + 0.004
    )
  }
  facadeWall(b, {
    face,
    inward: -1,
    level: y0,
    top: y1,
    openings: REAR_BAND_OPENINGS,
    lintels: true,
    key: 200 + n
  })
}

function sideWalls(b) {
  const top = levelBase(AMENITIES_LEVEL)
  const deckFront = -TOWER.upperBalconyDepth
  for (const side of [-1, 1]) {
    const x0 = side * INNER
    const x1 = side * HALF
    // Medianera completa hasta el contrafrente más profundo (enmarca balcones y terrazas)
    b.add('plaster', x0, x1, 0, top, 0, TOWER.rearLow)
    // Canto de hormigón que acompaña los balcones del frente
    b.add(
      'concrete',
      x0,
      x1,
      levelBase(1) - SLAB,
      levelBase(BANDED_FLOORS + 1),
      -TOWER.bandDepth,
      0
    )
    b.add('concrete', x0, x1, levelBase(BANDED_FLOORS + 1), top, deckFront, 0)
  }
  // Caño de bajada pluvial al centro de la fachada, entre las dos puertas (foto)
  b.add('pipe', -0.05, 0.05, levelBase(1), levelBase(BANDED_FLOORS + 1), -0.14, -0.04)
}

function amenities(b) {
  const y0 = levelBase(AMENITIES_LEVEL)
  const { enclosedFrom, enclosedTo, pool } = TOWER.amenities
  const deckFront = -TOWER.upperBalconyDepth
  const roof = y0 + AMENITIES_HEIGHT

  // Losa (techo del P15) y solado de porcelanato alrededor de la pileta
  b.add('concrete', -HALF, HALF, y0 - 0.35, y0, deckFront, TOWER.rearHigh)
  b.add('deck', -INNER, INNER, y0, y0 + 0.02, deckFront, pool.z0)
  b.add('deck', -INNER, INNER, y0, y0 + 0.02, pool.z1, enclosedFrom)
  b.add('deck', -INNER, pool.x0, y0, y0 + 0.02, pool.z0, pool.z1)
  b.add('deck', pool.x1, INNER, y0, y0 + 0.02, pool.z0, pool.z1)
  b.add('water', pool.x0, pool.x1, y0, y0 + 0.015, pool.z0, pool.z1)

  // Baranda de vidrio del solárium (render de la pileta)
  addGlassRailing(b, {
    from: -HALF,
    to: HALF,
    bottom: y0,
    plane: deckFront + 0.04,
    glassMaterial: 'glassRailing',
    capMaterial: 'frameDark'
  })
  for (const x of [-HALF + 0.04, HALF - 0.04]) {
    addGlassRailing(b, {
      axis: 'z',
      from: deckFront,
      to: enclosedFrom,
      bottom: y0,
      plane: x,
      glassMaterial: 'glassRailing',
      capMaterial: 'frameDark'
    })
  }

  // Volumen de quinchos y núcleo
  for (const side of [-1, 1]) {
    b.add('concrete', side * INNER, side * HALF, y0, roof + 0.3, enclosedFrom, enclosedTo)
  }
  facadeWall(b, {
    face: enclosedFrom,
    inward: 1,
    level: y0,
    top: roof,
    frameMaterial: 'frameDark',
    mullions: 2,
    kind: PANE_KIND.office,
    key: 300,
    openings: [{ from: -3.3, to: 1.2, sill: 0, head: 2.5 }]
  })
  // Chapa microperforada sobre el sector del tanque (vista de fachada)
  b.add('perforated', 1.2, INNER, y0 + 0.1, roof + 0.3, enclosedFrom - 0.08, enclosedFrom)
  facadeWall(b, {
    face: enclosedTo,
    inward: -1,
    level: y0,
    top: roof,
    frameMaterial: 'frameDark',
    mullions: 3,
    kind: PANE_KIND.office,
    key: 301,
    openings: [
      { from: -4.9, to: -0.4, sill: 0, head: 2.5 },
      { from: 0.4, to: 4.9, sill: 0, head: 2.5 }
    ]
  })
  b.add('concrete', -HALF, HALF, roof, roof + 0.3, enclosedFrom - 0.1, enclosedTo + 0.1)

  // Terraza del contrafrente con parapetos laterales de hormigón
  b.add('deck', -INNER, INNER, y0, y0 + 0.02, enclosedTo, TOWER.rearHigh)
  addRailing(b, {
    from: -INNER,
    to: INNER,
    bottom: y0,
    plane: TOWER.rearHigh - 0.05,
    material: 'railingLight'
  })
  for (const side of [-1, 1]) {
    b.add('concrete', side * INNER, side * HALF, y0, y0 + 1.1, enclosedTo, TOWER.rearHigh)
  }

  // Azotea: sala de máquinas de hormigón visto, salida de escalera de bloque y
  // baranda negra perimetral (render del contrafrente). El tanque cilíndrico se
  // dibuja aparte (RoofTank).
  const r = roof + 0.3
  const { z0, z1 } = TOWER.core
  b.add('concrete', -4.6, -0.6, r, r + 2.2, z0, z1)
  b.add('block', -0.6, 1.0, r, r + 1.0, z0 + 0.6, z1)
  const rail = { bottom: r, material: 'railing', spacing: 0.16, height: 1.0 }
  addRailing(b, { ...rail, from: -HALF + 0.1, to: HALF - 0.1, plane: enclosedFrom - 0.02 })
  addRailing(b, { ...rail, from: -HALF + 0.1, to: HALF - 0.1, plane: enclosedTo + 0.02 })
  for (const x of [-HALF + 0.1, HALF - 0.1]) {
    addRailing(b, { ...rail, axis: 'z', from: enclosedFrom, to: enclosedTo, plane: x })
  }

  // Escalera de jaula del tanque, sobre su cara hacia Pueyrredón
  const ladderZ = (z0 + z1) / 2 - TANK.radius - 0.08
  const top = r + TANK.height + 0.9
  for (const x of [TANK.x - 0.22, TANK.x + 0.22]) {
    b.add('railing', x - 0.02, x + 0.02, r, top, ladderZ - 0.02, ladderZ + 0.02)
  }
  for (let y = r + 0.3; y < top - 0.2; y += 0.3) {
    b.add('railing', TANK.x - 0.22, TANK.x + 0.22, y, y + 0.025, ladderZ - 0.015, ladderZ + 0.015)
  }
  const cage = ladderZ - 0.7
  for (let y = r + 2.2; y < top; y += 0.6) {
    b.add('railing', TANK.x - 0.4, TANK.x + 0.4, y, y + 0.03, cage, cage + 0.03)
    for (const x of [TANK.x - 0.4, TANK.x + 0.4])
      b.add('railing', x - 0.015, x + 0.015, y, y + 0.03, cage, ladderZ)
  }
  for (const x of [TANK.x - 0.4, TANK.x, TANK.x + 0.4]) {
    b.add('railing', x - 0.015, x + 0.015, r + 2.2, top, cage, cage + 0.03)
  }
}

export function buildTower(b) {
  groundFloor(b)
  for (let n = 1; n <= TOP_FLOOR; n++) {
    if (n <= BANDED_FLOORS) bandedFront(b, n)
    else railedFront(b, n)
    rearFloor(b, n)
  }
  sideWalls(b)
  amenities(b)
}

/**
 * Bordes de los balcones del piso n (antepechos y barandas) con la losa en
 * y = 0, para el interior abierto: el corte por piso se lleva los del
 * edificio, que arrancan apenas arriba de la losa.
 */
export function buildFloorEdges(b, n) {
  if (n < 1 || n > TOP_FLOOR) return
  const rail = { bottom: 0, material: 'railing' }
  if (n <= BANDED_FLOORS) {
    const d = TOWER.bandDepth
    b.add('concrete', -INNER, INNER, 0, TOWER.parapetHeight, -d, -d + 0.15)
  } else {
    addRailing(b, { ...rail, from: -INNER, to: INNER, plane: -TOWER.upperBalconyDepth + 0.05 })
  }
  for (const side of [-1, 1]) {
    b.add('concrete', side * INNER, side * HALF, 0, TOWER.parapetHeight, -TOWER.bandDepth, 0)
  }
  const light = { ...rail, material: 'railingLight' }
  if (n <= 6) {
    const edge = TOWER.rearLow + TOWER.rearBalconyDepth
    addRailing(b, { ...light, from: -INNER, to: INNER, plane: edge - 0.04 })
  } else {
    const edge = TOWER.rearHigh + TOWER.rearBalconyDepth
    b.add('concrete', -INNER, INNER, 0, TOWER.parapetHeight, edge - 0.15, edge)
  }
}
