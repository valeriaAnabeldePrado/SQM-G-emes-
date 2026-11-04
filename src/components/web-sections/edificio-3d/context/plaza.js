import { createBoxList } from '../architecture/boxes.js'
import contextData from './contextData.json'
import { STREETS, crossings } from './streets'

/**
 * Plazoleta Comandante Coronel Aníbal Montes: ocupa la esquina de Pueyrredón y
 * Belgrano hasta Peredo, al lado del edificio de 41 m que linda con VIVRA por
 * Pueyrredón.
 *
 * Huella: OSM 1093283746 (leisure=park), en el sistema local. El equipamiento
 * sale de Street View desde Belgrano y de la imagen satelital: adoquín rojo en
 * espiga, vereda de baldosa roja con una franja gris, un cantero ovalado con
 * cordón de piedra (pasto en lomada y tierra) bajo un árbol grande con su farol,
 * una fuente escalonada de ladrillo con espejo de agua, un cantero redondo de
 * ladrillo, juegos (tobogán naranja y hamacas azules), bancos de hormigón y
 * bicicleteros azules. Las posiciones son aproximadas.
 */
export const PLAZA_OUTLINE = [
  [27.6, 41.7],
  [39.7, 22.4],
  [44.6, 22.0],
  [54.8, 2.7],
  [71.6, 2.3],
  [72.2, 40.8]
]

// Esquinas noreste y sureste del edificio de 41 m (OSM 1222647846): el solado
// de la plaza llega hasta su planta baja vidriada
const TOWER_SOUTH = [44.7, 16.3]
const TOWER_NORTH = [52.4, 0.1]

const SIDEWALK = 2.6 // vereda de Belgrano, del cordón al solado de la plaza

const BED = { x: 65.8, z: 26, rx: 4.4, rz: 7.6, ring: 0.3 }
const POND = { x0: 52.4, x1: 59.8, z0: 25.4, z1: 31.4, rim: 0.3 }
const FOUNTAIN = { x: 57.4, z: 25.4, half: 1.8, steps: 4, rise: 0.24, inset: 0.38 }
export const PLANTER = { x: 49.6, z: 33.2, r: 1.4, h: 0.45 }
const SAND = { x0: 35.2, x1: 47.4, z0: 32.6, z1: 39.4 }

export const PLAZA_LAMP_HEIGHT = 4.2

/** Faroles de plaza: columna baja con farol arriba (sin brazo). */
export const PLAZA_LAMPS = [
  [70.6, 23.0],
  [57.6, 10.0],
  [50.5, 30.0],
  [60.5, 34.0],
  [38.5, 31.5]
].map(([x, z]) => ({ x, z, dx: 0, dz: 0, park: true }))

const TREES = [
  { x: 66.5, z: 5.0, h: 9.5, r: 4.0 },
  { x: 58.5, z: 6.5, h: 9, r: 3.8 },
  { x: 54.0, z: 14.5, h: 10.5, r: 4.5 },
  { x: 67.3, z: 15.0, h: 9, r: 3.6 },
  // El árbol grande del cantero ovalado (Street View)
  { x: 65.4, z: 24.8, h: 12.5, r: 5.8 },
  { x: 48.5, z: 24.5, h: 11, r: 5.0 },
  { x: 37.6, z: 28.0, h: 10, r: 4.2 },
  { x: 33.0, z: 35.5, h: 9, r: 3.8 },
  { x: 51.5, z: 38.6, h: 9.5, r: 4.0 },
  { x: 62.0, z: 37.5, h: 10, r: 4.5 },
  { x: 69.6, z: 36.2, h: 9, r: 3.8 }
]

const BENCHES = [
  [62.4, 16.5, 'x'],
  [59.5, 13.0, 'z'],
  [66.6, 9.0, 'z'],
  [54.6, 21.6, 'x'],
  [50.6, 27.5, 'z'],
  [49.6, 37.2, 'z'],
  [41.5, 31.4, 'x'],
  [57.5, 35.8, 'x'],
  [66.0, 38.2, 'x']
]
const BIKE_RACKS = { x0: 68.4, x1: 69.2, zs: [7.6, 8.4, 9.2, 10.0] }
const BINS = [
  [70.5, 24.4],
  [56.2, 21.4],
  [48.0, 31.2]
]

