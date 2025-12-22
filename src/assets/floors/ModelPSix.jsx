import React, { useState } from 'react'
import './models.css'

const ModelPSix = ({ onEventApartment, selectedApartment, selectedLetter }) => {
  const [hoveredApartment, setHoveredApartment] = useState(null)

  const apartmentIds = {
    A: 'apartment_A_P6',
    B: 'apartment_B_P6',
    C: 'apartment_C_P6',
    D: 'apartment_D_P6'
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
        src="/planos/pisoSeis/piso-seis.png"
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
          <g id="planta-piso-cuatro-cinco" data-name="Capa 1" transform="translate(3, 45)">
            <rect
              id="pasillo"
              className="pasillo"
              x="278.54"
              y="58.14"
              width="80.74"
              height="268.25"
            />
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
                points="274.85 165.2 274.85 325.08 29.41 325.08 29.41 243.98 0 243.98 0 165.2 274.85 165.2"
              />
              <text className="letras" x="137" y="255">
                A
              </text>
            </g>
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
                points="275.27 .29 275.27 160.17 .43 160.17 .43 81.39 29.84 81.39 29.84 .29 275.27 .29"
              />
              <text className="letras" x="137" y="90">
                B
              </text>
            </g>
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
              <rect
                id="dpto-esquema-d"
                className={`plantasDptos ${isApartmentActive(apartmentIds.D) ? 'plantasDptos-active' : ''}`}
                x="364.17"
                y="164.07"
                width="244.9"
                height="159.88"
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
              <rect
                id="dpto-esquema-c"
                className={`plantasDptos ${isApartmentActive(apartmentIds.C) ? 'plantasDptos-active' : ''}`}
                x="364.2"
                width="244.9"
                height="159.88"
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

export default ModelPSix
