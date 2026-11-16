import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { SATELLITE } from './satellite.js'

const INNER = 800 // m: el barrio modelado (suelo de UrbanContext)
const Y = 0.05 // apenas sobre las veredas: los edificios que crecen la atraviesan
const NIGHT_TINT = new THREE.Color('#6a7590') // de noche se oscurece sin perder la ciudad

/** UV sobre la foto completa a partir de la posición en el mundo (ver satellite.js). */
function withPhotoUv(geometry) {
  const pos = geometry.getAttribute('position')
  const half = SATELLITE.size / 2
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) + half) / SATELLITE.size
    uv[i * 2 + 1] = 1 - (pos.getZ(i) + half) / SATELLITE.size
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  return geometry
}

const square = (half) =>
  new THREE.Shape([
    new THREE.Vector2(-half, -half),
    new THREE.Vector2(half, -half),
    new THREE.Vector2(half, half),
    new THREE.Vector2(-half, half)
  ])

/**
 * Foto satelital del piso para la entrada tipo drone. El anillo de afuera del
 * barrio modelado queda siempre; el cuadrado del barrio se desvanece al bajar
 * (`setMix`). Sin luces: la foto ya trae las suyas; de noche se oscurece.
 */
export const Satellite = forwardRef(function Satellite({ night = 0 }, ref) {
  const map = useTexture(SATELLITE.url)
  const parts = useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 8
    const outerShape = square(SATELLITE.size / 2)
    outerShape.holes.push(square(INNER))
    const make = (shape, transparent) => {
      const geometry = new THREE.ShapeGeometry(shape)
      geometry.rotateX(-Math.PI / 2)
      geometry.translate(0, Y, 0)
      const material = new THREE.MeshBasicMaterial({ map, transparent, depthWrite: !transparent })
      return { geometry: withPhotoUv(geometry), material }
    }
    return { outer: make(outerShape, false), inner: make(square(INNER), true) }
  }, [map])

  useEffect(() => {
    const color = new THREE.Color('#ffffff').lerp(NIGHT_TINT, night)
    parts.outer.material.color.copy(color)
    parts.inner.material.color.copy(color)
  }, [parts, night])

  useEffect(
    () => () => {
      for (const { geometry, material } of [parts.outer, parts.inner]) {
        geometry.dispose()
        material.dispose()
      }
      // Solo se usa en el vuelo: se libera de la GPU y del caché de drei
      map.dispose()
      useTexture.clear(SATELLITE.url)
    },
    [parts, map]
  )

  useImperativeHandle(
    ref,
    () => ({
      setMix(value) {
        parts.inner.material.opacity = value
        parts.inner.material.visible = value > 0.001
      }
    }),
    [parts]
  )

  return (
    <group name="foto-satelital">
      <mesh geometry={parts.outer.geometry} material={parts.outer.material} />
      <mesh geometry={parts.inner.geometry} material={parts.inner.material} renderOrder={1} />
    </group>
  )
})
