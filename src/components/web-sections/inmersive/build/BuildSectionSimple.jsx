import { Suspense, useState, useRef, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import BackToHome from '../components/BackToHome'

// Función para detectar el piso según el nombre
function detectarPiso(nombre) {
  if (!nombre) return null

  // Planta Baja
  if (nombre.includes('PB') || nombre.includes('LOCAL') || nombre.includes('OFI_PB')) {
    return 'PB'
  }

  // Pisos numerados (1A, 1B, 2A, etc)
  const match = nombre.match(/^(\d+)[A-Z]/)
  if (match) {
    return `P${match[1]}`
  }

  // Terraza
  if (nombre.includes('TERRAZA')) {
    return 'TERRAZA'
  }

  // Ignorar pasillos y planos auxiliares
  if (nombre.includes('PASILLO') || nombre.includes('Plane')) {
    return 'AUXILIAR'
  }

  return null
}

// Componente para un mesh individual interactivo
function MeshInteractivo({ mesh, selected, onSelect, onDeselect }) {
  const [isHovered, setIsHovered] = useState(false)
  const meshRef = useRef()
  const materialRef = useRef(mesh.material) // Referencia al material clonado original

  const piso = detectarPiso(mesh.name)
  const isAuxiliar = piso === 'AUXILIAR' || !piso

  // Actualizar colores del material original en vez de crear uno nuevo
  useEffect(() => {
    if (!materialRef.current || isAuxiliar) return

    const material = Array.isArray(materialRef.current)
      ? materialRef.current[0]
      : materialRef.current

    if (material) {
      // Color base
      if (selected) {
        material.color.set('#00ff88') // Verde para seleccionado
      } else if (isHovered) {
        material.color.set('#4a9eff') // Azul para hover
      } else {
        material.color.set(`#${mesh.originalColor}`) // Color original
      }

      // Emisivo para dar brillo
      if (selected || isHovered) {
        material.emissive = material.emissive || new THREE.Color()
        material.emissive.set(selected ? '#00aa55' : '#2266cc')
        material.emissiveIntensity = selected ? 0.5 : 0.3
      } else {
        if (material.emissive) {
          material.emissive.set('#000000')
          material.emissiveIntensity = 0
        }
      }

      material.needsUpdate = true
    }
  }, [selected, isHovered, mesh.originalColor, isAuxiliar])

  const handlePointerOver = (e) => {
    if (isAuxiliar) return
    e.stopPropagation()
    setIsHovered(true)
    document.body.style.cursor = 'pointer'

    console.log('🔵 HOVER:', {
      nombre: mesh.name,
      piso: piso
    })
  }

  const handlePointerOut = (e) => {
    if (isAuxiliar) return
    e.stopPropagation()
    setIsHovered(false)
    document.body.style.cursor = 'auto'
  }

  const handleClick = (e) => {
    if (isAuxiliar) return
    e.stopPropagation()

    if (selected) {
      onDeselect()
    } else {
      onSelect(mesh)
    }

    console.log('✅ CLICK en:', {
      departamento: mesh.name,
      piso: piso,
      posicion: {
        x: mesh.position.x.toFixed(2),
        y: mesh.position.y.toFixed(2),
        z: mesh.position.z.toFixed(2)
      }
    })
  }

  return (
    <mesh
      ref={meshRef}
      geometry={mesh.geometry}
      material={materialRef.current}
      position={mesh.position}
      rotation={mesh.rotation}
      scale={mesh.scale}
      castShadow
      receiveShadow
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  )
}

// Componente principal del edificio con interactividad
function EdificioInteractivo() {
  const { scene } = useGLTF('/3D-EDIFICIO1.glb')
  const [selectedUuid, setSelectedUuid] = useState(null)

  // Extraer todos los meshes con su info básica
  const meshes = useMemo(() => {
    const result = []
    scene.traverse((child) => {
      if (child.isMesh) {
        // Clonar el material para que cada mesh tenga el suyo
        const clonedMaterial = child.material
          ? Array.isArray(child.material)
            ? child.material.map((m) => m.clone())
            : child.material.clone()
          : null

        result.push({
          id: child.uuid,
          name: child.name,
          geometry: child.geometry,
          position: child.position.clone(),
          rotation: child.rotation.clone(),
          scale: child.scale.clone(),
          material: clonedMaterial, // Guardar material original clonado
          originalColor: child.material?.color ? child.material.color.getHexString() : '888888',
          uuid: child.uuid
        })
      }
    })
    return result
  }, [scene])

  // DEBUGGING: Agrupar por piso (solo una vez)
  useEffect(() => {
    console.group('🏗️ ESTRUCTURA POR PISO')
    const pisoGroups = {}

    meshes.forEach((mesh) => {
      const piso = detectarPiso(mesh.name)
      if (piso && piso !== 'AUXILIAR') {
        if (!pisoGroups[piso]) {
          pisoGroups[piso] = []
        }
        pisoGroups[piso].push(mesh.name)
      }
    })

    Object.keys(pisoGroups)
      .sort()
      .forEach((piso) => {
        console.log(`📍 ${piso}:`, pisoGroups[piso])
      })
    console.groupEnd()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo al montar

  const handleSelect = (mesh) => {
    setSelectedUuid(mesh.id)
  }

  const handleDeselect = () => {
    setSelectedUuid(null)
  }

  return (
    <group>
      {meshes.map((mesh) => (
        <MeshInteractivo
          key={mesh.id}
          mesh={mesh}
          selected={selectedUuid === mesh.id}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
        />
      ))}
    </group>
  )
}

// Loading simple
function Loading() {
  return (
    <Html center>
      <div
        style={{
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '20px 30px',
          borderRadius: '10px',
          fontSize: '16px'
        }}
      >
        Cargando edificio 3D...
      </div>
    </Html>
  )
}

// Componente principal exportado
export default function BuildSectionSimple() {
  return (
    <>
      <BackToHome position="top-left" />

      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          fontSize: '13px',
          zIndex: 100,
          fontFamily: 'monospace'
        }}
      >
        <div>
          <strong>🏢 Controles:</strong>
        </div>
        <div>🖱️ Click: Seleccionar</div>
        <div>🔵 Hover: Vista previa</div>
        <div>🔄 Drag: Rotar</div>
        <div>🔍 Scroll: Zoom</div>
      </div>

      <Canvas
        camera={{
          position: [10, 8, 10],
          fov: 50
        }}
        shadows
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)'
        }}
      >
        {/* Luces mejoradas con sombras */}
        <ambientLight intensity={0.4} />

        {/* Luz principal del sol con sombras */}
        <directionalLight
          position={[15, 20, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        {/* Luz de relleno suave */}
        <directionalLight position={[-10, 10, -10]} intensity={0.3} />

        {/* Luz puntual para destacar */}
        <pointLight position={[0, 15, 0]} intensity={0.5} />

        {/* Hemisferio para iluminación natural */}
        <hemisphereLight skyColor="#87CEEB" groundColor="#444444" intensity={0.3} />

        <OrbitControls
          target={[0, 2, 0]}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
        />

        <Suspense fallback={<Loading />}>
          <EdificioInteractivo />
        </Suspense>
      </Canvas>
    </>
  )
}
