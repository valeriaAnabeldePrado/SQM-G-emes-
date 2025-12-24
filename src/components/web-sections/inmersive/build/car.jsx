import { useGLTF, useAnimations } from '@react-three/drei'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { SkeletonUtils } from 'three-stdlib'

// Modelo simple de persona con animaciones y movimiento
export function SedanModel({
  animation = 'walk',
  position = [2.8, 0, -1],
  speed = 1,
  patrolDistance = 3.5, // distancia para ir y volver
  scale = 0.1, // escala del modelo (0.5 = mitad, 2 = doble)
  direction = 0 // 0 = horizontal (eje Z), Math.PI/2 = vertical (eje X)
}) {
  const group = useRef()
  const gltf = useGLTF('/sedan.glb')

  // Clonar el scene para que cada instancia sea independiente
  const clonedScene = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene])
  const { actions } = useAnimations(gltf.animations, group)

  const [moveDirection, setMoveDirection] = useState(1) // 1 = adelante, -1 = atrás
  const [isVisible, setIsVisible] = useState(true) // controlar visibilidad
  const [_, setCycleCount] = useState(0) // contar ciclos
  const startPosition = useRef(position)
  const isHorizontal = direction === 0 // true = mueve en Z, false = mueve en X

  // Inicializar posición una sola vez
  useEffect(() => {
    if (group.current) {
      group.current.position.set(...position)
      startPosition.current = [...position]
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reproducir la animación seleccionada
  useEffect(() => {
    if (actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play()
    }

    return () => {
      if (actions[animation]) {
        actions[animation].fadeOut(0.5)
      }
    }
  }, [animation, actions])

  // Movimiento de patrulla (ir y volver)
  useFrame((_state, delta) => {
    if (group.current && isVisible) {
      // Mover en el eje correspondiente según la dirección
      if (isHorizontal) {
        // Movimiento en eje Z (horizontal)
        group.current.position.z += moveDirection * speed * delta
        const distanceTraveled = Math.abs(group.current.position.z - startPosition.current[2])

        if (distanceTraveled >= patrolDistance) {
          setMoveDirection((prev) => -prev)
          group.current.rotation.y += Math.PI
          // Cuando completa un ciclo (ida y vuelta), desaparecer
          setCycleCount((prev) => prev + 1)
          setIsVisible(false)
        }
      } else {
        // Movimiento en eje X (perpendicular)
        group.current.position.x += moveDirection * speed * delta
        const distanceTraveled = Math.abs(group.current.position.x - startPosition.current[0])

        if (distanceTraveled >= patrolDistance) {
          setMoveDirection((prev) => -prev)
          group.current.rotation.y += Math.PI
          // Cuando completa un ciclo (ida y vuelta), desaparecer
          setCycleCount((prev) => prev + 1)
          setIsVisible(false)
        }
      }
    }
  })

  // Efecto para reaparición después de 5 segundos
  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 5000) // 5 segundos

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <group ref={group} scale={scale} rotation={[0, direction, 0]} visible={isVisible}>
      <primitive object={clonedScene} castShadow receiveShadow />
    </group>
  )
}

// Preload del modelo
useGLTF.preload('/sedan.glb')
