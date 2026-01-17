import { Suspense, useEffect, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Cloud, Stats } from '@react-three/drei'
import * as THREE from 'three'
import BackToHome from '../components/BackToHome'
import { Model, preloadModel } from './Model'
import { SceneLights } from './Lights'
import { LoadingScreen } from './LoadingScreen'
import { DepartmentDrawer } from './DepartmentDrawer'
import { FloorsPanel } from './FloorsPanel'

import { UrbanDetails } from './UrbanDetails'
import { SedanModel } from './car'

export default function NewBuild() {
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [highlightedUnits, setHighlightedUnits] = useState([])

  const handleDepartmentClick = useCallback((data) => {
    setSelectedDepartment(data)

    setTimeout(() => setIsDrawerOpen(true), 10)
  }, [])

  const handleHighlightUnits = useCallback((units) => {
    setHighlightedUnits(units)
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
        return prev + Math.random() * 45
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <BackToHome />

      <LoadingScreen loadingProgress={loadingProgress} isLoading={isLoading} />

      <FloorsPanel onHighlightUnits={handleHighlightUnits} />

      <DepartmentDrawer
        selectedDepartment={selectedDepartment}
        isDrawerOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />

      <Canvas
        shadows
        camera={{ position: [15, 10, 15], fov: 20 }}
        dpr={window.innerWidth < 768 ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: window.innerWidth >= 768,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.2
        }}
        style={{ background: '#87CEEB' }}
      >
        <Suspense fallback={null}>
          <Sky
            sunPosition={[100, 20, 100]}
            turbidity={8}
            rayleigh={0.5}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
          />

          <SceneLights />
          <UrbanDetails />
          {/* <Stats /> */}
          <Model onDepartmentClick={handleDepartmentClick} highlightedUnits={highlightedUnits} />
          <SedanModel />

          {/* Personas caminando random */}
          {/* {people.map((person) => (
            <ManModel
              key={person.id}
              animation="walk"
              position={person.position}
              speed={person.speed}
              patrolDistance={0.2}
              scale={0.2}
              direction={person.direction}
            />
          ))} */}

          <OrbitControls
            enablePan={true}
            maxPolarAngle={Math.PI / 2}
            minDistance={8}
            maxDistance={30}
            touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Preload del modelo para mejor performance
preloadModel()
