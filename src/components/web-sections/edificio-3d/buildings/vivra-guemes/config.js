/**
 * VIVRA Güemes — Av. Pueyrredón 377, Córdoba.
 *
 * Medidas en metros. Sistema local:
 *   x a lo largo de Pueyrredón (+x hacia Belgrano), y hacia arriba,
 *   z hacia el fondo del lote: z = 0 es la línea municipal sobre Pueyrredón y
 *   z = LOT.depth la de Pje. Ángelo de Peredo (lote pasante).
 *
 * Fuentes:
 *   - Plantas de /public/planos (PB, 1 a 16 y oficinas).
 *   - Render de la fachada sobre Pueyrredón: src/assets/banner/bannerOk.png
 *   - Render del frente de oficinas sobre Peredo: src/assets/section-six/frenteTwoOk.png
 *   - Detalle del frente (bandas, carpinterías, PB) y render completo del
 *     contrafrente desde Peredo, enviados por el cliente
 *   - Vista de fachada con materiales: src/assets/sectioncto/plano.png
 *   - Manzana y calles: OpenStreetMap (scripts/edificio-3d/bake-osm-context.py)
 *
 * Las plantas comerciales no tienen cotas generales. El ancho sale de la terraza
 * del piso 16 (10,70 m libres), las alturas de la proporción ancho/piso del render
 * y la profundidad del lote del ancho de la manzana en OSM. Todo es aproximado
 * (±0,5 m) salvo donde se indica la cota del plano.
 */

export const LOT = {
  width: 11.0,
  depth: 40.5 // aprox.: ancho de manzana OSM entre líneas municipales
}

export const HALF = LOT.width / 2
export const SIDE_WALL = 0.2
export const INNER = HALF - SIDE_WALL

export const SLAB = 0.25
export const GROUND_HEIGHT = 4.8 // local con entrepiso: PB ≈ 1,6 pisos tipo en el render
export const FLOOR_HEIGHT = 2.95
export const TOP_FLOOR = 15
export const AMENITIES_LEVEL = 16
export const AMENITIES_HEIGHT = 2.8

/** Nivel de piso terminado del piso n (0 = PB). */
export const levelBase = (n) => (n === 0 ? 0 : GROUND_HEIGHT + (n - 1) * FLOOR_HEIGHT)

export const TOWER = {
  // P1-P13: balcón corrido con antepecho de hormigón (render) que vuela sobre la
  // vereda ("proyección piso 01" en la planta baja).
  bandDepth: 1.0,
  parapetHeight: 1.1,
  // P14-P15: balcones de 0,85 m con baranda metálica (plano y vista de fachada)
  upperBalconyDepth: 0.85,
  // Contrafrente: P1-P5 más profundos; desde P6 retrocede y aparece la terraza
  // de 5,33 x 1,93 m de las unidades C/D.
  // Profundidades calibradas con las plantas (escala del ancho del lote)
  rearLow: 18.7,
  rearHigh: 17.6,
  rearBalconyDepth: 0.9, // balcones de 0,90 m (plantas 7 a 15)
  // Piso 16: solárium + pileta (3,00 x 8,70 m) al frente, quinchos al centro y
  // terraza de 2,70 m al contrafrente.
  amenities: {
    enclosedFrom: 6.5,
    enclosedTo: 14.9,
    pool: { x0: -4.35, x1: 4.35, z0: 1.6, z1: 4.6 }
  },
  // Núcleo (ascensores + escalera) sobre el que apoyan sala de máquinas y tanque
  core: { z0: 8.6, z1: 12.4 }
}

/**
 * Vanos de la fachada principal P1-P13, medidos sobre el render y simetrizados
 * (las unidades A y B son espejadas): dormitorio en cada extremo y dos puertas
 * al balcón en el centro.
 */
export const FRONT_OPENINGS = [
  { from: -4.47, to: -2.93, sill: 0.9 },
  { from: -1.63, to: -0.18, sill: 0 },
  { from: 0.18, to: 1.63, sill: 0 },
  { from: 2.93, to: 4.47, sill: 0.9 }
]
export const WINDOW_HEAD = 2.35

