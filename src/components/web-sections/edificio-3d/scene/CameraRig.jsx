import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { BUILDING_HEIGHT, LOT } from '../buildings/vivra-guemes/config'
import { getFloor } from '../interiors/catalog'

const HOME_FOV = 35
// Vista general: casi frontal desde Pueyrredón, como el render de fachada,
// con un leve giro para que se lea la profundidad de los balcones.
const HOME_DIRECTION = new THREE.Vector3(0.3, 0.16, -1).normalize()
// Ancho mínimo a encuadrar: torre + parte de las medianeras (más justo en vertical)
const frameWidth = (aspect) => (aspect < 1 ? 22 : 30)
const MAX_PORTRAIT_FOV = 80

/** Vistas fijas equivalentes a los renders de referencia. */
const PRESETS = {
  // bannerOk.png: desde la vereda de enfrente, a la altura del peatón
  frente: { position: [0.6, 1.7, -15.2], target: [0, 12.5, 0], fov: 64 },
  // frenteTwoOk.png: frente de oficinas desde la vereda de enfrente sobre Peredo
  contrafrente: {
    position: [-0.5, 1.7, LOT.depth + 11.8],
    target: [0, 9.5, LOT.depth - 4],
    fov: 60
  },
  aerea: { position: [30, 88, -78], target: [0, 23, 12], fov: 35 }
}

const FOCUS_ZOOM = 0.6 // acercamiento al elegir una unidad
const FOCUS_MIN_DISTANCE = 13

const TARGET_BOUNDS = new THREE.Box3(new THREE.Vector3(-80, 1, -45), new THREE.Vector3(80, 60, 85))
const MIN_CAMERA_HEIGHT = 1.2

/**
 * Vista de un piso abierto (vista "piso:<id>"): desde arriba y en diagonal,
 * como los recorredores de disponibilidad. La torre se mira desde Pueyrredón;
 * las oficinas, desde Peredo (así la torre queda de fondo y no tapa).
 */
