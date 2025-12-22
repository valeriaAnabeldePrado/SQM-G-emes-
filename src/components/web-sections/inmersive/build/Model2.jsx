import { useEffect, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { departamentosData, amenitiesData } from './constant'
import { detectarPiso } from './utils'

// Componente del modelo GLB con hover por departamento individual
export function Model({ onDepartmentClick }) {
  const { scene } = useGLTF('/3d-edif.glb')

  // Guardar colores originales, clonar materiales y asignar eventos a cada mesh
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Clonar el material para que cada mesh tenga el suyo propio
        child.material = Array.isArray(child.material)
          ? child.material.map((m) => m.clone())
          : child.material.clone()

        // Guardar color original del material clonado
        child.userData.originalColor = child.material.color.clone()
        child.userData.originalEmissive = child.material.emissive
          ? child.material.emissive.clone()
          : new THREE.Color(0x000000)
        child.userData.originalEmissiveIntensity = child.material.emissiveIntensity || 0

        // Habilitar sombras en cada mesh
        child.castShadow = true
        child.receiveShadow = true

        // Hacer cada mesh interactivo
        const pisoKey = detectarPiso(child.name)
        if (pisoKey) {
          child.userData.pisoKey = pisoKey
          child.userData.clickable = true

          // Intenta encontrar la unidad específica dentro de ese piso
          const unitsInFloor =
            departamentosData[pisoKey]?.unidades || amenitiesData[pisoKey]?.unidades || []
          const matchedUnit = unitsInFloor.find((unit) => child.name.includes(unit.meshNamePattern))

          if (matchedUnit) {
            child.userData.unitData = matchedUnit
            child.userData.meshName = child.name
          } else {
            // Si es un piso general o un amenity sin un patrón específico
            child.userData.unitData = {
              nombre: `${pisoKey} (General)`,
              tipologia: 'Información general del piso',
              ambientes: 'Ver detalles',
              superficiePropia: 'N/A',
              superficieTotal: 'N/A',
              descripcion: `Haz click para ver la información general del ${pisoKey}.`
            }
            child.userData.meshName = child.name
          }
        }
      }
    })
  }, [scene])

  const handlePointerOver = useCallback((event) => {
    event.stopPropagation()
    const mesh = event.object

    if (mesh.userData.clickable && mesh.isMesh && mesh.material) {
      mesh.material.color.set('#ffc46a')
      if (mesh.material.emissive) {
        mesh.material.emissive.set('#ffc46a')
        mesh.material.emissiveIntensity = 0.3
      }
      document.body.style.cursor = 'pointer'
    }
  }, [])

  const handlePointerOut = useCallback((event) => {
    event.stopPropagation()
    const mesh = event.object

    if (mesh.isMesh && mesh.material && mesh.userData.originalColor) {
      mesh.material.color.copy(mesh.userData.originalColor)
      if (mesh.material.emissive && mesh.userData.originalEmissive) {
        mesh.material.emissive.copy(mesh.userData.originalEmissive)
        mesh.material.emissiveIntensity = mesh.userData.originalEmissiveIntensity
      }
    }
    document.body.style.cursor = 'auto'
  }, [])

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation()
      const mesh = event.object

      if (mesh.userData.clickable && mesh.userData.pisoKey && mesh.userData.unitData) {
        onDepartmentClick({
          ...mesh.userData.unitData,
          piso: mesh.userData.pisoKey,
          meshName: mesh.name
        })
      }
    },
    [onDepartmentClick]
  )

  return (
    <primitive
      object={scene}
      castShadow
      receiveShadow
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  )
}

// Preload del modelo para mejor performance
export const preloadModel = () => useGLTF.preload('/3d-edif.glb')
