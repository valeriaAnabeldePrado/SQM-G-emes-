import { Cloud } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

// Nube individual que se mueve
function MovingCloud({ position, speed, opacity }) {
  const cloudRef = useRef()

  useFrame((state, delta) => {
    if (cloudRef.current) {
      // Mover la nube en el eje X
      cloudRef.current.position.x += speed * delta

      // Si sale del área visible, reiniciar posición
      if (cloudRef.current.position.x > 30) {
        cloudRef.current.position.x = -30
      }
    }
  })

  return (
    <Cloud
      ref={cloudRef}
      position={position}
      opacity={opacity}
      speed={0.4}
      width={15}
      depth={3}
      segments={30}
      color="#ffffff"
    />
  )
}

// Componente con múltiples nubes
export function Clouds() {
  const clouds = [
    { position: [-10, 6, 5], speed: 0.5, opacity: 0.4 },
    { position: [0, 8, 0], speed: 0.3, opacity: 0.2 },
    { position: [10, 9, 3], speed: 0.4, opacity: 0.32 }
  ]

  return (
    <>
      {clouds.map((cloud, index) => (
        <MovingCloud
          key={index}
          position={cloud.position}
          speed={cloud.speed}
          opacity={cloud.opacity}
        />
      ))}
    </>
  )
}
