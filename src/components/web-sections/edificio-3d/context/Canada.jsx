import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { createBoxList } from '../architecture/boxes'
import { MergedBoxes } from '../architecture/MergedBoxes'
import { useMaterials } from '../architecture/materialsContext'
import {
  CANAL,
  CANAL_DEPTH,
  CANAL_HALF,
  CANAL_PARAPET,
  CANAL_WALL,
  axisPoints,
  canalAxisX,
  canalZRange,
  openStretches
} from './canal'
import { SIDEWALK_HEIGHT } from './streets'

const GROUND = -SIDEWALK_HEIGHT

/** Caja a lo largo de un tramo del eje, desplazada `offset` hacia los costados. */
function alongAxis(b, material, [ax, az], [bx, bz], offset, width, y0, y1, extend = 0) {
  const theta = Math.atan2(bx - ax, bz - az)
  const half = (Math.hypot(bx - ax, bz - az) + extend) / 2
  const cx = (ax + bx) / 2 + Math.cos(theta) * offset
  const cz = (az + bz) / 2 - Math.sin(theta) * offset
  b.add(material, cx - width / 2, cx + width / 2, y0, y1, cz - half, cz + half, theta)
}

function buildCanal() {
  const b = createBoxList()
  const [start, end] = canalZRange()
  const wallOffset = CANAL_HALF + CANAL_WALL / 2
  const pts = axisPoints(start, end)

  for (let i = 0; i < pts.length - 1; i++) {
    for (const side of [-1, 1]) {
      alongAxis(
        b,
        'stone',
        pts[i],
        pts[i + 1],
        side * wallOffset,
        CANAL_WALL,
        -CANAL_DEPTH,
        GROUND,
        0.6
      )
    }
    alongAxis(
      b,
      'canalFloor',
      pts[i],
      pts[i + 1],
      0,
      CANAL.width,
      -CANAL_DEPTH - 0.2,
      -CANAL_DEPTH,
      0.6
    )
    alongAxis(b, 'canalWater', pts[i], pts[i + 1], 0, 3.2, -CANAL_DEPTH, -CANAL_DEPTH + 0.03, 0.6)
  }

  // Pretiles de piedra sobre la vereda, cortados donde cruzan los puentes
  for (const [z0, z1] of openStretches()) {
    const p = axisPoints(z0, z1)
    for (let i = 0; i < p.length - 1; i++) {
      for (const side of [-1, 1]) {
        alongAxis(b, 'stone', p[i], p[i + 1], side * wallOffset, CANAL_WALL, GROUND, CANAL_PARAPET)
      }
    }
  }

  // Puentes: tablero bajo la vereda (el suelo no se recorta ahí) y barandas de piedra
  const w = CANAL_HALF + CANAL_WALL
  for (const [z0, z1] of CANAL.bridges) {
    const cx = canalAxisX((z0 + z1) / 2)
    b.add('stone', cx - w, cx + w, -0.85, GROUND - 0.01, z0, z1)
    for (const z of [z0 + 0.25, z1 - 0.25]) {
      b.add('stone', cx - w, cx + w, GROUND, CANAL_PARAPET, z - 0.25, z + 0.25)
    }
  }

  // Cierre en los extremos del tramo modelado
  for (const z of [start, end]) {
    const cx = canalAxisX(z)
    b.add('stone', cx - CANAL_HALF, cx + CANAL_HALF, -CANAL_DEPTH, GROUND, z - 0.3, z + 0.3)
  }
  return b
}

/** Frentes de los puentes con su arco rebajado, sobre el agua. */
function buildArches() {
  const half = CANAL_HALF
  const spring = -CANAL_DEPTH + 1.0
  const top = GROUND - 0.01
  const shape = new THREE.Shape()
  shape.moveTo(-half, spring)
  shape.lineTo(-half, top)
  shape.lineTo(half, top)
  shape.lineTo(half, spring)
  shape.absellipse(0, spring, half, 1.6, 0, Math.PI, false)
  const face = new THREE.ExtrudeGeometry(shape, {
    depth: 0.4,
    bevelEnabled: false,
    curveSegments: 16
  })

  const parts = CANAL.bridges.flatMap(([z0, z1]) => {
    const cx = canalAxisX((z0 + z1) / 2)
    return [z0, z1 - 0.4].map((z) => face.clone().translate(cx, 0, z))
  })
  const merged = mergeGeometries(parts)
  face.dispose()
  parts.forEach((part) => part.dispose())
  return merged
}

/**
 * La Cañada: el arroyo encajonado entre muros de piedra que corre entre las
 * dos manos de Marcelo T. de Alvear, a media cuadra del edificio. Las tipas que
 * la acompañan están en StreetProps.
 */
export function Canada() {
  const materials = useMaterials()
  const list = useMemo(buildCanal, [])
  const arches = useMemo(buildArches, [])
  useEffect(() => () => arches.dispose(), [arches])

  return (
    <group name="la-canada">
      <MergedBoxes list={list} />
      <mesh geometry={arches} material={materials.stone} castShadow receiveShadow />
    </group>
  )
}
