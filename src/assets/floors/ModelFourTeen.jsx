import React, { useState } from 'react'
import './models.css'

const ModelFourTeen = ({ onEventApartment, selectedApartment, selectedLetter }) => {
  const [hoveredApartment, setHoveredApartment] = useState(null)

  const apartmentIds = {
    A: 'apartment_A_P14',
    B: 'apartment_B_P14',
    C: 'apartment_C_P14',
    D: 'apartment_D_P14',
    E: 'apartment_E_P14'
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
        src="/planos/pisoCatorce/piso-catorce.png"
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
          top: '48%',
          left: '49%',
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
          <g id="Duplex" transform="translate(3, 45)">
            <polygon
              id="pasillo"
              className="pasillo"
              points="380.41 59.32 380.41 342.56 285.87 342.56 285.87 207.15 248.4 207.15 248.4 116.57 279.66 116.57 279.66 135.59 285.87 135.59 285.87 59.32 380.41 59.32"
            />
            <g
              id="duplexA"
              onClick={(e) => {
                handleClick(apartmentIds.A, e)
                handleLetterSelected('A', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.A)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                id="duplexA-poly"
                className={`plantasDptos ${isApartmentActive(apartmentIds.A) ? 'plantasDptos-active' : ''}`}
                points="279.66 211.49 279.66 342.18 26.37 342.18 26.37 322.97 0 322.97 0 247.27 26.37 247.27 26.37 230.88 248.4 230.88 248.4 211.49 279.66 211.49"
              />
              <text className="letras" x="140" y="290">
                A
              </text>
            </g>
            <g
              id="duplexB"
              onClick={(e) => {
                handleClick(apartmentIds.B, e)
                handleLetterSelected('B', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.B)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                id="duplexB-poly"
                className={`plantasDptos ${isApartmentActive(apartmentIds.B) ? 'plantasDptos-active' : ''}`}
                points="243.69 116.57 243.69 226.17 26.37 226.17 26.37 209.79 0 209.79 0 132.96 26.37 132.96 26.37 116.57 243.69 116.57"
              />
              <text className="letras" x="120" y="180">
                B
              </text>
            </g>
            <g
              id="duplexC"
              onClick={(e) => {
                handleClick(apartmentIds.C, e)
                handleLetterSelected('C', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.C)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                id="duplexC-poly"
                className={`plantasDptos ${isApartmentActive(apartmentIds.C) ? 'plantasDptos-active' : ''}`}
                points="279.66 .19 279.66 112.05 26.37 112.05 26.37 95.67 0 95.67 0 19.78 26.37 19.78 26.37 .19 279.66 .19"
              />
              <text className="letras" x="140" y="70">
                C
              </text>
            </g>
            <g
              id="duplexD"
              onClick={(e) => {
                handleClick(apartmentIds.D, e)
                handleLetterSelected('D', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.D)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                id="duplexD-poly"
                className={`plantasDptos ${isApartmentActive(apartmentIds.D) ? 'plantasDptos-active' : ''}`}
                points="603 12.62 603 93.6 568.73 93.6 568.73 168.17 386.62 168.17 386.62 0 574.94 0 574.94 12.62 603 12.62"
              />
              <text className="letras" x="495" y="90">
                D
              </text>
            </g>
            <g
              id="duplexE"
              onClick={(e) => {
                handleClick(apartmentIds.E, e)
                handleLetterSelected('E', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.E)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                id="duplexE-poly"
                className={`plantasDptos ${isApartmentActive(apartmentIds.E) ? 'plantasDptos-active' : ''}`}
                points="603 249.15 603 330.13 574.94 330.13 574.94 342.56 386.81 342.56 386.81 174.57 568.73 174.57 568.73 249.15 603 249.15"
              />
              <text className="letras" x="495" y="270">
                E
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ModelFourTeen
