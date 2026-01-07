import { Suspense, useEffect, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, ContactShadows, Sky, Stats } from '@react-three/drei'
import * as THREE from 'three'
import BackToHome from '../components/BackToHome'
import { departamentosData, amenitiesData } from './constant'
import { FloorsPanel } from './FloorsPanel'

// --- DATOS DE DEPARTAMENTOS Y AMENITIES (AJUSTADO PARA TU CÓDIGO) ---

// --- CÓDIGO EXISTENTE (CON MODIFICACIONES EN detectarPiso y handleClick) ---

// Función para detectar el piso según el nombre del mesh
function detectarPiso(nombre) {
  if (!nombre) return null

  // Planta Baja (P00)
  if (nombre.includes('PB') || nombre.includes('LOCAL') || nombre.includes('OFI_PB')) {
    console.log(`✓ Detectado Planta Baja: ${nombre} -> P00`)
    return 'P00'
  }

  // Pisos numerados - buscar patrón de 1 o 2 dígitos seguidos de letra
  // Ejemplos: "1A", "07B", "10C", "14A_DUPLEX"
  const match = nombre.match(/(\d{1,2})[A-Z]/)
  if (match) {
    const floorNumber = parseInt(match[1])

    // Formatear el número de piso con ceros a la izquierda si es necesario
    const paddedFloor = floorNumber.toString().padStart(2, '0')

    // Para P14: planta baja del duplex (unidades A y B)
    if (floorNumber === 14 && (nombre.includes('14A') || nombre.includes('14B'))) {
      console.log(`✓ Detectado Duplex P14: ${nombre} -> P14`)
      return 'P14'
    }

    // Para P15: planta alta del duplex (unidades C, D, E que corresponden a 14C, 14D, 14E en el modelo)
    if (
      floorNumber === 14 &&
      (nombre.includes('14C') || nombre.includes('14D') || nombre.includes('14E'))
    ) {
      console.log(`✓ Detectado Duplex P15: ${nombre} -> P15`)
      return 'P15'
    }

    console.log(`✓ Detectado Piso: ${nombre} -> P${paddedFloor}`)
    return `P${paddedFloor}`
  }

  // Terraza Amenities
  if (nombre.includes('PISCINA') || nombre.includes('QUINCHO')) {
    console.log(`✓ Detectado Amenity: ${nombre} -> TERRAZA_PISCINA`)
    return 'TERRAZA_PISCINA'
  }

  // Ignorar pasillos y planos auxiliares
  if (nombre.includes('PASILLO') || nombre.includes('Plane')) {
    return null
  }

  // Si no se detectó ningún patrón, loguear para debug
  console.log(`⚠️ No se detectó piso para: ${nombre}`)
  return null
}

// Componente de luz direccional sin helper (optimizado)
function DirectionalLight() {
  return (
    <directionalLight
      position={[10, 15, 10]}
      intensity={5}
      castShadow
      shadow-mapSize={window.innerWidth < 768 ? [512, 512] : [1024, 1024]}
      shadow-camera-far={50}
      shadow-camera-left={-15}
      shadow-camera-right={15}
      shadow-camera-top={15}
      shadow-camera-bottom={-15}
      shadow-bias={-0.0001}
    />
  )
}

