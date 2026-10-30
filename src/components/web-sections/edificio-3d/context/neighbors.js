import {
  addGlassRailing,
  addRailing,
  addWallWithOpenings,
  addWindow
} from '../architecture/generators'
import { PANE_KIND } from '../architecture/interiorGlass'
import { HALF, LOT } from '../buildings/vivra-guemes/config'
import contextData from './contextData.json'

// Edificios linderos, reconstruidos desde las fotos de Street View del lote
// (sobre Pueyrredón y sobre Peredo). Alturas y modulación aproximadas.

const SIDEWALK = 2.5

/**
 * Línea municipal de la manzana hacia La Cañada, sobre Peredo: el cordón de la
 * mano este de Marcelo T. de Alvear (traza OSM) más la vereda.
 */
function blockWestEdge(z0, z1) {
  let curb = -Infinity
  for (const road of contextData.roads) {
    if (!road.n?.endsWith('Alvear')) continue
    for (const [x, z] of road.p) {
      // La mano este es la que corre pegada a la manzana (x > -50)
      if (z >= z0 - 5 && z <= z1 + 5 && x > -50) curb = Math.max(curb, x + road.w / 2)
    }
  }
  return Number.isFinite(curb) ? curb + SIDEWALK : -29.5
}

const hash = (n) => {
  const v = Math.sin(n * 127.1) * 43758.5453
  return v - Math.floor(v)
}

/** Azotea típica: parapeto, membrana, sala de máquinas con tanque y condensadoras. */
function roof(b, { x0, x1, z0, z1, top, wall, machine }) {
  const t = 0.2
  b.add('roofMembrane', x0 + t, x1 - t, top, top + 0.04, z0 + t, z1 - t)
  b.add(wall, x0, x1, top, top + 1, z0, z0 + t)
  b.add(wall, x0, x1, top, top + 1, z1 - t, z1)
  b.add(wall, x0, x0 + t, top, top + 1, z0, z1)
  b.add(wall, x1 - t, x1, top, top + 1, z0, z1)
  if (!machine) return
  const [mx0, mx1, mz0, mz1] = machine
  b.add(wall, mx0, mx1, top, top + 2.8, mz0, mz1)
  b.add(wall, mx0 + 0.3, mx1 - 0.3, top + 2.8, top + 4.6, mz0 + 0.3, mz1 - 0.3)
  for (let i = 0; i < 4; i++) {
    const x = x0 + 1.5 + i * 1.3
    b.add('acUnit', x, x + 0.9, top, top + 0.7, z1 - 2.2, z1 - 1.6)
  }
}

/**
 * Ventana con persiana de enrollar bajada a medias (muy común en el barrio).
 * `face`/`inward` como en addWindow; la persiana va dentro del vano.
 */
function shutteredWindow(
  b,
  o,
  { face, inward, frame = 'frameLight', shutter = 'shutter', room, seed }
) {
  addWindow(b, { ...o, face, inward, frameMaterial: frame, mullions: 1, room: { ...room, seed } })
  const drop = (o.top - o.bottom) * (0.2 + hash(seed * 91) * 0.65)
  b.add(
    shutter,
    o.from + 0.04,
    o.to - 0.04,
    o.top - drop,
    o.top - 0.04,
    face + inward * 0.02,
    face + inward * 0.05
  )
  b.add('lintel', o.from - 0.05, o.to + 0.05, o.top, o.top + 0.18, face - inward * 0.1, face)
}

/**
 * Pueyrredón, lindero hacia Belgrano (+x; a la izquierda mirando el lote):
 * hormigón gris beige, pisos bajos con ventanales y persianas de aluminio,
 * pisos altos con ventanas más chicas y aires acondicionados, y balcones de
 * baranda roja en el sector más alejado del lote.
 */
