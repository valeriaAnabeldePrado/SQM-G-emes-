import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

const IDLE_GAP = 250 // ms sin cuadros = la cámara estaba quieta, no cuenta
const SAMPLES = 45
const MIN_FPS = 28

/**
 * Baja de nivel si al mover la cámara la mediana de cuadros cae debajo de
 * MIN_FPS. Con frameloop "demand" solo se renderiza mientras algo se mueve, así
 * que los huecos largos entre cuadros se ignoran (no son lentitud).
 */
export function QualityMonitor({ enabled, onDecline }) {
  const state = useRef({ last: 0, samples: [] })
  useFrame(() => {
    const now = performance.now()
    const s = state.current
    const dt = now - s.last
    s.last = now
    if (!enabled || dt > IDLE_GAP) return
    s.samples.push(dt)
    if (s.samples.length < SAMPLES) return
    const median = [...s.samples].sort((a, b) => a - b)[SAMPLES >> 1]
    s.samples = []
    if (median > 1000 / MIN_FPS) onDecline()
  })
  return null
}

/**
 * Resolución dinámica: mientras se orbita o anima la cámara (performance.regress)
 * se renderiza a menos resolución; al soltar vuelve a la del nivel de calidad.
 */
export function DynamicResolution({ dpr }) {
  const factor = useThree((s) => s.performance.current)
  const setDpr = useThree((s) => s.setDpr)
  useEffect(() => {
    const target = Math.min(window.devicePixelRatio || 1, dpr)
    setDpr(Math.max(0.6, target * factor))
  }, [dpr, factor, setDpr])
  return null
}