function floorView(id) {
  const floor = getFloor(id)
  const y = floor.base
  const z = (floor.box.zMin + floor.box.zMax) / 2
  if (floor.building === 'oficinas') {
    return { position: [4, y + 22, z + 12], target: [0, y + 0.5, z], fov: 40 }
  }
  return { position: [4, y + 30, z - 12.4], target: [0, y + 0.5, z], fov: 40 }
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Animación por cuadros con su propio reloj: si un cuadro tarda (abrir un
 * piso puede trabar un instante), avanza como mucho 50 ms, así el vuelo no
 * salta al final y se ve completo.
 */
function fly(duration, onFrame, onEnd) {
  let elapsed = 0
  let last = performance.now()
  let frame = requestAnimationFrame(function step(now) {
    elapsed += Math.min(50, now - last)
    last = now
    const t = Math.min(1, elapsed / (duration * 1000))
    onFrame(easeInOut(t))
    if (t < 1) frame = requestAnimationFrame(step)
    else onEnd?.()
  })
  return {
    kill: () => {
      cancelAnimationFrame(frame)
      onEnd?.()
    }
  }
}

/** Encuadre automático: distancia para que el edificio entre completo en pantalla. */
function homeView(aspect) {
  const tan = Math.tan(THREE.MathUtils.degToRad(HOME_FOV / 2))
  const height = BUILDING_HEIGHT + 6
  const distance = Math.max(height / 2 / tan, frameWidth(aspect) / 2 / (tan * aspect)) * 1.05
  const target = new THREE.Vector3(0, height / 2 - 2, 9)
  return {
    position: target.clone().addScaledVector(HOME_DIRECTION, distance).toArray(),
    target: target.toArray(),
    fov: HOME_FOV
  }
}

/**
 * En pantallas verticales se abre el fov de las vistas fijas para conservar el
 * ancho del encuadre; la geometría no se toca.
 */
function fitPreset(preset, aspect) {
  if (aspect >= 1) return preset
  const tan = Math.tan(THREE.MathUtils.degToRad(preset.fov / 2)) / aspect
  return {
    ...preset,
    fov: Math.min(MAX_PORTRAIT_FOV, THREE.MathUtils.radToDeg(2 * Math.atan(tan)))
  }
}

export const CameraRig = forwardRef(function CameraRig(_, ref) {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const invalidate = useThree((s) => s.invalidate)
  const regress = useThree((s) => s.performance.regress)
  const controls = useRef(null)
  const state = useRef({ view: 'general', moved: false, tween: null })

  const resolve = useCallback(
    (view) => {
      const aspect = size.width / size.height
      if (view === 'general') return homeView(aspect)
      if (view.startsWith('piso:')) return fitPreset(floorView(view.slice(5)), aspect)
      return PRESETS[view] && fitPreset(PRESETS[view], aspect)
    },
    [size]
  )

  const apply = useCallback(
    (view, animate) => {
      const target = resolve(view)
      const ctrl = controls.current
      if (!target || !ctrl) return
      state.current.view = view
      state.current.moved = false
      state.current.tween?.kill()

      const sync = () => {
        camera.updateProjectionMatrix()
        ctrl.update()
        invalidate()
      }
      if (!animate) {
        camera.position.fromArray(target.position)
        ctrl.target.fromArray(target.target)
        camera.fov = target.fov
        sync()
        return
      }

      // Vuelo tipo dron: la cámara recorre un arco (sube, cruza y baja) y el
      // punto de mira se desliza al destino. Duración según la distancia.
      const startPosition = camera.position.clone()
      const startTarget = ctrl.target.clone()
      const endPosition = new THREE.Vector3(...target.position)
      const endTarget = new THREE.Vector3(...target.target)
      const startFov = camera.fov
      const distance = startPosition.distanceTo(endPosition)
      const control = startPosition
        .clone()
        .lerp(endPosition, 0.5)
        .add(new THREE.Vector3(0, Math.min(40, distance * 0.35), 0))
      const duration = THREE.MathUtils.clamp(1.6 + distance / 90, 1.6, 3.2)
      state.current.flying = true
      const land = () => {
        state.current.flying = false
      }
      state.current.tween = fly(
        duration,
        (t) => {
          const k = 1 - t
          camera.position
            .copy(startPosition)
            .multiplyScalar(k * k)
            .addScaledVector(control, 2 * k * t)
            .addScaledVector(endPosition, t * t)
          ctrl.target.lerpVectors(startTarget, endTarget, t)
          camera.fov = startFov + (target.fov - startFov) * t
          // Sin bajar la resolución: cambiarla recrea los buffers del
          // post-procesado y traba el vuelo al empezar y al terminar
          sync()
        },
        land
      )
    },
    [camera, invalidate, resolve]
  )

  /**
   * Viaja hasta `point` (la unidad elegida): el punto de mira se centra en
   * ella y la cámara se acerca manteniendo el ángulo.
   */
  const focus = useCallback(
    ([x, y, z]) => {
      const ctrl = controls.current
      if (!ctrl) return
      state.current.tween?.kill()
      // Movida a propósito: que un reencuadre por tamaño no la devuelva
      state.current.moved = true
      const startTarget = ctrl.target.clone()
      const startCamera = camera.position.clone()
      const endTarget = new THREE.Vector3(x, y, z)
      const offset = startCamera.clone().sub(startTarget)
      const distance = Math.max(FOCUS_MIN_DISTANCE, offset.length() * FOCUS_ZOOM)
      const endCamera = endTarget.clone().add(offset.setLength(distance))
      state.current.tween = fly(1.3, (t) => {
        ctrl.target.lerpVectors(startTarget, endTarget, t)
        camera.position.lerpVectors(startCamera, endCamera, t)
        ctrl.update()
        invalidate()
      })
    },
    [camera, invalidate]
  )

  useImperativeHandle(ref, () => ({ goTo: (view) => apply(view, true), focus }), [apply, focus])

  // Primer encuadre y reencuadre al cambiar el tamaño mientras no se haya movido la cámara
  useEffect(() => {
    if (!state.current.moved && !state.current.flying) apply(state.current.view, false)
  }, [apply])

  useEffect(() => {
    const current = state.current
    return () => current.tween?.kill()
  }, [])

  const onStart = useCallback(() => {
    state.current.moved = true
    state.current.dragging = true
    state.current.tween?.kill()
  }, [])
  const onEnd = useCallback(() => {
    state.current.dragging = false
  }, [])

  // Límites: el punto de mira no se va del barrio y la cámara no baja del suelo
  const onChange = useCallback(() => {
    const ctrl = controls.current
    if (!ctrl) return
    // Resolución reducida solo mientras el usuario arrastra (no en los vuelos:
    // cambiarla recrea los buffers del post-procesado)
    if (state.current.dragging) regress()
    if (!TARGET_BOUNDS.containsPoint(ctrl.target)) {
      const clamped = TARGET_BOUNDS.clampPoint(ctrl.target, new THREE.Vector3())
      camera.position.add(clamped.clone().sub(ctrl.target))
      ctrl.target.copy(clamped)
    }
    if (camera.position.y < MIN_CAMERA_HEIGHT) camera.position.y = MIN_CAMERA_HEIGHT
  }, [camera, regress])

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
      panSpeed={0.7}
      screenSpacePanning
      minDistance={8}
      maxDistance={260}
      maxPolarAngle={Math.PI * 0.8}
      onStart={onStart}
      onEnd={onEnd}
      onChange={onChange}
    />
  )
})
