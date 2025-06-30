import React, { useRef } from 'react'
import { CardArrow } from './components/card-arrow'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

const cardsData = [
  {
    img: '/characteristics/details.png',
    alt: 'details',
    title: 'Eficiencia térmica inteligente',
    description:
      ' Cerramientos exteriores con muro doble que mejoran el aislamiento térmico: ladrillo Corblock "Ceniza" al exterior y tabique cerámico interior con terminación en yeso proyectado.'
  },
  {
    img: '/characteristics/pisos.png',
    alt: 'pisos',
    title: 'Pisos vinílicos flotantes',
    description:
      'En interiores de departamentos y oficinas, piso vinílico flotante tono roble arenado, que aporta calidez, confort y una estética moderna y acogedora.'
  },
  {
    img: '/characteristics/bano.png',
    alt: 'bano',
    title: 'Baños listos para usar',
    description:
      'Baños totalmente equipados con vanitory, griferías de cierre cerámico y platos de ducha modernos.'
  },
  {
    img: '/characteristics/balcony.png',
    alt: 'balcony',
    title: 'Detalles que generan valor',
    description:
      'Balcones terminados en hormigón visto con placas laminadas para un acabado elegante.'
  }
]

gsap.registerPlugin(ScrollTrigger)

const SectionFour = () => {
  const sectionRef = useRef(null)

  const wrapWords = (element) => {
    const originalText = element.textContent
    element.textContent = ''

    const words = originalText.split(/(\s+)/).map((word) => {
      const span = document.createElement('span')
      span.textContent = word
      span.style.display = word.trim() === '' ? 'inline' : 'inline-block'
      span.style.opacity = word.trim() === '' ? '1' : '0'
      span.style.transform = word.trim() === '' ? 'none' : 'translateY(20px)'
      element.appendChild(span)
      return span
    })

    return words
  }

  useGSAP(
    () => {
      const title = sectionRef.current.querySelector('.section-four-title')
      const cards = sectionRef.current.querySelectorAll('.section-four-card')
      const words = wrapWords(title)

      console.log('Section Four - Words found:', words.length)
      console.log('Section Four - Cards found:', cards.length)

      // Create matchMedia instance
      let mm = gsap.matchMedia()

      // Desktop
      mm.add('(min-width: 1024px)', () => {
        gsap.set(cards, { opacity: 0, x: 100 })

        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'center center',
              scrub: 1,
              markers: false,
              id: 'section-four-desktop',
              refreshPriority: -1,
              onToggle: (self) => {
                console.log('Section Four Desktop trigger toggle:', self.isActive)
              }
            }
          })
          .to(words, {
            opacity: 1,
            y: 0,
            stagger: 0.01,
            duration: 0.5,
            ease: 'power2.out'
          })
          .to(
            cards,
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power3.out'
            },
            '-=0.3'
          )

        return () => {
          // Cleanup específico para desktop si es necesario
        }
      })

      // Mobile/Tablet
      mm.add('(max-width: 1023px)', () => {
        gsap.set(cards, {
          opacity: 0,
          y: 60,
          scale: 0.85,
          rotationX: 15,
          transformOrigin: 'center bottom'
        })

        // Estado inicial para las imágenes en mobile
        cards.forEach((card) => {
          const img = card.querySelector('img')
          if (img) {
            gsap.set(img, {
              scale: 1.2,
              filter: 'blur(3px)'
            })
          }
        })

        // Timeline principal para el título
        gsap
          .timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: '2% center',
              end: '7% center',
              scrub: 1,
              markers: true,
              id: 'section-four-mobile-title',
              refreshPriority: -1,
              onToggle: (self) => {
                console.log('Section Four Mobile Title trigger toggle:', self.isActive)
              }
            }
          })
          .to(words, {
            opacity: 1,
            y: 0,
            stagger: 0.01,
            duration: 0.5,
            ease: 'power2.out'
          })

        // Timeline progresivo para cada card individual
        cards.forEach((card, index) => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: card,
                start: 'top 60%',
                end: 'top 80%',
                scrub: 1.5,
                markers: false,
                id: `section-four-mobile-card-${index}`,
                refreshPriority: -1,
                onToggle: (self) => {
                  console.log(`Section Four Mobile Card ${index} trigger toggle:`, self.isActive)
                }
              }
            })
            .fromTo(
              card,
              {
                opacity: 0,
                y: 60,
                scale: 0.85,
                rotationX: 15,
                transformOrigin: 'center bottom'
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotationX: 0,
                duration: 1,
                ease: 'bounce'
              }
            )
            .fromTo(
              card.querySelector('img'),
              {
                scale: 1.2,
                filter: 'blur(3px)'
              },
              {
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.8,
                ease: 'bounce'
              },
              '-=0.7'
            )
        })

        return () => {
          // Cleanup específico para mobile si es necesario
        }
      })

      // Cleanup function que se ejecuta cuando el componente se desmonta
      return () => {
        mm.revert()
      }
    },
    { scope: sectionRef, revertOnUpdate: true }
  )

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
