import React, { useState } from 'react'
import './models.css'

const ModelTwo = ({ onEventApartment, selectedApartment, selectedFloor = 'p04' }) => {
  // Extraer el número de piso del selectedFloor (p04)
  const floorNumber = selectedFloor ? selectedFloor.slice(1, 3) : '04'

  console.log('ModelTwo renderizado con:', { selectedFloor, floorNumber, selectedApartment })

  // Estado para el hover en la imagen
  const [hoveredApartment, setHoveredApartment] = useState(null)

  // Generar IDs dinámicos basados en el piso
  const apartmentIds = {
    A: `apartment_A_P${parseInt(floorNumber)}`,
    B: `apartment_B_P${parseInt(floorNumber)}`,
    C: `apartment_C_P${parseInt(floorNumber)}`,
    D: `apartment_D_P${parseInt(floorNumber)}`,
  // Normalmente Oficina varia por piso; mapear a la clave compartida si queremos la misma oficina
  Oficina: `oficina_A_P00`
  }

  // Manejadores de hover para las áreas de la imagen
  const handleHover = (apartmentId) => {
    setHoveredApartment(apartmentId)
  }

  const handleHoverLeave = () => {
    setHoveredApartment(null)
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
        src="/planos/4/planta.png"
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
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '80%', zIndex: 2 }}
      >
        <svg
          dataname="Capa 2"
          className="animateInPlant"
          id="PlantaTwo"
          viewBox="0 0 218.28 659.28"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '90%', height: '590px', marginLeft: '5%', marginTop: '3.5%' }}
        >
          <g dataname="Capa 1" id="Capa_1-2">
            <g
              id={apartmentIds.A}
              className="apartment-group"
              onClick={(e) => {
                e.stopPropagation()
                onEventApartment(apartmentIds.A)
              }}
            >
              <polygon
                className="apartment-surface"
                fill={
                  hoveredApartment === apartmentIds.A
                    ? 'rgba(255, 196, 106, 0.3)'
                    : selectedApartment === apartmentIds.A
                      ? 'rgba(255, 196, 106, 0.5)'
                      : 'transparent'
                }
                stroke={
                  hoveredApartment === apartmentIds.A || selectedApartment === apartmentIds.A
                    ? '#ffc46a'
                    : 'transparent'
                }
                strokeWidth="2"
                points="107.64 0 107.64 185.04 0 185.04 0 19.8 54.6 19.8 54.6 0 107.64 0"
                onMouseEnter={() => handleHover(apartmentIds.A)}
                onMouseLeave={handleHoverLeave}
              />
            </g>
            <g
              id={apartmentIds.B}
              className="apartment-group"
              onClick={(e) => {
                e.stopPropagation()
                onEventApartment(apartmentIds.B)
              }}
            >
              <polygon
                className="apartment-surface"
                fill={
                  hoveredApartment === apartmentIds.B
                    ? 'rgba(255, 196, 106, 0.3)'
                    : selectedApartment === apartmentIds.B
                      ? 'rgba(255, 196, 106, 0.5)'
                      : 'transparent'
                }
                stroke={
                  hoveredApartment === apartmentIds.B || selectedApartment === apartmentIds.B
                    ? '#ffc46a'
                    : 'transparent'
                }
                strokeWidth="2"
                points="218.28 19.8 218.28 185.04 110.64 185.04 110.64 0 163.56 0 163.56 19.8 218.28 19.8"
                onMouseEnter={() => handleHover(apartmentIds.B)}
                onMouseLeave={handleHoverLeave}
              />
            </g>
            <g
              id={apartmentIds.D}
              className="apartment-group"
              onClick={(e) => {
                e.stopPropagation()
                onEventApartment(apartmentIds.D)
              }}
            >
              <rect
                className="apartment-surface"
                fill={
                  hoveredApartment === apartmentIds.D
                    ? 'rgba(255, 196, 106, 0.3)'
                    : selectedApartment === apartmentIds.D
                      ? 'rgba(255, 196, 106, 0.5)'
                      : 'transparent'
                }
                stroke={
                  hoveredApartment === apartmentIds.D || selectedApartment === apartmentIds.D
                    ? '#ffc46a'
                    : 'transparent'
                }
                strokeWidth="2"
                x="0"
                y="255.88"
                width="107.64"
                height="160"
                onMouseEnter={() => handleHover(apartmentIds.D)}
                onMouseLeave={handleHoverLeave}
              />
            </g>
            <g
              id={apartmentIds.C}
              className="apartment-group"
              onClick={(e) => {
                e.stopPropagation()
                onEventApartment(apartmentIds.C)
              }}
            >
              <rect
                className="apartment-surface"
                fill={
                  hoveredApartment === apartmentIds.C
                    ? 'rgba(255, 196, 106, 0.3)'
                    : selectedApartment === apartmentIds.C
                      ? 'rgba(255, 196, 106, 0.5)'
                      : 'transparent'
                }
                stroke={
                  hoveredApartment === apartmentIds.C || selectedApartment === apartmentIds.C
                    ? '#ffc46a'
                    : 'transparent'
                }
                strokeWidth="2"
                x="110.64"
                y="255.88"
                width="107.64"
                height="160"
                onMouseEnter={() => handleHover(apartmentIds.C)}
                onMouseLeave={handleHoverLeave}
              />
            </g>
            <g
              id={apartmentIds.Oficina}
              className="apartment-group"
              onClick={(e) => {
                e.stopPropagation()
                onEventApartment(apartmentIds.Oficina)
              }}
            >
              <rect
                className="apartment-surface"
                fill={
                  hoveredApartment === apartmentIds.Oficina
                    ? 'rgba(255, 196, 106, 0.3)'
                    : selectedApartment === apartmentIds.Oficina
                      ? 'rgba(255, 196, 106, 0.5)'
                      : 'transparent'
                }
                stroke={
                  hoveredApartment === apartmentIds.Oficina ||
                  selectedApartment === apartmentIds.Oficina
                    ? '#ffc46a'
                    : 'transparent'
                }
                strokeWidth="2"
                height="71.04"
                width="218.28"
                y="588.24"
                onMouseEnter={() => handleHover(apartmentIds.Oficina)}
                onMouseLeave={handleHoverLeave}
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ModelTwo
