import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Stats, Html, Environment, Sky } from '@react-three/drei'
import * as THREE from 'three'

import gsap from 'gsap'
import { HOTSPOTS } from '../data'
import BackToHome from '../components/BackToHome'

// Componente para manejar la recuperación del contexto WebGL
function WebGLContextHandler({ children }) {
  const { gl } = useThree()
  const [contextLost, setContextLost] = useState(false)

  useEffect(() => {
    if (!gl) return

    const handleContextLost = (event) => {
      event.preventDefault()
      setContextLost(true)
      console.warn('WebGL context lost')
    }

    const handleContextRestore = () => {
      setContextLost(false)
      console.log('WebGL context restored')
      // Forzar re-render después de la restauración
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }

    const canvas = gl.domElement
    canvas.addEventListener('webglcontextlost', handleContextLost)
    canvas.addEventListener('webglcontextrestored', handleContextRestore)

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestore)
    }
  }, [gl])

  if (contextLost) {
    return (
      <Html center>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '20px 30px',
            borderRadius: '10px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '16px',
            textAlign: 'center'
          }}
        >
          <div style={{ marginBottom: '15px' }}>⚠️ Contexto WebGL perdido</div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--color-one)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Recargar página
          </button>
        </div>
      </Html>
    )
  }

  return children
}

// Componente simple para cargar el modelo 3D
function Model3D({ position = [0, -1.3, 0] }) {
  const { scene } = useGLTF('/ABC.glb')

  if (scene) {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Desactivar sombras en todos los meshes
        child.castShadow = false
        child.receiveShadow = false

        // Forzar flatShading en materiales complejos
        if (
          child.material &&
          child.geometry &&
          child.geometry.attributes.position &&
          child.geometry.attributes.position.count > 10000
        ) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.flatShading = true
              mat.needsUpdate = true
              if (mat.transparent && mat.opacity >= 0.99) mat.transparent = false
            })
          } else {
            child.material.flatShading = true
            child.material.needsUpdate = true
            if (child.material.transparent && child.material.opacity >= 0.99)
              child.material.transparent = false
          }
        }
      }
    })
  }

  return <primitive object={scene} position={position} />
}

function ModelEdificio({ position = [0, -1.3, 0] }) {
  const { scene } = useGLTF('/s.glb')

  if (scene) {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Optimizaciones básicas de rendimiento
        child.castShadow = false
        child.receiveShadow = false
        child.frustumCulled = true

        // Simplificar materiales pesados
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material]

          materials.forEach((mat) => {
            if (mat) {
              // FlatShading para mejor performance
              mat.flatShading = true
              mat.needsUpdate = true

              // Remover transparencias innecesarias
              if (mat.transparent && mat.opacity >= 0.99) {
                mat.transparent = false
              }

              // Simplificar materiales muy complejos
              if (mat.normalMap || mat.roughnessMap || mat.metalnessMap) {
                // Limpiar texturas pesadas en meshes densos
                if (child.geometry?.attributes?.position?.count > 30000) {
                  if (mat.normalMap) {
                    if (mat.normalMap.dispose) mat.normalMap.dispose()
                    mat.normalMap = null
                  }
                  if (mat.roughnessMap) {
                    if (mat.roughnessMap.dispose) mat.roughnessMap.dispose()
                    mat.roughnessMap = null
                  }
                }
              }
            }
          })
        }
      }
    })
  }

  return <primitive position={position} object={scene} />
}

