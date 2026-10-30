import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { createBoxList } from '../architecture/boxes'
import { MergedBoxes } from '../architecture/MergedBoxes'
import { useMaterials } from '../architecture/materialsContext'
import { LOT } from '../buildings/vivra-guemes/config'
import { CANAL, CANAL_HALF, CANAL_WALL, canalAxisX, canalZRange, onBridge } from './canal'
import { STREETS, distanceToRoads } from './streets'

function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Árboles: los de cada vereda junto al lote siguen los renders (a los costados
// del frente, no delante); el resto acompaña el arbolado de la avenida que se ve
// en la imagen satelital.
function treeLayout() {
  const rand = seeded(42)
  const trees = []
  const street = (z, xs, h, r) => {
    for (const x of xs) {
      if (distanceToRoads(x, z) < 3) continue
      const k = 0.85 + rand() * 0.3
      trees.push({ x, z, h: h * k, r: r * k, rot: rand() * Math.PI })
    }
  }
  const range = (start, step, count) => Array.from({ length: count }, (_, i) => start + step * i)

  const pu = STREETS.pueyrredon
  const pe = STREETS.peredo
  street(pu.curbSouth + 0.9, [9.2, -9.6], 11, 3.4)
  street(pu.curbSouth + 0.9, [...range(18.7, 9.5, 14), ...range(-19.1, -9.5, 14)], 10, 3)
  street(pu.curbNorth - 1.0, range(-128, 9.5, 28), 9, 2.9)
  street(pe.curbNorth - 0.9, [-9, 9.5], 8, 2.6)
  street(pe.curbNorth - 0.9, [...range(19.5, 10, 10), ...range(-19, -10, 10)], 7.5, 2.4)
  street(pe.curbSouth + 0.9, range(-95, 10, 20), 7, 2.3)

  // Tipas de La Cañada: copas anchas que se cierran sobre el canal
  if (CANAL) {
    const [start, end] = canalZRange()
    for (let z = start + 4; z < end - 4; z += 11) {
      if (onBridge(z, 3)) continue
      for (const side of [-1, 1]) {
        const k = 0.85 + rand() * 0.3
        const x = canalAxisX(z) + side * (CANAL_HALF + CANAL_WALL + 1.1)
        trees.push({
          x,
          z: z + (rand() - 0.5) * 2,
          h: 14 * k,
          r: 5.4 * k,
          rot: rand() * Math.PI,
          tipa: true
        })
      }
    }
  }

  // Patio de oficinas (planta baja: árboles en el perímetro)
  for (const z of [27, 30.5]) {
    for (const x of [-4.1, 4.1]) {
      trees.push({ x, z, h: 5 + rand(), r: 1.6, rot: rand() * Math.PI })
    }
  }
  return trees
}

const CARDS_PER_TREE = 55
const MAX_CARDS = 85
const MAX_CARD = 3.2 // m: tarjetas más grandes se notan como "hojas gigantes" de cerca

// Copas grandes (las tipas) llevan más tarjetas, del mismo tamaño máximo
const cardsFor = (t) => Math.min(MAX_CARDS, Math.round(CARDS_PER_TREE * Math.pow(t.r / 3, 1.5)))

/**
 * Árboles con follaje de tarjetas: cada copa son de 55 a 85 planos con un ramillete de
 * hojas con alfa, orientados al azar dentro de un elipsoide. Liviano (dos
 * triángulos por tarjeta) y con sombras recortadas por las hojas.
 */
function Trees() {
  const materials = useMaterials()
  const trees = useMemo(treeLayout, [])
  const totalCards = useMemo(() => trees.reduce((sum, t) => sum + cardsFor(t), 0), [trees])
  const trunkRef = useRef(null)
  const leavesRef = useRef(null)
  const resources = useMemo(() => {
    const trunk = new THREE.CylinderGeometry(0.1, 0.22, 1, 7).translate(0, 0.5, 0)
    const card = new THREE.PlaneGeometry(1, 1)
    const depth = new THREE.MeshDepthMaterial({
      depthPacking: THREE.RGBADepthPacking,
      map: materials.leaves.map,
      alphaTest: materials.leaves.alphaTest
    })
    return { trunk, card, depth }
  }, [materials])
  useEffect(
    () => () => Object.values(resources).forEach((resource) => resource.dispose()),
    [resources]
  )

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const color = new THREE.Color()
    const rand = seeded(7)
    let index = 0
    trees.forEach((t, i) => {
      const crownY = t.h - t.r * 0.82
      m.compose(new THREE.Vector3(t.x, 0, t.z), q.identity(), new THREE.Vector3(1, crownY, 1))
      trunkRef.current.setMatrixAt(i, m)

      const cards = cardsFor(t)
      for (let k = 0; k < cards; k++) {
        // Punto dentro de un elipsoide, más denso hacia la superficie de la copa
        const u = rand() * Math.PI * 2
        const v = Math.acos(2 * rand() - 1)
        const radius = Math.pow(rand(), 0.35)
        const pos = new THREE.Vector3(
          t.x + Math.sin(v) * Math.cos(u) * t.r * radius,
          crownY + Math.cos(v) * t.r * 0.78 * radius,
          t.z + Math.sin(v) * Math.sin(u) * t.r * radius
        )
        q.setFromEuler(e.set(rand() * Math.PI, rand() * Math.PI * 2, rand() * Math.PI))
        const size = Math.min(MAX_CARD, t.r) * (0.95 + rand() * 0.55)
        m.compose(pos, q, new THREE.Vector3(size, size, size))
        leavesRef.current.setMatrixAt(index, m)
        const shade = 0.5 + rand() * 0.3 + (pos.y - crownY) / (t.r * 5)
        // Las tipas tienen un follaje más claro y amarillento
        if (t.tipa) color.setRGB(shade * 1.15, shade * 1.18, shade * 0.72)
        else color.setRGB(shade * 0.95, shade, shade * 0.85)
        leavesRef.current.setColorAt(index, color)
        index++
      }
    })
    for (const mesh of [trunkRef.current, leavesRef.current]) {
      mesh.instanceMatrix.needsUpdate = true
      mesh.computeBoundingSphere()
    }
    leavesRef.current.instanceColor.needsUpdate = true
  }, [trees])

  return (
    <>
      <instancedMesh
        ref={trunkRef}
        args={[resources.trunk, materials.trunk, trees.length]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={leavesRef}
        args={[resources.card, materials.leaves, totalCards]}
        customDepthMaterial={resources.depth}
        castShadow
        receiveShadow
      />
    </>
  )
}

