import React, { useState } from 'react'
import './models.css'

const ModelDuplex = ({ onEventApartment, selectedApartment }) => {
  // Estado para el hover en la imagen
  const [hoveredApartment, setHoveredApartment] = useState(null)

  // Generar IDs dinámicos basados en el piso 0 (PB)
  const apartmentIds = {
    A: `duplex_A_PB`,
    B: `estudio_B_PB`,
    C: `duplex_C_PB`,
    E: `entrepiso_E_PB` // El entrepiso
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

  // Función para obtener el path de la imagen según el apartamento seleccionado
  const getImagePath = () => {
    if (selectedApartment) {
      // Para duplex A y C, mostrar el plano correspondiente
      if (selectedApartment === 'duplex_A_PB') {
        return `/planos/0/A.png` // Planta baja del duplex A
      }
      if (selectedApartment === 'duplex_C_PB') {
        return `/planos/0/C.png` // Planta baja del duplex C
      }
      if (selectedApartment === 'estudio_B_PB') {
        return `/planos/0/planta.png` // Para el estudio B mostramos la planta general
      }
      if (selectedApartment === 'entrepiso_E_PB') {
        return `/planos/0/E.png` // Entrepiso E
      }
    }

    // Imagen por defecto - planta general
    return `/planos/0/planta.png`
  }

  console.log('ModelDuplex - apartmentIds:', apartmentIds)

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
        src={getImagePath()}
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
          id="PlantaDuplex"
          data-name="Capa 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 600"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <style>{`
              .apartment-text {
                font-family: Arial, sans-serif;
                font-size: 18px;
                font-weight: bold;
              }
            `}</style>
          </defs>
          <g id="Capa_1-2" data-name="Capa 1">
            {/* Duplex A - Área superior izquierda */}
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
                strokeWidth="3"
                x="20"
                y="20"
                width="160"
                height="200"
                onMouseEnter={() => handleHover(apartmentIds.A)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.A) && (
                <g>
                  <circle cx="100" cy="120" r="25" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text
                    x="100"
                    y="128"
                    textAnchor="middle"
                    className="apartment-text"
                    fill="#483b2b"
                  >
                    A
                  </text>
                </g>
              )}
            </g>

            {/* Estudio B - Área superior derecha */}
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
                strokeWidth="3"
                x="200"
                y="20"
                width="180"
                height="140"
                onMouseEnter={() => handleHover(apartmentIds.B)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.B) && (
                <g>
                  <circle cx="290" cy="90" r="25" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text
                    x="290"
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

            {/* Área gris central */}
            <rect
              x="200"
              y="180"
              width="180"
              height="120"
              fill="#e0e0e0"
              stroke="#ccc"
              strokeWidth="1"
            />

            {/* Duplex C - Área inferior derecha */}
            <g
              id={apartmentIds.C}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.C, e)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.C) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.C) ? '#ffc46a' : 'transparent'}
                strokeWidth="3"
                x="200"
                y="320"
                width="180"
                height="260"
                onMouseEnter={() => handleHover(apartmentIds.C)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.C) && (
                <g>
                  <circle cx="290" cy="450" r="25" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text
                    x="290"
                    y="458"
                    textAnchor="middle"
                    className="apartment-text"
                    fill="#483b2b"
                  >
                    C
                  </text>
                </g>
              )}
            </g>

            {/* Área inferior izquierda - puede ser E o área común */}
            <g
              id={apartmentIds.E}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.E, e)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.E) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.E) ? '#ffc46a' : 'transparent'}
                strokeWidth="3"
                x="20"
                y="240"
                width="160"
                height="340"
                onMouseEnter={() => handleHover(apartmentIds.E)}
                onMouseLeave={handleHoverLeave}
              />
              {isApartmentActive(apartmentIds.E) && (
                <g>
                  <circle cx="100" cy="410" r="25" fill="none" stroke="#483b2b" strokeWidth="2" />
                  <text
                    x="100"
                    y="418"
                    textAnchor="middle"
                    className="apartment-text"
                    fill="#483b2b"
                  >
                    E
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

export default ModelDuplex
