import { useEffect } from 'react'
import { useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { createBuildWave } from './buildWave'
import { createInteriorMaterials, createOverlayMaterials } from './interiorMaterials'
import { prewarmPlans } from './planCache'

/**
 * Deja todo listo para abrir pisos sin trabones: lee las plantas en segundo
 * plano y compila una vez los shaders del interior (muros con la onda de
 * construcción, vidrio y solados). Los programas quedan en caché de three.js
 * mientras estos materiales vivan, así que no se liberan.
 */
export function Prewarm() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)

  useEffect(() => prewarmPlans((url) => useTexture.preload(url)), [])

  useEffect(() => {
    const wave = createBuildWave()
    const materials = [
      ...Object.values(createInteriorMaterials(wave)),
      ...createOverlayMaterials()
    ]
    const geometry = new THREE.PlaneGeometry(0.01, 0.01)
    const group = new THREE.Group()
    for (const material of materials) group.add(new THREE.Mesh(geometry, material))
    group.position.set(0, -500, 0)
    scene.add(group)
    let done = false
    const id = setTimeout(async () => {
      try {
        // La escena se dibuja en el buffer del post-procesado (salida lineal,
        // sin tone mapping): se compila contra un buffer igual para obtener
        // los mismos programas
        const target = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType })
        const previous = gl.getRenderTarget()
        gl.setRenderTarget(target)
        const compiling = gl.compileAsync(group, camera, scene)
        gl.setRenderTarget(previous)
        await compiling
        target.dispose()
      } catch (error) {
        // Si el navegador no compila en segundo plano, se compila al abrir el piso
        if (import.meta.env.DEV) window.__prewarmError = String(error)
      } finally {
        done = true
        scene.remove(group)
      }
    }, 2500)
    return () => {
      clearTimeout(id)
      if (!done) scene.remove(group)
      // Los materiales se mantienen vivos a propósito (programas en caché)
    }
  }, [gl, scene, camera])

  return null
}
