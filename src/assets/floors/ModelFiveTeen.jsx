import React, { useState } from 'react'
import './models.css'

const ModelFiveTeen = ({ onEventApartment, selectedApartment, selectedLetter }) => {
  const [hoveredApartment, setHoveredApartment] = useState(null)

  const apartmentIds = {
    A: 'apartment_A_P15',
    B: 'apartment_B_P15',
    C: 'apartment_C_P15',
    D: 'apartment_D_P15',
    E: 'apartment_E_P15'
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
        src="/planos/pisoQuince/piso-quince.png"
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
          left: '48%',
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
          <g id="DuplexUltimoPiso" transform="translate(3, 45)">
            <polygon
              id="pasillo"
              className="pasillo"
              points="383.35 230.08 383.35 341 289.3 341 289.3 229.9 383.35 230.08"
            />
            <g
              id="duplexHabitacionA"
              onClick={(e) => {
                handleClick(apartmentIds.A, e)
                handleLetterSelected('A', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.A)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                id="duplexHabitacionA-poly"
                className={`plantasDptos ${isApartmentActive(apartmentIds.A) ? 'plantasDptos-active' : ''}`}
                points="282.93 229.71 282.93 341 31.11 341 31.11 330.04 0 330.04 0 245.08 31.11 245.08 31.11 229.71 282.93 229.71"
              />
              <text className="letras" x="140" y="300">
                A
              </text>
            </g>
            <g
              id="duplexHabitacionB"
              onClick={(e) => {
                handleClick(apartmentIds.B, e)
                handleLetterSelected('B', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.B)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                id="duplexHabitacionB-poly"
                className={`plantasDptos ${isApartmentActive(apartmentIds.B) ? 'plantasDptos-active' : ''}`}
                points="327.7 133.41 327.7 225.03 31.11 225.03 31.11 212.62 1.16 212.62 1.16 127.66 31.11 127.66 31.11 116.17 282.93 116.17 282.93 133.41 327.7 133.41"
              />
              <text className="letras" x="160" y="190">
                B
              </text>
            </g>
            <g
              id="duplexHabitacionC"
              onClick={(e) => {
                handleClick(apartmentIds.C, e)
                handleLetterSelected('C', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.C)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                id="duplexHabitacionC-poly"
                className={`plantasDptos ${isApartmentActive(apartmentIds.C) ? 'plantasDptos-active' : ''}`}
                points="282.93 .19 282.93 111.48 31.11 111.48 31.11 98.62 1.17 98.62 1.17 13.66 31.11 13.66 31.11 .19 282.93 .19"
              />
              <text className="letras" x="140" y="75">
                C
              </text>
            </g>
            <g
              id="duplexHabitacionD"
              onClick={(e) => {
                handleClick(apartmentIds.D, e)
                handleLetterSelected('D', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.D)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                id="duplexHabitacionD-poly"
                className={`plantasDptos ${isApartmentActive(apartmentIds.D) ? 'plantasDptos-active' : ''}`}
                points="603.56 10.14 603.56 95.09 576.9 95.09 576.9 237.02 474.6 237.02 474.6 186.05 383.35 186.05 383.35 225.4 333.89 225.4 333.89 133.41 383.35 133.41 383.35 .19 474.6 .19 576.9 0 576.9 10.14 603.56 10.14"
              />
              <text className="letras" x="490" y="120">
                D
              </text>
            </g>
            <g
              id="duplexHabitacionE"
              onClick={(e) => {
                handleClick(apartmentIds.E, e)
                handleLetterSelected('E', e)
              }}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => handleHover(apartmentIds.E)}
              onMouseLeave={handleHoverLeave}
            >
              <polygon
                id="duplexHabitacionE-poly"
                className={`plantasDptos ${isApartmentActive(apartmentIds.E) ? 'plantasDptos-active' : ''}`}
                points="602.39 246.41 602.39 331.37 576.9 331.37 576.9 341 388.04 341 388.04 192.24 468.41 192.24 468.41 243.2 576.9 243.2 576.9 246.41 602.39 246.41"
              />
              <text className="letras" x="495" y="305">
                E
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ModelFiveTeen
