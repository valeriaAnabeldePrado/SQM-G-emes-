import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { createBoxList } from '../architecture/boxes'
import floorFurniture from './floorFurniture.json'

// Muebles livianos generados donde las plantas dibujan mesas redondas, camas,
// artefactos de baño y cocina (ver scripts/edificio-3d/bake-furniture.py). Medidas en metros, alturas desde la
// losa del piso.

const TABLE_HEIGHT = 0.74
const CHAIR_GAP = 0.22 // distancia del borde de la mesa al centro de la silla

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
  for (const detected of counters) counter(boxes, plan, detected)
  for (const detected of fixtures) {
    const [, px0, py0, px1, py1] = detected
    fixture(boxes, plan, detected, insideAny(counters, (px0 + px1) / 2, (py0 + py1) / 2))
  }
  const tops = []
  const stems = []
  for (const [px, py, pr] of tables) {
    const [x, z] = plan.toWorld(px, py)
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
    appliance: new THREE.MeshStandardMaterial({ color: '#f2f2f0', roughness: 0.4 })
  }
}
