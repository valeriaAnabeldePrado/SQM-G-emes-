import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { createBoxList } from '../architecture/boxes'
import { LOT } from '../buildings/vivra-guemes/config'
import floorFurniture from './floorFurniture.json'
import { layoutOf } from './layouts'

// Muebles livianos generados donde las plantas dibujan mesas redondas, camas,
// artefactos de baño y cocina (ver scripts/edificio-3d/bake-furniture.py). Medidas en metros, alturas desde la
// losa del piso.

const TABLE_HEIGHT = 0.74
const CHAIR_GAP = 0.22 // distancia del borde de la mesa al centro de la silla
// Fachadas sobre Pueyrredón (z = 0) y sobre Peredo (z = LOT.depth)
const FACADE_MARGIN = 0.2

/** Caja rotada `theta` alrededor del centro de la pieza (cx, cz), desplazada (lx, lz). */
function part(b, material, cx, cz, theta, lx, lz, hw, hd, y0, y1) {
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)
  const x = cx + lx * cos + lz * sin
  const z = cz - lx * sin + lz * cos
  b.add(material, x - hw, x + hw, y0, y1, z - hd, z + hd, theta)
}

/** Silla: asiento, respaldo del lado opuesto a la mesa y cuatro patas. */
function chair(b, cx, cz, theta) {
  part(b, 'chairSeat', cx, cz, theta, 0, 0, 0.21, 0.21, 0.43, 0.47)
  part(b, 'chairSeat', cx, cz, theta, 0, 0.19, 0.21, 0.02, 0.47, 0.86)
  for (const lx of [-0.18, 0.18]) {
    for (const lz of [-0.18, 0.18])
      part(b, 'chairLeg', cx, cz, theta, lx, lz, 0.015, 0.015, 0, 0.43)
  }
}

/**
 * Cama alineada a los ejes: base, colchón, acolchado sobre los dos tercios del
 * pie, almohadas y respaldo contra el muro. `head` es hacia dónde queda la
 * cabecera: '+x', '-x', '+z' o '-z'.
 */
function bed(b, x0, x1, z0, z1, head) {
  const alongX = head === '+x' || head === '-x'
  const sign = head[0] === '+' ? 1 : -1
  // Coordenadas locales: u a lo largo de la cama (0 pie -> 1 cabecera), v a lo ancho
  const [a0, a1, c0, c1] = alongX ? [x0, x1, z0, z1] : [z0, z1, x0, x1]
  const at = (u) => (sign > 0 ? a0 + u * (a1 - a0) : a1 - u * (a1 - a0))
  const box = (material, u0, u1, w0, w1, y0, y1) => {
    const ua = at(u0)
    const ub = at(u1)
    const va = c0 + w0 * (c1 - c0)
    const vb = c0 + w1 * (c1 - c0)
    if (alongX) b.add(material, ua, ub, y0, y1, va, vb)
    else b.add(material, va, vb, y0, y1, ua, ub)
  }
  const width = c1 - c0
  box('bedFrame', 0, 1, 0, 1, 0.08, 0.3)
  box('mattress', 0.01, 0.99, 0.02, 0.98, 0.3, 0.5)
  box('duvet', 0, 0.68, -0.01, 1.01, 0.32, 0.53)
  box('bedFrame', 0.97, 1.0, -0.02, 1.02, 0.08, 1.05)
  const pillows =
    width > 1.2
      ? [
          [0.06, 0.48],
          [0.52, 0.94]
        ]
      : [[0.1, 0.9]]
  for (const [w0, w1] of pillows) box('pillow', 0.8, 0.95, w0, w1, 0.5, 0.62)
}

// En la imagen: izquierda = -z, derecha = +z, arriba = +x, abajo = -x
const SIDE_TO_DIR = { left: '-z', right: '+z', top: '+x', bottom: '-x' }

