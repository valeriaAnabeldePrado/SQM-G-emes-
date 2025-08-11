import React, { useState } from 'react'
import './models.css'

const ModelSix = ({ onEventApartment, selectedApartment }) => {
  // Extraer el número de piso del selectedFloor (p14, etc)
  const floorNumber = '13'

  // Estado para el hover en la imagen
  const [hoveredApartment, setHoveredApartment] = useState(null)

  // Generar IDs dinámicos basados en el piso
  const apartmentIds = {
    A: `apartment_A_P${parseInt(floorNumber)}`,
    B: `apartment_B_P${parseInt(floorNumber)}`
  }

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
        src="/planos/13/planta.png"
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
          id="PlantaSix"
          data-name="Capa 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 218.16 349.44"
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
            {/* Rectángulo central transparente */}
            <rect y="168.24" width="180.48" height="54.36" fill="transparent" />

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
                width="218.16"
                height="165.24"
                onMouseEnter={() => handleHover(apartmentIds.A)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.A) && (
                <g>
                  <circle cx="110" cy="80" r="22" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text
                    x="110"
                    y="86"
                    textAnchor="middle"
                    className="apartment-text"
                    fill="#483b2b"
                  >
                    A
                  </text>
                </g>
              )}
            </g>

            <g
              id={apartmentIds.B}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.B, e)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.B) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.B) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                y="225.6"
                width="218.16"
                height="123.84"
                onMouseEnter={() => handleHover(apartmentIds.B)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.B) && (
                <g>
                  <circle cx="110" cy="287" r="22" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text
                    x="110"
                    y="293"
                    textAnchor="middle"
                    className="apartment-text"
                    fill="#483b2b"
                  >
                    B
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

export default ModelSix