/** P14-P15: tres balcones de 2,68 m (plano) con puerta corrediza cada uno. */
export const UPPER_BALCONIES = [-3.42, 0, 3.42]

/** Juntas verticales de encofrado en las bandas: 4 paños por banda (foto de detalle). */
export const BAND_JOINTS = [-2.65, 0, 2.65]

/** Parantes del vidriado de PB sobre Pueyrredón, medidos sobre la foto de detalle. */
export const GROUND_MULLIONS = [-3.84, -2.35, -1.0, 1.36, 2.96, 4.38]
export const GROUND_DOOR = { from: -1.0, to: 1.36 }

/**
 * Contrafrente, medido sobre el render completo desde Peredo (x crece hacia la
 * derecha de quien mira desde Peredo).
 * P1-P6: puertas al balcón corrido con baranda clara y cortinas.
 * P7-P15: banda de hormigón; ventana doble, ventiluz angosto, ventana central
 * de tres hojas y ventana doble.
 */
export const REAR_BALCONY_OPENINGS = [
  { from: -4.8, to: -2.9, sill: 0 },
  { from: -2.4, to: -0.3, sill: 0 },
  { from: 0.3, to: 2.4, sill: 0 },
  { from: 2.9, to: 4.8, sill: 0 }
]
export const REAR_BAND_OPENINGS = [
  { from: -4.61, to: -2.94, sill: 0.9 },
  { from: -2.16, to: -1.43, sill: 0.9, mullions: 0 },
  { from: 0.41, to: 2.11, sill: 0.9, mullions: 2 },
  { from: 2.87, to: 4.54, sill: 0.9 }
]

// Tanque de agua cilíndrico en la azotea, sobre el núcleo (render del contrafrente)
export const TANK = { x: 2.6, radius: 1.25, height: 3.2 }

// Bloque de oficinas sobre Pje. Ángelo de Peredo: PB + 2 pisos + terraza
// (plantas ofiPisoUno/Dos/Tres y render frenteTwoOk).
export const OFFICES = {
  depth: 6.6,
  groundHeight: 3.3,
  floorHeight: 3.4,
  floors: 2,
  sideWallExtra: 1.9, // los laterales de hormigón suben sobre la terraza (render)
  groundMullions: [-3.21, -2.19, 0.03, 2.39, 3.4],
  // Paneles pivotantes de chapa: ángulos (grados) leídos del render, por piso
  panelAngles: [
    [8, 35, 70, 10, 55, 0, 80, 25, 0, 45],
    [0, 60, 15, 75, 5, 40, 0, 65, 20, 0]
  ]
}

// Patio entre la torre y las oficinas (PB): patios privados de 5,15 m y patio verde
export const PATIO = { privateDepth: 5.2 }

/**
 * Pisos del edificio, pensado para futuras funciones (selección, resaltado,
 * recorridos de cámara). Cada entrada describe un volumen consultable.
 */
export const FLOORS = [
  {
    id: 'PB',
    label: 'Planta baja',
    base: 0,
    height: GROUND_HEIGHT,
    use: 'Local, accesos y 2 dptos'
  },
  ...Array.from({ length: TOP_FLOOR }, (_, i) => {
    const n = i + 1
    return {
      id: `P${n}`,
      label: `Piso ${n}`,
      base: levelBase(n),
      height: FLOOR_HEIGHT,
      use: n >= 14 ? 'Dúplex' : 'Departamentos'
    }
  }),
  {
    id: 'P16',
    label: 'Piso 16',
    base: levelBase(AMENITIES_LEVEL),
    height: AMENITIES_HEIGHT,
    use: 'Amenities: pileta, solárium y quinchos'
  }
]

export const BUILDING_HEIGHT = levelBase(AMENITIES_LEVEL) + AMENITIES_HEIGHT + 2.3