// Autos estacionados para dar escala (el render de fachada muestra un sedán
// blanco y una SUV negra frente al edificio).
function buildCars() {
  const b = createBoxList()
  const pu = STREETS.pueyrredon
  const pe = STREETS.peredo
  const cars = [
    { x: 8.5, z: pu.curbSouth - 1.0, paint: 'carPaintLight' },
    { x: -8, z: pu.curbSouth - 1.0, paint: 'carPaintDark', tall: true },
    { x: -26, z: pu.curbSouth - 1.0, paint: 'carPaintGrey' },
    { x: 34, z: pu.curbNorth + 1.0, paint: 'carPaintLight' },
    { x: -14, z: pu.curbNorth + 1.0, paint: 'carPaintGrey', tall: true },
    { x: 18, z: (pu.curbNorth + pu.curbSouth) / 2 + 2.2, paint: 'carPaintDark' },
    { x: -7, z: pe.curbNorth + 1.0, paint: 'carPaintGrey' },
    { x: 10, z: pe.curbNorth + 1.0, paint: 'carPaintLight', tall: true }
  ]
  for (const { x, z, paint, tall } of cars) {
    const len = tall ? 4.6 : 4.5
    const body = tall ? 1.15 : 0.95
    b.add(paint, x - len / 2, x + len / 2, -0.15 + 0.3, -0.15 + body, z - 0.9, z + 0.9)
    b.add('carGlass', x - 1.2, x + 1.1, -0.15 + body, -0.15 + body + 0.5, z - 0.78, z + 0.78)
    b.add(paint, x - 1.15, x + 1.05, -0.15 + body + 0.5, -0.15 + body + 0.56, z - 0.8, z + 0.8)
    for (const dx of [-1.45, 1.4]) {
      for (const dz of [-0.82, 0.82]) {
        b.add(
          'tire',
          x + dx - 0.33,
          x + dx + 0.33,
          -0.15,
          -0.15 + 0.66,
          z + dz - 0.12,
          z + dz + 0.12
        )
      }
    }
  }
  return b
}

// Platea del lote a nivel de vereda: el edificio y los patios apoyan en y = 0
function buildLotBase() {
  const b = createBoxList()
  b.add('sidewalk', -LOT.width / 2, LOT.width / 2, -0.15, 0, 0, LOT.depth)
  return b
}

export function StreetProps() {
  const cars = useMemo(buildCars, [])
  const lotBase = useMemo(buildLotBase, [])
  return (
    <>
      <Trees />
      <MergedBoxes list={cars} />
      <MergedBoxes list={lotBase} castShadow={false} />
    </>
  )
}
