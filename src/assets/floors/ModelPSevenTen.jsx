import React, { useState } from 'react'
import './models.css'

const ModelPSevenTen = ({
  onEventApartment,
  selectedApartment,
  selectedLetter,
  selectedFloor = 'pisoSiete' | 'pisoOcho' | 'pisoNueve' | 'pisoDiez'
}) => {
  const getFloorNumber = (floor) => {
    switch (floor) {
      case 'pisoSiete':
        return '7'
      case 'pisoOcho':
        return '8'
      case 'pisoNueve':
        return '9'
      case 'pisoDiez':
        return '10'
    }
  }

  const floorNumber = getFloorNumber(selectedFloor)

  const [hoveredApartment, setHoveredApartment] = useState(null)

  const apartmentIds = {
    A: `apartment_A_P${floorNumber}`,
    B: `apartment_B_P${floorNumber}`,
    C: `apartment_C_P${floorNumber}`
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
        src="/planos/pisoSieteDiez/piso-siete-diez.png"
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
          <g id="planta-piso-siete-diez" data-name="Capa 1" transform="translate(3, 45)">
            <g id="PisoSieteDiez">
              <g
                id="depto-B"
                onClick={(e) => {
                  handleClick(apartmentIds.B, e)
                  handleLetterSelected('B', e)
                }}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => handleHover(apartmentIds.B)}
                onMouseLeave={handleHoverLeave}
              >
                <polygon
                  id="dpto-esquema-b"
                  className={`plantasDptos ${isApartmentActive(apartmentIds.B) ? 'plantasDptos-active' : ''}`}
                  points="285.62 0 285.62 166.04 0 166.04 0 84.22 30.54 84.22 30.54 0 285.62 0"
                />
                <text className="letras" x="137" y="90">
                  B
                </text>
              </g>
              <g
                id="depto-A"
                onClick={(e) => {
                  handleClick(apartmentIds.A, e)
                  handleLetterSelected('A', e)
                }}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => handleHover(apartmentIds.A)}
                onMouseLeave={handleHoverLeave}
              >
                <polygon
                  id="dpto-esquema-a"
                  className={`plantasDptos ${isApartmentActive(apartmentIds.A) ? 'plantasDptos-active' : ''}`}
                  points="285.62 170.67 285.62 336.71 30.54 336.71 30.54 252.49 0 252.49 0 170.67 285.62 170.67"
                />
                <text className="letras" x="137" y="255">
                  A
                </text>
              </g>

              <rect id="pasillo" class="cls-3" x="290.06" y="58.12" width="83.86" height="278.59" />
              <g
                id="depto-C"
                onClick={(e) => {
                  handleClick(apartmentIds.C, e)
                  handleLetterSelected('C', e)
                }}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => handleHover(apartmentIds.C)}
                onMouseLeave={handleHoverLeave}
              >
                <polygon
                  id="dpto-esquema-c"
                  className={`plantasDptos ${isApartmentActive(apartmentIds.C) ? 'plantasDptos-active' : ''}`}
                  points="569.63 166.23 569.63 170.85 569.76 170.85 569.76 246.38 598.82 246.38 598.82 322.83 569.76 322.83 569.76 336.71 378.73 336.71 378.73 185.83 378.56 185.83 378.56 166.23 378.54 166.23 378.54 0 569.76 0 569.76 13.88 598.82 13.88 598.82 90.33 569.76 90.33 569.76 166.23 569.63 166.23"
                />
                <text className="letras" x="460" y="180">
                  C
                </text>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ModelPSevenTen
