import { useCallback, useEffect, useRef, useState } from 'react'
import { MdArrowBackIos, MdArrowForwardIos, MdFullscreen } from 'react-icons/md'
import MediaItem from './MediaItem'
import { isVideo, posterFor } from '../utils/media'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Carousel embebido en la tarjeta de etapa. El track es scroll-snap nativo,
 * así que el swipe en touch y la rueda horizontal en trackpad funcionan solos;
 * las flechas y las miniaturas sólo empujan el scroll.
 */
const MediaCarousel = ({ items, onExpand, fallback }) => {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)

  const scrollTo = useCallback((i) => {
    const track = trackRef.current
    if (!track) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({
      left: i * track.clientWidth,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    })
  }, [])

  const go = useCallback(
    (delta) => scrollTo((index + delta + items.length) % items.length),
    [index, items.length, scrollTo]
  )

  // El índice lo manda el scroll, no el click: así el swipe queda sincronizado
  // con las miniaturas y el contador sin estado duplicado.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const next = Math.round(track.scrollLeft / track.clientWidth)
        setIndex((prev) => (next === prev ? prev : next))
      })
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener('scroll', onScroll)
    }
  }, [])

  const current = items[index]
  const many = items.length > 1

  return (
    <div className="w-full">
      {/* Marco principal */}
      <div
        className="group relative w-full overflow-hidden rounded-[var(--border-radius-tablet)] min-note:rounded-[var(--border-radius-note)] bg-[var(--color-three)]"
        role="group"
        aria-roledescription="carrusel"
        aria-label="Fotos y videos de la etapa"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            go(1)
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            go(-1)
          }
        }}
      >
        <div
          ref={trackRef}
          className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => onExpand(i)}
              aria-label={`Ampliar ${isVideo(item.src) ? 'video' : 'foto'} ${i + 1} de ${items.length}`}
              className="relative w-full flex-shrink-0 snap-center cursor-zoom-in overflow-hidden aspect-[4/3] min-d:aspect-[16/9]"
            >
              <img
                src={isVideo(item.src) ? posterFor(item.src) : item.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-2xl"
              />
              <div className="relative z-10 h-full w-full">
                <MediaItem
                  item={item}
                  variant="preview"
                  fallback={fallback}
                  className="w-full h-full object-contain"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Hora de captura: la secuencia es el dato, no un adorno */}
        {current.time && (
          <div className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-white text-sm font-bold tabular-nums tracking-wider">
              {current.time}
            </span>
            {current.source && (
              <span className="text-white/70 text-[0.7rem] uppercase tracking-[0.14em]">
                {current.source}
              </span>
            )}
          </div>
        )}

        <span className="pointer-events-none absolute right-4 top-4 z-20 rounded-full bg-black/45 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <MdFullscreen size={20} />
        </span>

        {many && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-2.5 text-[var(--color-three)] shadow-md transition-all duration-300 hover:bg-white hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-one)]"
            >
              <MdArrowBackIos size={18} className="translate-x-[3px]" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-2.5 text-[var(--color-three)] shadow-md transition-all duration-300 hover:bg-white hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-one)]"
            >
              <MdArrowForwardIos size={18} />
            </button>

            <div className="pointer-events-none absolute bottom-4 right-4 z-20 rounded-full bg-black/45 px-3 py-1 backdrop-blur-sm">
              <span className="text-white text-sm font-bold tabular-nums">
                {pad(index + 1)}
                <span className="opacity-50"> / {pad(items.length)}</span>
              </span>
            </div>
          </>
        )}
      </div>

      {/* Tira de miniaturas */}
      {many && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Ir a la pieza ${i + 1}`}
              aria-current={i === index}
              className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--color-three)] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-one)] ${
                i === index
                  ? 'ring-2 ring-[var(--color-one)] ring-offset-2 ring-offset-transparent'
                  : 'opacity-55 hover:opacity-100'
              }`}
            >
              <MediaItem
                item={item}
                variant="preview"
                badge="sm"
                fallback={fallback}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default MediaCarousel
