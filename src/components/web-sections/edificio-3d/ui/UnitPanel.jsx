import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import { getFloor } from '../interiors/catalog'
import { unitStatus } from '../interiors/status'

// Mismo número que el botón flotante (WhatsAppButton). Los clics a wa.me se
// miden solos en GA4 con el listener global de index.html.
const WHATSAPP = '5493513470043'

function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="flex justify-between gap-3 border-b border-darck/10 py-1.5 text-xs">
      <span className="text-darck/60">{label}</span>
      <span className="text-right text-darck">{value}</span>
    </div>
  )
}

/** Ficha de la unidad elegida en la planta: estado, datos, plano y contacto. */
export function UnitPanel({ unit, availability, onClose }) {
  const [planOk, setPlanOk] = useState(true)
  if (!unit) return null

  const status = unitStatus(unit, availability)
  const row = availability?.[unit.sheet]
  const info = unit.info
  const title = unit.amenity
    ? unit.letter
    : info?.title || `${unit.letter} · ${getFloor(unit.floor)?.label}`
  const message = `Hola, me interesa ${unit.amenity ? 'conocer las amenities' : `el ${title}`} de VIVRA Güemes. ¿Me pasan información?`

  return (
    <aside
      aria-label={`Unidad ${title}`}
      className="edificio-panel-in pointer-events-auto absolute inset-x-3 bottom-28 z-30 max-h-[55vh] overflow-y-auto rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-md md:inset-x-auto md:bottom-auto md:left-6 md:top-36 md:w-80"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="block text-lg font-semibold leading-tight text-darck">{title}</span>
          <span className="block text-xs text-darck/60">
            {row?.tipo || info?.type || ''}
            {unit.duplexUpper ? ' · planta alta del dúplex del piso 14' : ''}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="rounded-full p-1 text-darck/60 hover:bg-darck/10"
        >
          <FiX />
        </button>
      </div>

      <span
        className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white"
        style={{ background: status.color }}
      >
        {status.label}
      </span>

      {info?.floorPlan && planOk ? (
        <img
          src={info.floorPlan}
          alt={`Plano de ${title}`}
          onError={() => setPlanOk(false)}
          className="mx-auto mt-3 max-h-56 w-auto rounded-lg bg-white object-contain"
        />
      ) : null}

      <div className="mt-3">
        <Row label="Superficie total" value={info?.superficieTotal} />
        <Row label="Superficie propia" value={info?.superficiePropia} />
        <Row label="Balcón" value={info?.balcones !== 'NO' ? info?.balcones : null} />
        <Row label="Orientación" value={row?.orientacion} />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {info && unit.key ? (
          <Link
            to={`/apartments/${unit.key}`}
            className="rounded-full bg-darck px-4 py-2 text-center text-xs text-white"
          >
            Ver ficha de la unidad
          </Link>
        ) : null}
        <a
          href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#22a565] px-4 py-2 text-center text-xs text-white"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </aside>
  )
}