function beigeNeighbor(b) {
  const x0 = HALF + 0.02
  const x1 = 22
  const z1 = 22
  const ground = 4.2
  const floor = 2.85
  const floors = 13 // el render del contrafrente lo muestra por debajo de la torre
  const lowFloors = 3
  const top = ground + floors * floor
  const face = 0

  b.add('beige', x0, x1, 0, top, 0.25, z1)

  // PB comercial
  const shop = { from: x0 + 0.6, to: x1 - 3.6, bottom: 0, top: 3.4 }
  addWallWithOpenings(b, 'beige', {
    from: x0,
    to: x1,
    bottom: 0,
    top: ground,
    planeMin: 0,
    planeMax: 0.25,
    openings: [shop, { from: x1 - 3, to: x1 - 0.6, bottom: 0, top: 2.6 }]
  })
  addWindow(b, {
    ...shop,
    face,
    inward: 1,
    frameMaterial: 'frameDark',
    mullions: 4,
    room: { roomFloor: 0, roomCeiling: 3.4, depth: 6, kind: PANE_KIND.shop, seed: 0.71 }
  })
  b.add('frameDark', x1 - 3, x1 - 0.6, 0, 2.6, 0.12, 0.2)

  for (let n = 0; n < floors; n++) {
    const y0 = ground + n * floor
    const big = n < lowFloors
    const count = big ? 3 : 6
    const module = (x1 - x0) / count
    const half = big ? 1.2 : 0.75
    const holes = Array.from({ length: count }, (_, k) => {
      const c = x0 + module * (k + 0.5)
      return { from: c - half, to: c + half, bottom: y0 + (big ? 0.5 : 1.0), top: y0 + 2.3 }
    })
    addWallWithOpenings(b, 'beige', {
      from: x0,
      to: x1,
      bottom: y0,
      top: y0 + floor,
      planeMin: 0,
      planeMax: 0.25,
      openings: holes
    })
    holes.forEach((o, k) => {
      const seed = hash(n * 13 + k) * 0.98
      shutteredWindow(b, o, {
        face,
        inward: 1,
        seed,
        room: { roomFloor: y0, roomCeiling: y0 + floor - 0.2, depth: 3.5, kind: PANE_KIND.home }
      })
      if (hash(n * 7.3 + k * 3.1) > 0.5) {
        const x = o.to + 0.12
        b.add('acUnit', x, x + 0.8, o.bottom - 0.15, o.bottom + 0.4, -0.3, 0)
      }
    })

    // Balcones de baranda roja en las dos bahías del extremo (foto)
    if (!big) {
      const bx0 = x0 + module * 4 + 0.15
      const bx1 = x1 - 0.15
      b.add('beige', bx0, bx1, y0 - 0.18, y0, -1.1, 0)
      b.add('redSteel', bx0, bx1, y0 - 0.18, y0 - 0.02, -1.12, -1.08)
      addRailing(b, {
        from: bx0,
        to: bx1,
        bottom: y0,
        plane: -1.06,
        material: 'redSteel',
        height: 1.0
      })
      for (const x of [bx0, bx1]) {
        addRailing(b, {
          axis: 'z',
          from: -1.1,
          to: 0,
          bottom: y0,
          plane: x,
          material: 'redSteel',
          height: 1.0
        })
      }
    }
  }

  // Contrafrente (render desde Peredo): gris con balcones corridos y vidrio
  for (let n = 0; n < floors; n++) {
    const y0 = ground + n * floor
    b.add('greyConcrete', x0, x1, y0 - 0.2, y0, z1, z1 + 1.2)
    addGlassRailing(b, {
      from: x0 + 0.3,
      to: x1 - 0.3,
      bottom: y0,
      plane: z1 + 1.14,
      height: 1.0,
      glassMaterial: 'glassRailing',
      capMaterial: 'frameDark'
    })
    for (let k = 0; k < 3; k++) {
      const c = x0 + 2.8 + k * 5.4
      addWindow(b, {
        from: c - 1.3,
        to: c + 1.3,
        bottom: y0,
        top: y0 + 2.3,
        face: z1 + 0.02,
        inward: -1,
        frameMaterial: 'frameDark',
        mullions: 1,
        room: {
          roomFloor: y0,
          roomCeiling: y0 + floor - 0.2,
          depth: 3.5,
          kind: PANE_KIND.curtains,
          seed: hash(n * 4.1 + k * 7 + 3) * 0.98
        }
      })
    }
  }

  roof(b, { x0, x1, z0: 0, z1, top, wall: 'beige', machine: [x0 + 6, x0 + 9.5, 8, 12] })
}

/**
 * Pueyrredón, lindero hacia La Cañada (-x; a la derecha mirando el lote):
 * balcones corridos con baranda de vidrio, pilares de ladrillo visto y
 * medianera blanca hacia el lote. Desde Peredo se ve su contrafrente blanco con
 * ventanas chicas, por encima de las casas de Peredo pero más bajo que la torre.
 */
