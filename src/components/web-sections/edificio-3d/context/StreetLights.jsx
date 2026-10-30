import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { createBoxList } from '../architecture/boxes'
import { MergedBoxes } from '../architecture/MergedBoxes'
import { useMaterials } from '../architecture/materialsContext'
import { CANAL, CANAL_HALF, canalAxisX, canalZRange, onBridge } from './canal'
import { STREETS, distanceToRoads } from './streets'

const POLE_HEIGHT = 7.5
const ARM = 1.4
const POOL_SIZE = 11

/**
 * Faroles de las veredas. De noche se enciende el cabezal (emisivo + bloom) y
 * se suma una mancha de luz en el piso: nada de luces reales, que en tiempo
 * real son lo más caro.
 */
function lampLayout() {
  const lamps = []
  const range = (from, to, step) => {
    const out = []
    for (let v = from; v <= to; v += step) out.push(v)
    return out
  }
  const nearCanal = (x, z) => CANAL && Math.abs(x - canalAxisX(z)) < CANAL_HALF + 2.5

  // Veredas de Pueyrredón y Peredo: el brazo apunta hacia la calzada
  const pu = STREETS.pueyrredon
  const pe = STREETS.peredo
  const street = (z, dir, xs) => {
    for (const x of xs) {
      if (distanceToRoads(x, z) < 2 || nearCanal(x, z)) continue
      lamps.push({ x, z, dx: 0, dz: dir })
    }
  }
  street(pu.curbSouth + 0.5, -1, range(-156, 180, 24))
  street(pu.curbNorth - 0.5, 1, range(-156, 180, 24))
  street(pe.curbNorth - 0.5, 1, range(-150, 150, 26))

  // Bordes de La Cañada: el brazo vuela hacia la avenida
  if (CANAL) {
    const [start, end] = canalZRange()
    for (const z of range(start + 10, end - 10, 22)) {
      if (onBridge(z, 4)) continue
      for (const side of [-1, 1]) {
        lamps.push({ x: canalAxisX(z) + side * (CANAL_HALF + 1.4), z, dx: side, dz: 0 })
      }
    }
  }
  return lamps
}

function buildLamps(lamps) {
  const b = createBoxList()
  for (const { x, z, dx, dz } of lamps) {
    b.add('lampPole', x - 0.07, x + 0.07, 0, POLE_HEIGHT, z - 0.07, z + 0.07)
    const ex = x + dx * ARM
    const ez = z + dz * ARM
    b.add(
      'lampPole',
      Math.min(x, ex) - 0.04,
      Math.max(x, ex) + 0.04,
      POLE_HEIGHT - 0.08,
      POLE_HEIGHT,
      Math.min(z, ez) - 0.04,
      Math.max(z, ez) + 0.04
    )
    b.add(
      'lampHead',
      ex - 0.3,
      ex + 0.3,
      POLE_HEIGHT - 0.16,
      POLE_HEIGHT - 0.04,
      ez - 0.16,
      ez + 0.16
    )
  }
  return b
}

function LightPools({ lamps, visible }) {
  const materials = useMaterials()
  const ref = useRef(null)
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(POOL_SIZE, POOL_SIZE).rotateX(-Math.PI / 2),
    []
  )
  useEffect(() => () => geometry.dispose(), [geometry])
  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    lamps.forEach(({ x, z, dx, dz }, i) => {
      m.makeTranslation(x + dx * (ARM + 0.6), 0.04, z + dz * (ARM + 0.6))
      ref.current.setMatrixAt(i, m)
    })
    ref.current.instanceMatrix.needsUpdate = true
    ref.current.computeBoundingSphere()
  }, [lamps])
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, materials.lightPool, lamps.length]}
      visible={visible}
      renderOrder={2}
    />
  )
}

export function StreetLights({ night }) {
  const lamps = useMemo(lampLayout, [])
  const list = useMemo(() => buildLamps(lamps), [lamps])
  return (
    <group name="faroles">
      <MergedBoxes list={list} />
      <LightPools lamps={lamps} visible={night > 0.05} />
    </group>
  )
}
