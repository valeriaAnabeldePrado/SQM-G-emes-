import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { createBoxList } from '../../architecture/boxes'
import { MergedBoxes } from '../../architecture/MergedBoxes'
import { Panes } from '../../architecture/Panes'
import { useMaterials } from '../../architecture/materialsContext'
import { AMENITIES_HEIGHT, AMENITIES_LEVEL, FLOORS, TANK, TOWER, levelBase } from './config'
import { buildOffices, buildPatio } from './offices'
import { buildTower } from './tower'

function buildBuilding() {
  const b = createBoxList()
  buildTower(b)
  buildOffices(b)
  buildPatio(b)
  return b
}

/**
 * Tanque de agua cilíndrico sobre la azotea (render del contrafrente). Es la
 * única pieza curva del edificio; su escalera de jaula está en tower.js.
 */
function RoofTank() {
  const materials = useMaterials()
  const base = levelBase(AMENITIES_LEVEL) + AMENITIES_HEIGHT + 0.3
  const { z0, z1 } = TOWER.core
  const z = (z0 + z1) / 2
  const geometry = useMemo(
    () => new THREE.CylinderGeometry(TANK.radius, TANK.radius, TANK.height, 32),
    []
  )
  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <mesh
      geometry={geometry}
      material={materials.concrete}
      position={[TANK.x, base + TANK.height / 2, z]}
      castShadow
      receiveShadow
    />
  )
}

/**
 * VIVRA Güemes. La geometría se fusiona por material (≈25 draw calls); los
 * pisos quedan descritos en `FLOORS` para sumar después volúmenes de selección
 * o resaltado sin tocar la geometría.
 */
export default function Building() {
  const list = useMemo(buildBuilding, [])
  return (
    <group name="vivra-guemes" userData={{ floors: FLOORS }}>
      <MergedBoxes list={list} />
      <Panes panes={list.panes} />
      <RoofTank />
    </group>
  )
}
