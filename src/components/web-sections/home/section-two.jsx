'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Card } from './components/card'

gsap.registerPlugin(ScrollTrigger)

export default function SectionTwo() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const cards = sectionRef.current.querySelectorAll('.animated-card')
      console.log('Section Two - Cards found:', cards.length)

      gsap.set(cards, {
        opacity: 0,
        y: 50
      })

      // Pequeño delay para asegurar que el DOM esté completamente renderizado
      gsap.delayedCall(0.1, () => {
        gsap.to(cards, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom', // Empieza cuando la sección toca el fondo del viewport
            end: 'bottom 60%',
            scrub: 2,
            toggleActions: 'play none none reverse',
            id: 'section-two',
            refreshPriority: -1, // Prioridad baja para que se actualice después del banner
            onToggle: (self) => {
              console.log('Section Two trigger toggle:', self.isActive)
            }
          },
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.2
        })

        // Forzar refresh después de crear el trigger
        ScrollTrigger.refresh()
      })
    },
    { scope: sectionRef, revertOnUpdate: true }
  )

  return (
    <div
      ref={sectionRef}
      className="flex flex-col min-d:flex-row items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)]"
      id="section-two"
    >
      <div className="w-full flex gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] flex-col basis-1/2">
        <section className="flex md:flex-row gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] sm:flex-row basis-1/2">
          <Card className="animated-card flex-1 flex-col" hasGradient>
            <h2 className="text-(length:--text-title-huge) font-[var(--font-weight-bold)] leading-none text-[var(--color-one)]">
              46
            </h2>
            <div className="min-d:items-start text-[var(--color-three)] text-body w-full items-center justify-center align-middle flex flex-col">
              <p>Unidades</p>
              <p>Disponibles</p>
            </div>
          </Card>
          <Card
            className="animated-card flex-1 font-[var(--font-weight-bold)] flex-col w-full min-d:items-start"
            hasGradient
          >
            <div className="flex-1/2 items-center justify-center align-middle flex"></div>
            <div className="text-[var(--color-three)] text-body">
              <p>Bloque</p>
              <p>Coorporativo</p>
              <p>Comercial</p>
            </div>
          </Card>
        </section>
        <section id="location" className="basis-1/2">
          <Card className="animated-card w-full bg-[var(--color-two)] flex-col">
            <div className="flex-1/2"></div>
            <div className="text-[var(--color-three)] pt-16">
              <p>Ubicado en</p>
              <h2 className="font-[var(--font-weight-bold)] text-(length:--text-menu)">
                Av. Pueyrredón 387
              </h2>
            </div>
          </Card>
        </section>
      </div>

      {/* Card principal grande */}
      <div className="basis-1/2">
        <Card
          className="animated-card cardita w-full min-d:flex-1 bg-red-500 flex-col h-full"
          hasGradient
        >
          <div className="flex-1"></div>
          <div>
            <p className="text-body text-[var(--color-three)]">
              En SQM Güemes, convergen estilo, funcionalidad y ubicación. Un proyecto moderno que
              redefine la forma de habitar y trabajar, integrando un bloque residencial con unidades
              de 1 y 2 dormitorios, microviviendas y dúplex, más un bloque corporativo ideal para
              oficinas y locales comerciales.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
