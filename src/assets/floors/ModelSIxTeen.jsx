import React, { useState } from 'react'
import './models.css'

const ModelSixTeen = ({ onEventApartment, selectedApartment, selectedLetter }) => {
  const [hoveredApartment, setHoveredApartment] = useState(null)

  const apartmentIds = {
    A: 'quincho_A_P16',
    B: 'quincho_B_P16',
    C: 'pileta_C_P16'
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
        src="/planos/pisoDieciseis/piso-dieciseis.png"
        alt="Planta del piso"
        className="rotateMobile"
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
        className="rotateMobile esquemasMobile"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          zIndex: 2,
          display: 'flex',

          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg
          className="animateInPlant "
          data-name="Capa 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 609 420"
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
                .plantasDptos {
                  fill: transparent;
                  stroke: transparent;
                 
                  cursor: pointer;
                  transition: all 0.3s ease;
                }
                
                .plantasDptos:hover {
                  fill: rgba(255, 196, 106, 0.8);
                }
                
                .plantasDptos-active {
                  fill: rgba(255, 196, 106, 0.73);
                  stroke: #ffc46a;
                  stroke-width: 2;
                }

                .pasillo {
                  fill: rgba(147, 149, 152, 0.3);
                }

                .letras {
                  fill: #483b2b;
                  font-size: 48px;
                  font-weight: bold;
                  pointer-events: none;
                }
              `}
            </style>
          </defs>
          <g id="pisodieciseis" transform="translate(3, 45)">
            <rect
              id="pasillo"
              className="pasillo"
              x="280.99"
              y="58.33"
              width="97.07"
              height="270.59"
            />
            <g
              id="quinchoUno"
              onClick={(e) => {
                handleClick(apartmentIds.A, e)
                handleLetterSelected('A', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.A)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                id="quinchoUno-poly"
                className={`plantasDptos ${isApartmentActive(apartmentIds.A) ? 'plantasDptos-active' : ''}`}
                points="353.91 142.12 353.91 0 541.53 0 541.53 166.65 387.72 166.65 387.72 142.12 353.91 142.12"
                transform="translate(25,0)"
              />
              <text className="letras" x="400" y="100" style={{ fontSize: '30px' }}>
                Quincho A
              </text>
            </g>
            <g
              id="QuinchoDos"
              onClick={(e) => {
                handleClick(apartmentIds.B, e)
                handleLetterSelected('B', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.B)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                id="QuinchoDos-poly"
                className={`plantasDptos ${isApartmentActive(apartmentIds.B) ? 'plantasDptos-active' : ''}`}
                points="353.89 337.92 353.89 195.8 387.71 195.8 387.71 171.28 541.52 171.28 541.52 337.92 353.89 337.92"
                transform="translate(25,0)"
              />
              <text className="letras" x="400" y="280" style={{ fontSize: '30px' }}>
                Quincho B
              </text>
            </g>
            <g
              id="Piscina"
              onClick={(e) => {
                handleClick(apartmentIds.C, e)
                handleLetterSelected('C', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.C)}
              onMouseLeave={handleHoverLeave}
            >
              <rect
                id="Piscina-2"
                className={`plantasDptos ${isApartmentActive(apartmentIds.C) ? 'plantasDptos-active' : ''}`}
                width="270.86"
                height="337.92"
              />

              <text className="letras" x="80" y="180" style={{ fontSize: '30px' }}>
                Piscina
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ModelSixTeen
