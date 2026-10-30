import { useLayoutEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { LOT } from '../buildings/vivra-guemes/config'
import { LIGHT_TARGET } from './timeOfDay'

const SHADOW_EXTENT = 75

// Bañadores de fachada: embutidos en la vereda, apuntan hacia arriba rozando
// los balcones. Siempre montados (prender/apagar luces recompila shaders):
// de día quedan en 0
const UPLIGHTS = [
  { position: [-2.5, 0.2, -2.2], target: [-2.5, 40, 1.4] },
  { position: [2.5, 0.2, -2.2], target: [2.5, 40, 1.4] },
  { position: [0, 0.2, LOT.depth + 2.2], target: [0, 14, LOT.depth - 0.6], angle: 0.5 }
]

// decay bajo: la luz llega atenuada hasta la corona en vez de morir en el piso 4
function Uplight({ position, target, angle = 0.18, decay = 0.75, intensity }) {
  const light = useRef(null)
  const object = useMemo(() => {
    const o = new THREE.Object3D()
    o.position.set(...target)
    return o
  }, [target])
  useLayoutEffect(() => {
    light.current.target = object
  }, [object])
  return (
    <>
      <primitive object={object} />
      <spotLight
        ref={light}
        position={position}
        angle={angle}
        penumbra={0.8}
        distance={80}
        decay={decay}
        color="#ffc98a"
        intensity={intensity}
      />
    </>
  )
}

/** Sol (o luna) con sombras horneadas + luz de cielo, según el momento del día. */
export function Lighting({ preset, shadowMapSize = 2048 }) {
  const sun = useRef(null)
  const gl = useThree((s) => s.gl)
  const invalidate = useThree((s) => s.invalidate)
  const target = useMemo(() => {
    const object = new THREE.Object3D()
    object.position.copy(LIGHT_TARGET)
    return object
  }, [])
  const position = useMemo(
    () => preset.light.direction.clone().multiplyScalar(180).add(LIGHT_TARGET).toArray(),
    [preset]
  )

  useLayoutEffect(() => {
    sun.current.target = target
  }, [target])

  // Las sombras están horneadas (BakeShadows): al mover el sol hay que recalcularlas
  useLayoutEffect(() => {
    gl.shadowMap.needsUpdate = true
    invalidate()
  }, [gl, invalidate, position])

  return (
    <>
      <primitive object={target} />
      <directionalLight
        ref={sun}
        position={position}
        intensity={preset.light.intensity}
        color={preset.light.color}
        castShadow
        shadow-mapSize={[shadowMapSize, shadowMapSize]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.04}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-SHADOW_EXTENT, SHADOW_EXTENT, SHADOW_EXTENT, -SHADOW_EXTENT, 1, 420]}
        />
      </directionalLight>
      <hemisphereLight args={preset.hemisphere} />
      {UPLIGHTS.map((u, i) => (
        <Uplight key={i} {...u} intensity={preset.night * 90} />
      ))}
    </>
  )
}