const BELGRANO = contextData.roads.filter((road) => road.n === 'Belgrano')

/** Cordón oeste de Belgrano (lado de la plaza) a la altura z. */
function belgranoCurb(z) {
  for (const road of BELGRANO) {
    for (let i = 0; i < road.p.length - 1; i++) {
      const [ax, az] = road.p[i]
      const [bx, bz] = road.p[i + 1]
      if (az === bz || (az - z) * (bz - z) > 0) continue
      return ax + ((z - az) / (bz - az)) * (bx - ax) - road.w / 2
    }
  }
  return 73.4
}

const xAt = ([ax, az], [bx, bz], z) => ax + ((z - az) / (bz - az)) * (bx - ax)

/** Donde termina la vereda elevada de Pueyrredón o Peredo antes de la esquina. */
function cornerCut(z0, z1) {
  const curb = belgranoCurb((z0 + z1) / 2)
  return crossings(z0, z1).find(([a, b]) => a <= curb && curb <= b)?.[0] ?? curb
}

function pointInPolygon(x, z, polygon) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [ax, az] = polygon[i]
    const [bx, bz] = polygon[j]
    if (az > z !== bz > z && x < ((bx - ax) * (z - az)) / (bz - az) + ax) inside = !inside
  }
  return inside
}

/**
 * Volúmenes del contexto que caen dentro de la plaza: el raster de alturas de
 * Google toma la copa del árbol grande como si fuera un edificio de 6 m.
 */
export function insidePlaza({ p }) {
  if (p.length < 3) return false
  const x = p.reduce((sum, v) => sum + v[0], 0) / p.length
  const z = p.reduce((sum, v) => sum + v[1], 0) / p.length
  return pointInPolygon(x, z, PLAZA_OUTLINE)
}

function ellipse({ x, z, rx, rz }, segments = 56) {
  return Array.from({ length: segments }, (_, i) => {
    const a = (i / segments) * Math.PI * 2
    return [x + Math.cos(a) * rx, z + Math.sin(a) * rz]
  })
}

/** Sutherland-Hodgman contra el semiplano f(x, z) >= 0. */
function clipHalfPlane(polygon, f) {
  const out = []
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i]
    const b = polygon[(i + 1) % polygon.length]
    const fa = f(...a)
    const fb = f(...b)
    if (fa >= 0) out.push(a)
    if (fa >= 0 !== fb >= 0) {
      const t = fa / (fa - fb)
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    }
  }
  return out
}

/**
 * Pisos de la plaza como polígonos (x, z): solado, vereda de Belgrano, franja
 * verde sobre el borde oeste y el cantero ovalado.
 */
