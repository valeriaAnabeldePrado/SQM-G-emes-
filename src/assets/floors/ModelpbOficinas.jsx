import React, { useState } from 'react'
import './models.css'

const ModelpbOficinas = ({ onEventApartment, selectedApartment, selectedLetter }) => {
  const [hoveredApartment, setHoveredApartment] = useState(null)

  const apartmentIds = {
    OFICINA: 'oficina_pb_PB'
  }

  const isApartmentActive = (apartmentId) => {
    return selectedApartment === apartmentId || hoveredApartment === apartmentId
  }

  const handleHover = (apartmentId) => {
    setHoveredApartment(apartmentId)
  }

  const handleHoverLeave = () => {
    setHoveredApartment(null)
  }

  const handleClick = (apartmentId, e) => {
    e.stopPropagation()
    onEventApartment(apartmentId)
  }

  const handleLetterSelected = (letter, e) => {
    e.stopPropagation()
    selectedLetter(letter)
  }

  return (
    <div
      className="floor-plan-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
        maxWidth: '650px',
        borderRadius: '20px',
        backgroundColor: 'white',
        margin: 'auto',
        padding: '0 1rem'
      }}
    >
      <img
        src="/planos/plantaBajaOficina/pb-oficina.png"
        alt="Planta baja oficina"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: '20px',
          zIndex: 1
        }}
        onError={(e) => {
          e.target.style.display = 'none'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85%',
          height: '85%',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg
          className="animateInPlant"
          data-name="Capa 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 330"
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: '100%',
            height: '100%',
            padding: '0 1rem'
          }}
        >
          <defs>
            <style>
              {`
                .oficinaPb {
                  fill: transparent;
                  stroke: transparent;
                  cursor: pointer;
                  transition: all 0.3s ease;
                }
                
                .oficinaPb:hover {
                  fill: rgba(255, 196, 106, 0.8);
                }
                
                .oficinaPb-active {
                  fill: rgba(255, 196, 106, 0.73);
                  stroke: #ffc46a;
                  stroke-width: 2;
                }

                .patioOfiPb {
                  fill: rgba(147, 149, 152, 0.3);
                  pointer-events: none;
                }

                .letras {
                  fill: #483b2b;
                  font-size: 36px;
                  font-weight: bold;
                  pointer-events: none;
                }
              `}
            </style>
          </defs>
          <g id="oficina-pb-container" data-name="Capa 1">
            <g
              id="oficina-pb-group"
              onClick={(e) => {
                handleClick(apartmentIds.OFICINA, e)
                handleLetterSelected('OFICINA', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.OFICINA)}
              onMouseLeave={handleHoverLeave}
            >
              <rect
                id="oficina-pb"
                className={`oficinaPb ${isApartmentActive(apartmentIds.OFICINA) ? 'oficinaPb-active' : ''}`}
                x="140"
                y="0"
                width="185.24"
                height="328.74"
              />
              <text className="letras" x="160" y="175">
                Oficina
              </text>
            </g>

            <rect
              id="patio-ofi-pb"
              className="patioOfiPb"
              x="-100"
              y="100"
              width="327.39"
              height="128.45"
              transform="translate(-100 228) rotate(-90)"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ModelpbOficinas
