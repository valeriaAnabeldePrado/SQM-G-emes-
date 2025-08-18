import React, { useState, useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const ScrollApartmentOptimized = ({
  title = 'Explora tu futuro hogar',
  description = 'Descubre cada detalle de tu nuevo apartamento con nuestra experiencia inmersiva',
  totalFrames = 188
}) => {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  const [_, setCurrentFrame] = useState(1)
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Generar URLs de imágenes de forma más eficiente
  const imageUrls = useMemo(
    () =>
      Array.from(
        { length: totalFrames },
        (_, i) => `/secuencia/${(i + 1).toString().padStart(4, '0')}.webp`
      ),
    [totalFrames]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    const images = []
    let loadedCount = 0
    let currentFrameIndex = 0

    // Configurar canvas de alta resolución
    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'

      ctx.scale(dpr, dpr)

      // Configurar calidad de renderizado
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }

    // Función para dibujar imagen con mejor calidad
    const drawImage = (frameIndex) => {
      const img = images[frameIndex]
      if (!img || !img.complete) return

      const canvasRect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, canvasRect.width, canvasRect.height)

      // Calcular dimensiones manteniendo aspect ratio
      const imgAspect = img.width / img.height
      const canvasAspect = canvasRect.width / canvasRect.height

      let drawWidth, drawHeight, offsetX, offsetY

      if (imgAspect > canvasAspect) {
        drawHeight = canvasRect.height
        drawWidth = drawHeight * imgAspect
        offsetX = (canvasRect.width - drawWidth) / 2
        offsetY = 0
      } else {
        drawWidth = canvasRect.width
        drawHeight = drawWidth / imgAspect
        offsetX = 0
        offsetY = (canvasRect.height - drawHeight) / 2
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
    }

    // Cargar imágenes de forma progresiva
    const loadImages = () => {
      imageUrls.forEach((src, index) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'

        img.onload = () => {
          images[index] = img
          loadedCount++

          const progressPercent = Math.round((loadedCount / totalFrames) * 100)
          setLoadingProgress(progressPercent)

          // Mostrar primera imagen cuando esté lista
          if (index === 0) {
            setupCanvas()
            drawImage(0)
          }

          if (loadedCount === totalFrames) {
            setIsLoaded(true)
            // Configurar ScrollTrigger después de cargar
            setTimeout(setupScrollTrigger, 100)
          }
        }

        img.onerror = () => {
          console.warn(`Error loading: ${src}`)
          loadedCount++

          const progressPercent = Math.round((loadedCount / totalFrames) * 100)
          setLoadingProgress(progressPercent)

          if (loadedCount === totalFrames) {
            setIsLoaded(true)
            setTimeout(setupScrollTrigger, 100)
          }
        }

        img.src = src
      })
    }

    // Configurar ScrollTrigger con mejor suavidad
    const setupScrollTrigger = () => {
      gsap.registerPlugin(ScrollTrigger)

      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2,
        pin: false,
        anticipatePin: 1,
        onUpdate: (self) => {
          const rawProgress = self.progress
          const smoothProgress = gsap.utils.clamp(0, 1, rawProgress)

          // Calcular frame con interpolación más suave
          const exactFrame = smoothProgress * (totalFrames - 1)
          const frameIndex = Math.round(exactFrame) // Usar round en lugar de floor para menos saltos
          const clampedIndex = Math.min(Math.max(frameIndex, 0), totalFrames - 1)

          // Solo actualizar si realmente cambió
          if (clampedIndex !== currentFrameIndex) {
            currentFrameIndex = clampedIndex
            setCurrentFrame(clampedIndex + 1)
            setProgress(smoothProgress)
            drawImage(clampedIndex)
          }

          // Animaciones de desvanecimiento basadas en el progreso del scroll
          const fadeOutProgress = Math.min(smoothProgress * 8, 1) // Se desvanece en el primer 25% del scroll

          // Desvanecer texto principal
          gsap.to('.main-content', {
            opacity: Math.max(0, 1 - fadeOutProgress),
            y: -50 * fadeOutProgress,
            scale: 1 - fadeOutProgress * 0.1,
            duration: 0.1,
            ease: 'none'
          })

          // Desvanecer indicador de scroll
          gsap.to('.scroll-indicator', {
            opacity: Math.max(0, 1 - fadeOutProgress * 1.5),
            y: 30 * fadeOutProgress,
            duration: 0.1,
            ease: 'none'
          })

          // Desvanecer progress bar horizontal
          gsap.to('.horizontal-progress', {
            opacity: Math.max(0, 1 - fadeOutProgress * 1.2),
            y: 20 * fadeOutProgress,
            duration: 0.1,
            ease: 'none'
          })

          // La barra lateral permanece visible todo el tiempo
          gsap.to('.side-progress', {
            opacity: 1,
            duration: 0.1
          })
        },
        onRefresh: () => {
          setupCanvas()
          if (images[currentFrameIndex]) {
            drawImage(currentFrameIndex)
          }
        }
      })

      // Animar elementos de texto al inicio
      gsap.fromTo(
        '.scroll-text',
        {
          opacity: 0,
          y: 30,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.2
        }
      )
    }

    // Inicializar
    setupCanvas()
    loadImages()

    // Manejar resize
    const handleResize = () => {
      setupCanvas()
      if (images[currentFrameIndex]) {
        drawImage(currentFrameIndex)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [imageUrls, totalFrames])

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '500vh' }}>
      {/* Container fijo para el canvas */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-black">
        {/* Canvas para la secuencia */}
        <div className="absolute inset-0 w-full h-full">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{
              width: '100%',
              height: '100%',
              display: 'block'
            }}
          />

          {/* Overlay gradient más sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Loading indicator mejorado */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
              <p className="text-xl mb-4 font-medium">Cargando experiencia inmersiva</p>
              <div className="w-80 h-3 bg-white/20 rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-sm mt-3 opacity-70">{loadingProgress}% completado</p>
            </div>
          </div>
        )}

        {/* Contenido principal con mejor diseño */}
        {isLoaded && (
          <div className="main-content relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
            <h1 className="scroll-text text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="scroll-text text-xl md:text-2xl lg:text-3xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Indicador de scroll mejorado */}
        {isLoaded && (
          <div className="scroll-indicator absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/80 text-center z-10">
            <div className="scroll-text animate-bounce">
              <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center mb-4">
                <div className="w-1 h-4 bg-white/80 rounded-full mt-2 animate-pulse"></div>
              </div>
              <p className="text-sm uppercase tracking-wider font-medium">Desliza para explorar</p>
            </div>
          </div>
        )}

        {/* Progress bar lateral - permanece visible */}
        {isLoaded && (
          <div className="side-progress absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-4 z-10">
            <div className="w-1 h-40 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-purple-600 transition-all duration-200 ease-out rounded-full"
                style={{ height: `${progress * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/60 rotate-90 transform origin-center whitespace-nowrap mt-6 font-medium">
              {Math.round(progress * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScrollApartmentOptimized
