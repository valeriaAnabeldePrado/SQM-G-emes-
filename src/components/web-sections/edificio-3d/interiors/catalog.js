import apartmentData from '../../apartments/utils/apartmentData.json'
import {
  AMENITIES_HEIGHT,
  AMENITIES_LEVEL,
  FLOOR_HEIGHT,
  GROUND_HEIGHT,
  HALF,
  LOT,
  OFFICES,
  TOP_FLOOR,
  TOWER,
  levelBase
} from '../buildings/vivra-guemes/config'
import floorUnits from './floorUnits.json'

// Une cada piso abrible (torre y bloque de oficinas) con su planta (la misma
// imagen y los mismos polígonos de /apartments), la ficha de cada unidad
// (apartmentData.json, la que usa /apartments/:id) y su fila en la planilla de
// disponibilidad. Los pisos se identifican con un string: '0'..'16' en la
// torre y 'of0'..'of3' en las oficinas.

const OFFICE_BACK = LOT.depth - OFFICES.depth

// Volúmenes que se recortan al abrir un piso (z de punta a punta)
const TOWER_BOX = { zMin: -1.4, zMax: TOWER.rearLow + 1.5 }
const OFFICE_BOX = { zMin: OFFICE_BACK - 0.3, zMax: LOT.depth + 0.6 }

/** Planta de cada piso de la torre: varios pisos comparten la misma. */
function towerPlan(n) {
  if (n === 0) return 'PB'
  if (n <= 5) return 'P1-5'
  if (n === 6) return 'P6'
  if (n <= 10) return 'P7-10'
  if (n <= 13) return 'P11-13'
  if (n === 14) return 'P14'
  if (n === 15) return 'P15'
  return 'P16'
}

function towerFloor(n) {
  const amenities = n === AMENITIES_LEVEL
  return {
    id: String(n),
    building: 'torre',
    label: n === 0 ? 'PB' : amenities ? `Piso ${n} · Amenities` : `Piso ${n}`,
    short: n === 0 ? 'PB' : String(n),
    base: levelBase(n),
    height: n === 0 ? GROUND_HEIGHT : amenities ? AMENITIES_HEIGHT : FLOOR_HEIGHT,
    plan: towerPlan(n),
    // Borde de la planta hacia Pueyrredón (izquierda de la imagen): el de los
    // balcones, o la línea municipal en PB
    align: { front: n === 0 ? 0 : n >= 14 ? -0.85 : -1.0 },
    box: TOWER_BOX,
    amenities,
    // Planta alta de un dúplex del 14: en la planilla figura como piso 14
    duplexUpper: n === TOP_FLOOR,
    apartmentKey: (letter) =>
      n === 0
        ? letter === 'Local'
          ? 'local_comercial_PB'
          : `duplex_${letter}_PB`
        : `apartment_${letter}_P${n}`,
    sheetKey: (letter) => `${n === 0 ? 'PB' : n === TOP_FLOOR ? 14 : n}-${letter}`
  }
}

const OFFICE_LEVELS = [0, 1, 2, 3].map((k) =>
  k === 0 ? 0 : OFFICES.groundHeight + (k - 1) * OFFICES.floorHeight
)
const OFFICE_KEYS = ['oficina_pb_PB', 'oficina_p1_P1', 'oficina_p2_P2', 'oficina_p3_P3']

function officeFloor(k) {
  return {
    id: `of${k}`,
    building: 'oficinas',
    label: k === 0 ? 'Oficinas · PB' : k === 3 ? 'Oficinas · Terraza' : `Oficinas · Piso ${k}`,
    short: k === 0 ? 'PB' : String(k),
    base: OFFICE_LEVELS[k],
    height: k === 0 ? OFFICES.groundHeight : OFFICES.floorHeight,
    plan: ['OF-PB', 'OF1', 'OF2', 'OF3'][k],
    // Las plantas de oficinas terminan sobre la línea municipal de Peredo
    align: { rear: LOT.depth },
    box: OFFICE_BOX,
    amenities: false,
    duplexUpper: false,
    apartmentKey: () => OFFICE_KEYS[k],
    // El bloque de oficinas se vende entero: una sola fila en la planilla
    sheetKey: () => 'PB-Peredo-Bloque'
  }
}

export const TOWER_FLOORS = Array.from({ length: AMENITIES_LEVEL + 1 }, (_, n) => towerFloor(n))
export const OFFICE_FLOORS = [0, 1, 2, 3].map(officeFloor)
const FLOORS = Object.fromEntries([...TOWER_FLOORS, ...OFFICE_FLOORS].map((f) => [f.id, f]))

export const getFloor = (id) => (id == null ? null : FLOORS[String(id)])

/** Unidades del piso con su ficha y clave de disponibilidad. */
export function floorCatalog(id) {
  const floor = getFloor(id)
  const plan = floorUnits.floors[floor.plan]
  const units = Object.entries(plan.units).map(([letter, polygons]) => {
    const key = floor.amenities ? null : floor.apartmentKey(letter)
    return {
      letter,
      polygons,
      amenity: floor.amenities,
      key,
      info: key ? apartmentData[key] : null,
      sheet: floor.amenities ? null : floor.sheetKey(letter),
      duplexUpper: floor.duplexUpper
    }
  })
  return { floor, image: plan.image, units }
}

/** Cuántas unidades disponibles tiene el piso según la planilla. */
export function availableCount(id, availability) {
  if (!availability) return null
  return floorCatalog(id).units.filter((u) => availability[u.sheet]?.disponible).length
}

/** Piso que corresponde a un punto sobre la torre o las oficinas, o null. */
export function floorAtPoint({ x, y, z }) {
  if (Math.abs(x) > HALF + 0.2 || y < 0) return null
  if (z > TOWER_BOX.zMin && z < TOWER_BOX.zMax) {
    if (y < GROUND_HEIGHT) return '0'
    const n = Math.floor((y - GROUND_HEIGHT) / FLOOR_HEIGHT) + 1
    return String(Math.min(AMENITIES_LEVEL, n))
  }
  if (z > OFFICE_BOX.zMin + 0.3 && z < LOT.depth + 0.2) {
    let k = 0
    OFFICE_LEVELS.forEach((level, i) => {
      if (y >= level) k = i
    })
    return `of${k}`
  }
  return null
}
