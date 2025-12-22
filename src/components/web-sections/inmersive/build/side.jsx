import { useGLTF } from '@react-three/drei'

// Componente del modelo GLB con hover por departamento individual
export function Side({
  scale = 0.05, // Tamaño del modelo (0.5 = mitad, 0.3 = muy pequeño)
  position = [0, 0, 2] // Posición [x, y, z]
}) {
  const { scene } = useGLTF('/edd.glb')
  console.log(scene)

  return (
    <group scale={scale} position={position}>
      <primitive object={scene} castShadow receiveShadow />
    </group>
  )
}

// Preload del modelo para mejor performance
useGLTF.preload('/edd.glb')
