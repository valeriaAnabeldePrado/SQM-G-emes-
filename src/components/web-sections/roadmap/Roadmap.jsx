import { useRef, useState, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Card } from '../home/components/card'
import { milestones } from './data/milestones'
import ModalGallery from './components/ModalGallery'
import MilestoneCard from './components/MilestoneCard'
import UpcomingList from './components/UpcomingList'
import { MdCheckCircle, MdRadioButtonUnchecked, MdAccessTime, MdPhotoLibrary } from 'react-icons/md'

gsap.registerPlugin(ScrollTrigger)

const PLACEHOLDER_IMAGE = '/characteristics/bano.png'

const hasMedia = (milestone) => Array.isArray(milestone.media) && milestone.media.length > 0

const documented = milestones.filter(hasMedia)
const upcoming = milestones.filter((milestone) => !hasMedia(milestone))
const completedCount = milestones.filter((m) => m.status === 'completed').length
const overallProgress = Math.round((completedCount / milestones.length) * 100)

const Roadmap = () => {
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const timelineRef = useRef(null)
  const progressRef = useRef(null)
  const [gallery, setGallery] = useState(null)

  const wrapWords = (element) => {
    const nodes = Array.from(element.childNodes)
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split(/(\s+)/)
        parts.forEach((part) => {
          const span = document.createElement('span')
          span.textContent = part
          span.style.display = part.trim() === '' ? 'inline' : 'inline-block'
          if (part.trim() === '') {
            span.style.width = '0.4em'
            span.style.opacity = '1'
            span.style.transform = 'none'
          } else {
            span.style.opacity = '0'
            span.style.transform = 'translateY(20px)'
          }
          element.insertBefore(span, node)
        })
        element.removeChild(node)
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        wrapWords(node)
      }
    })
  }

  useGSAP(
    () => {
      const headerEl = headerRef.current
      wrapWords(headerEl)
      const spans = headerEl.querySelectorAll('span')

      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
          }
        })
        .to(spans, {
          opacity: 1,
          y: 0,
          stagger: 0.01,
          duration: 1,
          ease: 'power2.out'
        })

      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: progressRef.current, start: 'top 90%' }
        }
      )

      gsap.set('.timeline-milestone', { opacity: 0, y: 50 })
      gsap.to('.timeline-milestone', {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 2
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.3
      })

      // Cada etapa documentada se revela con su propio trigger: son tarjetas
      // altas y encadenarlas al scrub de la línea de tiempo las dejaba en blanco.
      gsap.utils.toArray('.milestone-card').forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 85%' }
          }
        )
      })
    },
    { scope: containerRef, revertOnUpdate: true }
  )

  const getSmallIcon = (status) => {
    switch (status) {
      case 'completed':
        return <MdCheckCircle size={16} className="text-green-600" />
      case 'in-progress':
        return <MdAccessTime size={16} className="text-[var(--color-one)]" />
      default:
        return <MdRadioButtonUnchecked size={16} className="text-[var(--color-three)] opacity-60" />
    }
  }

  const jumpToMilestone = (milestone) => {
    const target = hasMedia(milestone)
      ? document.getElementById(`etapa-${milestone.id}`)
      : document.getElementById('proximas-etapas')
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openGallery = useCallback((milestone, index = 0) => {
    setGallery({ items: milestone.media, title: milestone.title, index })
  }, [])

  const closeGallery = useCallback(() => setGallery(null), [])

  const step = useCallback(
    (delta) =>
      setGallery((prev) =>
        prev
          ? { ...prev, index: (prev.index + delta + prev.items.length) % prev.items.length }
          : prev
      ),
    []
  )

  useEffect(() => {
    if (!gallery) return
    const handler = (e) => {
      if (e.key === 'Escape') closeGallery()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [gallery, closeGallery, step])

  return (
    <>
      <div ref={containerRef} className="custom-container mx-auto px-4 md:py-14 py-24">
        {/* Encabezado */}
        <div className="mt-8 lg:pt-20 max-w-6xl">
          <h3
            ref={headerRef}
            className="text-subtitle font-bold text-[var(--color-three)] pb-8 min-lg:pb-16"
          >
            Seguí el{' '}
            <span className="inline-block font-bold rounded-full text-[var(--color-one)]">
              avance de obra mes a mes
            </span>{' '}
            con fotos reales del proceso constructivo. Conocé cada etapa del desarrollo de VIVRA
            Güemes.
          </h3>
        </div>

        {/* Avance general */}
        <div className="mb-10">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <p className="text-[var(--color-three)]/55 text-[0.7rem] uppercase tracking-[0.2em]">
                Avance general
              </p>
              <p className="mt-2 text-[var(--color-three)] text-sm font-medium">
                <span className="text-2xl font-bold tabular-nums">{completedCount}</span>
                <span className="opacity-60"> de {milestones.length} etapas completadas</span>
              </p>
            </div>
            <span className="text-[var(--color-one)] text-3xl font-bold tabular-nums leading-none">
              {overallProgress}%
            </span>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
            <div
              ref={progressRef}
              style={{ width: `${overallProgress}%`, transformOrigin: 'left center' }}
              className="h-full rounded-full bg-[var(--color-one)]"
            />
          </div>
        </div>

        {/* Línea de tiempo */}
        <div ref={timelineRef}>
          <Card
            className="p-[var(--padding-cards-small)] min-d:p-[var(--padding-cards)] overflow-hidden"
            hasGradient
          >
            <div className="relative w-full">
              <div className="absolute top-1/2 left-6 right-6 h-1 bg-[var(--color-border)] rounded-full transform -translate-y-1/2 z-0"></div>

              {/* Desktop: recorrido horizontal */}
              <div className="relative hidden min-d:block">
                <div className="overflow-x-auto px-6 py-6">
                  <div className="min-w-max flex gap-6 items-start z-10 snap-x snap-mandatory">
                    {milestones.map((milestone) => (
                      <button
                        key={milestone.id}
                        type="button"
                        onClick={() => jumpToMilestone(milestone)}
                        className="timeline-milestone min-w-[140px] flex-shrink-0 snap-center flex flex-col items-center cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-one)] rounded-lg"
                      >
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border-2 transition-all duration-200 group-hover:scale-110 ${
                            milestone.status === 'completed'
                              ? 'bg-green-50 border-green-400'
                              : milestone.status === 'in-progress'
                                ? 'bg-orange-50 border-[var(--color-one)]'
                                : 'bg-white border-gray-300'
                          }`}
                        >
                          {getSmallIcon(milestone.status)}
                        </span>

                        <span className="mt-2 text-center max-w-[140px]">
                          <span className="block text-sm font-semibold text-[var(--color-three)] line-clamp-2 group-hover:text-[var(--color-one)] transition-colors">
                            {milestone.title}
                          </span>
                          {hasMedia(milestone) && (
                            <span className="mt-1.5 flex items-center justify-center gap-1 text-[var(--color-one)]">
                              <MdPhotoLibrary size={12} />
                              <span className="text-[0.7rem] font-bold tabular-nums">
                                {milestone.media.length}
                              </span>
                            </span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile: recorrido vertical */}
              <div className="block min-d:hidden py-4">
                <div className="flex flex-col gap-6 z-10">
                  {milestones.map((milestone) => (
                    <button
                      key={milestone.id}
                      type="button"
                      onClick={() => jumpToMilestone(milestone)}
                      className="flex items-center gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-one)] rounded-lg"
                    >
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border-2 shrink-0 ${
                          milestone.status === 'completed'
                            ? 'bg-green-50 border-green-400'
                            : milestone.status === 'in-progress'
                              ? 'bg-orange-50 border-[var(--color-one)]'
                              : 'bg-white border-gray-300'
                        }`}
                      >
                        {getSmallIcon(milestone.status)}
                      </span>
                      <span className="text-sm font-semibold text-[var(--color-three)]">
                        {milestone.title}
                        {hasMedia(milestone) && (
                          <span className="ml-2 inline-flex items-center gap-1 align-middle text-[var(--color-one)]">
                            <MdPhotoLibrary size={12} />
                            <span className="text-[0.7rem] font-bold tabular-nums">
                              {milestone.media.length}
                            </span>
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Etapas documentadas */}
        <div className="py-[var(--pading-y)] space-y-8 min-d:space-y-12">
          {documented.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              onExpand={openGallery}
              placeholderImage={PLACEHOLDER_IMAGE}
            />
          ))}
        </div>

        {/* Etapas sin material todavía */}
        <div id="proximas-etapas" className="scroll-mt-32">
          <UpcomingList milestones={upcoming} />
        </div>
      </div>

      <ModalGallery
        items={gallery?.items ?? null}
        currentIndex={gallery?.index ?? 0}
        milestoneTitle={gallery?.title ?? ''}
        onClose={closeGallery}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        onSelect={(index) => setGallery((prev) => (prev ? { ...prev, index } : prev))}
        placeholderImage={PLACEHOLDER_IMAGE}
      />
    </>
  )
}

export default Roadmap
