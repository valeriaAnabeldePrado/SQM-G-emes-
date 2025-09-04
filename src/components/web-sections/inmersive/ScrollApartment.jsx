import React, { useState, useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Import logos
import empraconsLogo from '../../../assets/logos/empra.png'
import lzLogo from '../../../assets/logos/lz.png'
import juarezLogo from '../../../assets/logos/juarez.png'
import scLogo from '../../../assets/logo/sc.png'

const ScrollApartment = ({
  title = 'Explora tu futuro hogar',
  description = 'Descubre cada detalle de tu nuevo apartamento con nuestra experiencia inmersiva',
  totalFrames = 168,
  // number of frames in the lighter mobile sequence (folder: /secuencia-m)
  mobileFrames = 168
}) => {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  const [_, setCurrentFrame] = useState(1)
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Generar URLs de imágenes de forma más eficiente.
  // En móviles usamos la secuencia más liviana en /secuencia-m
  const imageUrls = useMemo(() => {
    const isClient = typeof window !== 'undefined'
    const isMobile =
      isClient && (window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent))
    const effectiveTotal = isMobile ? mobileFrames : totalFrames
    const base = isMobile ? '/secuencia-m/' : '/secuencia/'
    return Array.from(
      { length: effectiveTotal },
      (_, i) => `${base}${(i + 1).toString().padStart(4, '0')}.webp`
    )
  }, [totalFrames, mobileFrames])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    const images = []
    let currentFrameIndex = 0

    // Configurar canvas de alta resolución
    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const rawDpr = window.devicePixelRatio || 1
      const isMobile = window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent)
      // Cap DPR on mobile to reduce upscaling and memory usage
      const dpr = isMobile ? Math.min(rawDpr, 1.25) : Math.min(rawDpr, 2)

      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'

      // Use setTransform to avoid accumulating scale on repeated calls
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Configurar calidad de renderizado
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
    }

    // Función para dibujar imagen con mejor calidad y ajuste contain
    let rafId = null
    const drawImage = (frameIndex) => {
      const img = images[frameIndex]
      if (!img || !img.complete) return

      const canvasRect = canvas.getBoundingClientRect()
      // clear using CSS pixel dimensions (transform handles DPR)
      ctx.clearRect(0, 0, canvasRect.width, canvasRect.height)

      // Calcular dimensiones usando contain (sin zoom/crop)
      const imgAspect = img.width / img.height
      const canvasAspect = canvasRect.width / canvasRect.height

      let drawWidth, drawHeight, offsetX, offsetY

      // Usar contain en lugar de cover - la imagen completa siempre es visible
      if (imgAspect > canvasAspect) {
        drawWidth = canvasRect.width
        drawHeight = drawWidth / imgAspect
        offsetX = 0
        offsetY = (canvasRect.height - drawHeight) / 2
      } else {
        drawHeight = canvasRect.height
        drawWidth = drawHeight * imgAspect
        offsetX = (canvasRect.width - drawWidth) / 2
        offsetY = 0
      }

      ctx.drawImage(img, 0, 0, img.width, img.height, offsetX, offsetY, drawWidth, drawHeight)
    }

    // requestAnimationFrame wrapper to avoid redundant draws
    const render = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        drawImage(currentFrameIndex)
        rafId = null
      })
    }

    // Cargar imágenes de forma progresiva con mejor manejo de errores
    const loadImages = () => {
      let actualLoadedCount = 0
      let totalAttempted = 0

      // Timeout de seguridad - si tarda más de 30 segundos, forzar carga
      const safetyTimeout = setTimeout(() => {
        console.warn('Safety timeout reached, forcing load completion')
        setIsLoaded(true)
        setTimeout(setupScrollTrigger, 100)
      }, 30000)

      imageUrls.forEach((src, index) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'

        img.onload = () => {
          images[index] = img
          actualLoadedCount++
          totalAttempted++

          const progressPercent = Math.min(99, Math.round((totalAttempted / totalFrames) * 100))
          setLoadingProgress(progressPercent)

          // Mostrar primera imagen cuando esté lista
          if (index === 0) {
            setupCanvas()
            render()
          }

          // Considerar "cargado" cuando tenemos al menos 90% de las imágenes
          // O cuando hemos intentado cargar todas
          if (
            actualLoadedCount >= Math.floor(totalFrames * 0.9) ||
            totalAttempted === totalFrames
          ) {
            clearTimeout(safetyTimeout)
            setLoadingProgress(100)
            setIsLoaded(true)
            // Configurar ScrollTrigger después de cargar
            setTimeout(setupScrollTrigger, 100)
          }
        }

        img.onerror = () => {
          console.warn(`Error loading: ${src}`)
          totalAttempted++

          const progressPercent = Math.min(99, Math.round((totalAttempted / totalFrames) * 100))
          setLoadingProgress(progressPercent)

          // Si hemos intentado cargar todas, proceder
          if (totalAttempted === totalFrames) {
            clearTimeout(safetyTimeout)
            setLoadingProgress(100)
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

      // quickSetters para updates de alta frecuencia (más eficientes que crear tweens constantemente)
      const setMainOpacity = gsap.quickSetter('.main-content', 'opacity')
      const setMainY = gsap.quickSetter('.main-content', 'y', 'px')
      // Avoid quickSetter for 'scale' which may try to set SVG attributes like 'scaleX,scaleY'
      // We'll set scale via gsap.set(...) when needed.

      const setMainTopOpacity = gsap.quickSetter('.main-content-top', 'opacity')
      const setMainTopY = gsap.quickSetter('.main-content-top', 'y', 'px')
      const setMainBottomOpacity = gsap.quickSetter('.main-content-bottom', 'opacity')
      const setMainBottomY = gsap.quickSetter('.main-content-bottom', 'y', 'px')

      const setIndicatorOpacity = gsap.quickSetter('.scroll-indicator', 'opacity')
      const setIndicatorY = gsap.quickSetter('.scroll-indicator', 'y', 'px')

      const setBarOpacity = gsap.quickSetter('.horizontal-progress', 'opacity')
      const setBarY = gsap.quickSetter('.horizontal-progress', 'y', 'px')

      // QuickSetters para los logos (no necesarios aquí porque animamos con gsap.to dinámicamente)

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

          // Calcular frame con mejor manejo de límites
          const exactFrame = smoothProgress * (totalFrames - 1)
          const frameIndex = Math.round(exactFrame)
          const clampedIndex = Math.min(Math.max(frameIndex, 0), totalFrames - 1)

          // Solo actualizar si realmente cambió y la imagen existe
          if (clampedIndex !== currentFrameIndex && images[clampedIndex]) {
            currentFrameIndex = clampedIndex
            setCurrentFrame(clampedIndex + 1)
            setProgress(smoothProgress)
            render()
          } else if (clampedIndex !== currentFrameIndex) {
            // Si la imagen no existe, buscar la más cercana que sí exista
            let fallbackIndex = clampedIndex
            for (let i = 0; i < 5; i++) {
              if (images[fallbackIndex - i] && fallbackIndex - i >= 0) {
                fallbackIndex = fallbackIndex - i
                break
              }
              if (images[fallbackIndex + i] && fallbackIndex + i < totalFrames) {
                fallbackIndex = fallbackIndex + i
                break
              }
            }
            if (images[fallbackIndex] && fallbackIndex !== currentFrameIndex) {
              currentFrameIndex = fallbackIndex
              setCurrentFrame(fallbackIndex + 1)
              setProgress(smoothProgress)
              render()
            }
          }

          // Animaciones de desvanecimiento basadas en el progreso del scroll
          const fadeOutProgress = Math.min(smoothProgress * 8, 1) // Se desvanece en el primer 25% del scroll

          // Usar quickSetters (muy eficientes) para updates de alta frecuencia
          // Desktop content
          setMainOpacity(Math.max(0, 1 - fadeOutProgress))
          setMainY(-50 * fadeOutProgress)
          // Apply scale safely using gsap.set to avoid attribute name issues on certain elements
          gsap.set('.main-content', { scale: 1 - fadeOutProgress * 0.1 })

          // Mobile content
          setMainTopOpacity(Math.max(0, 1 - fadeOutProgress))
          setMainTopY(-30 * fadeOutProgress)
          setMainBottomOpacity(Math.max(0, 1 - fadeOutProgress))
          setMainBottomY(30 * fadeOutProgress)

          setIndicatorOpacity(Math.max(0, 1 - fadeOutProgress * 1.5))
          setIndicatorY(30 * fadeOutProgress)

          setBarOpacity(Math.max(0, 1 - fadeOutProgress * 1.2))
          setBarY(20 * fadeOutProgress)

          // La barra lateral permanece visible todo el tiempo
          gsap.set('.side-progress', { opacity: 1 })

          // Reveal de logos al final: aparece cerca del final
          const revealStart = 0.96
          const revealEnd = 1.0
          const revealProgress = gsap.utils.clamp(
            0,
            1,
            (smoothProgress - revealStart) / (revealEnd - revealStart)
          )

          // target Y for logo lift
          const targetY = -window.innerHeight * 0.18

          // If we're at the very end of the scroll, force full reveal immediately
          if (smoothProgress >= 0.999) {
            gsap.to('.logos-grid', {
              opacity: 1,
              y: targetY,
              duration: 0.12,
              overwrite: true,
              ease: 'power1.out'
            })
            gsap.to('.credit', {
              opacity: 0.9,
              y: targetY + 8,
              duration: 0.12,
              overwrite: true,
              ease: 'power1.out'
            })
          } else {
            // Progressive reveal while scrolling into the final segment
            gsap.to('.logos-grid', {
              opacity: revealProgress,
              y: targetY * revealProgress,
              duration: 0.12,
              overwrite: true,
              ease: 'power1.out'
            })
            gsap.to('.credit', {
              opacity: revealProgress * 0.8,
              y: targetY * revealProgress + 50,
              duration: 0.12,
              overwrite: true,
              ease: 'power1.out'
            })
          }
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

      // Asegurar que los logos empiecen ocultos
      gsap.set('.logos-grid', { opacity: 0 })
      gsap.set('.credit', { opacity: 0 })
    }

    // Inicializar
    setupCanvas()
    loadImages()

    // Manejar resize (debounced via rAF)
    let resizeRaf = null
    const handleResize = () => {
      if (resizeRaf !== null) return
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null
        setupCanvas()
        if (images[currentFrameIndex]) {
          render()
        }
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (rafId) cancelAnimationFrame(rafId)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [imageUrls, totalFrames])

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '900vh' }}>
      {/* Container fijo para el canvas */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
        {/* Canvas para la secuencia */}
        <div className="absolute inset-0 w-full h-full">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              filter: 'brightness(1.15) contrast(1.05)'
            }}
          />

          {/* Overlay gradient más sutil */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
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

        {/* Contenido principal responsive para móvil */}
        {isLoaded && (
          <>
            {/* Título arriba en móvil (bajado ~25vh) */}

            {/* Contenido principal centrado para desktop */}
            <div className="main-content relative z-10 text-center text-white px-6 max-w-5xl mx-auto hidden md:block">
              <h1 className="scroll-text  text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                {title}
              </h1>
              <p
                className="scroll-text text-xl md:text-2xl lg:text-3xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed"
                style={{ transform: 'translateY(-2.5vh)' }}
              >
                {description}
              </p>
            </div>
          </>
        )}

        {/* Indicador de scroll mejorado - centrado (más pequeño en móviles) */}
        {isLoaded && (
          <div className="scroll-indicator  absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/80 text-center z-10">
            <div className="scroll-text animate-bounce flex flex-col items-center">
              <div className="w-6 h-10 md:w-8 md:h-12 border-2 border-white/60 rounded-full flex justify-center items-center mb-4">
                <div className="w-1 h-3 md:h-4 bg-white/80 rounded-full animate-pulse"></div>
              </div>
              <p className="text-xs md:text-sm uppercase tracking-wider font-medium">
                Desliza para explorar
              </p>
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
        {/* Logos aparecen solo al final - partners más arriba, SmartCloud en el bottom */}
        {isLoaded && (
          <>
            {/* Partner logos: on mobile show near the top, on md+ keep them above SmartCloud near the bottom */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-20 pointer-events-none top-44 md:bottom-24 md:top-auto">
              <div className="flex flex-col items-center space-y-4">
                <div className="logos-grid flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-6 mb-2">
                  <div className="w-full md:w-auto flex justify-center">
                    <div className="rounded-md bg-white/30 md:bg-transparent p-2 md:p-0 flex items-center">
                      <img
                        src={empraconsLogo}
                        alt="Empracons"
                        className="h-8 md:h-10 object-contain"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex justify-center">
                    <div className="rounded-md bg-white/30 md:bg-transparent p-2 md:p-0 flex items-center">
                      <img src={lzLogo} alt="LZ" className="h-8 md:h-10 object-contain" />
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex justify-center">
                    <div className="rounded-md bg-white/30 md:bg-transparent p-2 md:p-0 flex items-center">
                      <img src={juarezLogo} alt="Juarez" className="h-8 md:h-10 object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SmartCloud credit stays at the original bottom position */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
              <div className="flex flex-col items-center space-y-4">
                <div className="credit flex flex-col md:flex-row items-center gap-2">
                  <div className="rounded-md bg-black/30 md:bg-transparent p-2 md:p-0 flex items-center">
                    <img
                      src={scLogo}
                      alt="SmartCloud"
                      className="h-6 object-contain"
                      onLoad={() => console.log('SC logo loaded successfully')}
                      onError={(e) => console.log('Error loading SC logo:', e)}
                    />
                  </div>
                  <span className="text-white text-xs font-medium drop-shadow">
                    Hecho por SmartCloud Studio
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ScrollApartment
