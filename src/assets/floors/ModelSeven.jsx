import React, { useState } from 'react'
import './models.css'

const ModelSeven = ({ onEventApartment, selectedApartment }) => {
  // Para el asador/piso 14, usar piso 14
  const floorNumber = '14'

  // Estado para el hover en la imagen
  const [hoveredApartment, setHoveredApartment] = useState(null)

  // Generar IDs dinámicos basados en el piso - solo tiene quincho
  const apartmentIds = {
    A: `quincho_A_P${parseInt(floorNumber)}`
  }

  // Función para determinar si un apartamento está activo (seleccionado o hover)
  const isApartmentActive = (apartmentId) => {
    return selectedApartment === apartmentId || hoveredApartment === apartmentId
  }

  // Manejadores de hover para las áreas de la imagen
  const handleHover = (apartmentId) => {
    setHoveredApartment(apartmentId)
  }

  const handleHoverLeave = () => {
    setHoveredApartment(null)
  }

  // Manejador de click
  const handleClick = (apartmentId, e) => {
    e.stopPropagation()
    onEventApartment(apartmentId)
  }

  console.log('ModelSeven - apartmentIds:', apartmentIds)

  return (
    <div
      className="floor-plan-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px'
      }}
    >
      {/* PNG principal como fondo */}
      <img
        src="/planos/14/planta.png"
        alt="Planta del piso"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          zIndex: 1
        }}
        onError={(e) => {
          e.target.style.display = 'none'
        }}
      />

      {/* SVG superpuesto para selecciones precisas */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}
      >
        <svg
          id="PlantaSeven"
          data-name="Capa 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 218.45 238.14"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <style>{`
              .apartment-text {
                font-family: Arial, sans-serif;
                font-size: 16px;
                font-weight: bold;
              }
            `}</style>
          </defs>
          <g id="Capa_1-2" data-name="Capa 1">
            {/* Quincho/Asador - área completa */}
            <g
              id={apartmentIds.A}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.A, e)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.A) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.A) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                width="218.45"
                height="238.14"
                onMouseEnter={() => handleHover(apartmentIds.A)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.A) && (
                <g>
                  <circle cx="109" cy="119" r="30" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text
                    x="109"
                    y="127"
                    textAnchor="middle"
                    className="apartment-text"
                    fill="#483b2b"
                    fontSize="18"
                  >
                    QUINCHO
                  </text>
                </g>
              )}
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ModelSeven