// Componente del modelo GLB con hover por departamento individual
function Model({ onDepartmentClick }) {
  const { scene } = useGLTF('/3d-edif.glb')

  // Guardar colores originales, clonar materiales y asignar eventos a cada mesh
  useEffect(() => {
    let meshCount = 0
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        meshCount++
        // CLONAR el material para que cada mesh tenga el suyo propio
        child.material = Array.isArray(child.material)
          ? child.material.map((m) => m.clone())
          : child.material.clone()

        // Mejorar materiales para más realismo
        if (child.material) {
          child.material.roughness = 0.6
          child.material.metalness = 0.1
          child.material.envMapIntensity = 0.5
        }

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
          // Asigna la clave del piso al userData para usarla en el click
          child.userData.pisoKey = pisoKey
          child.userData.clickable = true

          // Intenta encontrar la unidad específica dentro de ese piso
          const unitsInFloor =
            departamentosData[pisoKey]?.unidades || amenitiesData[pisoKey]?.unidades || []
          const matchedUnit = unitsInFloor.find((unit) => child.name.includes(unit.meshNamePattern))
          if (matchedUnit) {
            child.userData.unitData = matchedUnit // Guarda todos los datos de la unidad
            child.userData.meshName = child.name // Guarda el nombre del mesh original
          } else {
            // Si es un piso general o un amenity sin un patrón específico aún
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

    console.log(`✓ ${meshCount} meshes configurados`)
  }, [scene])

  const handlePointerOver = useCallback((event) => {
    event.stopPropagation()
    const mesh = event.object

    if (mesh.userData.clickable && mesh.isMesh && mesh.material) {
      mesh.material.color.set('#4a9eff')
      if (mesh.material.emissive) {
        mesh.material.emissive.set('#2266cc')
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

export default function NewBuild() {
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleDepartmentClick = useCallback((data) => {
    setSelectedDepartment(data)
    setTimeout(() => setIsDrawerOpen(true), 10)
  }, [])

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false)
    setTimeout(() => setSelectedDepartment(null), 400)
  }, [])

  // Simular progreso de carga
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 300)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <BackToHome />

      {/* Loader de página completa */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            zIndex: 9999,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: '300',
              color: '#fff',
              letterSpacing: '2px',
              marginBottom: '20px'
            }}
          >
            EDIFICIO GÜEMES
          </div>

          <div
            style={{
              width: '80%',
              maxWidth: '300px',
              textAlign: 'center',
              padding: '0 20px'
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: '200',
                color: '#4a9eff',
                marginBottom: '16px'
              }}
            >
              {Math.floor(loadingProgress)}%
            </div>

            <div
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: 'rgba(74, 158, 255, 0.2)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${loadingProgress}%`,
                  backgroundColor: '#4a9eff',
                  transition: 'width 0.3s ease',
                  boxShadow: '0 0 10px rgba(74, 158, 255, 0.5)'
                }}
              />
            </div>

            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.5)',
                marginTop: '24px',
                letterSpacing: '1px'
              }}
            >
              Cargando modelo 3D...
            </div>
          </div>
        </div>
      )}

      {/* Drawer lateral para información del departamento */}
      {selectedDepartment && (
        <>
          {/* Overlay/backdrop */}
          <div
            onClick={handleCloseDrawer}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(19, 31, 40, 0.85)',
              backdropFilter: 'blur(4px)',
              zIndex: 999,
              opacity: isDrawerOpen ? 1 : 0,
              transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              pointerEvents: isDrawerOpen ? 'auto' : 'none'
            }}
          />

          {/* Drawer */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: window.innerWidth < 768 ? '100%' : '380px',
              height: '100%',
              background: 'rgba(255, 252, 249, 0.95)',
              borderLeft: '1px solid rgba(226, 216, 206, 0.4)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              zIndex: 1000,
              transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
              boxShadow: isDrawerOpen ? '-2px 0 20px rgba(0, 0, 0, 0.08)' : 'none',
              overflowY: 'auto',
              overflowX: 'hidden',
              fontFamily: 'var(--font-poppins)',
              color: 'var(--color-darck)',
              willChange: 'transform'
            }}
          >
            {/* Header del drawer */}
            <div
              style={{
                padding: window.innerWidth < 768 ? '24px 20px' : '32px 32px 24px',
                borderBottom: '1px solid rgba(226, 216, 206, 0.3)',
                position: 'sticky',
                top: 0,
                background: 'rgba(255, 252, 249, 0.98)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                zIndex: 1
              }}
            >
              <button
                onClick={handleCloseDrawer}
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-three)',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px',
                  lineHeight: 1,
                  opacity: 0.5,
                  transition: 'opacity 0.2s',
                  fontWeight: '300'
                }}
                onMouseEnter={(e) => (e.target.style.opacity = '1')}
                onMouseLeave={(e) => (e.target.style.opacity = '0.5')}
              >
                ×
              </button>

              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-three)',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  fontWeight: '500',
                  opacity: 0.7
                }}
              >
                {selectedDepartment.tipologia}
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                  fontWeight: '400',
                  fontFamily: "'Poppins', sans-serif",
                  color: 'var(--color-darck)',
                  letterSpacing: '0.3px'
                }}
              >
                {selectedDepartment.nombre || selectedDepartment.tipologia}
              </h2>
            </div>

            {/* Contenido del drawer */}
            <div style={{ padding: window.innerWidth < 768 ? '24px 20px' : '32px' }}>
              {/* Información básica */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-three)',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      fontWeight: '500',
                      opacity: 0.7
                    }}
                  >
                    Ambientes
                  </div>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: '400',
                      color: 'var(--color-darck)'
                    }}
                  >
                    {selectedDepartment.ambientes}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-three)',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      fontWeight: '500',
                      opacity: 0.7
                    }}
                  >
                    Superficie Propia
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                      fontWeight: 'var(--font-weight-normal)',
                      color: 'var(--color-darck)'
                    }}
                  >
                    {selectedDepartment.superficiePropia
                      ? `${selectedDepartment.superficiePropia} m²`
                      : 'Consultar'}
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <div
                    style={{
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      color: 'var(--color-three)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1.2px',
                      fontWeight: 'var(--font-weight-medium)',
                      fontFamily: 'var(--font-coco)'
                    }}
                  >
                    Superficie Total
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                      fontWeight: 'var(--font-weight-normal)',
                      color: 'var(--color-darck)'
                    }}
                  >
                    {selectedDepartment.superficieTotal
                      ? `${selectedDepartment.superficieTotal} m²`
                      : 'Consultar'}
                  </div>
                </div>

                {selectedDepartment.balcones && (
                  <div style={{ marginBottom: '28px' }}>
                    <div
                      style={{
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        color: 'var(--color-three)',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '1.2px',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-coco)'
                      }}
                    >
                      Balcones
                    </div>
                    <div
                      style={{
                        fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: 'var(--color-darck)'
                      }}
                    >
                      {selectedDepartment.balcones} m²
                    </div>
                  </div>
                )}

                {selectedDepartment.descubierta && (
                  <div style={{ marginBottom: '28px' }}>
                    <div
                      style={{
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        color: 'var(--color-three)',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '1.2px',
                        fontWeight: 'var(--font-weight-medium)',
                        fontFamily: 'var(--font-coco)'
                      }}
                    >
                      Superficie Descubierta
                    </div>
                    <div
                      style={{
                        fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: 'var(--color-darck)'
                      }}
                    >
                      {selectedDepartment.descubierta} m²
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '28px' }}>
                  <div
                    style={{
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      color: 'var(--color-three)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1.2px',
                      fontWeight: 'var(--font-weight-medium)',
                      fontFamily: 'var(--font-coco)'
                    }}
                  >
                    Orientación
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                      fontWeight: 'var(--font-weight-normal)',
                      color: 'var(--color-darck)'
                    }}
                  >
                    {selectedDepartment.orientacion || 'No especificado'}
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <div
                    style={{
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      color: 'var(--color-three)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1.2px',
                      fontWeight: 'var(--font-weight-medium)',
                      fontFamily: 'var(--font-coco)'
                    }}
                  >
                    Descripción
                  </div>
                  <div
                    style={{
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                      fontWeight: 'var(--font-weight-normal)',
                      color: 'var(--color-darck)'
                    }}
                  >
                    {selectedDepartment.descripcion || 'Sin descripción disponible.'}
                  </div>
                </div>
              </div>

              {/* Botón de acción */}
              <button
                style={{
                  width: '100%',
                  padding: '16px 32px',
                  backgroundColor: 'var(--color-one)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  letterSpacing: '0.3px',
                  fontFamily: 'var(--font-poppins)'
                }}
                onMouseEnter={(e) => (e.target.style.filter = 'brightness(0.9)')}
                onMouseLeave={(e) => (e.target.style.filter = 'brightness(1)')}
              >
                Solicitar información
              </button>

              {/* Debug info */}
              <div
                style={{
                  marginTop: '40px',
                  padding: '16px',
                  background: 'rgba(226, 216, 206, 0.3)',
                  borderRadius: '15px',
                  fontSize: '12px',
                  color: 'var(--color-three)',
                  border: '1px solid rgba(179, 175, 171, 0.2)'
                }}
              >
                <div>Mesh: {selectedDepartment.meshName}</div>
                <div>Piso Key: {selectedDepartment.piso}</div>{' '}
                {/* `piso` ahora es la clave del piso */}
              </div>
            </div>
          </div>
        </>
      )}

      <Canvas
        camera={{ position: [15, 10, 15], fov: 15 }}
        shadows
        gl={{
          antialias: window.innerWidth > 768,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        dpr={window.innerWidth < 768 ? [1, 1.5] : [1, 2]}
      >
        {/* Iluminación mejorada para más realismo */}
        <ambientLight intensity={0.3} />
        <DirectionalLight />
        <hemisphereLight intensity={0.4} color="#ffffff" groundColor="#666666" />

        {/* Luz de relleno suave */}
        <directionalLight position={[-5, 8, -8]} intensity={0.3} color="#b8d4ff" />

        <Suspense fallback={null}>
          {/* <Stats /> */}
          <Sky />
          <Model onDepartmentClick={handleDepartmentClick} />
        </Suspense>

        <OrbitControls
          target={[0, 2, 0]}
          minDistance={5}
          maxDistance={40}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.05}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
          maxPolarAngle={Math.PI / 2}
        />

        {/* Grid helper para referencia (comentar si no se necesita) */}
      </Canvas>
    </div>
  )
}

// Preload del modelo para mejor performance
useGLTF.preload('/3d-edif.glb')
