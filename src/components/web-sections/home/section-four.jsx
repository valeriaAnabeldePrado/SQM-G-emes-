import React, { useRef, useEffect, useState } from 'react'
import { CardArrow } from './components/card-arrow'
import bano from '/src/assets/characteristics/bano.jpg'
import pisos from '/src/assets/characteristics/pisos.jpg'
import balcony from '/src/assets/characteristics/balcon.png'
import details from '/src/assets/characteristics/details.jpg'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const cardsData = [
  {
    img: details,
    alt: 'details',
    title: 'Eficiencia térmica inteligente',
    description: 'Cerramientos exteriores con muro doble que mejoran el aislamiento térmico.'
  },
  {
    img: pisos,
    alt: 'pisos',
    title: 'Pisos de calidad superior',
    description:
      'En palieres y espacios comunes porcelanato rectificado. En interiores de departamentos, piso símil madera que aporta calidez al ambiente.'
  },
  {
    img: bano,
    alt: 'bano',
    title: 'Baños listos para usar',
    description:
      'Baños totalmente equipados con vanitory, griferías de cierre cerámico y platos de ducha modernos.'
  },
  {
    img: balcony,
    alt: 'balcony',
    title: 'Detalles que generan valor',
    description:
      'Todas las unidades cuentan con balcón propio. Balcones terminados en hormigón visto. Vistas privilegiadas e ingreso con seguridad.'
  }
]

gsap.registerPlugin(ScrollTrigger)

const SectionFour = () => {
  const sectionRef = useRef(null)
  const [modalImage, setModalImage] = useState(null)

  const openModal = (img) => {
    setModalImage(img)
  }

  const closeModal = () => {
    setModalImage(null)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.section-four-title span', { opacity: 0, y: 20 })
      gsap.set('.section-four-card', { opacity: 0, x: 100 })

      const title = sectionRef.current.querySelector('.section-four-title')
      const originalText = title.textContent
      title.textContent = ''

      const words = originalText.split(/(\s+)/).map((word) => {
        const span = document.createElement('span')
        span.textContent = word
        span.style.display = word.trim() === '' ? 'inline' : 'inline-block'
        span.style.opacity = word.trim() === '' ? '1' : '0'
        span.style.transform = word.trim() === '' ? 'none' : 'translateY(20px)'
        title.appendChild(span)
        return span
      })

      // Responsive trigger for GSAP
      const isMobile = window.innerWidth < 768
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: isMobile ? 'top 85%' : 'top center',
            scrub: 1,
            end: isMobile ? 'top 30%' : '50% 80%'
          }
        })
        .to(words, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.5,
          ease: 'power2.out'
        })
        .to(
          '.section-four-card',
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
          },
          '+=0.3'
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div id="characte" ref={sectionRef} className="py-[var(--pading-y)] overflow-x-hidden">
      <div>
        <h3 className="section-four-title text-(length:--text-subtitle) min-node:leading-20 text-[var(--color-three)]">
          Detalles que definen{' '}
          <span className="inline-block font-bold rounded-full text-[var(--color-one)]">
            la calidad
          </span>
          , elevando cada espacio en{' '}
          <span className="inline-block font-bold rounded-full text-(lenght:--color-one)">
            una experiencia superior
          </span>
        </h3>
      </div>

      <div className="flex flex-col min-d:flex-row items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] pt-[var(--pading-y)]">
        {cardsData.map(({ img, alt, title, description }, index) => (
          <CardArrow
            key={index}
            className="section-four-card w-full min-d:flex-1 overflow-hidden transition-all duration-300 min-d:hover:flex-[3] flex flex-col min-d:h-[650px] relative"
          >
            <img
              src={img}
              alt={alt}
              className="absolute inset-0 object-cover min-d:scale-105 min-d:group-hover:scale-125 min-d:transition-transform min-d:duration-100 min-d:ease-in-out w-full h-full z-0 cursor-pointer"
              style={{ pointerEvents: 'auto', objectPosition: 'center' }}
              onClick={() => openModal(img)}
            />
            <div className="min-d:hidden h-[45vh]"></div>
            <div className="opacity-100 min-d:opacity-0 min-d:group-hover:opacity-100 min-d:group-hover:delay-300 min-d:group-hover:transition-opacity min-d:group-hover:duration-100 min-d:transition-opacity min-d:duration-75 z-10 flex flex-col h-full justify-end gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] p-4">
              <div>
                <h3 className="text-white text-subtitleS min-lg:leading-14 leading-10">{title}</h3>
              </div>
              <div>
                <p className="text-white">{description}</p>
              </div>
              <div className="mt-4 hidden min-d:block">
                <button
                  onClick={() => openModal(img)}
                  className=" bg-opacity-20 hover:bg-opacity-40 text-white px-6 py-4 rounded-full text-sm font-medium transition-all duration-200 border border-white border-2 hover:border-[var(--color-one)] hover:bg-[var(--color-one)] cursor-pointer"
                >
                  Ver imagen completa
                </button>
              </div>
            </div>
          </CardArrow>
        ))}
      </div>

      {/* Modal para mostrar imagen ampliada - Solo desktop */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 min-d:flex items-center justify-center z-500 hidden transition-opacity duration-300 ease-in-out"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={closeModal}
        >
          <div className="relative w-[80vw] h-[80vh] flex items-center justify-center transform scale-95 transition-transform duration-300 ease-in-out hover:scale-100">
            <img
              src={modalImage}
              alt="Imagen ampliada"
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-white text-4xl bg-black bg-opacity-60 w-12 h-12 rounded-full flex items-center justify-center hover:bg-opacity-80 hover:scale-110 transition-all duration-200 ease-in-out"
              onClick={closeModal}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SectionFour
