import React, { useState } from 'react'
import './models.css'

const ModelElevenThirteen = ({
  onEventApartment,
  selectedApartment,
  selectedLetter,
  selectedFloor = 'pisoOnce' | 'pisoDoce' | 'pisoTrece'
}) => {
  const getFloorNumber = (floor) => {
    switch (floor) {
      case 'pisoOnce':
        return '11'
      case 'pisoDoce':
        return '12'
      case 'pisoTrece':
        return '13'
    }
  }

  const floorNumber = getFloorNumber(selectedFloor)

  const [hoveredApartment, setHoveredApartment] = useState(null)

  const apartmentIds = {
    A: `apartment_A_P${floorNumber}`,
    B: `apartment_B_P${floorNumber}`,
    C: `apartment_C_P${floorNumber}`,
    D: `apartment_D_P${floorNumber}`
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
        src="/planos/pisoOnceTrece/piso-once-trece.png"
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
          <g id="planta-piso-once-trece" data-name="Capa 1" transform="translate(3, 45)">
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
                points="285.23 0 285.23 165.81 0 165.81 0 84.11 30.5 84.11 30.5 0 285.23 0"
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
                points="285.23 170.43 285.23 336.25 30.5 336.25 30.5 252.14 0 252.14 0 170.43 285.23 170.43"
              />
              <text className="letras" x="137" y="255">
                A
              </text>
            </g>
            <rect
              id="pasillo"
              className="pasillo"
              x="285.54"
              y="58.14"
              width="95"
              height="268.25"
            />
            <g
              id="depto-D"
              onClick={(e) => {
                handleClick(apartmentIds.D, e)
                handleLetterSelected('D', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.D)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                id="dpto-esquema-d"
                className={`plantasDptos ${isApartmentActive(apartmentIds.D) ? 'plantasDptos-active' : ''}`}
                points="598 246.04 598 322.38 568.97 322.38 568.97 336.25 378.21 336.25 378.21 170.62 568.97 170.62 568.97 246.04 598 246.04"
              />
              <text className="letras" x="470" y="258">
                D
              </text>
            </g>
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
                points="598.4 14.32 598.4 90.67 569.37 90.67 569.37 166.46 378.42 166.46 378.42 .46 569.37 .46 569.37 14.32 598.4 14.32"
              />
              <text className="letras" x="470" y="90">
                C
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ModelElevenThirteen