export function plazaGround() {
  const pu = STREETS.pueyrredon
  const pe = STREETS.peredo
  const inner = (z) => belgranoCurb(z) - SIDEWALK
  const [west, notch, notchEnd] = PLAZA_OUTLINE
  const puCut = cornerCut(pu.curbSouth, pu.lineSouth)
  const peCut = cornerCut(pe.lineNorth, pe.curbNorth)
  const southWest = [xAt(west, notch, pe.lineNorth), pe.lineNorth]

  const paving = [
    southWest,
    notch,
    notchEnd,
    TOWER_SOUTH,
    [xAt(TOWER_SOUTH, TOWER_NORTH, 0), 0],
    [inner(0), 0],
    [inner(pe.lineNorth), pe.lineNorth]
  ]
  const sidewalk = [
    [puCut, pu.curbSouth],
    [belgranoCurb(pu.curbSouth), pu.curbSouth],
    [belgranoCurb(pe.curbNorth), pe.curbNorth],
    [peCut, pe.curbNorth],
    [peCut, pe.lineNorth],
    [inner(pe.lineNorth), pe.lineNorth],
    [inner(0), 0],
    [puCut, 0]
  ]
  // Franja de pasto con árboles contra el borde suroeste
  const band = [
    southWest,
    notch,
    [notch[0] + 2.5, notch[1] - 0.2],
    [southWest[0] + 2.6, southWest[1]]
  ]

  const soil = ellipse({ ...BED, rx: BED.rx - BED.ring, rz: BED.rz - BED.ring })
  // Pasto en la mitad hacia Peredo y tierra hacia Pueyrredón (Street View)
  const grass = clipHalfPlane(soil, (x, z) => z - BED.z - 0.35 * (x - BED.x) + 1.0)
  const mound = { x: BED.x - 0.4, z: BED.z + 3.4, rx: 2.6, ry: 0.45, rz: 3.0 }

  // Franja gris de baldosas a lo largo de la vereda, a 1 m del cordón
  const z0 = pu.curbSouth + 0.3
  const z1 = pe.curbNorth - 0.3
  const guide = {
    from: [belgranoCurb(z0) - 1.2, z0],
    to: [belgranoCurb(z1) - 1.2, z1],
    width: 0.4
  }
  return {
    paving,
    sidewalk,
    band,
    bed: { outer: ellipse(BED), soil, grass, mound },
    guide,
    hedge: [southWest, notch, notchEnd, TOWER_SOUTH]
  }
}

export function plazaTrees(rand) {
  return TREES.map((t) => ({ ...t, rot: rand() * Math.PI }))
}

/** Caja a lo largo de un tramo (a → b), desplazada `offset` hacia un costado (como en Canada.jsx). */
function along(b, material, [ax, az], [bx, bz], offset, width, y0, y1) {
  const theta = Math.atan2(bx - ax, bz - az)
  const half = Math.hypot(bx - ax, bz - az) / 2
  const cx = (ax + bx) / 2 + Math.cos(theta) * offset
  const cz = (az + bz) / 2 - Math.sin(theta) * offset
  b.add(material, cx - width / 2, cx + width / 2, y0, y1, cz - half, cz + half, theta)
}

function fountain(b) {
  // Espejo de agua con borde de ladrillo y la fuente escalonada en el extremo norte
  const { x0, x1, z0, z1, rim } = POND
  b.add('brick', x0, x1, 0, 0.4, z0, z0 + rim)
  b.add('brick', x0, x1, 0, 0.4, z1 - rim, z1)
  b.add('brick', x0, x0 + rim, 0, 0.4, z0, z1)
  b.add('brick', x1 - rim, x1, 0, 0.4, z0, z1)
  b.add('canalWater', x0 + rim, x1 - rim, 0, 0.22, z0 + rim, z1 - rim)
  const { x, z, half, steps, rise, inset } = FOUNTAIN
  for (let k = 0; k < steps; k++) {
    const h = half - k * inset
    b.add('brick', x - h, x + h, k * rise, (k + 1) * rise, z - h, z + h)
  }
}

