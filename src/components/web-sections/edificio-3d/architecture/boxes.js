import * as THREE from 'three'
import { addBuildingBounds } from './buildingBounds.js'

// Caras de un cubo. u × v = n, así los triángulos quedan en sentido antihorario.
const FACES = [
  { n: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },
  { n: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
  { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },
  { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
  { n: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0] }
]
const CORNERS = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1]
]

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

/**
 * Lista de cajas en metros, agrupadas por material.
 * Casi toda la arquitectura del edificio es ortogonal, así que se describe como
 * cajas min/max y después se fusiona en una sola geometría por material
 * (un draw call por material para todo el edificio).
 */
export function createBoxList() {
  const items = []
  const panes = []
  return {
    items,
    panes,
    /** Agrupa un lindero completo, incluidos sus vidrios, sin separar meshes. */
    building(build) {
      const start = items.length
      const paneStart = panes.length
      build()
      const bounds = { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] }
      const include = (min, max) => {
        for (let k = 0; k < 3; k++) {
          bounds.min[k] = Math.min(bounds.min[k], min[k])
          bounds.max[k] = Math.max(bounds.max[k], max[k])
        }
      }
      for (const item of items.slice(start)) {
        const center = item.min.map((v, k) => (v + item.max[k]) / 2)
        const half = item.min.map((v, k) => (item.max[k] - v) / 2)
        const c = Math.abs(Math.cos(item.rotY))
        const s = Math.abs(Math.sin(item.rotY))
        const extent = [half[0] * c + half[2] * s, half[1], half[0] * s + half[2] * c]
        include(center.map((v, k) => v - extent[k]), center.map((v, k) => v + extent[k]))
        item.building = bounds
      }
      for (const pane of panes.slice(paneStart)) {
        include([pane.from, pane.bottom, pane.plane], [pane.to, pane.top, pane.plane])
        pane.building = bounds
      }
    },
    /** Paño de vidrio con interior simulado (ver interiorGlass.js). */
    pane(pane) {
      panes.push(pane)
    },
    /** Agrega una caja por sus extremos. rotY (radianes) gira la caja sobre su centro. */
    add(material, x0, x1, y0, y1, z0, z1, rotY = 0) {
      if (x0 === x1 || y0 === y1 || z0 === z1) return
      items.push({
        material,
        min: [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)],
        max: [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)],
        rotY
      })
    }
  }
}

/**
 * Fusiona las cajas en una BufferGeometry por material.
 * Las UV están en metros (coordenadas de mundo proyectadas sobre cada cara), así
 * las texturas de hormigón o bloque mantienen la escala real en todo el edificio.
 */
export function buildBoxGeometries(list) {
  const counts = new Map()
  for (const item of list.items) counts.set(item.material, (counts.get(item.material) || 0) + 1)

  const buffers = new Map()
  for (const [material, count] of counts) {
    const vertices = count * 24
    buffers.set(material, {
      position: new Float32Array(vertices * 3),
      normal: new Float32Array(vertices * 3),
      uv: new Float32Array(vertices * 2),
      buildings: [],
      index: vertices > 65535 ? new Uint32Array(count * 36) : new Uint16Array(count * 36),
      v: 0,
      i: 0
    })
  }

  for (const { material, min, max, rotY, building } of list.items) {
    const buf = buffers.get(material)
    buf.buildings.push(building)
    const center = [(min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2]
    const half = [(max[0] - min[0]) / 2, (max[1] - min[1]) / 2, (max[2] - min[2]) / 2]
    const cos = Math.cos(rotY)
    const sin = Math.sin(rotY)

    for (const face of FACES) {
      const hu = Math.abs(dot(face.u, half))
      const hv = Math.abs(dot(face.v, half))
      const hn = Math.abs(dot(face.n, half))
      const base = buf.v

      for (const [su, sv] of CORNERS) {
        const p = [0, 1, 2].map(
          (k) => center[k] + face.n[k] * hn + face.u[k] * su * hu + face.v[k] * sv * hv
        )
        // UV con la posición antes de rotar: la textura acompaña a la pieza
        buf.uv[buf.v * 2] = dot(p, face.u)
        buf.uv[buf.v * 2 + 1] = dot(p, face.v)

        const dx = p[0] - center[0]
        const dz = p[2] - center[2]
        buf.position[buf.v * 3] = center[0] + dx * cos + dz * sin
        buf.position[buf.v * 3 + 1] = p[1]
        buf.position[buf.v * 3 + 2] = center[2] - dx * sin + dz * cos
        buf.normal[buf.v * 3] = face.n[0] * cos + face.n[2] * sin
        buf.normal[buf.v * 3 + 1] = face.n[1]
        buf.normal[buf.v * 3 + 2] = -face.n[0] * sin + face.n[2] * cos
        buf.v++
      }

      buf.index.set([base, base + 1, base + 2, base, base + 2, base + 3], buf.i)
      buf.i += 6
    }
  }

  const geometries = new Map()
  for (const [material, buf] of buffers) {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(buf.position, 3))
    geometry.setAttribute('normal', new THREE.BufferAttribute(buf.normal, 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(buf.uv, 2))
    geometry.setIndex(new THREE.BufferAttribute(buf.index, 1))
    addBuildingBounds(geometry, buf.buildings, 24)
    geometry.computeBoundingSphere()
    geometries.set(material, geometry)
  }
  return geometries
}
