import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { buildBoxGeometries } from '../architecture/boxes'
import { useMaterials } from '../architecture/materialsContext'
import { PLANTER, PLAZA_BEAMS, buildPlazaBoxes, plazaGround } from './plaza.js'
import { SIDEWALK_HEIGHT } from './streets'

const GROUND = -SIDEWALK_HEIGHT

// Pisos: no proyectan sombra (solo la reciben)
const FLAT = new Set(['plazaPaving', 'plazaTile', 'curb', 'soil', 'sand', 'canalWater'])

/**
 * Polígono (x, z) extruido entre y0 e y1; las UV de las tapas quedan en metros.
 * Devuelve [tapas, laterales] para asignarles materiales distintos.
 */
function slab(points, y0, y1, holes = []) {
  const toShape = (pts) => pts.map(([x, z]) => new THREE.Vector2(x, -z))
  const shape = new THREE.Shape(toShape(points))
  for (const hole of holes) shape.holes.push(new THREE.Path(toShape(hole)))
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false })
  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, y0, 0)
  const parts = geometry.groups.map(({ start, count }) => {
    const part = new THREE.BufferGeometry()
    for (const name of ['position', 'normal', 'uv']) {
      const attr = geometry.getAttribute(name)
      const size = attr.itemSize
      part.setAttribute(
        name,
        new THREE.BufferAttribute(attr.array.slice(start * size, (start + count) * size), size)
      )
    }
    return part
  })
  geometry.dispose()
  return parts
}

/** Caja de sección w x h entre dos puntos, con el ancho siempre horizontal. */
function beam({ from, to, w, h }) {
  const a = new THREE.Vector3(...from)
  const b = new THREE.Vector3(...to)
  const dir = b.clone().sub(a)
  const length = dir.length()
  dir.normalize()
  const up = Math.abs(dir.y) > 0.99 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)
  const x = new THREE.Vector3().crossVectors(up, dir).normalize()
  const y = new THREE.Vector3().crossVectors(dir, x)
  const matrix = new THREE.Matrix4().makeBasis(x, y, dir).setPosition(a.add(b).multiplyScalar(0.5))
  return new THREE.BoxGeometry(w, h, length).applyMatrix4(matrix)
}

/**
 * Toda la plaza fusionada en un mesh por material: cajas (plaza.js), solados
 * y canteros curvos extruidos, y las piezas inclinadas de los juegos.
 */
function buildPlaza() {
  const byMaterial = new Map()
  const add = (material, geometry) => {
    if (!byMaterial.has(material)) byMaterial.set(material, [])
    byMaterial.get(material).push(geometry)
  }
  for (const [material, geometry] of buildBoxGeometries(buildPlazaBoxes())) add(material, geometry)

  const ground = plazaGround()
  const { bed } = ground
  const [paving, pavingEdge] = slab(ground.paving, GROUND, 0)
  add('plazaPaving', paving)
  add('curb', pavingEdge)
  const [tile, tileEdge] = slab(ground.sidewalk, GROUND, 0)
  add('plazaTile', tile)
  add('curb', tileEdge)
  const [band, bandEdge] = slab(ground.band, GROUND, 0.07)
  add('grass', band)
  add('soil', bandEdge)
  slab(bed.outer, GROUND, 0.12, [bed.soil]).forEach((g) => add('stone', g))
  slab(bed.soil, GROUND, 0.05).forEach((g) => add('soil', g))
  slab(bed.grass, GROUND, 0.08).forEach((g) => add('grass', g))

  // Lomada de pasto del cantero ovalado
  const { mound } = bed
  add(
    'grass',
    new THREE.SphereGeometry(1, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2)
      .scale(mound.rx, mound.ry, mound.rz)
      .translate(mound.x, 0.06, mound.z)
  )

  // Cantero redondo de ladrillo: UV del lateral en metros para la textura
  const { x, z, r, h } = PLANTER
  const ring = new THREE.CylinderGeometry(r, r, h, 36).translate(x, h / 2, z)
  const uv = ring.getAttribute('uv')
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 2 * Math.PI * r, uv.getY(i) * h)
  add('brick', ring)
  add(
    'soil',
    new THREE.CircleGeometry(r - 0.15, 36).rotateX(-Math.PI / 2).translate(x, h + 0.005, z)
  )
  add(
    'hedge',
    new THREE.SphereGeometry(1, 16, 8).scale(r - 0.4, 0.5, r - 0.4).translate(x, h + 0.1, z)
  )

  // Tobogán, caballetes de las hamacas y subibaja
  for (const piece of PLAZA_BEAMS) add(piece.material, beam(piece))

  return [...byMaterial].map(([material, list]) => {
    const flat = list.map((g) => (g.index ? g.toNonIndexed() : g))
    const geometry = mergeGeometries(flat)
    geometry.computeBoundingSphere()
    new Set([...list, ...flat]).forEach((g) => g.dispose())
    return { material, geometry }
  })
}

/** Plazoleta Aníbal Montes, en la esquina de Pueyrredón y Belgrano (ver plaza.js). */
export function Plaza() {
  const materials = useMaterials()
  const meshes = useMemo(buildPlaza, [])
  useEffect(() => () => meshes.forEach(({ geometry }) => geometry.dispose()), [meshes])
  return (
    <group name="plazoleta-anibal-montes">
      {meshes.map(({ material, geometry }) => (
        <mesh
          key={material}
          geometry={geometry}
          material={materials[material]}
          castShadow={!FLAT.has(material)}
          receiveShadow
        />
      ))}
    </group>
  )
}
