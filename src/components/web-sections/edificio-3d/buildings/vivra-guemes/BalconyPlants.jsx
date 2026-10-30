import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useMaterials } from '../../architecture/materialsContext'
import { plantLayout, seeded } from './balconyLife'

const CARDS = 9 // tarjetas de hojas por planta

/**
 * Macetas con plantas en parte de los balcones del frente: un edificio
 * habitado nunca tiene todos los balcones vacíos. Las copas asoman por encima
 * del antepecho de hormigón (P1-P13) o se ven a través de la baranda (P14-P15).
 * Dos instancedMesh (macetas y hojas) para todo el edificio.
 */
export function BalconyPlants() {
  const materials = useMaterials()
  const plants = useMemo(plantLayout, [])
  const potRef = useRef(null)
  const leavesRef = useRef(null)
  const resources = useMemo(
    () => ({
      pot: new THREE.CylinderGeometry(0.2, 0.15, 1, 10).translate(0, 0.5, 0),
      card: new THREE.PlaneGeometry(1, 1)
    }),
    []
  )
  useEffect(() => () => Object.values(resources).forEach((r) => r.dispose()), [resources])

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const color = new THREE.Color()
    const rand = seeded(5)
    plants.forEach((p, i) => {
      m.compose(new THREE.Vector3(p.x, p.y, p.z), q.identity(), new THREE.Vector3(1, p.pot, 1))
      potRef.current.setMatrixAt(i, m)
      const center = new THREE.Vector3(p.x, p.y + p.lift, p.z)
      for (let k = 0; k < CARDS; k++) {
        const pos = center
          .clone()
          .add(
            new THREE.Vector3(rand() - 0.5, (rand() - 0.5) * 1.2, rand() - 0.5).multiplyScalar(
              p.crown
            )
          )
        q.setFromEuler(e.set(rand() * Math.PI, rand() * Math.PI * 2, rand() * Math.PI))
        const size = p.crown * (1.3 + rand() * 0.5)
        m.compose(pos, q, new THREE.Vector3(size, size, size))
        leavesRef.current.setMatrixAt(i * CARDS + k, m)
        const shade = 0.55 + rand() * 0.25
        color.setRGB(shade * 0.92, shade, shade * 0.82)
        leavesRef.current.setColorAt(i * CARDS + k, color)
      }
    })
    for (const mesh of [potRef.current, leavesRef.current]) {
      mesh.instanceMatrix.needsUpdate = true
      mesh.computeBoundingSphere()
    }
    leavesRef.current.instanceColor.needsUpdate = true
  }, [plants])

  return (
    <>
      <instancedMesh
        ref={potRef}
        args={[resources.pot, materials.groove, plants.length]}
        receiveShadow
      />
      <instancedMesh
        ref={leavesRef}
        args={[resources.card, materials.leaves, plants.length * CARDS]}
        receiveShadow
      />
    </>
  )
}