function balconyNeighbor(b) {
  const x0 = -21.5
  const x1 = -HALF - 0.02
  const z1 = 21
  const ground = 4.5
  const floor = 3.0
  const floors = 13 // más bajo que la torre (render del contrafrente)
  const top = ground + floors * floor
  const depth = 1.4
  const piers = [
    [x0, x0 + 1.2],
    [-14.2, -13.0]
  ]
  const bays = [
    [x0 + 1.2, -14.2],
    [-13.0, x1 - 0.3]
  ]

  b.add('whitePlaster', x0, x1, 0, top, depth + 0.25, z1)
  for (const [a, c] of piers) b.add('brick', a, c, ground - 0.2, top, 0, depth + 0.25)

  // PB comercial retirada
  addWallWithOpenings(b, 'whitePlaster', {
    from: x0,
    to: x1,
    bottom: 0,
    top: ground,
    planeMin: depth,
    planeMax: depth + 0.25,
    openings: [{ from: x0 + 1.5, to: x1 - 1, bottom: 0, top: 3.6 }]
  })
  addWindow(b, {
    from: x0 + 1.5,
    to: x1 - 1,
    bottom: 0,
    top: 3.6,
    face: depth,
    inward: 1,
    frameMaterial: 'frameDark',
    mullions: 5,
    room: { roomFloor: 0, roomCeiling: 3.6, depth: 6, kind: PANE_KIND.shop, seed: 0.33 }
  })

  for (let n = 0; n < floors; n++) {
    const y0 = ground + n * floor
    b.add('whitePlaster', x0 + 1.2, x1, y0 - 0.22, y0, 0, depth)
    const holes = bays.map(([a, c]) => ({
      from: a + 0.15,
      to: c - 0.15,
      bottom: y0,
      top: y0 + 2.45
    }))
    addWallWithOpenings(b, 'whitePlaster', {
      from: x0 + 1.2,
      to: x1,
      bottom: y0,
      top: y0 + floor,
      planeMin: depth,
      planeMax: depth + 0.25,
      openings: holes
    })
    holes.forEach((o, k) => {
      addWindow(b, {
        ...o,
        face: depth,
        inward: 1,
        frameMaterial: 'frameDark',
        mullions: 3,
        room: {
          roomFloor: y0,
          roomCeiling: y0 + floor - 0.25,
          depth: 4,
          kind: PANE_KIND.home,
          seed: hash(n * 5.7 + k * 11) * 0.98
        }
      })
    })
    for (const [a, c] of bays) {
      addGlassRailing(b, {
        from: a,
        to: c,
        bottom: y0,
        plane: 0.06,
        height: 1.0,
        glassMaterial: 'glassRailing',
        capMaterial: 'frameDark'
      })
    }

    // Contrafrente: ventanas chicas sobre el muro blanco (vista desde Peredo)
    for (let k = 0; k < 4; k++) {
      const c = x0 + 2.5 + k * 4.2
      shutteredWindow(
        b,
        { from: c - 0.55, to: c + 0.55, bottom: y0 + 1.0, top: y0 + 2.3 },
        {
          face: z1 + 0.06,
          inward: -1,
          shutter: 'shutterWhite',
          seed: hash(n * 3.3 + k * 17 + 5) * 0.98,
          room: { roomFloor: y0, roomCeiling: y0 + floor - 0.25, depth: 3.2, kind: PANE_KIND.home }
        }
      )
    }
  }
  b.add('whitePlaster', x0, x1, top - 0.25, top, 0, depth + 0.25)

  roof(b, { x0, x1, z0: 0, z1, top, wall: 'whitePlaster', machine: [x0 + 5, x0 + 8.5, 9, 13] })
}

/**
 * Peredo, linderos de las oficinas (foto desde Peredo): casa crema angosta de
 * PB + 3 junto al lote, edificio de ladrillo con balcones de vidrio y metal
 * negro, y en la esquina con La Cañada un edificio gris de balcones corridos.
 * Del otro lado, una obra con la estructura de hormigón a la vista.
 */
