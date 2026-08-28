import { MdCheckCircle, MdAccessTime } from 'react-icons/md'
import { Card } from '../../home/components/card'
import MediaCarousel from './MediaCarousel'
import { describeMedia } from '../utils/media'

const pad = (n) => String(n).padStart(2, '0')

/** Etapa documentada: la ficha y el carousel de su material. */
const MilestoneCard = ({ milestone, onExpand, placeholderImage }) => {
  const done = milestone.status === 'completed'

  return (
    <section id={`etapa-${milestone.id}`} className="scroll-mt-32">
      <Card className="milestone-card flex-col items-stretch gap-6 min-d:gap-8" hasGradient>
        {/* Ficha: número de etapa, fecha, estado */}
        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-[var(--color-one)] text-sm font-bold tabular-nums tracking-[0.1em]">
            ETAPA {pad(milestone.id)}
          </span>
          {milestone.date && (
            <>
              <span className="h-3 w-px bg-[var(--color-three)]/25" />
              <span className="text-[var(--color-three)]/60 text-sm">{milestone.date}</span>
            </>
          )}
          <span className="h-3 w-px bg-[var(--color-three)]/25" />
          <span className="text-[var(--color-three)]/60 text-sm">
            {describeMedia(milestone.media)}
          </span>
          <span className="ml-auto flex items-center gap-2">
            {done ? (
              <>
                <MdCheckCircle size={20} className="text-green-600" />
                <span className="text-[var(--color-three)]/70 text-sm font-medium">Completada</span>
              </>
            ) : (
              <>
                <MdAccessTime size={20} className="text-[var(--color-one)]" />
                <span className="text-[var(--color-three)]/70 text-sm font-medium">En curso</span>
              </>
            )}
          </span>
        </div>

        <h4 className="w-full text-(length:--text-subtitleS) font-bold leading-[1.05] tracking-tight text-[var(--color-three)]">
          {milestone.title}
        </h4>

        <MediaCarousel
          items={milestone.media}
          onExpand={(index) => onExpand(milestone, index)}
          fallback={placeholderImage}
        />

        <p className="w-full max-w-3xl text-(length:--text-p) leading-relaxed text-[var(--color-three)]/80">
          {milestone.description}
        </p>
      </Card>
    </section>
  )
}

export default MilestoneCard