/** Rectángulo de la planta (px) en metros: [x0, x1, z0, z1]. */
function worldRect(plan, px0, py0, px1, py1) {
  const [xa, za] = plan.toWorld(px0, py0)
  const [xb, zb] = plan.toWorld(px1, py1)
  return [Math.min(xa, xb), Math.max(xa, xb), Math.min(za, zb), Math.max(za, zb)]
}

/**
 * Cajas en coordenadas de la pieza: u de adelante (0) hacia el muro (1), w a lo
 * ancho (0..1), y en metros. `back` es hacia dónde queda el muro.
 */
function piece(b, [x0, x1, z0, z1], back) {
  const alongX = back === '+x' || back === '-x'
  const toWall = back[0] === '+'
  const [a0, a1, c0, c1] = alongX ? [x0, x1, z0, z1] : [z0, z1, x0, x1]
  const at = (u) => (toWall ? a0 + u * (a1 - a0) : a1 - u * (a1 - a0))
  return (material, u0, u1, w0, w1, y0, y1) => {
    const ua = at(u0)
    const ub = at(u1)
    const va = c0 + w0 * (c1 - c0)
    const vb = c0 + w1 * (c1 - c0)
    if (alongX) b.add(material, ua, ub, y0, y1, va, vb)
    else b.add(material, va, vb, y0, y1, ua, ub)
  }
}

const COUNTER_TOP = 0.9
const KITCHEN_FIXTURES = new Set(['anafe', 'bacha', 'lavarropas'])
// Los muros se cortan a 1,6 m (planta en corte): el placard llega apenas abajo
const CLOSET_TOP = 1.56
const CLOSET_DOOR = 0.55 // ancho de hoja

// Hacia dónde abren las puertas -> hacia dónde queda el muro del fondo
const OPPOSITE = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

/**
 * Placard de roble (renders del proyecto): cuerpo a la altura del corte,
 * juntas entre hojas y tiradores negros verticales, a la altura de la mano.
 */
function closet(b, plan, { rect: [px0, py0, px1, py1], doors }) {
  const area = worldRect(plan, px0, py0, px1, py1)
  const box = piece(b, area, SIDE_TO_DIR[OPPOSITE[doors]])
  const along = doors === 'top' || doors === 'bottom' ? area[3] - area[2] : area[1] - area[0]
  box('closet', 0.03, 1, 0, 1, 0, CLOSET_TOP)
  const leaves = Math.max(2, Math.round(along / CLOSET_DOOR))
  for (let k = 1; k < leaves; k++) {
    const w = k / leaves
    box('closetSeam', 0.02, 0.035, w - 0.004 / along, w + 0.004 / along, 0.04, CLOSET_TOP - 0.02)
    // Un tirador a cada lado de las juntas pares (hojas de a pares)
    if (k % 2 === 1) {
      for (const side of [-1, 1]) {
        const c = w + (side * 0.05) / along
        box('handle', 0, 0.03, c - 0.012 / along, c + 0.012 / along, 0.85, 1.2)
      }
    }
  }
}

/** Artefactos de baño y cocina (bloques de CAD detectados en la planta). */
function fixture(b, plan, [name, px0, py0, px1, py1, side], onCounter) {
  const box = piece(b, worldRect(plan, px0, py0, px1, py1), SIDE_TO_DIR[side])
  if (name === 'inodoro') {
    box('ceramic', 0, 0.72, 0.12, 0.88, 0, 0.4)
    box('ceramic', 0.72, 1, 0.05, 0.95, 0, 0.78)
  } else if (name === 'bide') {
    box('ceramic', 0, 0.85, 0.12, 0.88, 0, 0.4)
  } else if (name === 'lavatorio') {
    box('cabinet', 0, 1, 0, 1, 0, 0.8)
    box('ceramic', 0, 1, 0, 1, 0.8, 0.86)
    box('steel', 0.2, 0.75, 0.2, 0.8, 0.86, 0.865)
  } else if (name === 'anafe') {
    box('cooktop', 0.08, 0.92, 0.05, 0.95, COUNTER_TOP, COUNTER_TOP + 0.012)
  } else if (name === 'bacha') {
    box('steel', 0.12, 0.88, 0.1, 0.9, COUNTER_TOP - 0.01, COUNTER_TOP + 0.006)
  } else if (name === 'lavarropas' && !onCounter) {
    box('appliance', 0, 1, 0, 1, 0, 0.85)
  }
}

