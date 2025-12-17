import React, { useState } from 'react'
import './models.css'

const ModelpbDptos = ({ onEventApartment, selectedApartment, selectedLetter }) => {
  const floorNumber = 'PB'

  const [hoveredApartment, setHoveredApartment] = useState(null)

  const apartmentIds = {
    LOCAL: `local_comercial_${floorNumber}`,
    C: `duplex_C_${floorNumber}`,
    D: `duplex_A_${floorNumber}`
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
        src="/planos/plantaBajaDptos/pb-dptos.png"
        alt="Planta baja"
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
        className="rotateMobile esquemasMobilePb"
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
                  pointer-events: none;
                }

                .letras {
                  fill: #483b2b;
                  font-size: 48px;
                  font-weight: bold;
                  pointer-events: none;
                }
                
                .letras-local {
                  fill: #483b2b;
                  font-size: 32px;
                  font-weight: bold;
                  pointer-events: none;
                }
              `}
            </style>
          </defs>
          <g id="planta-baja-dptos" data-name="Capa 1" transform="translate(3, 45)">
            <g
              id="locales-pb"
              onClick={(e) => {
                handleClick(apartmentIds.LOCAL, e)
                handleLetterSelected('LOCAL', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.LOCAL)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                className={`plantasDptos ${isApartmentActive(apartmentIds.LOCAL) ? 'plantasDptos-active' : ''}`}
                points=".42 68.49 164.87 68.49 164.87 198.42 210.43 198.42 210.43 326.56 164.87 326.56 .42 326.21 .42 68.49"
              />
              <text className="letras-local" x="60" y="200">
                Local
              </text>
            </g>

            <polygon
              id="pasillo"
              className="pasillo"
              points="0 2.34 209.84 2.34 209.84 121.59 215.71 121.59 215.71 102.54 215.89 58.23 305.23 58.23 305.23 326.62 215.89 326.44 215.71 326.44 215.71 193.67 209.84 193.67 168.72 193.49 168.72 65.52 0 65.7 0 2.34"
            />

            <g
              id="depto-d"
              onClick={(e) => {
                handleClick(apartmentIds.D, e)
                handleLetterSelected('D', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.D)}
              onMouseLeave={handleHoverLeave}
            >
              <rect
                className={`plantasDptos ${isApartmentActive(apartmentIds.D) ? 'plantasDptos-active' : ''}`}
                x="313.01"
                y="167.45"
                width="229.56"
                height="158.94"
              />
              <text className="letras" x="410" y="260">
                D
              </text>
            </g>

            <g
              id="depto-c"
              onClick={(e) => {
                handleClick(apartmentIds.C, e)
                handleLetterSelected('C', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.C)}
              onMouseLeave={handleHoverLeave}
            >
              <rect
                className={`plantasDptos ${isApartmentActive(apartmentIds.C) ? 'plantasDptos-active' : ''}`}
                x="313.01"
                y="2.64"
                width="229.56"
                height="158.94"
              />
              <text className="letras" x="410" y="95">
                C
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ModelpbDptos
