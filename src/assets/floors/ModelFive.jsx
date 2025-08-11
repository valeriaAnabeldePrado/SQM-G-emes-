import React, { useState } from 'react'
import './models.css'

const ModelFive = ({ onEventApartment, selectedApartment, selectedFloor = 'p11' }) => {
  // Extraer el número de piso del selectedFloor (p11, p12, p13)
  const floorNumber = selectedFloor ? selectedFloor.slice(1, 3) : '11'

  // Estado para el hover en la imagen
  const [hoveredApartment, setHoveredApartment] = useState(null)

  // Generar IDs dinámicos basados en el piso
  const apartmentIds = {
    A: `apartment_A_P${parseInt(floorNumber)}`,
    B: `apartment_B_P${parseInt(floorNumber)}`,
    C: `apartment_C_P${parseInt(floorNumber)}`,
    D: `apartment_D_P${parseInt(floorNumber)}`
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
        src="/planos/1112/planta.png"
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
          id="PlantaFive"
          data-name="Capa 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 218.28 388.2"
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
            <rect y="188.04" width="180.6" height="54.36" fill="transparent" />

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
                points="107.64 0 107.64 185.16 0 185.16 0 19.8 54.6 19.8 54.6 0 107.64 0"
                onMouseEnter={() => handleHover(apartmentIds.A)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.A) && (
                <g>
                  <circle cx="54" cy="92.5" r="22" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text x="54" y="98" textAnchor="middle" className="apartment-text" fill="#483b2b">
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
                points="218.28 19.8 218.28 185.16 110.64 185.16 110.64 0 163.68 0 163.68 19.8 218.28 19.8"
                onMouseEnter={() => handleHover(apartmentIds.B)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.B) && (
                <g>
                  <circle cx="163" cy="92.5" r="22" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text
                    x="163"
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
              id={apartmentIds.D}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.D, e)}
              style={{ cursor: 'pointer' }}
            >
              <polygon
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.D) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.D) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                points="107.52 245.52 107.52 369.36 58.56 369.36 58.56 388.2 9 388.2 9 369.36 0 369.36 0 245.52 107.52 245.52"
                onMouseEnter={() => handleHover(apartmentIds.D)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.D) && (
                <g>
                  <circle cx="54" cy="307" r="22" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text
                    x="54"
                    y="313"
                    textAnchor="middle"
                    className="apartment-text"
                    fill="#483b2b"
                  >
                    D
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
                points="218.28 245.4 218.28 369.36 209.28 369.36 209.28 388.2 159.72 388.2 159.72 369.36 110.52 369.36 110.52 245.4 218.28 245.4"
                onMouseEnter={() => handleHover(apartmentIds.C)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.C) && (
                <g>
                  <circle cx="163" cy="307" r="22" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text
                    x="163"
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

export default ModelFive
