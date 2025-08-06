import { Suspense, useEffect, useRef, useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, Preload, Stats, useProgress, Sky } from '@react-three/drei'

import { ScrollWaypointCamera2 } from '../components/scroll1'
import BackToHome from '../components/BackToHome'

// Componente de modelo optimizado con diagnóstico
function ModeloGLB({ url = '/ok.glb', onModelReady, ...props }) {
  const { scene, materials } = useGLTF(url)
  const [isProcessed, setIsProcessed] = useState(false)

  // Diagnóstico COMPLETO del modelo GLTF
  useEffect(() => {
    if (scene && !isProcessed) {
      let meshCount = 0

      let largestMesh = { vertices: 0, name: '', triangles: 0 }

      // Análisis detallado por mesh
      scene.traverse((child) => {
        if (child.isMesh && child.geometry) {
          meshCount++
          const geometry = child.geometry
          const meshName = child.name || `Mesh_${meshCount}`

          if (geometry.attributes.position) {
            const vertices = geometry.attributes.position.count
            let triangles = 0

            if (geometry.index) {
              triangles = geometry.index.count / 3
            } else {
              triangles = vertices / 3
            }

            // Encontrar el mesh más grande
            if (vertices > largestMesh.vertices) {
              largestMesh = {
                vertices,
                triangles: Math.round(triangles),
                name: meshName
              }
            }
          }
        }
      })

      setIsProcessed(true)

      // Notificar que el modelo está listo
      if (onModelReady) {
        setTimeout(() => {
          onModelReady()
        }, 100)
      }
    }

    // Optimizar materiales para mejor rendimiento
    if (materials) {
      Object.values(materials).forEach((material) => {
        // Optimizaciones de materiales
        material.envMapIntensity = 0.8
        material.roughness = Math.max(material.roughness, 0.1)
        material.metalness = Math.min(material.metalness, 0.9)

        // Optimizar texturas si existen
        if (material.map) {
          material.map.generateMipmaps = true
          material.map.minFilter = 1008 // LinearMipmapLinearFilter
          material.map.magFilter = 1006 // LinearFilter
        }

        if (material.normalMap) {
          material.normalMap.generateMipmaps = true
          material.normalMap.minFilter = 1008 // LinearMipmapLinearFilter
        }
      })
    }
  }, [scene, materials, isProcessed, onModelReady])

  return <primitive object={scene} {...props} />
}

