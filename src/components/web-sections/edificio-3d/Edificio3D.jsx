import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import gsap from 'gsap'
import { useAvailability } from './interiors/useAvailability'
import { QUALITY_TIERS, initialQuality } from './scene/quality'
import { Scene } from './scene/Scene'
import { HOUR_RANGE, TIMES, skyState } from './scene/timeOfDay'
import { ENTRY_HOUR, ENTRY_VIEW } from './scene/views'
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

/** Hora inicial: `?hora=dia|atardecer|noche` o `?hora=19.5`; si no, ENTRY_HOUR. */
function initialHour() {
  const requested = new URLSearchParams(window.location.search).get('hora')
  if (requested in TIMES) return TIMES[requested].hour(TODAY)
  const value = Number.parseFloat(requested)
  if (value >= HOUR_RANGE[0] && value <= HOUR_RANGE[1]) return value
  return ENTRY_HOUR
}

const INVITE_SECONDS = 5
const GUIDE_SECONDS = 7
const PLAY_SPEED = 0.9 // horas por segundo al reproducir el día
const TIME_TRANSITION = 2.6 // s

/** Reconstrucción 3D procedural del edificio (ruta /edificio-3d). */
export default function Edificio3D() {
  const rig = useRef(null)
  const [view, setView] = useState(ENTRY_VIEW)
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
  // Entorno bajo: se arranca con los edificios de alrededor bajos (VIVRA a la
  // vista) y "Generar entorno" los levanta a su altura real
  const [lowContext, setLowContext] = useState(true)
  const toggleLowContext = useCallback(() => setLowContext((low) => !low), [])
  // Giro del plano de la ficha para que coincida con la vista 3D (ver CameraRig)
  const [planTurn, setPlanTurn] = useState(180)
  const availability = useAvailability()
  // Carga inicial: texturas y cielo (useProgress) hasta que la escena dibuja
  const { progress: assets } = useProgress()
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])
  // Al entrar, el selector de pisos invita a elegir unidad unos segundos
  const [invite, setInvite] = useState(false)
  const container = useRef(null)
  useEffect(() => {
    if (ready) setInvite(true)
  }, [ready])

  // Guía de gestos (girar, elegir un piso): al terminar el recorrido, hasta
  // el primer toque o GUIDE_SECONDS
  const [guide, setGuide] = useState(false)
  useEffect(() => {
    if (!guide) return
    const hide = () => setGuide(false)
    const id = setTimeout(hide, GUIDE_SECONDS * 1000)
    window.addEventListener('pointerdown', hide, true)
    window.addEventListener('wheel', hide, { capture: true, passive: true })
    window.addEventListener('keydown', hide, true)
    return () => {
      clearTimeout(id)
      window.removeEventListener('pointerdown', hide, true)
      window.removeEventListener('wheel', hide, { capture: true })
      window.removeEventListener('keydown', hide, true)
    }
  }, [guide])

  // Al entrar la cámara gira de las oficinas a la vista aérea (ver tour.js),
  // salvo con "reducir movimiento" del sistema. Cualquier toque, rueda o tecla
  // (arrastrar, un piso, un botón, la hora) la deja quieta.
  useEffect(() => {
    if (!ready) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setGuide(true)
      return
    }
    rig.current?.playTour({
      onDone: (view) => {
        setView(view)
        setGuide(true)
      }
    })
    const stop = () => rig.current?.stopTour()
    window.addEventListener('pointerdown', stop, true)
    window.addEventListener('wheel', stop, { capture: true, passive: true })
    window.addEventListener('keydown', stop, true)
    return () => {
      stop()
      window.removeEventListener('pointerdown', stop, true)
      window.removeEventListener('wheel', stop, { capture: true })
      window.removeEventListener('keydown', stop, true)
    }
  }, [ready])

  useEffect(() => {
    if (!invite) return
    const id = setTimeout(() => setInvite(false), INVITE_SECONDS * 1000)
    return () => clearTimeout(id)
  }, [invite])
  const dismissInvite = useCallback(() => setInvite(false), [])

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
    <div
      ref={container}
      className="relative h-screen h-[100svh] w-full overflow-hidden bg-[#d6dee4]"
    >
      <Canvas
        // Contexto de apilado propio: las letras de las unidades (Html) quedan
        // debajo de la interfaz y no tapan las barras
        style={{ zIndex: 0 }}
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
          lowContext={lowContext}
          onPlanTurn={setPlanTurn}
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
        lowContext={lowContext}
        onToggleLowContext={toggleLowContext}
        planTurn={planTurn}
        invite={invite}
        guide={guide}
        onInviteSeen={dismissInvite}
      />
      <LoadingScreen
        progress={Math.min(99, CODE_SHARE + ((100 - CODE_SHARE) * assets) / 100)}
        done={ready}
      />
    </div>
  )
}
