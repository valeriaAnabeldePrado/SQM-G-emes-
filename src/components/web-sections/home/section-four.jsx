import React, { useRef, useEffect } from 'react'
import { CardArrow } from './components/card-arrow'
import bano from '/src/assets/characteristics/bano.png'
import pisos from '/src/assets/characteristics/pisos.png'
import balcony from '/src/assets/characteristics/balcony.png'
import details from '/src/assets/characteristics/details.png'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const cardsData = [
  {
    img: details,
    alt: 'details',
    title: 'Eficiencia térmica inteligente',
    description:
      ' Cerramientos exteriores con muro doble que mejoran el aislamiento térmico: ladrillo Corblock "Ceniza" al exterior y tabique cerámico interior con terminación en yeso proyectado.'
  },
  {
    img: pisos,
    alt: 'pisos',
    title: 'Pisos vinílicos flotantes',
    description:
      'En interiores de departamentos y oficinas, piso vinílico flotante tono roble arenado, que aporta calidez, confort y una estética moderna y acogedora.'
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
      'Balcones terminados en hormigón visto con placas laminadas para un acabado elegante.'
  }
]

gsap.registerPlugin(ScrollTrigger)

const SectionFour = () => {
  const sectionRef = useRef(null)

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

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            scrub: 1,
            end: '50% 80%',
            markers: true
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
    <div id="characte" ref={sectionRef} className="py-[var(--pading-y)]">
      <div>
        <h3 className="section-four-title text-(length:--text-subtitle) min-node:leading-20 text-[var(--color-three)]">
          Detalles que definen{' '}
          <span className="inline-block font-bold rounded-full text-(lenght:--color-one)">
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
            className="section-four-card flex-1 min-w-0 overflow-hidden transition-all duration-300 min-d:hover:flex-[3] flex flex-col min-d:h-[650px] relative"
          >
            <img
              src={img}
              alt={alt}
              className="absolute inset-0 object-cover min-d:scale-105 min-d:group-hover:scale-125 min-d:transition-transform min-d:duration-100 min-d:ease-in-out w-full h-full z-0"
              style={{ pointerEvents: 'none', objectPosition: 'center' }}
            />
            <div className="min-d:hidden h-[45vh]"></div>
            <div className="opacity-100 min-d:opacity-0 min-d:group-hover:opacity-100 min-d:group-hover:delay-300 min-d:group-hover:transition-opacity min-d:group-hover:duration-100 min-d:transition-opacity min-d:duration-75 z-10 flex flex-col h-full justify-end gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] p-4">
              <div>
                <h3 className="text-white text-subtitleS">{title}</h3>
              </div>
              <div>
                <p className="text-white">{description}</p>
              </div>
            </div>
          </CardArrow>
        ))}
      </div>
    </div>
  )
}

export default SectionFour