/** Mesada de cocina: bajo mesada blanco y tapa de piedra oscura. */
function counter(b, plan, [px0, py0, px1, py1, side]) {
  const box = piece(b, worldRect(plan, px0, py0, px1, py1), SIDE_TO_DIR[side])
  box('cabinet', 0.04, 1, 0, 1, 0.1, COUNTER_TOP - 0.04)
  box('countertop', 0, 1, 0, 1, COUNTER_TOP - 0.04, COUNTER_TOP)
}

// Cocinas curadas (layouts.js): bajo mesada de roble como los placares,
// mesada clara de cuarzo, heladera de acero y banquetas en las islas
const BASE_TOP = 0.86
const STOOL_SPACING = 0.55
const OVERHANG = 0.25 // vuelo de la mesada de la isla del lado de las banquetas

const inside = ([x0, y0, x1, y1], [a0, b0, a1, b1]) =>
  x0 >= a0 - 1 && x1 <= a1 + 1 && y0 >= b0 - 1 && y1 <= b1 + 1

/** Bajo mesada con zócalo, juntas entre puertas y mesada de cuarzo. */
function cabinetRun(b, area, back, length) {
  const box = piece(b, area, back)
  box('plinth', 0.08, 1, 0, 1, 0, 0.1)
  box('closet', 0.03, 1, 0, 1, 0.1, BASE_TOP)
  box('quartz', 0, 1, 0, 1, BASE_TOP, COUNTER_TOP)
  const doors = Math.max(1, Math.round(length / 0.6))
  for (let k = 1; k < doors; k++) {
    const w = k / doors
    box('closetSeam', 0.02, 0.035, w - 0.004 / length, w + 0.004 / length, 0.12, BASE_TOP - 0.02)
  }
}

