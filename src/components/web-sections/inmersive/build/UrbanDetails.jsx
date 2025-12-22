import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

// Piso/suelo con textura
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, -2]} position={[0, -0.3, 0]} receiveShadow>
      <planeGeometry args={[1000, 10000]} />
      <meshStandardMaterial color="grey" roughness={0.9} metalness={0.1} />
    </mesh>
  )
}

// Pájaros volando
function Bird({ position, speed }) {
  const birdRef = useRef()

  useFrame((state, delta) => {
    if (birdRef.current) {
      const time = state.clock.elapsedTime
      birdRef.current.position.x += speed * delta
      birdRef.current.position.y = position[1] + Math.sin(time * 2) * 0.2

      if (birdRef.current.position.x > 15) {
        birdRef.current.position.x = -15
      }
    }
  })

  return (
    <group ref={birdRef} position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.1, 0.02, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  )
}

// Componente principal con todos los detalles urbanos
export function UrbanDetails() {
  return (
    <>
      <Ground />

      {/* Pájaros volando */}
      <Bird position={[-10, 2, 5]} speed={0.8} />
      <Bird position={[-8, 5, 3]} speed={0.6} />
      <Bird position={[-12, 4, 4]} speed={0.7} />
      <Bird position={[-2, 2, 5]} speed={0.8} />
      <Bird position={[-5, 5, 3]} speed={0.6} />
      <Bird position={[12, 4, 4]} speed={0.7} />
    </>
  )
}