// Componente de loading personalizado
function LoadingComponent() {
  return (
    <Html center>
      <div
        style={{
          background: 'rgba(0, 1, 0, 0.8)',
          color: 'white',
          padding: '20px 30px',
          borderRadius: '10px',
          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid #fff',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        Cargando modelo 3D...
      </div>
    </Html>
  )
}

// Selector de modelos disponibles
function Hotspot({ position, label, cameraConfig, onClick, hotspotData }) {
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={position}
      onClick={() => onClick(cameraConfig, hotspotData)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color={hovered ? '#FFC46A' : '#F8A668'}
        emissive={hovered ? '#C24C50' : '#3B2B30'}
        emissiveIntensity={hovered ? 0.8 : 0.5}
      />
      {hovered && (
        <Html distanceFactor={8} position={[0, 0.4, 0]} center>
          <div
            style={{
              background: '#F0EBE0',
              color: '#3B2B30',
              padding: '8px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              pointerEvents: 'none',
              border: '2px solid #FFC46A',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            📍 {label}
          </div>
        </Html>
      )}
    </mesh>
  )
}

function Hotspots({ onHotspotClick }) {
  return (
    <group>
      {HOTSPOTS.map((h, i) => (
        <Hotspot
          key={i}
          position={h.position}
          label={h.label}
          cameraConfig={h.camera}
          hotspotData={h}
          onClick={onHotspotClick}
        />
      ))}
    </group>
  )
}

// Función para obtener información detallada del piso
function getFloorInfo(floorNumber) {
  const floorData = {
    0: {
      title: 'Planta Baja',
      totalUnits: 5,
      description:
        'Este nivel ofrece una variedad de unidades con la ventaja de acceso directo y espacios al aire libre. Se compone de un Local Comercial de 89,33 m² con planta libre, dos Duplex (A y C) de 2 ambientes (49,71 m² y 49,54 m²) cada uno con 1 dormitorio y un patio privado de 12 m², un Estudio-Loft (B) de 32,10 m² también con un patio de 12 m², y una Oficina (A) de 45,60 m² que se destaca por su gran espacio descubierto de casi 54 m².',
      units: [
        { type: 'Local Comercial', area: '89,33m²', features: 'Planta libre, acceso directo' },
        { type: 'Duplex A', area: '49,71m²', features: '2 ambientes, 1 dormitorio, patio 12m²' },
        { type: 'Duplex C', area: '49,54m²', features: '2 ambientes, 1 dormitorio, patio 12m²' },
        { type: 'Estudio-Loft B', area: '32,10m²', features: 'Ambiente único, patio 12m²' },
        { type: 'Oficina A', area: '45,60m²', features: 'Espacio descubierto 54m²' }
      ]
    },
    1: {
      title: 'Piso 1',
      totalUnits: 5,
      description:
        'El primer piso cuenta con cuatro departamentos residenciales y una unidad de oficina. Incluye dos departamentos (A y B) de 2 ambientes y 48,01 m², cada uno con 1 dormitorio y un balcón de 4,76 m². Se suman otros dos departamentos (C y D) también de 2 ambientes, con 45,46 m² y 45,26 m² respectivamente, ambos con 1 dormitorio y un balcón de 3,85 m². Finalmente, se encuentra una Oficina (B) de 61,88 m² con un diseño de planta libre.',
      units: [
        {
          type: 'Departamentos A y B',
          area: '48,01m² c/u',
          features: '2 ambientes, 1 dormitorio, balcón 4,76m²'
        },
        {
          type: 'Departamentos C y D',
          area: '45,46m² y 45,26m²',
          features: '2 ambientes, 1 dormitorio, balcón 3,85m²'
        },
        { type: 'Oficina B', area: '61,88m²', features: 'Planta libre' }
      ]
    },
    2: {
      title: 'Piso 2',
      totalUnits: 5,
      description:
        'En el segundo piso se ubican cuatro departamentos y una oficina. Hay dos departamentos (A y B) de 48,01 m², cada uno de 2 ambientes con 1 dormitorio y balcón de 4,76 m². Se complementan con dos departamentos (C y D) de 45,46 m² y 45,26 m², ambos de 2 ambientes con 1 dormitorio y balcón de 3,85 m². Adicionalmente, se encuentra una Oficina (C) de 61,88 m² de planta libre.',
      units: [
        {
          type: 'Departamentos A y B',
          area: '48,01m² c/u',
          features: '2 ambientes, 1 dormitorio, balcón 4,76m²'
        },
        {
          type: 'Departamentos C y D',
          area: '45,46m² y 45,26m²',
          features: '2 ambientes, 1 dormitorio, balcón 3,85m²'
        },
        { type: 'Oficina C', area: '61,88m²', features: 'Planta libre' }
      ]
    },
    3: {
      title: 'Piso 3',
      totalUnits: 5,
      description:
        'Este piso alberga cuatro unidades residenciales y un espacio de oficina. Ofrece dos departamentos (A y B) de 2 ambientes, con una superficie de 48,01 m², 1 dormitorio y balcón de 4,76 m² cada uno. También cuenta con dos departamentos (C y D) de 45,46 m² y 45,26 m², ambos de 2 ambientes con 1 dormitorio y balcón de 3,85 m². La planta se completa con la Oficina (D), un espacio de 61,88 m² con planta libre.',
      units: [
        {
          type: 'Departamentos A y B',
          area: '48,01m² c/u',
          features: '2 ambientes, 1 dormitorio, balcón 4,76m²'
        },
        {
          type: 'Departamentos C y D',
          area: '45,46m² y 45,26m²',
          features: '2 ambientes, 1 dormitorio, balcón 3,85m²'
        },
        { type: 'Oficina D', area: '61,88m²', features: 'Planta libre' }
      ]
    },
    4: {
      title: 'Piso 4',
      totalUnits: 5,
      description:
        'La cuarta planta presenta una mezcla de tipologías. Incluye dos departamentos (A y B) de 2 ambientes con 48,01 m², 1 dormitorio y balcón de 4,76 m². La novedad son los dos Estudio-Loft (C y D) de 34,00 m² y 33,80 m², que son de ambiente único y cuentan con una amplia terraza privada de 11,50 m² cada uno. También hay una Oficina (D) de 32,75 m² con un gran espacio descubierto de 33,00 m².',
      units: [
        {
          type: 'Departamentos A y B',
          area: '48,01m² c/u',
          features: '2 ambientes, 1 dormitorio, balcón 4,76m²'
        },
        {
          type: 'Estudio-Loft C y D',
          area: '34,00m² y 33,80m²',
          features: 'Ambiente único, terraza 11,50m²'
        },
        { type: 'Oficina D', area: '32,75m²', features: 'Espacio descubierto 33m²' }
      ]
    },
    5: {
      title: 'Piso 5',
      totalUnits: 4,
      description:
        'El quinto piso se compone de cuatro unidades residenciales. Hay dos departamentos (A y B) de 2 ambientes y 48,01 m², cada uno con 1 dormitorio y un balcón de 4,76 m². Además, se encuentran dos Estudio-Loft (C y D) de 36,83 m² y 36,63 m², ambos de ambiente único y con un balcón de 2,83 m².',
      units: [
        {
          type: 'Departamentos A y B',
          area: '48,01m² c/u',
          features: '2 ambientes, 1 dormitorio, balcón 4,76m²'
        },
        {
          type: 'Estudio-Loft C y D',
          area: '36,83m² y 36,63m²',
          features: 'Ambiente único, balcón 2,83m²'
        }
      ]
    },
    6: {
      title: 'Piso 6',
      totalUnits: 4,
      description:
        'La distribución del sexto piso ofrece cuatro unidades de vivienda. Dispone de dos departamentos (A y B) de 2 ambientes, cada uno con 48,01 m², 1 dormitorio y un balcón de 4,76 m². Se suman dos Estudio-Loft (C y D) de 36,83 m² y 36,63 m² respectivamente, ambos de ambiente único con cocina integrada y un balcón de 2,83 m².',
      units: [
        {
          type: 'Departamentos A y B',
          area: '48,01m² c/u',
          features: '2 ambientes, 1 dormitorio, balcón 4,76m²'
        },
        {
          type: 'Estudio-Loft C y D',
          area: '36,83m² y 36,63m²',
          features: 'Ambiente único, cocina integrada, balcón 2,83m²'
        }
      ]
    },
    7: {
      title: 'Piso 7',
      totalUnits: 3,
      description:
        'A partir de este nivel, la configuración cambia para ofrecer unidades más amplias. Se encuentran dos departamentos (A y B) de 2 ambientes y 48,01 m², con 1 dormitorio y balcón de 4,76 m². La tercera unidad es el departamento C, un espacioso 3 ambientes de 73,30 m² que cuenta con 2 dormitorios, cocina independiente y un balcón de 5,66 m².',
      units: [
        {
          type: 'Departamentos A y B',
          area: '48,01m² c/u',
          features: '2 ambientes, 1 dormitorio, balcón 4,76m²'
        },
        {
          type: 'Departamento C',
          area: '73,30m²',
          features: '3 ambientes, 2 dormitorios, cocina independiente, balcón 5,66m²'
        }
      ]
    },
    8: {
      title: 'Piso 8',
      totalUnits: 3,
      description:
        'El octavo piso está compuesto por tres departamentos. Dos de ellos son los departamentos A y B, de 2 ambientes y 48,01 m², cada uno con 1 dormitorio y balcón de 4,76 m². La tercera unidad es el departamento C, un amplio 3 ambientes de 73,30 m² con 2 dormitorios, cocina y un balcón de 5,66 m².',
      units: [
        {
          type: 'Departamentos A y B',
          area: '48,01m² c/u',
          features: '2 ambientes, 1 dormitorio, balcón 4,76m²'
        },
        {
          type: 'Departamento C',
          area: '73,30m²',
          features: '3 ambientes, 2 dormitorios, cocina, balcón 5,66m²'
        }
      ]
    },
    9: {
      title: 'Piso 9',
      totalUnits: 3,
      description:
        'Esta planta cuenta con tres unidades residenciales. Se ofrecen dos departamentos (A y B) de 2 ambientes y 48,01 m², ambos con 1 dormitorio y un balcón de 4,76 m². Se complementan con el departamento C, una unidad de 3 ambientes y 73,30 m² que incluye 2 dormitorios y un balcón de 5,66 m².',
      units: [
        {
          type: 'Departamentos A y B',
          area: '48,01m² c/u',
          features: '2 ambientes, 1 dormitorio, balcón 4,76m²'
        },
        {
          type: 'Departamento C',
          area: '73,30m²',
          features: '3 ambientes, 2 dormitorios, balcón 5,66m²'
        }
      ]
    },
    10: {
      title: 'Piso 10',
      totalUnits: 3,
      description:
        'El décimo piso dispone de tres departamentos. Incluye los departamentos A y B, ambos de 2 ambientes con 48,01 m², 1 dormitorio y balcón de 4,76 m². La planta se completa con el departamento C, una unidad familiar de 3 ambientes con 73,30 m², 2 dormitorios y un balcón de 5,66 m².',
      units: [
        {
          type: 'Departamentos A y B',
          area: '48,01m² c/u',
          features: '2 ambientes, 1 dormitorio, balcón 4,76m²'
        },
        {
          type: 'Departamento C',
          area: '73,30m²',
          features: '3 ambientes, 2 dormitorios, balcón 5,66m²'
        }
      ]
    },
    11: {
      title: 'Piso 11',
      totalUnits: 4,
      description:
        'Esta planta vuelve a tener cuatro unidades residenciales. Hay dos departamentos (A y B) de 2 ambientes y 48,01 m², cada uno con 1 dormitorio y balcón de 4,76 m². Se suman dos Estudio-Loft (C y D) de 36,83 m² y 36,63 m², ambos de ambiente único y con un balcón privado de 2,83 m².',
      units: [
        {
          type: 'Departamentos A y B',
          area: '48,01m² c/u',
          features: '2 ambientes, 1 dormitorio, balcón 4,76m²'
        },
        {
          type: 'Estudio-Loft C y D',
          area: '36,83m² y 36,63m²',
          features: 'Ambiente único, balcón 2,83m²'
        }
      ]
    },
    12: {
      title: 'Piso 12',
      totalUnits: 4,
      description:
        'El piso doce cuenta con cuatro departamentos. Dos de ellos, A y B, son unidades de 2 ambientes de 45,27 m² con 1 dormitorio y una terraza de 2,75 m². Los otros dos, C y D, son Estudio-Loft de 34,00 m² y 33,80 m², de ambiente único y con un balcón de 2,83 m² cada uno.',
      units: [
        {
          type: 'Departamentos A y B',
          area: '45,27m² c/u',
          features: '2 ambientes, 1 dormitorio, terraza 2,75m²'
        },
        {
          type: 'Estudio-Loft C y D',
          area: '34,00m² y 33,80m²',
          features: 'Ambiente único, balcón 2,83m²'
        }
      ]
    },
    13: {
      title: 'Piso 13',
      totalUnits: 2,
      description:
        'Este nivel alberga dos exclusivos departamentos tipo penthouse. El departamento A es un 3 ambientes de 60,28 m² con 2 dormitorios y una espectacular terraza de 30,25 m². El departamento B es un 3 ambientes de 36,08 m² con 2 dormitorios y una terraza aún más grande, de 31,52 m².',
      units: [
        {
          type: 'Departamento A',
          area: '60,28m²',
          features: '3 ambientes, 2 dormitorios, terraza 30,25m²'
        },
        {
          type: 'Departamento B',
          area: '36,08m²',
          features: '3 ambientes, 2 dormitorios, terraza 31,52m²'
        }
      ]
    },
    14: {
      title: 'Piso 14 - Amenities',
      totalUnits: 1,
      description:
        'En la cima del edificio se encuentra una amenidad para todos los residentes: un Quincho de 30,00 m² de uso común. Este espacio está equipado con parrilla, un salón de usos múltiples y una terraza de 30,25 m² con vistas panorámicas.',
      units: [
        { type: 'Quincho', area: '30,00m²', features: 'Parrilla, salón SUM, terraza 30,25m²' }
      ]
    }
  }

  return floorData[floorNumber] || null
}

// Componente Drawer para mostrar características
function CharacteristicsDrawer({ isOpen, characteristics, onClose }) {
  if (!isOpen || !characteristics) return null

  const isFloorPlan = characteristics.type === 'floorplan'

  // Extract floor number from title for floor plan hotspots
  const floorNumber = isFloorPlan ? parseInt(characteristics.title.match(/\d+/)?.[0] || '0') : null

  const floorInfo = isFloorPlan ? getFloorInfo(floorNumber) : null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: isOpen ? 0 : '-600px',
        width: isFloorPlan ? '600px' : '400px',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        color: 'white',
        padding: '20px',
        boxShadow: '-5px 0 20px rgba(0,0,0,0.3)',
        transition: 'right 0.3s ease-in-out',
        zIndex: 1001,
        overflowY: 'auto',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: '25px',
          borderBottom: '2px solid #444',
          paddingBottom: '15px'
        }}
      >
        <button
          onClick={onClose}
          style={{
            float: 'right',
            background: 'transparent',
            border: 'none',
            color: '#ff6b6b',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          ✕
        </button>
        <h2
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fff'
          }}
        >
          {floorInfo ? floorInfo.title : characteristics.title}
        </h2>
        <p
          style={{
            margin: '10px 0 0 0',
            color: '#ccc',
            fontSize: '14px',
            lineHeight: '1.4'
          }}
        >
          {floorInfo ? floorInfo.description : characteristics.description}
        </p>
      </div>

      {/* Floor Plan Image or Regular Content */}
      {isFloorPlan ? (
        <div style={{ marginBottom: '25px' }}>
          {/* Floor Plan Image - Better centered */}
          <div
            style={{
              background: 'rgba(255,255,255,0.95)',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px'
            }}
          >
            <img
              src={characteristics.floorPlanImage}
              alt="Planta del piso"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                height: 'auto',
                width: 'auto',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div
              style={{
                display: 'none',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                color: '#666',
                fontSize: '14px',
                flexDirection: 'column'
              }}
            >
              <span>📋</span>
              <span style={{ marginTop: '10px' }}>No se pudo cargar la imagen del plano</span>
            </div>
          </div>

          {/* Floor Summary Stats */}
          {floorInfo && (
            <div
              style={{
                background: 'rgba(255,107,107,0.1)',
                border: '1px solid #ff6b6b',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px'
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                  textAlign: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b' }}>
                    {floorInfo.totalUnits}
                  </div>
                  <div style={{ fontSize: '12px', color: '#ccc' }}>Unidades Totales</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b' }}>
                    {floorNumber}
                  </div>
                  <div style={{ fontSize: '12px', color: '#ccc' }}>Número de Piso</div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Unit Information */}
          {floorInfo && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#ff6b6b' }}>
                Unidades del piso
              </h3>
              <div style={{ space: '10px' }}>
                {floorInfo.units.map((unit, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      padding: '12px',
                      borderRadius: '6px',
                      marginBottom: '10px',
                      borderLeft: '3px solid #ff6b6b'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
                          {unit.type}
                        </div>
                        <div style={{ color: '#ccc', fontSize: '12px', marginTop: '4px' }}>
                          {unit.features}
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255,107,107,0.2)',
                          color: '#ff6b6b',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          marginLeft: '10px'
                        }}
                      >
                        {unit.area}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Características principales */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#ff6b6b' }}>
              Características destacadas
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {characteristics.features.map((feature, index) => (
                <li
                  key={index}
                  style={{
                    padding: '8px 0',
                    borderBottom: '1px solid #333',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Especificaciones técnicas */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#ff6b6b' }}>
              Especificaciones
            </h3>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '15px',
                borderRadius: '8px'
              }}
            >
              {Object.entries(characteristics.specs).map(([key, value], index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom:
                      index < Object.entries(characteristics.specs).length - 1
                        ? '1px solid #444'
                        : 'none'
                  }}
                >
                  <span style={{ fontWeight: 'bold', color: '#ddd' }}>{key}:</span>
                  <span style={{ color: '#fff' }}>{value}</span>
                </div>
              ))}

              {/* Campos adicionales de alto nivel */}
              <div style={{ marginTop: '12px', borderTop: '1px solid #333', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ fontWeight: 'bold', color: '#ddd' }}>Año:</span>
                  <span style={{ color: '#fff' }}>{characteristics.year || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ fontWeight: 'bold', color: '#ddd' }}>Arquitecto:</span>
                  <span style={{ color: '#fff' }}>{characteristics.architect || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ fontWeight: 'bold', color: '#ddd' }}>Superficie total:</span>
                  <span style={{ color: '#fff' }}>{characteristics.totalArea || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ fontWeight: 'bold', color: '#ddd' }}>Ascensores:</span>
                  <span style={{ color: '#fff' }}>{characteristics.elevators ?? '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function SidebarHotspots({ hotspots, onHotspotClick }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        background: '#F0EBE0',
        color: '#3B2B30',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 50,
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <h3
        style={{
          margin: '0 0 10px 0',
          fontSize: '16px',
          textAlign: 'center',
          color: '#C24C50'
        }}
      >
        Hotspots
      </h3>
      {hotspots.map((hotspot, index) => (
        <button
          key={index}
          onClick={() => onHotspotClick(hotspot.camera, hotspot)}
          style={{
            display: 'block',
            width: '100%',
            margin: '5px 0',
            padding: '8px',
            background: '#FFC46A',
            color: '#3B2B30',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background 0.3s ease'
          }}
          onMouseEnter={(e) => (e.target.style.background = '#F8A668')}
          onMouseLeave={(e) => (e.target.style.background = '#FFC46A')}
        >
          {hotspot.label}
        </button>
      ))}
    </div>
  )
}

export default function Edificio() {
  const [activeHotspot, setActiveHotspot] = useState(null)
  const [selectedCharacteristics, setSelectedCharacteristics] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isZoomedIn, setIsZoomedIn] = useState(false)

  const controlsRef = useRef()

  const handleHotspotClick = (cameraConfig, hotspotData) => {
    setActiveHotspot(cameraConfig)
    setSelectedCharacteristics(hotspotData.characteristics)
    setIsDrawerOpen(true)
    setIsZoomedIn(true)

    // NO tocar OrbitControls aquí para evitar saltos
    // La animación de GSAP se encargará de todo suavemente
  }

  const handleAnimationComplete = () => {
    setActiveHotspot(null)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedCharacteristics(null)
  }

  const handleResetView = () => {
    setIsDrawerOpen(false)
    setSelectedCharacteristics(null)
    setIsZoomedIn(false)

    // Trigger camera reset animation con lookAt correcto
    setActiveHotspot({
      position: [15, 10, 15], // Vista más lejana inicial
      lookAt: [0, 1.5, 1.8] // Vista general consistente con OrbitControls
    })
  }

  function CameraHotspotController({ controlsRef, activeHotspot, onAnimationComplete }) {
    const { camera } = useThree()

    useEffect(() => {
      if (activeHotspot && controlsRef.current) {
        const controls = controlsRef.current

        // Posición final de la cámara
        const cameraEndPos = activeHotspot.position || [15, 10, 15]
        // Punto final al que mirar (el nuevo target de OrbitControls)
        const targetEndPos = activeHotspot.lookAt || [0, 1.5, 1.8]

        // 1. Animar la posición de la cámara
        gsap.to(camera.position, {
          x: cameraEndPos[0],
          y: cameraEndPos[1],
          z: cameraEndPos[2],
          duration: 1.5, // Un poco más de tiempo para suavidad
          ease: 'power3.inOut',
          onComplete: () => {
            if (onAnimationComplete) {
              onAnimationComplete()
            }
          }
        })

        // 2. Animar el 'target' de OrbitControls SIMULTÁNEAMENTE
        gsap.to(controls.target, {
          x: targetEndPos[0],
          y: targetEndPos[1],
          z: targetEndPos[2],
          duration: 1.5,
          ease: 'power3.inOut',
          onUpdate: () => {
            controls.update()
          }
        })
      }
    }, [activeHotspot, camera, controlsRef, onAnimationComplete])

    return null
  }

  return (
    <>
      {/* Barra lateral de hotspots */}
      <SidebarHotspots hotspots={HOTSPOTS} onHotspotClick={handleHotspotClick} />

      {/* Drawer de características */}
      <CharacteristicsDrawer
        isOpen={isDrawerOpen}
        characteristics={selectedCharacteristics}
        onClose={handleCloseDrawer}
      />

      {/* Botón para regresar al home de visores */}
      <BackToHome position="top-left" />

      {/* Botón para volver a vista general */}
      {isZoomedIn && (
        <button
          onClick={handleResetView}
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '20%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #ff6b6b, #ff4444)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            padding: '14px 28px',
            borderRadius: '30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 1002,
            boxShadow: '0 6px 20px rgba(255,107,107,0.4), 0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            animation: 'pulseButton 3s ease-in-out infinite'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateX(-50%) scale(1.1)'
            e.target.style.boxShadow =
              '0 8px 25px rgba(255,107,107,0.5), 0 4px 12px rgba(0,0,0,0.3)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateX(-50%) scale(1)'
            e.target.style.boxShadow = '0 6px 20px rgba(255,107,107,0.4), 0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          🏠 Vista General
        </button>
      )}

      {/* Indicador de animación activa */}
      {activeHotspot && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.2)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '25px',
            zIndex: 1000,
            fontSize: '14px',
            fontWeight: 'bold',
            pointerEvents: 'none'
          }}
        >
          🎯 Enfocando característica...
        </div>
      )}

      {/* Canvas 3D principal */}
      <Canvas
        camera={{
          position: [15, 10, 15], // Más lejos para vista inicial más amplia
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(to bottom, #87CEEB, #98D8E8)'
        }}
        onError={(error) => {
          console.error('Canvas error:', error)
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false
        }}
      >
        <WebGLContextHandler>
          <Sky />
          <Stats />
          {/* Iluminación estándar */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />

          {/* Environment para mejor iluminación */}
          <Environment preset="city" />

          {/* Controles de órbita mejorados y restringidos */}
          <OrbitControls
            ref={controlsRef}
            target={[0, 1.5, 1.8]}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={6}
            maxDistance={35}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            enableDamping={true}
            dampingFactor={0.05}
            panSpeed={0.8}
            rotateSpeed={0.8}
            zoomSpeed={0.6}
          />

          {/* Modelo 3D seleccionado */}
          <Suspense fallback={<LoadingComponent />}>
            <ModelEdificio />
          </Suspense>
          <Suspense fallback={<LoadingComponent />}>
            <Model3D />
          </Suspense>

          <Hotspots onHotspotClick={handleHotspotClick} />
          <CameraHotspotController
            controlsRef={controlsRef} // Pasa el ref como prop
            activeHotspot={activeHotspot}
            onAnimationComplete={handleAnimationComplete}
          />
        </WebGLContextHandler>
      </Canvas>

      {/* Estilos CSS para las animaciones */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            @keyframes fadeIn {
              0% { opacity: 0; transform: translateY(10px) scale(0.9); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }

            @keyframes slideInFromRight {
              0% { transform: translateX(100%); opacity: 0; }
              100% { transform: translateX(0); opacity: 1; }
            }

            @keyframes pulse {
              0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }
              70% { box-shadow: 0 0 0 10px rgba(255, 107, 107, 0); }
              100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
            }

            @keyframes pulseButton {
              0% { 
                box-shadow: 0 6px 20px rgba(255,107,107,0.4), 0 2px 8px rgba(0,0,0,0.2);
                transform: translateX(-50%) scale(1);
              }
              50% { 
                box-shadow: 0 8px 30px rgba(255,107,107,0.6), 0 4px 12px rgba(0,0,0,0.3);
                transform: translateX(-50%) scale(1.02);
              }
              100% { 
                box-shadow: 0 6px 20px rgba(255,107,107,0.4), 0 2px 8px rgba(0,0,0,0.2);
                transform: translateX(-50%) scale(1);
              }
            }

            /* Scrollbar personalizado para el drawer */
            div[style*="overflowY: auto"]::-webkit-scrollbar {
              width: 8px;
            }
            
            div[style*="overflowY: auto"]::-webkit-scrollbar-track {
              background: rgba(255,255,255,0.1);
              border-radius: 4px;
            }
            
            div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
              background: #ff6b6b;
              border-radius: 4px;
            }
            
            div[style*="overflowY: auto"]::-webkit-scrollbar-thumb:hover {
              background: #ff4444;
            }
          `
        }}
      />
    </>
  )
}
