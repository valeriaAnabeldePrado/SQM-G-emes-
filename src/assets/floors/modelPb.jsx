import React, { useState } from 'react'
import './models.css'

const ModelPb = ({ onEventApartment, selectedApartment }) => {
  console.log('ModelPb rendered with selectedApartment:', selectedApartment)

  // Estado para el hover en la imagen
  const [hoveredApartment, setHoveredApartment] = useState(null)

  // Generar IDs dinámicos basados en el piso PB (Planta Baja)
  const apartmentIds = {
    A: `dpto_A_PB`,
    B: `dpto_B_PB`,
    C: `dpto_C_PB`,
    LOCAL: `Local_PB`,
    OFICINA: `ofi_PB`
  }

  // Función para determinar si un apartamento está activo
  const isApartmentActive = (apartmentId) => {
    return selectedApartment === apartmentId || hoveredApartment === apartmentId
  }

  // Manejadores de eventos
  // const handleMouseEnter = () => {
  //   // Lógica de hover si es necesaria
  // }

  const handleMouseLeave = () => {
    setHoveredApartment(null)
  }

  // Manejador de hover específico
  const handleHover = (apartmentId) => {
    setHoveredApartment(apartmentId)
  }

  // Manejador de click
  const handleClick = (apartmentId, e) => {
    e.stopPropagation()
    onEventApartment(apartmentId)
  }

  return (
    <div
      className="floorplan-container animateInPlant"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px'
      }}
    >
      {/* PNG principal como fondo */}
      <img
        src="/planos/0/planta.png"
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
        onLoad={() => console.log('Imagen cargada correctamente')}
        onError={(e) => {
          console.log('Error cargando imagen:', e)
          e.target.style.display = 'none'
        }}
      />

      {/* SVG superpuesto para selecciones precisas */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}
      >
        <svg
          id="PlantaBaja"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 701"
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
            {/* dpto-a-PB */}
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
                stroke={isApartmentActive(apartmentIds.A) ? '#ff6b35' : 'transparent'}
                strokeWidth="2"
                points="360.98,250.24 360.98,419.8 297.56,419.8 297.56,274.62 280.2,274.62 280.2,250.24 360.98,250.24"
                onMouseEnter={() => handleHover(apartmentIds.A)}
                onMouseLeave={handleMouseLeave}
              />
            </g>

            {/* dpto-b-PB */}
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
                stroke={isApartmentActive(apartmentIds.B) ? '#ff6b35' : 'transparent'}
                strokeWidth="2"
                x="215.61"
                y="270.06"
                width="75.51"
                height="130.2"
                onMouseEnter={() => handleHover(apartmentIds.B)}
                onMouseLeave={handleMouseLeave}
              />
            </g>

            {/* dpto-c-PB */}
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
                stroke={isApartmentActive(apartmentIds.C) ? '#ff6b35' : 'transparent'}
                strokeWidth="2"
                points="226.27,250.24 226.27,274.62 200.53,274.62 200.53,419.55 137,419.8 137,250.24 226.27,250.24"
                onMouseEnter={() => handleHover(apartmentIds.C)}
                onMouseLeave={handleMouseLeave}
              />
            </g>

            {/* Local-PB */}
            <g
              id={apartmentIds.LOCAL}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.LOCAL, e)}
              style={{ cursor: 'pointer' }}
            >
              <polygon
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.LOCAL) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.LOCAL) ? '#ff6b35' : 'transparent'}
                strokeWidth="2"
                points="317.27,37 317.27,157.8 226.15,157.67 226.15,157.8 226.27,190.3 137,190.3 137,37 317.27,37"
                onMouseEnter={() => handleHover(apartmentIds.LOCAL)}
                onMouseLeave={handleMouseLeave}
              />
            </g>

            {/* ofi-pb */}
            <g
              id={apartmentIds.OFICINA}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.OFICINA, e)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                className="apartment-surface"
                fill={
                  isApartmentActive(apartmentIds.OFICINA)
                    ? 'rgba(255, 196, 106, 0.4)'
                    : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.OFICINA) ? '#ff6b35' : 'transparent'}
                strokeWidth="2"
                x="137"
                y="530.16"
                width="223.98"
                height="133.97"
                onMouseEnter={() => handleHover(apartmentIds.OFICINA)}
                onMouseLeave={handleMouseLeave}
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ModelPb
