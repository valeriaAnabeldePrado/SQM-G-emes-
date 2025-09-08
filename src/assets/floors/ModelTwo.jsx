import React, { useState } from 'react'
import './models.css'

const ModelTwo = ({ onEventApartment, selectedApartment, selectedFloor = 'p04' }) => {
  const floorNumber = selectedFloor ? selectedFloor.slice(1, 3) : '04'

  const apartmentIds = {
    A: `apartment_A_P${parseInt(floorNumber, 10)}`,
    B: `apartment_B_P${parseInt(floorNumber, 10)}`,
    C: `apartment_C_P${parseInt(floorNumber, 10)}`,
    D: `apartment_D_P${parseInt(floorNumber, 10)}`,
    Oficina: `oficina_D_P04`
  }

  const [hoveredApartment, setHoveredApartment] = useState(null)

  const handleHover = (id) => setHoveredApartment(id)
  const handleHoverLeave = () => setHoveredApartment(null)

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
      <img
        src="/planos/4/planta.png"
        alt={`Planta piso ${parseInt(floorNumber, 10)}`}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          maxHeight: '100%',
          objectFit: 'contain'
        }}
      />

      <svg
        className="animateInPlant"
        id="plantaTwoUnified"
        data-name="Capa 2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 218.28 718.92"
        style={{
          position: 'absolute',
          top: 12,
          left: 6,
          width: '93%',
          height: '93%'
        }}
      >
        <g id="Capa_1-2" data-name="Capa 1">
          {/* Apartment A (left top) */}
          <g
            id={apartmentIds.A}
            className="apartment-group"
            onClick={(e) => {
              e.stopPropagation()
              onEventApartment(apartmentIds.A)
            }}
            style={{ pointerEvents: 'all' }}
          >
            <polygon
              className="apartment-surface"
              fill={
                hoveredApartment === apartmentIds.A
                  ? 'rgba(255, 196, 106, 0.3)'
                  : selectedApartment === apartmentIds.A
                    ? 'rgba(255, 196, 106, 0.4)'
                    : 'transparent'
              }
              stroke={
                selectedApartment === apartmentIds.A || hoveredApartment === apartmentIds.A
                  ? '#ffc46a'
                  : 'transparent'
              }
              strokeWidth="2"
              points="107.64 0 107.64 185.16 0 185.16 0 19.8 54.6 19.8 54.6 0 107.64 0"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={() => handleHover(apartmentIds.A)}
              onMouseLeave={handleHoverLeave}
            />
          </g>

          {/* Apartment B (right top) */}
          <g
            id={apartmentIds.B}
            className="apartment-group"
            onClick={(e) => {
              e.stopPropagation()
              onEventApartment(apartmentIds.B)
            }}
            style={{ pointerEvents: 'all' }}
          >
            <polygon
              className="apartment-surface"
              fill={
                hoveredApartment === apartmentIds.B
                  ? 'rgba(255, 196, 106, 0.3)'
                  : selectedApartment === apartmentIds.B
                    ? 'rgba(255, 196, 106, 0.4)'
                    : 'transparent'
              }
              stroke={
                selectedApartment === apartmentIds.B || hoveredApartment === apartmentIds.B
                  ? '#ffc46a'
                  : 'transparent'
              }
              strokeWidth="2"
              points="218.28 19.8 218.28 185.16 110.64 185.16 110.64 0 163.68 0 163.68 19.8 218.28 19.8"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={() => handleHover(apartmentIds.B)}
              onMouseLeave={handleHoverLeave}
            />
          </g>

          {/* Apartment D (left middle) */}
          <g
            id={apartmentIds.D}
            className="apartment-group"
            onClick={(e) => {
              e.stopPropagation()
              onEventApartment(apartmentIds.D)
            }}
            style={{ pointerEvents: 'all' }}
          >
            <rect
              className="apartment-surface"
              fill={
                hoveredApartment === apartmentIds.D
                  ? 'rgba(255, 196, 106, 0.3)'
                  : selectedApartment === apartmentIds.D
                    ? 'rgba(255, 196, 106, 0.4)'
                    : 'transparent'
              }
              stroke={
                selectedApartment === apartmentIds.D || hoveredApartment === apartmentIds.D
                  ? '#ffc46a'
                  : 'transparent'
              }
              strokeWidth="2"
              y="255.88"
              width="107.64"
              height="164.88"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={() => handleHover(apartmentIds.D)}
              onMouseLeave={handleHoverLeave}
            />
          </g>

          {/* Apartment C (right middle) */}
          <g
            id={apartmentIds.C}
            className="apartment-group"
            onClick={(e) => {
              e.stopPropagation()
              onEventApartment(apartmentIds.C)
            }}
            style={{ pointerEvents: 'all' }}
          >
            <rect
              className="apartment-surface"
              fill={
                hoveredApartment === apartmentIds.C
                  ? 'rgba(255, 196, 106, 0.3)'
                  : selectedApartment === apartmentIds.C
                    ? 'rgba(255, 196, 106, 0.4)'
                    : 'transparent'
              }
              stroke={
                selectedApartment === apartmentIds.C || hoveredApartment === apartmentIds.C
                  ? '#ffc46a'
                  : 'transparent'
              }
              strokeWidth="2"
              x="110.64"
              y="255.88"
              width="107.64"
              height="164.88"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={() => handleHover(apartmentIds.C)}
              onMouseLeave={handleHoverLeave}
            />
          </g>

          {/* Oficina (bottom full width) */}
          <g
            id={apartmentIds.Oficina}
            className="apartment-group"
            onClick={(e) => {
              e.stopPropagation()
              onEventApartment(apartmentIds.Oficina)
            }}
            style={{ pointerEvents: 'all' }}
          >
            <rect
              className="apartment-surface"
              y="610.36"
              width="218.28"
              height="130.56"
              fill={
                hoveredApartment === apartmentIds.Oficina
                  ? 'rgba(255, 196, 106, 0.3)'
                  : selectedApartment === apartmentIds.Oficina
                    ? 'rgba(255, 196, 106, 0.4)'
                    : 'transparent'
              }
              stroke={
                selectedApartment === apartmentIds.Oficina ||
                hoveredApartment === apartmentIds.Oficina
                  ? '#ffc46a'
                  : 'transparent'
              }
              strokeWidth="2"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={() => handleHover(apartmentIds.Oficina)}
              onMouseLeave={handleHoverLeave}
            />
          </g>
        </g>
      </svg>
    </div>
  )
}

export default ModelTwo
