import { MdAccessTime, MdRadioButtonUnchecked } from 'react-icons/md'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Las etapas que todavía no tienen material. Son doce: darles la misma tarjeta
 * grande que a las etapas documentadas convierte la página en un muro de vacíos,
 * así que van como ficha de obra: número, nombre, estado.
 */
const UpcomingList = ({ milestones }) => {
  if (!milestones.length) return null

  return (
    <section className="py-[var(--pading-y)]">
      <div className="mb-6 flex items-baseline gap-4">
        <h4 className="text-[var(--color-three)] text-sm font-bold uppercase tracking-[0.2em]">
          Próximas etapas
        </h4>
        <span className="h-px flex-1 bg-[var(--color-border)]" />
        <span className="text-[var(--color-three)]/50 text-sm font-bold tabular-nums">
          {pad(milestones.length)}
        </span>
      </div>

      <ol className="border-t border-[var(--color-border)]">
        {milestones.map((milestone) => {
          const active = milestone.status === 'in-progress'
          return (
            <li
              key={milestone.id}
              className={`flex items-center gap-4 min-d:gap-6 border-b border-[var(--color-border)] py-4 transition-colors duration-300 ${
                active ? 'bg-[var(--color-one)]/5' : ''
              }`}
            >
              <span
                className={`w-8 shrink-0 text-sm font-bold tabular-nums ${
                  active ? 'text-[var(--color-one)]' : 'text-[var(--color-three)]/35'
                }`}
              >
                {pad(milestone.id)}
              </span>

              <span className="shrink-0">
                {active ? (
                  <MdAccessTime size={18} className="text-[var(--color-one)]" />
                ) : (
                  <MdRadioButtonUnchecked size={18} className="text-[var(--color-three)]/25" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <h5
                  className={`truncate text-sm min-d:text-base font-bold tracking-wide ${
                    active ? 'text-[var(--color-three)]' : 'text-[var(--color-three)]/60'
                  }`}
                >
                  {milestone.title}
                </h5>
                {active && (
                  <p className="mt-1 text-[var(--color-three)]/70 text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                )}
              </div>

              {active && (
                <span className="shrink-0 rounded-full bg-[var(--color-one)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white">
                  En curso
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default UpcomingList
