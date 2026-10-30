import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { MergedBoxes } from '../architecture/MergedBoxes'
import { MaterialsContext } from '../architecture/materialsContext'
import { withViewCorridor } from '../architecture/viewCorridor'
import { buildPocito } from './pocito.js'

function createMaterials() {
  const rough = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.88 })
  const materials = {
    pocitoStone: rough('#c5c0b3'),
    pocitoConcrete: rough('#969b9c'),
    pocitoGlass: new THREE.MeshStandardMaterial({ color: '#324f5c', roughness: 0.2, metalness: 0.38, envMapIntensity: 0.9 }),
    pocitoVoid: new THREE.MeshLambertMaterial({ color: '#32383a' }),
    pocitoCrane: new THREE.MeshLambertMaterial({ color: '#49768f' }),
    pocitoSoil: new THREE.MeshLambertMaterial({ color: '#ac9079' })
  }
  for (const material of Object.values(materials)) withViewCorridor(material, { fade: false })
  return materials
}

function createSign() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 80
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#c5c0b3'
  ctx.fillRect(0, 0, 512, 80)
  ctx.font = '600 58px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#293e48'
  ctx.fillText('POCITO', 256, 43)
  const map = new THREE.CanvasTexture(canvas)
  map.colorSpace = THREE.SRGBColorSpace
  const material = new THREE.MeshStandardMaterial({ map, roughness: 0.9 })
  const geometry = new THREE.PlaneGeometry(24, 3.75)
  return { material, geometry, map }
}

/** Hito del barrio: seis meshes opacos, sin sombras propias ni animación. */
export function Pocito() {
  const list = useMemo(buildPocito, [])
  const materials = useMemo(createMaterials, [])
  const sign = useMemo(createSign, [])
  useEffect(() => () => {
    Object.values(materials).forEach((m) => m.dispose())
    sign.material.dispose()
    sign.geometry.dispose()
    sign.map.dispose()
  }, [materials, sign])
  return (
    <MaterialsContext.Provider value={materials}>
      <group name="pocito-social-life">
        <MergedBoxes list={list} castShadow={false} receiveShadow={false} />
        <mesh geometry={sign.geometry} material={sign.material} position={[154.89, 5.6, 122]} rotation-y={-Math.PI / 2} />
      </group>
    </MaterialsContext.Provider>
  )
}
