import { useProgress } from '@react-three/drei'
import { Link } from 'react-router-dom'
import { STATUS } from '../interiors/status'
import { getFloor } from '../interiors/catalog'
import { FloorPicker } from './FloorPicker'
import { TimeBar } from './TimeBar'
import { UnitPanel } from './UnitPanel'
import './overlay.css'

const VIEWS = [
  { id: 'general', label: 'General' },
  { id: 'frente', label: 'Frente' },
  { id: 'contrafrente', label: 'Oficinas' },
  { id: 'aerea', label: 'Aérea' }
]

/** Aviso de carga de texturas y cielo (al entrar y al cambiar de momento del día). */
function Loading() {
  const { active, progress } = useProgress()
  if (!active) return null
  return (
    <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/85 px-4 py-2 text-xs text-darck shadow-sm backdrop-blur-md">
      Cargando modelo… {Math.round(progress)}%
    </span>
  )
}

/** Barra del piso abierto: nombre, referencias de color y salida. */
function FloorBar({ floor, onExit }) {
  const { label } = getFloor(floor)
  return (
    <div className="edificio-fade-in pointer-events-auto absolute left-1/2 top-[13.5rem] flex -translate-x-1/2 md:top-32 items-center gap-3 rounded-full bg-white/90 py-1.5 pl-4 pr-1.5 shadow-sm backdrop-blur-md md:top-6">
      <span className="whitespace-nowrap text-sm font-medium text-darck">{label}</span>
      <span className="hidden items-center gap-3 text-[11px] text-darck/70 sm:flex">
        {[STATUS.disponible, STATUS.vendida].map(({ color, label: text }) => (
          <span key={text} className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
            {text}
          </span>
        ))}
      </span>
      <button
        type="button"
        onClick={onExit}
        className="whitespace-nowrap rounded-full bg-darck px-3 py-1.5 text-xs text-white"
      >
        Ver edificio completo
      </button>
    </div>
  )
}

export function Overlay({
  view,
  onView,
  hour,
  onHour,
  onTime,
  playing,
  onTogglePlay,
  night,
  floor,
  onFloor,
  onHoverFloor,
  unit,
  onUnit,
  availability
}) {
  return (
    <>
      <Loading />
      <header className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-4 md:flex-nowrap md:gap-3 md:p-6">
        <div className="pointer-events-auto rounded-2xl bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md">
          <Link to="/" className="text-xs text-darck/60 transition-colors hover:text-one">
            ← Volver al inicio
          </Link>
          <h1 className="font-coco text-lg leading-tight text-darck md:text-xl">VIVRA Güemes</h1>
          <span className="block whitespace-nowrap text-[11px] text-darck/70 md:text-xs">
            Av. Pueyrredón 377 · Córdoba
          </span>
        </div>
        <div className="pointer-events-auto flex w-full flex-col items-stretch gap-2 md:w-auto md:items-end">
          <button
            type="button"
            onClick={() => onView('general')}
            // En celulares "General" (barra de vistas) ya cumple esta función
            className="hidden whitespace-nowrap rounded-full bg-darck/85 px-4 py-2 text-xs text-white shadow-sm backdrop-blur-md transition-colors hover:bg-darck md:block"
          >
            Restablecer vista
          </button>
          <TimeBar
            hour={hour}
            onHour={onHour}
            onTime={onTime}
            playing={playing}
            onTogglePlay={onTogglePlay}
          />
        </div>
      </header>

      <FloorPicker
        floor={floor}
        onFloor={onFloor}
        onHover={onHoverFloor}
        availability={availability}
      />
      {floor == null ? null : <FloorBar floor={floor} onExit={() => onFloor(null)} />}
      <UnitPanel
        key={unit ? `${unit.floor}-${unit.letter}` : 'none'}
        unit={unit}
        availability={availability}
        onClose={() => onUnit(null)}
      />

      <nav
        aria-label="Vistas del edificio"
        className="absolute bottom-36 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-white/80 p-1 shadow-sm backdrop-blur-md md:bottom-8"
      >
        {VIEWS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onView(id)}
            aria-pressed={view === id}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors md:px-4 md:text-sm ${
              view === id ? 'bg-darck text-white' : 'text-darck hover:bg-darck/10'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* span y no p: App.css fija el tamaño de todos los <p> */}
      <span
        className={`pointer-events-none absolute bottom-3 left-3 max-w-[55vw] text-[10px] leading-tight md:max-w-none ${
          night > 0.5 ? 'text-white/60' : 'text-darck/60'
        }`}
      >
        Modelo aproximado según planos y renders · © OpenStreetMap contributors
      </span>
    </>
  )
}
