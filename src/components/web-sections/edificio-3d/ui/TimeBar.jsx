import { FiMoon, FiPause, FiPlay, FiSun, FiSunset } from 'react-icons/fi'
import { HOUR_RANGE, TIMES, formatHour } from '../scene/timeOfDay'

const SHORTCUTS = [
  { id: 'dia', Icon: FiSun },
  { id: 'atardecer', Icon: FiSunset },
  { id: 'noche', Icon: FiMoon }
]

/**
 * Hora del día: atajos (Día / Atardecer / Noche), una barra con la hora y un
 * botón para ver pasar el día. El sol y la luz siguen a la barra.
 */
export function TimeBar({ hour, onHour, onTime, playing, onTogglePlay }) {
  const [min, max] = HOUR_RANGE
  const progress = ((hour - min) / (max - min)) * 100
  return (
    <div className="flex w-full flex-col gap-1.5 rounded-2xl bg-white/80 p-1.5 shadow-sm backdrop-blur-md md:w-64">
      <div className="flex items-center gap-1">
        {SHORTCUTS.map(({ id, Icon }) => {
          // Mayúscula: el lint de este repo no ve el uso en JSX de desestructurados
          const TimeIcon = Icon
          return (
            <button
              key={id}
              type="button"
              title={TIMES[id].label}
              aria-label={TIMES[id].label}
              onClick={() => onTime(id)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-darck transition-colors hover:bg-darck/10"
            >
              <TimeIcon aria-hidden="true" />
            </button>
          )
        })}
        <span className="ml-auto text-sm font-semibold tabular-nums text-darck">
          {formatHour(hour)}
        </span>
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={playing ? 'Pausar el paso del día' : 'Ver pasar el día'}
          title={playing ? 'Pausar' : 'Ver pasar el día'}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-darck text-white"
        >
          {playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
        </button>
      </div>
      <label className="flex items-center gap-2 px-1.5 pb-1">
        <span className="sr-only">Hora del día</span>
        <input
          type="range"
          min={min}
          max={max}
          step={1 / 12}
          value={hour}
          onChange={(e) => onHour(Number(e.target.value))}
          className="edificio-time-range w-full"
          style={{ '--progress': `${progress}%` }}
        />
      </label>
      <div className="flex justify-between px-1.5 text-[9px] text-darck/50">
        {[6, 9, 12, 15, 18, 21].map((h) => (
          <span key={h}>{h}h</span>
        ))}
      </div>
    </div>
  )
}
