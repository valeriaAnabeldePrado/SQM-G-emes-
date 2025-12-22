import React, { useState } from 'react'
import './models.css'

const ModelPTwoOfi = ({ onEventApartment, selectedApartment, selectedLetter }) => {
  //const floorNumber = 'pisoDosOficina'

  const [hoveredApartment, setHoveredApartment] = useState(null)

  const apartmentIds = {
    OFICINA: 'oficina_p2_P2'
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
        src="/planos/ofiPisoDos/ofiPisoDos.png"
        alt="Piso dos oficina"
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
          transform: 'translate(-39%, -49%)',
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
          <g
            id="oficina-pTwo"
            data-name="Capa 1"
            onClick={(e) => {
              handleClick(apartmentIds.OFICINA, e)
              handleLetterSelected('OFICINA', e)
            }}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => handleHover(apartmentIds.OFICINA)}
            onMouseLeave={handleHoverLeave}
          >
            <rect
              width="205.84"
              height="324.43"
              id="oficina-p-two"
              className={`oficinaPb ${isApartmentActive(apartmentIds.OFICINA) ? 'oficinaPb-active' : ''}`}
            />
            <text className="letras" x="50" y="175">
              Oficina
            </text>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ModelPTwoOfi
