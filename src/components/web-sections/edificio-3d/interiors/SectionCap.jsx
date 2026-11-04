import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMaterials } from '../architecture/materialsContext'
import {
  AMENITIES_LEVEL,
  HALF,
  LOT,
  OFFICES,
  TOWER,
  levelBase
} from '../buildings/vivra-guemes/config'

const OFFICE_FRONT = LOT.depth - OFFICES.depth
const OFFICE_TOP = OFFICES.groundHeight + OFFICES.floors * OFFICES.floorHeight
// El corte queda 3 cm sobre el piso abierto: la tapa va 3 cm por debajo de su
// solado (no se pisan) y hace de losa
const BELOW_CUT = 0.06

/**
 * Tapa de corte: el edificio es una cáscara (fachadas y balcones, sin losas
 * por dentro), así que al barrer el corte entre pisos se veía hueco. Una sola
 * pieza plana con la planta del volumen cortado sigue al corte en cada cuadro
 * y lo cierra como el corte de una maqueta. No se recorta ni proyecta sombra.
 */
export function SectionCap() {
  const materials = useMaterials()
  // Los planos de corte son los mismos para todos los materiales del edificio
  const planes = materials.concrete.clippingPlanes
  const ref = useRef(null)
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), [])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: '#9b968f', roughness: 0.95, envMapIntensity: 0.4 }),
    []
  )
  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material]
  )

  useFrame(() => {
    const mesh = ref.current
    const y = planes[0].constant
    // planes[3] cierra la caja del volumen abierto hacia el fondo del lote
    const offices = -planes[3].constant > LOT.depth - 5
    const top = offices ? OFFICE_TOP : levelBase(AMENITIES_LEVEL)
    // Sin piso abierto el corte está muy arriba; en PB no hace falta tapa
    mesh.visible = y >= 1 && y <= top + 0.1
    if (!mesh.visible) return
    const z0 = offices ? OFFICE_FRONT : 0
    // Contrafrente: P1-P5 más profundos, desde P6 retrocede (ver tower.js)
    const z1 = offices ? LOT.depth : y < levelBase(6) ? TOWER.rearLow : TOWER.rearHigh
    mesh.position.set(0, y - BELOW_CUT, (z0 + z1) / 2)
    mesh.scale.set(2 * HALF, 1, z1 - z0)
  })

  return <mesh ref={ref} geometry={geometry} material={material} visible={false} receiveShadow />
}
