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

/**
 * Entrada tipo drone: `?intro=no` o "reducir movimiento" del sistema la
 * saltean. En desarrollo, `?intro=0.4` congela el vuelo en ese instante.
 */
function initialIntro() {
  if (new URLSearchParams(window.location.search).get('intro') === 'no') return 'off'
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'off'
  return 'pending'
}

function introFreeze() {
  if (!import.meta.env.DEV) return undefined
  const value = Number.parseFloat(new URLSearchParams(window.location.search).get('intro'))
  return Number.isNaN(value) ? undefined : Math.min(1, Math.max(0, value))
}

const INVITE_SECONDS = 5
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
  // Entorno bajo: los edificios de alrededor bajan para ver mejor VIVRA
  const [lowContext, setLowContext] = useState(false)
  const toggleLowContext = useCallback(() => setLowContext((v) => !v), [])
  // Giro del plano de la ficha para que coincida con la vista 3D (ver CameraRig)
  const [planTurn, setPlanTurn] = useState(180)
  const availability = useAvailability()
  // Carga inicial: texturas y cielo (useProgress) hasta que la escena dibuja
  const { progress: assets } = useProgress()
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])
  // 'pending' (cargando) → 'flying' → 'done'; 'off' sin vuelo
  const [intro, setIntro] = useState(initialIntro)
  // Al aterrizar, el selector de pisos invita a elegir unidad unos segundos
  const [invite, setInvite] = useState(false)
  const container = useRef(null)

  useEffect(() => {
    if (!ready || intro !== 'pending') return
    const started = rig.current?.playIntro({
      freezeAt: introFreeze(),
      onEnd: () => {
        setIntro('done')
        setInvite(true)
      }
    })
    // Si el vuelo no pudo arrancar, la interfaz no queda escondida
    setIntro(started ? 'flying' : 'done')
  }, [ready, intro])

  const skipIntro = useCallback(() => {
    if (!rig.current?.skipIntro()) setIntro((i) => (i === 'flying' ? 'done' : i))
  }, [])

  // Durante el vuelo, cualquier clic, arrastre, rueda o tecla lo saltea
  useEffect(() => {
    if (intro !== 'flying') return
    window.addEventListener('wheel', skipIntro, { passive: true })
    window.addEventListener('keydown', skipIntro)
    return () => {
      window.removeEventListener('wheel', skipIntro)
      window.removeEventListener('keydown', skipIntro)
    }
  }, [intro, skipIntro])

  // El toque que saltea el vuelo no llega a la escena: si no, al soltar sobre
  // la torre (que ya está en la vista general) abriría un piso. Se corta en la
  // captura, antes que los eventos de R3F y de OrbitControls.
  const swallowClick = useRef(false)
  const onPointerDownCapture = useCallback(
    (e) => {
      if (intro !== 'flying' || e.target.tagName !== 'CANVAS') return
      e.stopPropagation()
      swallowClick.current = true
      skipIntro()
    },
    [intro, skipIntro]
  )
  const onClickCapture = useCallback((e) => {
    if (!swallowClick.current) return
    swallowClick.current = false
    e.stopPropagation()
  }, [])

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
      onPointerDownCapture={onPointerDownCapture}
      onClickCapture={onClickCapture}
      className="relative h-screen h-[100svh] w-full overflow-hidden bg-[#d6dee4]"
    >
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
          lowContext={lowContext}
          onPlanTurn={setPlanTurn}
          intro={intro}
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
        intro={intro}
        onSkipIntro={skipIntro}
        invite={invite}
        onInviteSeen={dismissInvite}
      />
      <LoadingScreen
        progress={Math.min(99, CODE_SHARE + ((100 - CODE_SHARE) * assets) / 100)}
        done={ready}
      />
    </div>
  )
}