// Loader customizado con mejor diseño y progreso más preciso
const CustomLoader = () => {
  const { progress, active, loaded, total } = useProgress()
  const [loadingPhase, setLoadingPhase] = useState('Iniciando...')
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (progress < 10) {
      setLoadingPhase('Conectando...')
    } else if (progress < 30) {
      setLoadingPhase('Descargando modelo...')
    } else if (progress < 60) {
      setLoadingPhase('Procesando geometría...')
    } else if (progress < 85) {
      setLoadingPhase('Cargando texturas...')
    } else if (progress < 95) {
      setLoadingPhase('Optimizando...')
    } else {
      setLoadingPhase('Finalizando...')
    }
  }, [progress])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #fffcf9 0%, #e2d8ce 60%, #ffc46a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        color: '#483b2b',
        fontFamily: "'Poppins', 'Coco Gothic', Arial, sans-serif",
        overflow: 'hidden'
      }}
    >
      {/* Fondo animado */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at ${progress}% 50%, rgba(255,196,106,0.10) 0%, transparent 60%)`,
          animation: 'pulse 2s ease-in-out infinite',
          zIndex: 0
        }}
      />

      {/* Logo o título */}
      <div
        style={{
          marginBottom: '2.5rem',
          textAlign: 'center',
          zIndex: 2
        }}
      >
        <h1
          style={{
            fontSize: '2.7rem',
            fontWeight: 900,
            margin: 0,
            marginBottom: '0.5rem',
            background: 'linear-gradient(90deg, #ca493e 0%, #ffc46a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-1px',
            fontFamily: "'Coco Gothic', 'Poppins', Arial, sans-serif"
          }}
        >
          3D Show
        </h1>
        <p
          style={{
            fontSize: '1.15rem',
            margin: 0,
            opacity: 0.85,
            fontWeight: 400,
            color: '#483b2b',
            letterSpacing: '0.01em',
            fontFamily: "'Poppins', Arial, sans-serif"
          }}
        >
          Experiencia inmersiva
        </p>
      </div>

      {/* Barra de progreso mejorada */}
      <div
        style={{
          width: '340px',
          marginBottom: '2.2rem',
          zIndex: 2
        }}
      >
        <div
          style={{
            width: '100%',
            height: '12px',
            background: '#f9f0e2',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '1.1rem',
            position: 'relative',
            boxShadow: '0 2px 12px 0 #e2d8ce80',
            border: '1.5px solid #e2d8ce'
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #ffc46a 0%, #ca493e 100%)',
              borderRadius: '16px',
              transition: 'width 0.5s cubic-bezier(.4,1.4,.6,1)',
              position: 'relative',
              boxShadow: '0 0 8px 2px #ffc46a80, 0 0 0 1px #ca493e80'
            }}
          >
            {/* Animación de brillo */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                animation: progress > 0 ? 'shimmer 1.5s infinite' : 'none'
              }}
            />
          </div>
        </div>

        {/* Información de progreso */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}
        >
          <span
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#ca493e',
              textShadow: '0 1px 8px #ffc46a80, 0 0 2px #fff',
              fontFamily: "'Poppins', Arial, sans-serif"
            }}
          >
            {Math.round(progress)}%
          </span>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              background: '#fffcf9',
              border: '1.5px solid #ffc46a',
              color: '#ca493e',
              padding: '0.3rem 0.7rem',
              borderRadius: '8px',
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontWeight: 500,
              boxShadow: '0 1px 4px 0 #ffc46a40',
              transition: 'background 0.2s, color 0.2s',
              fontFamily: "'Poppins', Arial, sans-serif"
            }}
          >
            {showDetails ? 'Ocultar' : 'Detalles'}
          </button>
        </div>
      </div>

      {/* Fase de carga */}
      <p
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          margin: 0,
          marginBottom: '1.2rem',
          opacity: 0.92,
          textAlign: 'center',
          color: '#483b2b',
          textShadow: '0 1px 8px #e2d8ce80, 0 0 2px #fff',
          fontFamily: "'Poppins', Arial, sans-serif"
        }}
      >
        {loadingPhase}
      </p>

      {/* Detalles técnicos (opcionales) */}
      {showDetails && (
        <div
          style={{
            background: '#f9f0e2',
            padding: '1.1rem',
            borderRadius: '12px',
            fontSize: '1rem',
            opacity: 0.96,
            textAlign: 'center',
            border: '1.5px solid #e2d8ce',
            color: '#483b2b',
            marginBottom: '0.7rem',
            boxShadow: '0 1px 8px 0 #ffc46a40',
            fontFamily: "'Poppins', Arial, sans-serif"
          }}
        >
          <div>
            Archivos cargados: {loaded} / {total}
          </div>
          <div>Estado: {active ? 'Cargando...' : 'Procesando...'}</div>
        </div>
      )}

      {/* Spinner mejorado */}
      <div
        style={{
          width: '60px',
          height: '60px',
          border: '5px solid #ffc46a',
          borderTop: '5px solid #ca493e',
          borderRight: '5px solid #e2d8ce',
          borderBottom: '5px solid #fffcf9',
          borderLeft: '5px solid #ffc46a',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
          marginTop: '1.2rem',
          boxShadow: '0 2px 16px 0 #ffc46a40, 0 0 0 2px #e2d8ce80',
          background: 'rgba(255,255,255,0.01)'
        }}
      />

      {/* Estilos CSS inline para animaciones */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.13; }
            50% { opacity: 0.22; }
          }
        `}
      </style>
    </div>
  )
}

export default function VisorGLB() {
  const [isTouch, setIsTouch] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isModelReady, setIsModelReady] = useState(false)
  const canvasRef = useRef()

  useEffect(() => {
    useGLTF.preload('/ok.glb')

    return () => {
      useGLTF.clear()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    setIsTouch(
      'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    )
  }, [])

  // Configuración de Canvas optimizada SIN SOMBRAS
  const canvasConfig = useMemo(
    () => ({
      shadows: false, // NO SOMBRAS para máximo FPS
      gl: {
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false,
        depth: true,
        stencil: false,
        preserveDrawingBuffer: false
      },
      camera: {
        position: [8, 2, 8],
        fov: 60,
        near: 0.01,
        far: 1000
      },
      dpr: isTouch ? 1 : Math.min(window.devicePixelRatio, 1.5), // Reducido para mejor FPS
      performance: { min: 0.1 }, // Muy agresivo
      frameloop: 'always'
    }),
    [isTouch]
  )

  return (
    <>
      <BackToHome position="top-left" />
      {(!isLoaded || !isModelReady) && <CustomLoader />}
      {/* Instrucciones de scroll mejoradas - solo mostrar cuando esté cargado */}
      {isLoaded && isModelReady && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            fontWeight: 600,
            padding: '12px 24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            zIndex: 50,
            pointerEvents: 'none',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.95rem',
            border: '1px solid rgba(255,255,255,0.1)',
            animation: 'fadeIn 0.5s ease-in-out'
          }}
        >
          {isTouch ? '👆 Desliza para explorar' : '🖱️ Scroll para explorar'}
        </div>
      )}
      <Canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          opacity: isLoaded && isModelReady ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
        {...canvasConfig}
        onCreated={() => {
          setIsLoaded(true)
        }}
      >
        {/* Cámara con scroll */}
        <ScrollWaypointCamera2 />
        {/* Environment optimizado para MÁXIMO FPS */}
        <Environment preset="city" environmentIntensity={0.5} resolution={256} />
        <Stats />
        <Suspense fallback={null}>
          <Sky />
          <ModeloGLB onModelReady={() => setIsModelReady(true)} />
        </Suspense>
        <Preload all />
      </Canvas>

      {/* Estilos CSS para animaciones */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        `}
      </style>
    </>
  )
}
