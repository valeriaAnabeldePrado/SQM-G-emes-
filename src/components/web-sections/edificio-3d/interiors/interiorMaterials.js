import * as THREE from 'three'
import { tileTexture } from '../architecture/textures'
import { withBuildWave } from './buildWave'
import { createFurnitureMaterials } from './furniture'

/**
 * Materiales del interior de un piso. Los usan el interior y la precarga
 * (Prewarm): al salir de la misma función compilan exactamente los mismos
 * programas, así abrir un piso no compila nada.
 *   wave:     uniforms de la onda de construcción (muros y muebles crecen)
 */
// Un único cerámico blanco compartido: el rayado del plano no define materiales.
let floorTexture = null
const sharedFloorTexture = () => (floorTexture ??= tileTexture('#f4f4f1'))

export function createInteriorMaterials(wave) {
  const built = {
    wall: new THREE.MeshStandardMaterial({ color: '#f3f0ea', roughness: 0.9 }),
    cap: new THREE.MeshBasicMaterial({ color: '#3b3734' }),
    frame: new THREE.MeshStandardMaterial({ color: '#c3c6c8', roughness: 0.35, metalness: 0.8 }),
    glass: new THREE.MeshStandardMaterial({
      color: '#bcd6e2',
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.4,
      depthWrite: false
    }),
    concrete: new THREE.MeshStandardMaterial({ color: '#d9d5cd', roughness: 0.85 }),
    railing: new THREE.MeshStandardMaterial({ color: '#1f2123', roughness: 0.45, metalness: 0.6 }),
    railingLight: new THREE.MeshStandardMaterial({ color: '#ecebe7', roughness: 0.45 }),
    ...createFurnitureMaterials()
  }
  for (const material of Object.values(built)) withBuildWave(material, wave)
  return {
    ...built,
    // El solado aparece con un fundido (no crece)
    tile: Object.assign(
      new THREE.MeshStandardMaterial({
        map: sharedFloorTexture(),
        roughness: 0.45,
        transparent: true
      }),
      { userData: { sharedMap: true } }
    )
  }
}

/** Materiales de las unidades y del resaltado de pisos (para precompilar). */
export function createOverlayMaterials() {
  return [
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      side: THREE.DoubleSide
    }),
    new THREE.LineBasicMaterial({ transparent: true }),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.38, depthWrite: false }),
    new THREE.LineBasicMaterial()
  ]
}
