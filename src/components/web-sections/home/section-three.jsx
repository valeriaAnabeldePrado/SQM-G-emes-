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
            scrub: 1,
            markers: false
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
          className="text-(length:--text-subtitle) text-[var(--color-three)] pb-16 min-note:leading-20"
        >
          Una zona de continua continua{' '}
          <span className="inline-block font-bold rounded-full text-(lenght:--color-one)">
            renovación urbana
          </span>
          , próxima a Ciudad Universitaria y Plaza España, redeado de bares, restaurantes y vida
          cultural.
        </h3>
        <div ref={buttonRef} className="opacity-0">
          <Button icon={<MdArrowOutward size={25} />}>Ver en mapas</Button>
        </div>
      </div>
      <div className="flex-1 bg-gray-300">
        <h1>LOGO</h1>
      </div>
    </div>
  )
}