function kitchen(b, plan, k) {
  const runs = k.runs.map(({ rect, back }) => {
    const area = worldRect(plan, ...rect)
    const dir = SIDE_TO_DIR[back]
    const along = back === 'left' || back === 'right' ? area[1] - area[0] : area[3] - area[2]
    cabinetRun(b, area, dir, along)
    return { rect, dir }
  })
  // Lado del muro de lo que apoya sobre una mesada (para el frente del lavarropas)
  const backOf = (rect) => runs.find((r) => inside(rect, r.rect))?.dir ?? '-z'

  if (k.island) {
    const area = worldRect(plan, ...k.island.rect)
    const [x0, x1, z0, z1] = area
    const side = SIDE_TO_DIR[k.island.stools]
    const box = piece(b, area, side)
    box('plinth', 0.08, 0.92, 0.02, 0.98, 0, 0.1)
    box('closet', 0.03, 0.97, 0, 1, 0.1, BASE_TOP)
    // Mesada con vuelo hacia las banquetas
    const top = [...area]
    if (side === '+z') top[3] += OVERHANG
    else if (side === '-z') top[2] -= OVERHANG
    else if (side === '+x') top[1] += OVERHANG
    else top[0] -= OVERHANG
    b.add('quartz', top[0], top[1], BASE_TOP, COUNTER_TOP, top[2], top[3])
    // Banquetas a lo largo del lado libre
    const alongX = side === '+z' || side === '-z'
    const [l0, l1] = alongX ? [x0, x1] : [z0, z1]
    const count = Math.max(1, Math.floor((l1 - l0) / STOOL_SPACING))
    const edge = { '+z': z1, '-z': z0, '+x': x1, '-x': x0 }[side] + (side[0] === '+' ? 0.42 : -0.42)
    for (let i = 0; i < count; i++) {
      const c = l0 + ((l1 - l0) * (i + 0.5)) / count
      const [sx, sz] = alongX ? [c, edge] : [edge, c]
      b.add('chairSeat', sx - 0.18, sx + 0.18, 0.62, 0.67, sz - 0.18, sz + 0.18)
      b.add('metal', sx - 0.02, sx + 0.02, 0.02, 0.62, sz - 0.02, sz + 0.02)
      b.add('metal', sx - 0.16, sx + 0.16, 0, 0.02, sz - 0.16, sz + 0.16)
    }
  }

  if (k.fridge) {
    const box = piece(b, worldRect(plan, ...k.fridge.rect), SIDE_TO_DIR[k.fridge.back])
    box('fridge', 0.02, 1, 0.03, 0.97, 0, CLOSET_TOP)
    box('closetSeam', 0, 0.02, 0.03, 0.97, 1.0, 1.01)
    box('handle', 0, 0.02, 0.85, 0.88, 0.6, 1.4)
  }
  if (k.sink) {
    const [x0, x1, z0, z1] = worldRect(plan, ...k.sink)
    b.add('steel', x0, x1, COUNTER_TOP - 0.005, COUNTER_TOP + 0.004, z0, z1)
    b.add(
      'sinkBowl',
      x0 + 0.04,
      x1 - 0.04,
      COUNTER_TOP - 0.004,
      COUNTER_TOP + 0.006,
      z0 + 0.04,
      z1 - 0.04
    )
  }
  if (k.cooktop) {
    const [x0, x1, z0, z1] = worldRect(plan, ...k.cooktop)
    b.add('cooktop', x0, x1, COUNTER_TOP - 0.004, COUNTER_TOP + 0.01, z0, z1)
  }
  if (k.washer) {
    const box = piece(b, worldRect(plan, ...k.washer), backOf(k.washer))
    box('appliance', -0.005, 0.2, 0.05, 0.95, 0.1, BASE_TOP - 0.02)
    box('cooktop', -0.012, 0, 0.25, 0.75, 0.3, 0.68)
  }
}

const insideAny = (rects, x, y) =>
  rects.some(([x0, y0, x1, y1]) => x >= x0 && x <= x1 && y >= y0 && y <= y1)

/** Cama según la detección en la planta (rectángulo en píxeles + lado de la cabecera). */
function bedFromPlan(b, plan, [px0, py0, px1, py1, side]) {
  const [x0, x1, z0, z1] = worldRect(plan, px0, py0, px1, py1)
  bed(b, x0, x1, z0, z1, SIDE_TO_DIR[side])
}

/**
 * Mesas con cuatro sillas en diagonal (como están dibujadas en las plantas).
 * Devuelve cajas (sillas) y cilindros fusionados por material (tapas y pies).
 */
