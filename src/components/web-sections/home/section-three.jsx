import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { MdArrowOutward } from 'react-icons/md'
import Button from './components/button'

gsap.registerPlugin(ScrollTrigger)

export default function SectionThree() {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const buttonRef = useRef(null)

  const handleOpenMaps = () => {
    window.open('https://maps.app.goo.gl/JfvX3Am17h85QaoS7', '_blank', 'noopener,noreferrer')
  }

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
      const textEl = textRef.current
      wrapWords(textEl)

      const spans = textEl.querySelectorAll('span')

      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 80%',
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
        .fromTo(
          buttonRef.current,
          { y: -50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out'
          }
        )
    },
    { scope: containerRef, revertOnUpdate: true }
  )

  return (
    <div ref={containerRef} className="py-[var(--pading-y)] flex flex-col min-d:flex-row gap-10">
      <div className="flex-1/3">
        <h3
          ref={textRef}
          className="text-subtitle font-bold- text-[var(--color-three)] pb-8 min-lg:pb-16 "
        >
          Una zona de continua{' '}
          <span className="inline-block font-bold rounded-full text-(lenght:--color-one)">
            renovación urbana
          </span>
          , próximo a Ciudad Universitaria y Plaza España: a 5 minutos de Patio Olmos, a 5 minutos
          del campus UNC y de Parque Sarmiento. Rodeado de bares, restaurantes y vida cultural.
        </h3>
        <div ref={buttonRef} className="opacity-0">
          <Button icon={<MdArrowOutward size={25} />} onClick={handleOpenMaps}>
            Ver en mapas
          </Button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <img src="/vivra-logo.png" alt="VIVRA Logo" className=" object-contain h-24 " />
      </div>
    </div>
  )
}