function peredoNeighbors(b) {
  const front = LOT.depth
  const ground = 3.2
  const floor = 2.9
  const roomOf = (y0, seed) => ({
    roomFloor: y0,
    roomCeiling: y0 + floor - 0.2,
    depth: 3.5,
    kind: PANE_KIND.home,
    seed
  })

  // Casa crema: ventanas apiladas al centro, persianas blancas
  b.building(() => {
    const x0 = -12.5
    const x1 = -HALF - 0.02
    const top = ground + 3 * floor
    b.add('cream', x0, x1, 0, top, front - 13, front - 0.2)
    b.add('frameDark', x0 + 1.2, x0 + 2.3, 0, 2.2, front - 0.22, front - 0.18)
    for (let n = 0; n < 3; n++) {
      const y0 = ground + n * floor
      const c = (x0 + x1) / 2 + 0.6
      shutteredWindow(
        b,
        { from: c - 0.65, to: c + 0.65, bottom: y0 + 0.6, top: y0 + 2.3 },
        {
          face: front - 0.14,
          inward: -1,
          shutter: 'shutterWhite',
          seed: 0.21 + n * 0.17,
          room: roomOf(y0)
        }
      )
    }
    roof(b, { x0, x1, z0: front - 13, z1: front - 0.2, top, wall: 'cream' })
  })

  // Ladrillo visto con balcones de vidrio y estructura metálica negra
  b.building(() => {
    const x0 = -21
    const x1 = -12.52
    const top = ground + 3 * floor
    b.add('brick', x0, x1, 0, top, front - 14, front - 0.2)
    for (let n = 0; n < 3; n++) {
      const y0 = ground + n * floor
      for (const [k, c] of [x1 - 2.4, x1 - 0.9].entries()) {
        shutteredWindow(
          b,
          { from: c - 0.6, to: c + 0.6, bottom: y0 + 0.7, top: y0 + 2.3 },
          {
            face: front - 0.14,
            inward: -1,
            shutter: 'shutterWhite',
            seed: 0.4 + n * 0.13 + k * 0.29,
            room: roomOf(y0)
          }
        )
      }
      // Balcón en voladizo con baranda de vidrio en marco negro
      const bx0 = x0 + 0.8
      const bx1 = x0 + 4.6
      b.add('railing', bx0, bx1, y0 - 0.15, y0, front - 0.2, front + 1.0)
      addGlassRailing(b, {
        from: bx0,
        to: bx1,
        bottom: y0,
        plane: front + 0.96,
        height: 1.0,
        glassMaterial: 'glassRailing',
        capMaterial: 'railing'
      })
      addWindow(b, {
        from: bx0 + 0.3,
        to: bx1 - 0.3,
        bottom: y0,
        top: y0 + 2.3,
        face: front - 0.14,
        inward: -1,
        frameMaterial: 'frameDark',
        mullions: 1,
        room: roomOf(y0, 0.6 + n * 0.11)
      })
    }
    roof(b, { x0, x1, z0: front - 14, z1: front - 0.2, top, wall: 'brick' })
  })

  // Esquina con La Cañada: edificio gris de balcones corridos y persianas,
  // hasta la línea municipal sobre Marcelo T. de Alvear
  b.building(() => {
    const x0 = blockWestEdge(front - 16, front)
    const x1 = -21.02
    const floors = 7
    const top = ground + floors * floor
    b.add('greyConcrete', x0, x1, 0, top, front - 16, front - 1.4)
    for (let n = 0; n < floors; n++) {
      const y0 = ground + n * floor
      b.add('greyConcrete', x0, x1, y0 - 0.2, y0, front - 1.4, front)
      addGlassRailing(b, {
        from: x0 + 0.2,
        to: x1 - 0.2,
        bottom: y0,
        plane: front - 0.06,
        height: 1.0,
        glassMaterial: 'glassRailing',
        capMaterial: 'frameDark'
      })
      const bays = Math.max(1, Math.floor((x1 - x0) / 4))
      for (let k = 0; k < bays; k++) {
        const c = x0 + ((x1 - x0) * (k + 0.5)) / bays
        shutteredWindow(
          b,
          { from: c - 0.9, to: c + 0.9, bottom: y0, top: y0 + 2.3 },
          { face: front - 1.4, inward: -1, seed: hash(n * 9 + k) * 0.98, room: roomOf(y0) }
        )
      }
    }
    roof(b, { x0, x1, z0: front - 16, z1: front, top, wall: 'greyConcrete' })
  })

  // Obra en construcción: losas y columnas de hormigón, mampostería en los
  // pisos bajos y media sombra naranja
  b.building(() => {
    const x0 = HALF + 0.02
    const x1 = 20
    const z0 = front - 16
    const z1 = front - 0.2
    const levels = 9
    for (let n = 0; n <= levels; n++) {
      const y = n * 3
      b.add('rawConcrete', x0, x1, y - 0.25, y, z0, z1)
    }
    for (const x of [x0 + 0.2, x0 + 4.9, x0 + 9.6, x1 - 0.2]) {
      for (const z of [z0 + 0.2, z0 + 5.5, z0 + 10.8, z1 - 0.2]) {
        b.add('rawConcrete', x - 0.18, x + 0.18, 0, levels * 3, z - 0.18, z + 0.18)
      }
    }
    b.add('brick', x0, x1, 0, 2.6, z1 - 0.2, z1)
    b.add('brick', x0, x1, 3, 5.4, z1 - 0.2, z1)
    for (const n of [4, 5])
      b.add('safetyMesh', x0 + 1, x0 + 7, n * 3 + 0.1, n * 3 + 2.6, z1 + 0.05, z1 + 0.07)
  })
}

export function buildNeighbors(b) {
  b.building(() => beigeNeighbor(b))
  b.building(() => balconyNeighbor(b))
  peredoNeighbors(b)
}
