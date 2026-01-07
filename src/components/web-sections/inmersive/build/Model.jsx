import { useEffect, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { edificioVivra } from './constant'
import { detectarPiso } from './utils'
import { getFloorPlanImage } from './planMapping'

// Componente del modelo GLB con hover por departamento individual
export function Model({ onDepartmentClick }) {
  const { scene } = useGLTF('/edficio-ok.glb')

  // Guardar colores originales, clonar materiales y asignar eventos a cada mesh
  useEffect(() => {
    const meshesP14 = []
    const meshesP15 = []

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Recolectar meshes de pisos 14 y 15 para enlazar dúplex
        if (child.name.includes('14')) meshesP14.push(child)
        if (child.name.includes('15')) meshesP15.push(child)
        console.log(child)
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

        // Edificios de contexto: transparentes con sombras
        if (child.name.includes('edif_context')) {
          child.material.transparent = true
          child.material.opacity = 0.4
          child.material.color.setHex(0xd4c5b9) // Beige elegante
          child.material.roughness = 0.9
          child.material.depthWrite = false
          child.renderOrder = -1
          child.castShadow = true
          child.receiveShadow = true
          return // No hacer clickeables los edificios de contexto
        }

        // Remover transparencia del edificio principal
        child.material.transparent = false
        child.material.opacity = 1

        // Habilitar sombras en cada mesh
        child.castShadow = true
        child.receiveShadow = true

        // Hacer cada mesh interactivo
        const rawPisoKey = detectarPiso(child.name)

        // Map rawPisoKey (PB, P1...) to constant.js keys (P00, P01...)
        let pisoKey = null
        if (rawPisoKey === 'PB') pisoKey = 'P00'
        else if (rawPisoKey && rawPisoKey.match(/^P\d$/)) pisoKey = rawPisoKey.replace('P', 'P0')
        else pisoKey = rawPisoKey

        if (pisoKey) {
          child.userData.pisoKey = pisoKey
          child.userData.clickable = true

          // Intenta encontrar la unidad específica dentro de ese piso
          const unitsInFloor = edificioVivra[pisoKey]?.unidades || []

          const matchedUnit = unitsInFloor.find((unit) => {
            const matches = child.name.includes(unit.meshNamePattern)

            return matches
          })

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

    // Enlazar dúplex (Pisos 14 y 15)
    meshesP14.forEach((mesh14) => {
      const match = mesh14.name.match(/14([A-E])/)
      if (match) {
        const letra = match[1]
        const mesh15 = meshesP15.find((m) => m.name.includes(`15${letra}`))
        if (mesh15) {
          mesh14.userData.sibling = mesh15
          mesh15.userData.sibling = mesh14
        }
      }
    })
  }, [scene])

  const highlightMesh = (mesh, highlight) => {
    if (highlight) {
      mesh.material.color.set('#ffc46a')
      if (mesh.material.emissive) {
        mesh.material.emissive.set('#ffc46a')
        mesh.material.emissiveIntensity = 0.3
      }
    } else {
      if (mesh.userData.originalColor) {
        mesh.material.color.copy(mesh.userData.originalColor)
        if (mesh.material.emissive && mesh.userData.originalEmissive) {
          mesh.material.emissive.copy(mesh.userData.originalEmissive)
          mesh.material.emissiveIntensity = mesh.userData.originalEmissiveIntensity
        }
      }
    }
  }

  const handlePointerOver = useCallback((event) => {
    event.stopPropagation()
    const mesh = event.object

    if (mesh.userData.clickable && mesh.isMesh && mesh.material) {
      highlightMesh(mesh, true)
      if (mesh.userData.sibling) highlightMesh(mesh.userData.sibling, true)
      document.body.style.cursor = 'pointer'
    }
  }, [])

  const handlePointerOut = useCallback((event) => {
    event.stopPropagation()
    const mesh = event.object

    if (mesh.isMesh && mesh.material) {
      highlightMesh(mesh, false)
      if (mesh.userData.sibling) highlightMesh(mesh.userData.sibling, false)
    }
    document.body.style.cursor = 'auto'
  }, [])

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation()
      const mesh = event.object

      if (mesh.userData.clickable && mesh.userData.pisoKey && mesh.userData.unitData) {
        const floorPlanImage = getFloorPlanImage(mesh.name)

        onDepartmentClick({
          ...mesh.userData.unitData,
          piso: mesh.userData.pisoKey,
          meshName: mesh.name,
          floorPlanImage: floorPlanImage
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
export const preloadModel = () => useGLTF.preload('/eddi.glb')
