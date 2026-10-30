import { useMemo } from 'react'
import { OFFICE_FLOORS, TOWER_FLOORS, availableCount } from '../interiors/catalog'
import { STATUS } from '../interiors/status'

function FloorButton({ floor, active, available, onFloor, onHover }) {
  return (
    <button
      type="button"
      title={floor.label}
      aria-pressed={active}
      onClick={() => onFloor(active ? null : floor.id)}
      onMouseEnter={() => onHover(floor.id)}
      onMouseLeave={() => onHover(null)}
      className={`relative flex h-8 min-w-10 shrink-0 items-center justify-center rounded-full px-2 text-xs transition-colors ${
        active ? 'bg-darck text-white' : 'text-darck hover:bg-darck/10'
      }`}
    >
      {floor.short}
      {available ? (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold text-white"
          style={{ background: STATUS.disponible.color }}
        >
          {available}
        </span>
      ) : null}
    </button>
  )
}

/**
 * Selector de pisos: torre y, aparte, el bloque de oficinas sobre Peredo.
 * Columna a la derecha en escritorio, tira horizontal en celulares. Cada piso
 * muestra cuántas unidades disponibles tiene.
 */
export function FloorPicker({ floor, onFloor, onHover, availability }) {
  const counts = useMemo(
    () =>
      Object.fromEntries(
        [...TOWER_FLOORS, ...OFFICE_FLOORS].map((f) => [f.id, availableCount(f.id, availability)])
      ),
    [availability]
  )
  const groups = [
    { title: 'Torre', floors: [...TOWER_FLOORS].reverse() },
    { title: 'Oficinas', floors: [...OFFICE_FLOORS].reverse() }
  ]

  return (
    <div
      role="group"
      aria-label="Pisos"
      className="pointer-events-auto absolute inset-x-3 bottom-48 flex gap-1 overflow-x-auto rounded-full bg-white/80 p-1 shadow-sm backdrop-blur-md md:inset-x-auto md:bottom-6 md:right-6 md:top-52 md:flex-col md:overflow-y-auto md:rounded-2xl"
    >
      {groups.map(({ title, floors }) => (
        <div key={title} className="flex shrink-0 items-center gap-1 md:flex-col">
          <span className="shrink-0 px-1 text-[9px] font-semibold uppercase tracking-wide text-darck/50">
            {title}
          </span>
          {floors.map((f) => (
            <FloorButton
              key={f.id}
              floor={f}
              active={floor === f.id}
              available={counts[f.id]}
              onFloor={onFloor}
              onHover={onHover}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
