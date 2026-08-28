import { useEffect } from 'react'
import { MdClose, MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md'
import MediaItem from './MediaItem'

const pad = (n) => String(n).padStart(2, '0')

const ModalGallery = ({
  items,
  currentIndex,
  milestoneTitle,
  onClose,
  onPrev,
  onNext,
  onSelect,
  placeholderImage
}) => {
  // El scroll de fondo con el modal abierto es desorientador en mobile.
  useEffect(() => {
    if (!items) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [items])

  if (!items) return null

  const current = items[currentIndex]
  const many = items.length > 1

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col p-4 min-d:p-8"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.94)' }}
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${milestoneTitle}`}
      onClick={onClose}
    >
      {/* Encabezado: qué etapa y qué pieza se está mirando */}
      <div
        className="flex items-start justify-between gap-4 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0">
          <p className="text-white/55 text-[0.7rem] uppercase tracking-[0.18em]">Avance de obra</p>
          <h5 className="truncate text-white text-base min-d:text-xl font-bold tracking-wide">
            {milestoneTitle}
          </h5>
        </div>
        <div className="flex items-center gap-3">
          {current.time && (
            <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
              <span className="text-white text-sm font-bold tabular-nums tracking-wider">
                {current.time}
              </span>
              {current.source && (
                <span className="text-white/60 text-[0.7rem] uppercase tracking-[0.14em]">
                  {current.source}
                </span>
              )}
            </span>
          )}
          {many && (
            <span className="text-white/70 text-sm font-bold tabular-nums">
              {pad(currentIndex + 1)}
              <span className="opacity-50"> / {pad(items.length)}</span>
            </span>
          )}
          <button
            onClick={onClose}
            aria-label="Cerrar galería"
            className="rounded-full bg-white p-2 text-[var(--color-three)] shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <MdClose size={22} />
          </button>
        </div>
      </div>

      {/* Pieza a pantalla completa */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <MediaItem
          item={current}
          variant="full"
          fallback={placeholderImage}
          className="max-h-full max-w-full rounded-lg object-contain"
        />

        {many && (
          <>
            <button
              onClick={onPrev}
              aria-label="Anterior"
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 transition-all duration-300 hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MdArrowBackIos size={24} className="translate-x-[3px] text-white" />
            </button>
            <button
              onClick={onNext}
              aria-label="Siguiente"
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 transition-all duration-300 hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MdArrowForwardIos size={24} className="text-white" />
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {many && (
        <div
          className="mt-4 flex justify-start min-d:justify-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Ir a la pieza ${i + 1}`}
              aria-current={i === currentIndex}
              className={`h-12 w-16 flex-shrink-0 overflow-hidden rounded-md bg-white/10 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                i === currentIndex
                  ? 'ring-2 ring-[var(--color-two)]'
                  : 'opacity-45 hover:opacity-90'
              }`}
            >
              <MediaItem
                item={item}
                variant="preview"
                badge="sm"
                fallback={placeholderImage}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ModalGallery
