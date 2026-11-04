/**
 * Datos curados a mano sobre las plantas (no hay CAD del proyecto: se leen
 * del PNG de cada planta, en sus píxeles, con la misma transformación a metros
 * que los muros detectados; ver readPlan en planImage.js).
 *
 * Los placares se dibujan en el mismo gris que los muros y con el rayado de
 * las perchas: la detección automática no los separa y dejaba sus divisiones
 * como tabiques sueltos. Acá se marcan uno por uno:
 *   rect:  [x0, y0, x1, y1] en píxeles de la planta (del muro al frente)
 *   doors: hacia dónde abren las puertas en la imagen (top, bottom, left, right)
 * Lo detectado como muro dentro de un placard se descarta.
 */
const closet = (rect, doors) => ({ rect, doors })

/*
 * Cocinas (las plantas dibujan mesadas, bacha, anafe y heladera con trazos
 * finos que la detección automática solo encontraba a pedazos):
 *   runs:    mesadas contra un muro; `back` es el lado del muro en la imagen
 *   island:  isla exenta; `stools` es el lado de los banquetas
 *   fridge:  heladera (altura del corte), `back` como en las mesadas
 *   sink / cooktop / washer: bacha, anafe y lavarropas, apoyados en una mesada
 */
const run = (rect, back) => ({ rect, back })

// Kitchenette en L de los deptos A y B (pisos 1 a 6): mesada contra el núcleo
// con bacha y anafe, y enfrente lavarropas y heladera
const lKitchens = ({ core: [c0, c1], side: [s0, s1] }) => [
  {
    runs: [run([c0, 32, c1, 90], 'right'), run([s0, 50, s1, 90], 'left')],
    fridge: { rect: [s0, 32, s1, 50], back: 'left' },
    cooktop: [c0 + 2, 41, c1 - 1, 51],
    sink: [c0 + 3, 66, c1 - 3, 83],
    washer: [s0 + 2, 56, s1 - 3, 74]
  },
  {
    runs: [run([c0, 290, c1, 348], 'right'), run([s0, 290, s1, 326], 'left')],
    fridge: { rect: [s0, 326, s1, 348], back: 'left' },
    cooktop: [c0 + 2, 329, c1 - 1, 340],
    sink: [c0 + 3, 297, c1 - 3, 313],
    washer: [s0 + 2, 302, s1 - 3, 322]
  }
]

// Pisos 7 a 13, deptos A y B: misma L, un poco más larga
const lKitchensHigh = [
  {
    runs: [run([294, 25, 312, 88], 'right'), run([241, 46, 261, 72], 'left')],
    fridge: { rect: [241, 24, 261, 46], back: 'left' },
    cooktop: [296, 34, 311, 46],
    sink: [297, 60, 309, 80],
    washer: [243, 50, 258, 68]
  },
  {
    runs: [run([294, 297, 312, 357], 'right'), run([241, 307, 261, 330], 'left')],
    fridge: { rect: [241, 330, 261, 356], back: 'left' },
    cooktop: [296, 336, 311, 346],
    sink: [297, 300, 310, 317],
    washer: [243, 311, 258, 328]
  }
]

// Deptos C y D de PB y pisos 1 a 5: mesada con bacha y anafe y, enfrente,
// heladera y lavarropas
const rearKitchens = [
  {
    runs: [run([401, 32, 419, 90], 'left'), run([448, 52, 468, 90], 'right')],
    fridge: { rect: [448, 32, 468, 52], back: 'right' },
    cooktop: [403, 44, 417, 56],
    sink: [404, 66, 416, 82],
    washer: [451, 58, 466, 78]
  },
  {
    runs: [run([401, 290, 419, 348], 'left'), run([448, 290, 468, 328], 'right')],
    fridge: { rect: [448, 328, 468, 348], back: 'right' },
    cooktop: [403, 324, 417, 337],
    sink: [404, 297, 416, 313],
    washer: [451, 304, 466, 324]
  }
]

// Monoambientes C y D (pisos 6 y 11 a 13): mesada con bacha y heladera contra
// el núcleo, isla con anafe y banquetas hacia el ventanal
const islandKitchens = (dx) => [
  {
    runs: [run([402 + dx, 82, 419 + dx, 131], 'left')],
    fridge: { rect: [402 + dx, 131, 419 + dx, 155], back: 'left' },
    sink: [404 + dx, 98, 416 + dx, 115],
    island: { rect: [452 + dx, 100, 479 + dx, 157], stools: 'right' },
    cooktop: [455 + dx, 105, 470 + dx, 118]
  },
  {
    runs: [run([402 + dx, 247, 419 + dx, 296], 'left')],
    fridge: { rect: [402 + dx, 222, 419 + dx, 247], back: 'left' },
    sink: [404 + dx, 268, 416 + dx, 283],
    island: { rect: [452 + dx, 220, 479 + dx, 277], stools: 'right' },
    cooktop: [455 + dx, 262, 470 + dx, 274]
  }
]

