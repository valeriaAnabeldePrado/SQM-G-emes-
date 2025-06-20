import React, { useState, useEffect } from 'react'

const ScrollImageSequence = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Simular una secuencia de imágenes (reemplaza con tus URLs reales)
  const images = [
    'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Frame+1',
    'https://via.placeholder.com/600x400/4ECDC4/FFFFFF?text=Frame+2',
    'https://via.placeholder.com/600x400/45B7D1/FFFFFF?text=Frame+3',
    'https://via.placeholder.com/600x400/96CEB4/FFFFFF?text=Frame+4',
    'https://via.placeholder.com/600x400/FFEAA7/FFFFFF?text=Frame+5',
    'https://via.placeholder.com/600x400/DDA0DD/FFFFFF?text=Frame+6',
    'https://via.placeholder.com/600x400/98D8C8/FFFFFF?text=Frame+7',
    'https://via.placeholder.com/600x400/F7DC6F/FFFFFF?text=Frame+8',
    'https://via.placeholder.com/600x400/BB8FCE/FFFFFF?text=Frame+9',
    'https://via.placeholder.com/600x400/85C1E9/FFFFFF?text=Frame+10'
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Altura total disponible para scroll (excluyendo la altura de la ventana)
      const totalHeight = window.innerHeight * 4 // 4 veces la altura de la ventana

      // Calcular el progreso del scroll (0 a 1)
      const scrollProgress = Math.min(scrollTop / totalHeight, 1)

      // Mapear el progreso a un índice de imagen
      const imageIndex = Math.floor(scrollProgress * (images.length - 1))

      setCurrentImageIndex(Math.max(0, Math.min(imageIndex, images.length - 1)))
    }

    // Escuchar el evento de scroll con throttling para mejor performance
    let ticking = false
    const optimizedHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', optimizedHandleScroll)

    // Llamar una vez para establecer la imagen inicial
    handleScroll()

    return () => {
      window.removeEventListener('scroll', optimizedHandleScroll)
    }
  }, [images.length])

  return (
    <div className="scroll-sequence-container">
      {/* Sección fija con la imagen */}
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="relative w-full max-w-4xl mx-auto px-4">
          <img
            src={images[currentImageIndex]}
            alt={`Frame ${currentImageIndex + 1}`}
            className="w-full h-auto max-h-screen object-contain transition-opacity duration-100"
          />

          {/* Indicador de progreso */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-white bg-opacity-20 rounded-full px-4 py-2 backdrop-blur-sm">
              <span className="text-white text-sm font-medium">
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido scrolleable invisible para crear altura */}
      <div className="relative z-10 pointer-events-none">
        {/* Spacer para crear altura de scroll */}
        <div style={{ height: '400vh' }}></div>
      </div>

      {/* Contenido adicional después de la secuencia */}
      <div className="relative z-10 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Contenido después de la secuencia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Característica 1</h3>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Característica 2</h3>
              <p className="text-gray-600">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScrollImageSequence
