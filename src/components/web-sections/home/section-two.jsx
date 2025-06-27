'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Card } from './components/card'

gsap.registerPlugin(ScrollTrigger)

export default function SectionTwo() {
  const sectionRef = useRef(null)

  useEffect(() => {
    // Pequeño delay para que el DOM esté completamente listo
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Inicializar las cards como ocultas
        gsap.set('.animated-card', {
          opacity: 0,
          y: 50
        })

        // Crear la animación SIN scrub para que duration y stagger funcionen
        gsap.to('.animated-card', {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
            markers: true,
            onToggle: (self) => {
              console.log('SectionTwo trigger:', self.isActive)
            }
          },
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.2
        })
      }, sectionRef)

      return () => ctx.revert()
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={sectionRef}
      className="flex flex-col min-d:flex-row items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)]"
      // Agregamos un ID único para mejor identificación
      id="section-two"
    >
      {/* Container de las 3 cards pequeñas */}
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
        <section className="basis-1/2">
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