export const LAYOUTS = {
  // Deptos C y D de PB (dormitorios hacia los patios)
  PB: {
    closets: [closet([551, 30, 638, 48], 'bottom'), closet([551, 330, 638, 348], 'top')],
    kitchens: rearKitchens
  },
  // Un placard por dormitorio de los cuatro deptos (A y B al frente, C y D atrás)
  'P1-5': {
    closets: [
      closet([64, 32, 150, 50], 'bottom'),
      closet([64, 327, 151, 346], 'top'),
      closet([550, 31, 636, 50], 'bottom'),
      closet([550, 328, 636, 347], 'top')
    ],
    kitchens: [...lKitchens({ core: [281, 299], side: [232, 251] }), ...rearKitchens]
  },
  P6: {
    closets: [
      // Dormitorio del depto B (arriba en la imagen) y del depto A (abajo)
      closet([63, 32, 150, 49], 'bottom'),
      closet([63, 330, 150, 347], 'top')
    ],
    kitchens: [...lKitchens({ core: [279, 297], side: [230, 249] }), ...islandKitchens(0)]
  },
  'P7-10': {
    closets: [
      closet([66, 24, 155, 43], 'bottom'),
      closet([66, 343, 155, 356], 'top'),
      // Depto C: placard del dormitorio, vestidor y placard del pasillo
      closet([484, 24, 505, 72], 'right'),
      closet([418, 106, 474, 123], 'top'),
      closet([449, 193, 470, 262], 'right')
    ],
    kitchens: [
      ...lKitchensHigh,
      // Depto C: mesada corrida bajo la ventana del contrafrente
      {
        runs: [run([503, 212, 595, 234], 'top')],
        fridge: { rect: [505, 238, 530, 265], back: 'left' },
        cooktop: [531, 213, 549, 232],
        sink: [560, 218, 578, 231]
      }
    ]
  },
  'P11-13': {
    closets: [closet([66, 25, 155, 43], 'bottom'), closet([66, 337, 155, 356], 'top')],
    kitchens: [...lKitchensHigh, ...islandKitchens(16)]
  },
  // Planta baja de los dúplex: mesadas en paralelo en A, B y C (frente) e isla
  // con bacha en D y E (contrafrente)
  P14: {
    closets: [],
    kitchens: [
      {
        runs: [run([287, 25, 305, 95], 'right'), run([238, 52, 258, 92], 'left')],
        cooktop: [289, 79, 303, 89],
        sink: [243, 70, 256, 86],
        washer: [289, 28, 304, 46]
      },
      {
        runs: [run([250, 172, 268, 243], 'right'), run([202, 172, 221, 196], 'left')],
        cooktop: [252, 180, 266, 192],
        sink: [205, 178, 218, 193],
        washer: [252, 225, 266, 243]
      },
      {
        runs: [run([287, 293, 305, 357], 'right'), run([238, 293, 258, 330], 'left')],
        cooktop: [289, 294, 304, 303],
        sink: [243, 297, 256, 312],
        washer: [289, 336, 304, 355]
      },
      {
        runs: [run([440, 88, 458, 145], 'left')],
        fridge: { rect: [440, 62, 458, 88], back: 'left' },
        cooktop: [441, 122, 456, 137],
        washer: [442, 92, 456, 110],
        island: { rect: [484, 60, 504, 148], stools: 'right' },
        sink: [486, 97, 499, 113]
      },
      {
        runs: [run([440, 228, 458, 290], 'left')],
        fridge: { rect: [440, 290, 458, 318], back: 'left' },
        cooktop: [441, 236, 456, 250],
        washer: [442, 268, 456, 288],
        island: { rect: [484, 225, 504, 318], stools: 'right' },
        sink: [486, 266, 499, 282]
      }
    ]
  },
  // Terraza de oficinas: los cuatro círculos de las esquinas son macetas, no mesas
  OF3: { closets: [], ignoreTables: true },
  // Planta alta de los dúplex: placares en todos los dormitorios
  P15: {
    closets: [
      closet([130, 113, 173, 129], 'top'),
      closet([173, 79, 189, 129], 'left'),
      closet([192, 132, 241, 151], 'bottom'),
      closet([192, 197, 241, 216], 'top'),
      closet([130, 247, 173, 262], 'bottom'),
      closet([173, 247, 189, 296], 'left'),
      closet([410, 118, 436, 137], 'bottom'),
      closet([512, 117, 566, 135], 'bottom'),
      closet([411, 187, 489, 205], 'top'),
      closet([434, 262, 451, 320], 'right'),
      closet([481, 262, 500, 320], 'left')
    ]
  }
}

export const layoutOf = (planName) => ({ closets: [], kitchens: [], ...LAYOUTS[planName] })

/** Rectángulos (px) ocupados por muebles curados: lo detectado como muro adentro se descarta. */
function furnitureRects(layout) {
  const rects = layout.closets.map((c) => c.rect)
  for (const k of layout.kitchens) {
    rects.push(...k.runs.map((r) => r.rect))
    if (k.fridge) rects.push(k.fridge.rect)
    if (k.island) rects.push(k.island.rect)
  }
  return rects
}

/**
 * ¿El rectángulo (px) está entero dentro de algún placard? Se usa para
 * descartar las divisiones de los módulos; los muros que pasan por el borde
 * (el del fondo, el exterior) se conservan.
 */
export function insideCloset(layout, [x0, y0, x1, y1]) {
  return furnitureRects(layout).some(
    ([a0, b0, a1, b1]) => x0 >= a0 - 1 && x1 <= a1 + 1 && y0 >= b0 - 1 && y1 <= b1 + 1
  )
}
