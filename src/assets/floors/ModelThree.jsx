import React, { useState } from 'react'
import './models.css'

const ModelThree = ({ onEventApartment, selectedApartment, selectedFloor = 'p05' }) => {
  // Extraer el número de piso del selectedFloor (p05, p06)
  const floorNumber = selectedFloor ? selectedFloor.slice(1, 3) : '05'

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
        src="/planos/56/planta.png"
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
          data-name="Capa 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 218.28 420"
          style={{ width: '90%', height: '420px', marginLeft: '5%', marginTop: '3.5%' }}
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
          <g data-name="Capa 1">
            {/* Rectángulo central transparente */}
            <rect x="0" y="188.16" width="180.48" height="54.36" fill="transparent" />

            <g
              id={apartmentIds.A}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.A, e)}
              style={{ transform: 'translate(8px, 8px) scale(0.90)' }}
            >
              <polygon
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.A) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.A) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                points="107.64 0 107.64 185.16 0 185.16 0 19.92 54.6 19.92 54.6 0 107.64 0"
                onMouseEnter={() => handleHover(apartmentIds.A)}
                onMouseLeave={handleHoverLeave}
              />
            </g>

            <g
              id={apartmentIds.B}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.B, e)}
              style={{ transform: 'translate(10px, 8px) scale(0.90)' }}
            >
              <polygon
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.B) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.B) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                points="218.28 19.92 218.28 185.16 110.64 185.16 110.64 0 163.56 0 163.56 19.92 218.28 19.92"
                onMouseEnter={() => handleHover(apartmentIds.B)}
                onMouseLeave={handleHoverLeave}
              />
            </g>

            <g
              id={apartmentIds.D}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.D, e)}
              style={{ transform: 'translate(5px, 18px) scale(0.90)' }}
            >
              <polygon
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.D) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.D) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                points="107.52 245.52 107.52 369.24 58.56 369.24 58.56 388.08 9 388.08 9 369.24 0 369.24 0 245.52 107.52 245.52"
                onMouseEnter={() => handleHover(apartmentIds.D)}
                onMouseLeave={handleHoverLeave}
              />
            </g>

            <g
              id={apartmentIds.C}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.C, e)}
              style={{ transform: 'translate(12px, 18px) scale(0.90)' }}
            >
              <polygon
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.C) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.C) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                points="218.28 245.4 218.28 369.24 209.28 369.24 209.28 388.08 159.72 388.08 159.72 369.24 110.52 369.24 110.52 245.4 218.28 245.4"
                onMouseEnter={() => handleHover(apartmentIds.C)}
                onMouseLeave={handleHoverLeave}
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ModelThree
