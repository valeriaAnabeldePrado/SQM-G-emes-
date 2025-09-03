import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Card } from '../home/components/card'
import {
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdAccessTime,
  MdPhotoLibrary,
  MdClose,
  MdArrowBackIos,
  MdArrowForwardIos,
  MdPlayArrow
} from 'react-icons/md'

gsap.registerPlugin(ScrollTrigger)

const Roadmap = () => {
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const timelineRef = useRef(null)
  const [selectedImages, setSelectedImages] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const milestones = [
    {
      id: 1,
      title: 'Inicio de obra',
      date: 'Marzo 2024',
      description:
        'Preparación del terreno y comienzo de excavaciones. Obtención de permisos y habilitaciones necesarias.',
      status: 'completed',
      images: [
        '/characteristics/bano.png',
        '/characteristics/pisos.png',
        '/characteristics/balcony.jpg'
      ],
      progress: 100,
      thumbnail: '/characteristics/bano.png'
    },
    {
      id: 2,
      title: 'Cimientos y estructura',
      date: 'Junio 2024',
      description:
        'Construcción de fundaciones y estructura principal. Hormigón armado y pilares de soporte.',
      status: 'completed',
      images: ['/characteristics/pisos.png', '/characteristics/bano.png'],
      progress: 100,
      thumbnail: '/characteristics/pisos.png'
    },
    {
      id: 3,
      title: 'Avance constructivo',
      date: 'Septiembre 2024',
      description:
        'Levantamiento de muros y estructura de pisos. Mampostería y losas de entrepisos.',
      status: 'in-progress',
      images: ['/characteristics/balcony.jpg', '/characteristics/pisos.png'],
      progress: 65,
      thumbnail: '/characteristics/balcony.jpg'
    },
    {
      id: 4,
      title: 'Instalaciones',
      date: 'Diciembre 2024',
      description:
        'Sistemas eléctricos, sanitarios y de climatización. Cañerías, cableado y ductos.',
      status: 'upcoming',
      progress: 0,
      thumbnail: '/banner/0010.png'
    },
    {
      id: 5,
      title: 'Terminaciones',
      date: 'Marzo 2025',
      description:
        'Acabados interiores y exteriores. Revestimientos, pisos, pintura y carpintería.',
      status: 'upcoming',

      progress: 0,
      thumbnail: '/banner/0012.png'
    },
    {
      id: 6,
      title: 'Entrega',
      date: 'Junio 2025',
      description:
        'Entrega de unidades y puesta en funcionamiento. Últimos detalles y habilitación final.',
      status: 'upcoming',
      progress: 0,
      thumbnail: '/banner/0014.png'
    },
    {
      id: 7,
      title: 'Aislamientos y fachada',
      date: 'Septiembre 2025',
      description:
        'Trabajos de fachada, revestimientos exteriores e implementación de aislamientos térmicos y acústicos.',
      status: 'upcoming',
      progress: 30,
      thumbnail: '/banner/0016.png'
    },
    {
      id: 8,
      title: 'Espacios comunes',
      date: 'Noviembre 2025',
      description:
        'Terminación de áreas comunes: lobby, sala de usos múltiples, gimnasio y circulación principal.',
      status: 'upcoming',
      progress: 0,
      thumbnail: '/banner/0020.png'
    },
    {
      id: 9,
      title: 'Paisajismo',
      date: 'Enero 2026',
      description:
        'Diseño y ejecución de jardines, veredas y espacios verdes perimetrales del proyecto.',
      status: 'upcoming',
      progress: 0,
      thumbnail: '/banner/0024.png'
    },
    {
      id: 10,
      title: 'Certificaciones & ensayos',
      date: 'Marzo 2026',
      description:
        'Pruebas finales de instalaciones (eléctricas, sanitarias y de gas) y emisión de certificados obligatorios.',
      status: 'upcoming',
      progress: 0,
      thumbnail: '/banner/0026.png'
    },
    {
      id: 11,
      title: 'Garantías y postventa',
      date: 'Mayo 2026',
      description:
        'Implementación de procesos de postventa, atención a reclamos y garantías contractuales.',
      status: 'upcoming',
      progress: 0,
      thumbnail: '/banner/0027.png'
    },
    {
      id: 12,
      title: 'Puesta en marcha de instalaciones',
      date: 'Julio 2026',
      description:
        'Arranque y pruebas en condiciones reales de todas las instalaciones; puesta en servicio de climatización, bombas y ascensores.',
      status: 'upcoming',
      progress: 0,
      thumbnail: '/banner/0028.png'
    },
    {
      id: 13,
      title: 'Inspecciones finales',
      date: 'Septiembre 2026',
      description:
        'Inspecciones técnicas finales y check-list de calidad antes de la recepción definitiva.',
      status: 'upcoming',
      progress: 0,
      thumbnail: '/banner/0029.png'
    },
    {
      id: 14,
      title: 'Recepción final',
      date: 'Noviembre 2026',
      description:
        'Recepción definitiva del edificio, entrega de documentación y cierre administrativo del proyecto.',
      status: 'upcoming',
      progress: 0,
      thumbnail: '/banner/0030.png'
    }
  ]

  const PLACEHOLDER_IMAGE = '/characteristics/bano.png'

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
      // Animate header text
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

      // Animate timeline cards
      gsap.set('.timeline-milestone', {
        opacity: 0,
        y: 50
      })

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
    },
    { scope: containerRef, revertOnUpdate: true }
  )

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <MdCheckCircle size={28} className="text-green-500" />
      case 'in-progress':
        return <MdAccessTime size={28} className="text-[var(--color-one)] animate-pulse" />
      case 'upcoming':
        return <MdRadioButtonUnchecked size={28} className="text-[var(--color-three)] opacity-50" />
      default:
        return <MdRadioButtonUnchecked size={28} className="text-[var(--color-three)] opacity-50" />
    }
  }

  // Smaller icon used only inside the compact timeline points
  const getSmallIcon = (status) => {
    switch (status) {
      case 'completed':
        return <MdCheckCircle size={16} className="text-green-600" />
      case 'in-progress':
        return <MdAccessTime size={16} className="text-[var(--color-one)]" />
      case 'upcoming':
        return <MdRadioButtonUnchecked size={16} className="text-[var(--color-three)] opacity-60" />
      default:
        return <MdRadioButtonUnchecked size={16} className="text-[var(--color-three)] opacity-60" />
    }
  }

  const openImageGallery = (images, startIndex = 0) => {
    setSelectedImages(images)
    setCurrentImageIndex(startIndex)
  }

  const closeImageGallery = () => {
    setSelectedImages(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length)
  }

  // keyboard navigation for modal (Esc to close, arrows to navigate)
  useEffect(() => {
    if (!selectedImages) return

    const handler = (e) => {
      if (e.key === 'Escape') closeImageGallery()
      if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length)
      }
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedImages])

  return (
    <>
      <div ref={containerRef} className="custom-container mx-auto px-4 md:py-14 py-24">
        {/* Header Section */}
        <div className="py-[var(--pading-y)]">
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

        {/* Interactive Timeline */}
        <div ref={timelineRef} className="py-[var(--pading-y)]">
          <Card
            className="p-[var(--padding-cards-small)] min-d:p-[var(--padding-cards)] overflow-hidden"
            hasGradient
          >
            {/* Compact Horizontal/Vertical Timeline */}
            <div className="relative w-full">
              {/* Timeline Line constrained to container width */}
              <div className="absolute top-1/2 left-6 right-6 h-1 bg-[var(--color-border)] rounded-full transform -translate-y-1/2 z-0"></div>

              {/* On small screens show vertical stacked timeline; on larger show horizontal scroll */}
              <div className="hidden min-d:block overflow-x-auto px-6 py-6">
                <div className="min-w-max flex gap-6 items-center z-10 snap-x snap-mandatory">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className={`timeline-milestone min-w-[140px] flex-shrink-0 snap-center flex flex-col items-center ${
                        Array.isArray(milestone.images) && milestone.images.length > 0
                          ? 'cursor-pointer group'
                          : 'cursor-default'
                      }`}
                      onClick={() =>
                        Array.isArray(milestone.images) && milestone.images.length > 0
                          ? openImageGallery(milestone.images, 0)
                          : null
                      }
                    >
                      {/* Small Point */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border-2 transition-all duration-200 ${
                          milestone.status === 'completed'
                            ? 'bg-green-50 border-green-400'
                            : milestone.status === 'in-progress'
                              ? 'bg-orange-50 border-[var(--color-one)]'
                              : 'bg-white border-gray-300'
                        }`}
                      >
                        {getSmallIcon(milestone.status)}
                      </div>

                      <div className="mt-2 text-center max-w-[140px]">
                        <h6 className="text-sm font-semibold text-[var(--color-three)] mb-0 line-clamp-2">
                          {milestone.title}
                        </h6>
                        <span className="text-xs text-[var(--color-three)] opacity-70">
                          {milestone.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile: vertical timeline */}
              <div className="block min-d:hidden py-4">
                <div className="flex flex-col gap-6 z-10">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-start gap-4"
                      onClick={() => openImageGallery(milestone.images, 0)}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border-2 mt-1 ${
                          milestone.status === 'completed'
                            ? 'bg-green-50 border-green-400'
                            : milestone.status === 'in-progress'
                              ? 'bg-orange-50 border-[var(--color-one)]'
                              : 'bg-white border-gray-300'
                        }`}
                      >
                        {getSmallIcon(milestone.status)}
                      </div>
                      <div>
                        <h6 className="text-sm font-semibold text-[var(--color-three)]">
                          {milestone.title}
                        </h6>
                        <span className="text-xs text-[var(--color-three)] opacity-70">
                          {milestone.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Milestone Cards */}
        <div className="py-[var(--pading-y)] space-y-8">
          {milestones.map((milestone) => (
            <Card
              key={milestone.id}
              className="timeline-milestone p-[var(--padding-cards-small)] min-d:p-[var(--padding-cards)] flex items-center"
              hasGradient
            >
              <div className="flex flex-col min-lg:flex-row gap-8 items-center justify-center w-full">
                {/* Content */}
                <div className="flex-1 space-y-4 text-center min-lg:text-left">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(milestone.status)}
                    <div>
                      <h4 className="text-(length:--text-subtitleS) font-bold text-[var(--color-three)]">
                        {milestone.title}
                      </h4>
                      <span className="text-(length:--text-menu-sub) text-[var(--color-one)] font-medium">
                        {milestone.date}
                      </span>
                    </div>
                  </div>

                  <p className="text-(length:--text-p) text-[var(--color-three)] opacity-80 leading-relaxed">
                    {milestone.description}
                  </p>
                  {/* Photo Gallery Button */}
                  {Array.isArray(milestone.images) && milestone.images.length > 0 && (
                    <div className="flex justify-center min-lg:justify-start">
                      <button
                        onClick={() => openImageGallery(milestone.images, 0)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-one)] text-white rounded-full hover:brightness-90 transition-all duration-300 font-medium"
                      >
                        <MdPhotoLibrary size={18} />
                        Ver fotos ({milestone.images.length})
                      </button>
                    </div>
                  )}
                </div>
                {/* Thumbnails removed: keep only the action button to open gallery */}
              </div>
            </Card>
          ))}
        </div>

        {/* Overall Progress */}
        <div className="py-[var(--pading-y)]">
          <Card
            className="p-[var(--padding-cards-small)] min-d:p-[var(--padding-cards)] text-center"
            hasGradient
          >
            <h4 className="text-(length:--text-subtitle) font-bold text-[var(--color-three)] mb-6">
              Progreso General del Proyecto
            </h4>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Main Progress Bar */}
              <div className="relative">
                <div className="bg-[var(--color-beige)] rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-[var(--color-one)] h-full rounded-full transition-all duration-2000 ease-out relative"
                    style={{ width: '21%' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20 animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-(length:--text-menu-sub) font-bold text-white drop-shadow-lg">
                    21% Completado
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4 bg-white bg-opacity-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-(length:--text-menu-sub) text-[var(--color-three)]">
                    Completadas
                  </div>
                </div>
                <div className="text-center p-4 bg-white bg-opacity-50 rounded-lg">
                  <div className="text-2xl font-bold text-[var(--color-one)]">2</div>
                  <div className="text-(length:--text-menu-sub) text-[var(--color-three)]">
                    En progreso
                  </div>
                </div>
                <div className="text-center p-4 bg-white bg-opacity-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-500">10</div>
                  <div className="text-(length:--text-menu-sub) text-[var(--color-three)]">
                    Próximas
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {selectedImages && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center p-4"
          onClick={closeImageGallery}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeImageGallery}
              aria-label="Cerrar galería"
              className="absolute top-3 right-3 z-10 bg-white text-[var(--color-three)] rounded-full p-2 shadow-lg hover:scale-105 transition-all duration-200"
            >
              <MdClose size={22} />
            </button>

            {/* Navigation Buttons */}
            {selectedImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-300"
                >
                  <MdArrowBackIos size={24} className="text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition-all duration-300"
                >
                  <MdArrowForwardIos size={24} className="text-white" />
                </button>
              </>
            )}

            {/* Main Image */}
            <img
              src={selectedImages[currentImageIndex]}
              alt="Avance de obra"
              onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
              className="max-w-full max-h-full object-contain rounded-lg bg-gray-900"
            />

            {/* Image Counter */}
            {selectedImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                {currentImageIndex + 1} / {selectedImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Roadmap