function playground(b) {
  const { x0, x1, z0, z1 } = SAND
  b.add('sand', x0, x1, -0.1, 0.04, z0, z1)
  const t = 0.15
  b.add('stone', x0 - t, x1 + t, 0, 0.12, z0 - t, z0)
  b.add('stone', x0 - t, x1 + t, 0, 0.12, z1, z1 + t)
  b.add('stone', x0 - t, x0, 0, 0.12, z0, z1)
  b.add('stone', x1, x1 + t, 0, 0.12, z0, z1)

  // Tobogán: torre de 1 x 1 m con plataforma a 1,2 m y escalera al oeste
  const sx = 43
  const sz = 36
  for (const dx of [-0.5, 0.45]) {
    for (const dz of [-0.5, 0.45])
      b.add('playBlue', sx + dx, sx + dx + 0.05, 0, 2.1, sz + dz, sz + dz + 0.05)
  }
  b.add('playOrange', sx - 0.5, sx + 0.5, 1.2, 1.28, sz - 0.5, sz + 0.5)
  for (const dz of [-0.5, 0.45])
    b.add('playOrange', sx - 0.5, sx + 0.5, 1.85, 1.92, sz + dz, sz + dz + 0.05)
  b.add('playOrange', sx - 0.6, sx + 0.6, 2.1, 2.16, sz - 0.6, sz + 0.6)
  for (let y = 0.3; y < 1.2; y += 0.3)
    b.add('playBlue', sx - 0.52, sx - 0.47, y, y + 0.04, sz - 0.45, sz + 0.45)
  b.add('playOrange', 45.9, 46.5, 0.26, 0.31, sz - 0.25, sz + 0.25)

  // Hamacas: travesaño a 2,3 m sobre dos caballetes y dos asientos
  const hz = 36
  b.add('playBlue', 36.6, 40.2, 2.25, 2.35, hz - 0.05, hz + 0.05)
  for (const seat of [37.8, 39.0]) {
    for (const dx of [-0.22, 0.22])
      b.add('lampPole', seat + dx - 0.01, seat + dx + 0.01, 0.47, 2.25, hz - 0.01, hz + 0.01)
    b.add('playOrange', seat - 0.25, seat + 0.25, 0.45, 0.49, hz - 0.1, hz + 0.1)
  }

  // Subibaja: apoyo central
  b.add('playBlue', 39.35, 39.65, 0, 0.45, 33.45, 33.75)
}

/** Piezas inclinadas (no se pueden describir como cajas alineadas). */
export const PLAZA_BEAMS = [
  // Rampa del tobogán y sus bordes
  { material: 'playOrange', from: [43.5, 1.26, 36], to: [45.9, 0.3, 36], w: 0.5, h: 0.04 },
  { material: 'playOrange', from: [43.5, 1.36, 35.77], to: [45.9, 0.4, 35.77], w: 0.04, h: 0.18 },
  { material: 'playOrange', from: [43.5, 1.36, 36.23], to: [45.9, 0.4, 36.23], w: 0.04, h: 0.18 },
  // Caballetes de las hamacas
  ...[36.65, 40.15].flatMap((x) =>
    [-0.8, 0.8].map((dz) => ({
      material: 'playBlue',
      from: [x, 0, 36 + dz],
      to: [x, 2.32, 36],
      w: 0.07,
      h: 0.07
    }))
  ),
  // Tabla del subibaja
  { material: 'playOrange', from: [37.6, 0.22, 33.6], to: [41.4, 0.68, 33.6], w: 0.26, h: 0.06 }
]

export function buildPlazaBoxes() {
  const b = createBoxList()
  const ground = plazaGround()

  // Cerco vivo sobre el borde con los linderos (oeste)
  const hedge = ground.hedge
  for (let i = 0; i < hedge.length - 1; i++)
    along(b, 'hedge', hedge[i], hedge[i + 1], -0.4, 0.7, 0, 0.9)

  // Franja gris de la vereda de Belgrano
  const { from, to, width } = ground.guide
  along(b, 'curb', from, to, 0, width, -0.01, 0.008)

  fountain(b)
  playground(b)

  for (const [x, z, axis] of BENCHES) {
    const [hx, hz] = axis === 'x' ? [0.8, 0.23] : [0.23, 0.8]
    b.add('rawConcrete', x - hx, x + hx, 0, 0.45, z - hz, z + hz)
  }
  const { x0, x1, zs } = BIKE_RACKS
  for (const z of zs) {
    for (const x of [x0, x1 - 0.05]) b.add('playBlue', x, x + 0.05, 0, 0.82, z - 0.025, z + 0.025)
    b.add('playBlue', x0, x1, 0.78, 0.83, z - 0.025, z + 0.025)
  }
  for (const [x, z] of BINS) {
    b.add('lampPole', x - 0.025, x + 0.025, 0, 0.5, z - 0.025, z + 0.025)
    b.add('lampPole', x - 0.15, x + 0.15, 0.45, 0.85, z - 0.15, z + 0.15)
  }
  return b
}