export function buildFurniture(planName, plan) {
  const { tables = [], beds = [], fixtures = [], counters = [] } = floorFurniture[planName] ?? {}
  const boxes = createBoxList()
  for (const detected of beds) bedFromPlan(boxes, plan, detected)
  const layout = layoutOf(planName)
  for (const curated of layout.closets) closet(boxes, plan, curated)
  for (const curated of layout.kitchens) kitchen(boxes, plan, curated)
  // Con cocinas curadas, lo detectado de cocina (pedazos de mesada, bacha,
  // anafe, lavarropas) se descarta; los artefactos de baño quedan
  const curatedKitchens = layout.kitchens.length > 0
  for (const detected of curatedKitchens ? [] : counters) counter(boxes, plan, detected)
  for (const detected of fixtures) {
    if (curatedKitchens && KITCHEN_FIXTURES.has(detected[0])) continue
    const [, px0, py0, px1, py1] = detected
    fixture(boxes, plan, detected, insideAny(counters, (px0 + px1) / 2, (py0 + py1) / 2))
  }
  const tops = []
  const stems = []
  for (const [px, py, pr] of layoutOf(planName).ignoreTables ? [] : tables) {
    const [x, z] = plan.toWorld(px, py)
    // Las macetas de los balcones (P14 y P15) se dibujan como círculos y se
    // detectan como mesas: lo que cae fuera de las fachadas no es una mesa
    if (z < FACADE_MARGIN || z > LOT.depth - FACADE_MARGIN) continue
    const r = Math.min(0.55, pr / plan.scale)
    tops.push(new THREE.CylinderGeometry(r, r, 0.035, 32).translate(x, TABLE_HEIGHT, z))
    stems.push(
      new THREE.CylinderGeometry(0.045, 0.045, TABLE_HEIGHT, 10).translate(x, TABLE_HEIGHT / 2, z)
    )
    stems.push(new THREE.CylinderGeometry(0.24, 0.27, 0.03, 24).translate(x, 0.015, z))
    for (let k = 0; k < 4; k++) {
      const a = Math.PI / 4 + (k * Math.PI) / 2
      const d = r + CHAIR_GAP
      // El respaldo (+z local de la silla) mira hacia afuera de la mesa
      chair(boxes, x + Math.cos(a) * d, z + Math.sin(a) * d, Math.atan2(Math.cos(a), Math.sin(a)))
    }
  }
  const merge = (parts) => {
    if (!parts.length) return null
    const merged = mergeGeometries(parts)
    parts.forEach((g) => g.dispose())
    return merged
  }
  return { boxes, cylinders: { tableTop: merge(tops), metal: merge(stems) } }
}

export function createFurnitureMaterials() {
  return {
    tableTop: new THREE.MeshStandardMaterial({ color: '#c9a37a', roughness: 0.55 }),
    metal: new THREE.MeshStandardMaterial({ color: '#2f3033', roughness: 0.4, metalness: 0.7 }),
    chairSeat: new THREE.MeshStandardMaterial({ color: '#e7dfd3', roughness: 0.8 }),
    chairLeg: new THREE.MeshStandardMaterial({ color: '#7a5a3c', roughness: 0.6 }),
    bedFrame: new THREE.MeshStandardMaterial({ color: '#8a6a4c', roughness: 0.6 }),
    mattress: new THREE.MeshStandardMaterial({ color: '#f4f2ee', roughness: 0.9 }),
    duvet: new THREE.MeshStandardMaterial({ color: '#c8cfd6', roughness: 0.95 }),
    pillow: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 }),
    // Baño y cocina
    ceramic: new THREE.MeshStandardMaterial({ color: '#fbfbfa', roughness: 0.25 }),
    cabinet: new THREE.MeshStandardMaterial({ color: '#efece6', roughness: 0.6 }),
    countertop: new THREE.MeshStandardMaterial({ color: '#3a3a3d', roughness: 0.35 }),
    cooktop: new THREE.MeshStandardMaterial({ color: '#0f1012', roughness: 0.15, metalness: 0.3 }),
    steel: new THREE.MeshStandardMaterial({ color: '#b9bdc1', roughness: 0.3, metalness: 0.85 }),
    appliance: new THREE.MeshStandardMaterial({ color: '#f2f2f0', roughness: 0.4 }),
    // Placares de roble con tiradores negros (renders del proyecto)
    closet: new THREE.MeshStandardMaterial({ color: '#a38c75', roughness: 0.65 }),
    closetSeam: new THREE.MeshStandardMaterial({ color: '#4a3f35', roughness: 0.8 }),
    handle: new THREE.MeshStandardMaterial({ color: '#141414', roughness: 0.4, metalness: 0.3 }),
    // Cocinas
    quartz: new THREE.MeshStandardMaterial({ color: '#ebe8e2', roughness: 0.3 }),
    plinth: new THREE.MeshStandardMaterial({ color: '#2a2622', roughness: 0.8 }),
    fridge: new THREE.MeshStandardMaterial({ color: '#c8cbcd', roughness: 0.3, metalness: 0.75 }),
    sinkBowl: new THREE.MeshStandardMaterial({ color: '#8e9296', roughness: 0.35, metalness: 0.85 })
  }
}
