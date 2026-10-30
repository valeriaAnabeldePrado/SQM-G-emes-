import { useEffect, useMemo } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { HALF } from '../buildings/vivra-guemes/config'
import { availableCount, getFloor } from './catalog'

const BRAND = '#ffc46a'

/**
 * Resalta un piso (al pasar el mouse por el edificio o por la lista de pisos):
 * un volumen translúcido con contorno y un cartel con las unidades disponibles.
 */
export function FloorHighlight({ id, availability }) {
  const geometries = useMemo(() => {
    const box = new THREE.BoxGeometry(1, 1, 1)
    return { box, edges: new THREE.EdgesGeometry(box) }
  }, [])
  useEffect(
    () => () => {
      geometries.box.dispose()
      geometries.edges.dispose()
    },
    [geometries]
  )
  const floor = getFloor(id)
  if (!floor) return null

  const { base, height, box, label } = floor
  const front = box.zMin + 0.15
  const rear = box.zMax - 0.45
  const available = availableCount(floor.id, availability)

  return (
    <group
      position={[0, base + height / 2, (front + rear) / 2]}
      scale={[2 * HALF + 0.3, height, rear - front]}
    >
      <mesh geometry={geometries.box} renderOrder={5}>
        <meshBasicMaterial color={BRAND} transparent opacity={0.38} depthWrite={false} />
      </mesh>
      <lineSegments geometry={geometries.edges} renderOrder={6}>
        <lineBasicMaterial color={BRAND} />
      </lineSegments>
      <Html position={[0.5, 0.5, -0.5]} zIndexRange={[6, 0]} className="pointer-events-none">
        <span className="edificio-fade-in ml-3 block whitespace-nowrap rounded-full bg-white/90 px-3 py-1.5 text-xs text-darck shadow-md backdrop-blur-md">
          <strong className="font-semibold">{label}</strong>
          {available == null ? '' : ` · ${available} disponible${available === 1 ? '' : 's'}`}
        </span>
      </Html>
    </group>
  )
}
