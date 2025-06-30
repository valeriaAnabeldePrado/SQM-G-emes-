import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './canvas.css'
import Button from './components/button'
import { RiBuilding2Line } from 'react-icons/ri'
import { FiBox } from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

const SectionBanner = () => {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const contentRef = useRef(null)
  const frameCount = 30
  const [images, setImages] = useState([])
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const scrollTriggerRef = useRef(null)
  const timelineRef = useRef(null)
  const currentFrame = useRef(0)

  // Cargar imágenes
  useEffect(() => {
    const loadImages = async () => {
      const imgArray = []
      const loadPromises = []

      for (let i = 1; i < frameCount; i++) {
        const img = new Image()
        const loadPromise = new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })

        img.src = `/src/assets/banner/${String(i).padStart(4, '0')}.png`
        imgArray.push(img)
        loadPromises.push(loadPromise)
      }

      try {
        await Promise.all(loadPromises)
        setImages(imgArray)
        setImagesLoaded(true)
      } catch (error) {
        console.error('Error loading images:', error)
      }
    }

    loadImages()
  }, [])

  // Función para renderizar el frame actual en el canvas
  const render = () => {
    if (!canvasRef.current || !images.length) return

    if (!imagesLoaded) return

    const canvas = canvasRef.current

    const context = canvas.getContext('2d')

    const img = images[Math.floor(currentFrame.current)]

    if (!img) return

    context.clearRect(0, 0, canvas.width, canvas.height)

    // Usar tamaño real del canvas (ajustado por DPR)

    const dpr = window.devicePixelRatio || 1

    const canvasHeight = canvas.height / dpr

    // Calcular dimensiones manteniendo aspect ratio, alineado a la izquierda

    const imgAspect = img.width / img.height

    const drawHeight = canvasHeight
    const drawWidth = drawHeight * imgAspect
    const drawX = -100 // Alineado a la izquierda
    const drawY = 0

    context.drawImage(img, drawX, drawY, drawWidth, drawHeight)
  }

  // Redimensionar el canvas para que coincida con el contenedor
  const resizeCanvas = () => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const container = containerRef.current
    const dpr = window.devicePixelRatio || 1

    const rect = container.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    const context = canvas.getContext('2d')
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.scale(dpr, dpr)

    if (imagesLoaded) {
      render()
    }
  }

  // Manejar el redimensionamiento de la ventana
  useEffect(() => {
    if (imagesLoaded) {
      resizeCanvas()
    }

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [imagesLoaded, images])

  // Función de easing personalizada
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  // Configurar ScrollTrigger con Timeline
  useEffect(() => {
    if (!imagesLoaded || !images.length || !contentRef.current) return

    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
    }
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    // Initialize content to be hidden and behind the canvas
    gsap.set(contentRef.current, {
      opacity: 0,
      filter: 'blur(10px)',
      scale: 0.95,
      visibility: 'hidden',
      zIndex: 0 // Behind the canvas (canvas is zIndex: 1)
    })

    // Render the first frame initially
    render()

    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        // Incrementamos el end para incluir más scroll después de las animaciones
        end: `+=${frameCount * 100 + 400 + 800}`, // Agregamos 800px más de scroll
        scrub: 1.2,
        pin: true,
        markers: false,
        onUpdate: (self) => {
          // Ajustamos los porcentajes para que las animaciones terminen antes
          const imageAnimEndProgress = 0.5 // Las imágenes terminan al 50%
          const contentAnimEndProgress = 0.7 // El contenido termina al 70%
          // Del 70% al 100% es el buffer de scroll adicional

          if (self.progress <= imageAnimEndProgress) {
            const frameProgress = self.progress / imageAnimEndProgress
            const easedProgress = easeInOutCubic(frameProgress)
            const targetFrame = easedProgress * (frameCount - 1)

            gsap.to(currentFrame, {
              current: targetFrame,
              duration: 0.3,
              ease: 'power2.out',
              onUpdate: render
            })

            // Keep content hidden and behind during image animation
            gsap.set(contentRef.current, {
              opacity: 0,
              filter: 'blur(10px)',
              scale: 0.95,
              visibility: 'hidden',
              zIndex: 10 // Ensure it's behind the canvas
            })
          } else if (self.progress <= contentAnimEndProgress) {
            // Animación del contenido
            const contentStartProgress = imageAnimEndProgress
            let contentProgress =
              (self.progress - contentStartProgress) /
              (contentAnimEndProgress - contentStartProgress)
            contentProgress = Math.min(1, Math.max(0, contentProgress))

            gsap.set(contentRef.current, { visibility: 'visible' })

            gsap.to(contentRef.current, {
              opacity: contentProgress,
              filter: `blur(${10 - 10 * contentProgress}px)`,
              scale: 0.95 + 0.05 * contentProgress, // Scale from 0.95 to 1
              duration: 0.1,
              ease: 'power2.out'
            })
          } else {
            // Buffer zone - mantener todo como está, solo permitir scroll
            // El contenido ya está completamente visible
            gsap.set(contentRef.current, {
              opacity: 1,
              filter: 'blur(0px)',
              scale: 1,
              visibility: 'visible'
            })
          }
        },
        onLeave: () => {
          ScrollTrigger.refresh()
        }
      }
    })

    scrollTriggerRef.current = timelineRef.current.scrollTrigger

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [imagesLoaded, images, frameCount])

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        className="overflow-hidden relative flex mt-24"
        style={{ width: '100%', height: '100vh' }}
      >
        <canvas
          ref={canvasRef}
          className="min-d: block"
          style={{
            display: 'block',
            zIndex: 1,
            position: 'absolute',
            top: 0,
            left: 0,
            background: 'transparent'
          }}
        />

        <div
          ref={contentRef}
          className="inset-0 flex items-center justify-end w-full "
          style={{
            pointerEvents: 'auto'
          }}
        >
          <div className="w-[300px] min-d:w-[530px] min-bannerT:w-[720px]  min-d:mt-24 min-note:mt-38  relative overflow-hidden ">
            <div className="relative z-10 text-[var(--color-three)] flex flex-col min-d:justify-end min-d:items-end min-bannerT:justify-start min-bannerT:items-start">
              <h1 className="text-(length:--text-title-huge) font-bold  leading-none ">SQM</h1>
              <h1 className="text-(length:--text-title-huge) font-bold  leading-none ">GÜEMES</h1>
              <p className=" text-gray-700 mb-8 mt-5 max-w-[80%] text-body min-d:justify-end min-d:text-end min-bannerT:text-start">
                Un proyecto que combina diseño contemporáneo, calidad constructiva y ubicación
                estratégica
              </p>
              {/* Botones */}
              <div className="space-y-4 self-end">
                <Button className={'w-90 justify-between'} icon={<FiBox size={23} />}>
                  {' '}
                  Ver departamento
                </Button>
                <Button className={'w-90 justify-between'} icon={<RiBuilding2Line size={23} />}>
                  VIsta general del edificio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SectionBanner
