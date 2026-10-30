import { useLayoutEffect, useMemo, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { LIGHT_TARGET } from './timeOfDay'

const SHADOW_EXTENT = 75

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
    </>
  )
}
