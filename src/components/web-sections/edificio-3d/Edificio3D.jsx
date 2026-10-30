import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import gsap from 'gsap'
import { useAvailability } from './interiors/useAvailability'
import { QUALITY_TIERS, initialQuality } from './scene/quality'
import { Scene } from './scene/Scene'
import { HOUR_RANGE, TIMES, initialSkyHour, skyState } from './scene/timeOfDay'
import { Fallback } from './ui/Fallback'
import { CODE_SHARE, LoadingScreen } from './ui/LoadingScreen'
import { Overlay } from './ui/Overlay'

/** WebGL 2 está en Chrome, Edge, Firefox y Safari 15+; sin él no hay post-procesado. */
function supportsWebGL2() {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'))
  } catch {
    return false
  }
}

const TODAY = new Date()

/** Hora inicial: `?hora=dia|atardecer|noche` o `?hora=19.5`; si no, media tarde. */
function initialHour() {
  const requested = new URLSearchParams(window.location.search).get('hora')
  if (requested in TIMES) return TIMES[requested].hour(TODAY)
  const value = Number.parseFloat(requested)
  if (value >= HOUR_RANGE[0] && value <= HOUR_RANGE[1]) return value
  return initialSkyHour(TODAY)
}

const PLAY_SPEED = 0.9 // horas por segundo al reproducir el día
const TIME_TRANSITION = 2.6 // s

/** Reconstrucción 3D procedural del edificio (ruta /edificio-3d). */
export default function Edificio3D() {
  const rig = useRef(null)
  const [view, setView] = useState('general')
  const [hour, setHour] = useState(initialHour)
  const [playing, setPlaying] = useState(false)
  const hourTween = useRef(null)

  // Los atajos llevan el sol hasta su hora con una animación (se ve moverse).
  // Tiempo de reloj, no el de GSAP: en equipos lentos dura igual, con menos cuadros.
  const goToTime = useCallback(
    (id) => {
      setPlaying(false)
      hourTween.current?.kill()
      const from = hour
      const to = TIMES[id].hour(TODAY)
      const start = performance.now()
      let frame
      const tick = (now) => {
        const t = Math.min(1, (now - start) / (TIME_TRANSITION * 1000))
        setHour(from + (to - from) * gsap.parseEase('power2.inOut')(t))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
      hourTween.current = { kill: () => cancelAnimationFrame(frame) }
    },
    [hour]
  )
  const setHourManual = useCallback((h) => {
    hourTween.current?.kill()
    setPlaying(false)
    setHour(h)
  }, [])

  // Reproducir: el día avanza hasta el final de la barra
  useEffect(() => {
    if (!playing) return
    let frame
    let last = performance.now()
    const tick = (now) => {
      const dt = (now - last) / 1000
      last = now
      setHour((h) => {
        const next = h + dt * PLAY_SPEED
        if (next >= HOUR_RANGE[1]) {
          setPlaying(false)
          return HOUR_RANGE[1]
        }
        return next
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing])
  useEffect(() => () => hourTween.current?.kill(), [])
  const togglePlay = useCallback(() => {
    hourTween.current?.kill()
    setPlaying((p) => {
      if (!p && hour >= HOUR_RANGE[1] - 0.05) setHour(HOUR_RANGE[0])
      return !p
    })
  }, [hour])
  const [isMobile] = useState(() => window.innerWidth < 768)
  const [quality, setQuality] = useState(initialQuality)
  // Equipo sin aceleración o que ni en calidad mínima mueve la escena
  const [tooSlow, setTooSlow] = useState(() => quality.software)
  const showAnyway = useCallback(() => {
    setQuality({ tier: 0, forced: true, software: false })
    setTooSlow(false)
  }, [])
  const [webgl] = useState(supportsWebGL2)
  const [contextLost, setContextLost] = useState(false)
  // Piso abierto (todo lo de arriba se recorta) y unidad elegida en su planta
  const [floor, setFloor] = useState(null)
  const [unit, setUnit] = useState(null)
  const [hoverFloor, setHoverFloor] = useState(null)
  const availability = useAvailability()
  // Carga inicial: texturas y cielo (useProgress) hasta que la escena dibuja
  const { progress: assets } = useProgress()
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])

  const selectUnit = useCallback((next) => {
    setUnit(next)
    if (next?.center) rig.current?.focus([next.center[0], next.center[1] + 0.5, next.center[2]])
  }, [])

  const goTo = useCallback((next) => {
    setFloor(null)
    setUnit(null)
    setView(next)
    rig.current?.goTo(next)
  }, [])

  const openFloor = useCallback(
    (n) => {
      if (n == null) return goTo('general')
      setUnit(null)
      setFloor(n)
      setView(`piso:${n}`)
      rig.current?.goTo(`piso:${n}`)
    },
    [goTo]
  )

  if (!webgl) return <Fallback reason="unsupported" />
  if (contextLost) return <Fallback reason="lost" />
  if (tooSlow) return <Fallback reason="slow" onContinue={showAnyway} />

  return (
    <div className="relative h-screen h-[100svh] w-full overflow-hidden bg-[#d6dee4]">
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, QUALITY_TIERS[quality.tier].dpr]}
        // Resolución reducida mientras se mueve la cámara (ver DynamicResolution)
        performance={{ min: 0.5, debounce: 300 }}
        camera={{ fov: 35, near: 0.5, far: 3000, position: [30, 40, -110] }}
        // Sin antialias nativo: el composer renderiza en su propio buffer y aplica SMAA
        gl={{ antialias: false, stencil: false, powerPreference: 'high-performance' }}
        onCreated={(state) => {
          // Si el sistema le quita la GPU a la pestaña (memoria, suspensión en
          // celulares), se ofrece recargar en lugar de dejar el lienzo en negro
          state.gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault()
            setContextLost(true)
          })
          // Acceso de depuración (draw calls, cámara) solo en desarrollo
          if (import.meta.env.DEV) window.__edificio3d = state
        }}
      >
        <Scene
          rigRef={rig}
          isMobile={isMobile}
          quality={quality}
          onTooSlow={() => setTooSlow(true)}
          onReady={onReady}
          date={TODAY}
          hour={hour}
          floor={floor}
          hoverFloor={hoverFloor}
          onHoverFloor={setHoverFloor}
          onOpenFloor={openFloor}
          availability={availability}
          selectedUnit={unit}
          onSelectUnit={selectUnit}
        />
      </Canvas>
      <Overlay
        view={view}
        onView={goTo}
        hour={hour}
        onHour={setHourManual}
        onTime={goToTime}
        playing={playing}
        onTogglePlay={togglePlay}
        night={skyState(TODAY, hour).night}
        floor={floor}
        onFloor={openFloor}
        onHoverFloor={setHoverFloor}
        unit={unit}
        onUnit={setUnit}
        availability={availability}
      />
      <LoadingScreen
        progress={Math.min(99, CODE_SHARE + ((100 - CODE_SHARE) * assets) / 100)}
        done={ready}
      />
    </div>
  )
}
