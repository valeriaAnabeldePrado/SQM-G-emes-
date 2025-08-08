import React, { useState } from 'react'
import './models.css'

const ModelFour = ({ onEventApartment, selectedApartment, selectedFloor = 'p07' }) => {
  // Extraer el número de piso del selectedFloor (p07, p08, p09, p10)
  const floorNumber = selectedFloor ? selectedFloor.slice(1, 3) : '07'

  // Estado para el hover en la imagen
  const [hoveredApartment, setHoveredApartment] = useState(null)

  // Generar IDs dinámicos basados en el piso
  const apartmentIds = {
    A: `apartment_A_P${parseInt(floorNumber)}`,
    B: `apartment_B_P${parseInt(floorNumber)}`,
    C: `apartment_C_P${parseInt(floorNumber)}`
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
        src="/planos/78910/planta.png"
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
          className="animateInPlant"
          id="PlantaFour"
          data-name="Capa 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 218.4 387.96"
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
            <rect x=".24" y="188.04" width="180.48" height="54.36" fill="transparent" />

            <g
              id={apartmentIds.A}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.A, e)}
              style={{ cursor: 'pointer' }}
            >
              <polygon
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.A) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.A) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                points="107.88 0 107.88 185.16 .24 185.16 .24 19.8 54.84 19.8 54.84 0 107.88 0"
                onMouseEnter={() => handleHover(apartmentIds.A)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.A) && (
                <g>
                  <circle cx="55" cy="92.5" r="22" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text x="55" y="98" textAnchor="middle" className="apartment-text" fill="#483b2b">
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
              <polygon
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.B) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.B) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                points="218.4 19.8 218.4 185.16 110.76 185.16 110.76 0 163.8 0 163.8 19.8 218.4 19.8"
                onMouseEnter={() => handleHover(apartmentIds.B)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.B) && (
                <g>
                  <circle cx="164" cy="92.5" r="22" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text
                    x="164"
                    y="98"
                    textAnchor="middle"
                    className="apartment-text"
                    fill="#483b2b"
                  >
                    B
                  </text>
                </g>
              )}
            </g>

            <g
              id={apartmentIds.C}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.C, e)}
              style={{ cursor: 'pointer' }}
            >
              <polygon
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.C) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.C) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                points="218.28 245.4 218.28 369.12 209.4 369.12 209.4 387.96 159.72 387.96 159.72 369.12 58.56 369.12 58.56 387.96 9 387.96 9 369.12 0 369.12 0 245.4 218.28 245.4"
                onMouseEnter={() => handleHover(apartmentIds.C)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.C) && (
                <g>
                  <circle cx="109" cy="307" r="22" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text
                    x="109"
                    y="313"
                    textAnchor="middle"
                    className="apartment-text"
                    fill="#483b2b"
                  >
                    C
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

export default ModelFour
