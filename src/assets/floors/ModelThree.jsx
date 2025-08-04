import React from 'react'
import './models.css'

const ModelThree = ({ onEventApartment, selectedApartment }) => (
  <svg
    className="animateInPlant"
    id="PlantaThree"
    data-name="Capa 2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 218.28 388.08"
  >
    <defs>
      <style>{`
      .cls-1 {
        fill: none;
        stroke: #939598;
        stroke-linecap: round;
        stroke-miterlimit: 10;
      }

      .cls-2 {
        fill: #ffc46a;
      }

      .cls-3 {
        fill: #483b2b;
      }

      .cls-4 {
        fill: #c6c7c9;
      }

      .cls-5 {
        fill: #939598;
      }
    `}</style>
    </defs>
    <g id="Capa_1-2" data-name="Capa 1">
      <rect className="cls-4" x="0" y="188.16" width="180.48" height="54.36" />
      <polygon className="cls-5" points="218.28 245.28 218.28 245.4 110.52 245.4 218.28 245.28" />
      <polygon className="cls-1" points="218.28 245.28 218.28 245.4 110.52 245.4 218.28 245.28" />
      <polygon className="cls-5" points="107.52 245.4 107.52 245.52 0 245.52 107.52 245.4" />
      <polygon className="cls-1" points="107.52 245.4 107.52 245.52 0 245.52 107.52 245.4" />

      <g
        id="apartment_A_P3"
        className="apartment-group"
        onClick={(e) => {
          e.stopPropagation()
          onEventApartment('apartment_A_P3')
        }}
      >
        <polygon
          className="apartment-surface"
          fill={selectedApartment === 'apartment_A_P3' ? '#ffc46a' : '#c6c7c9'}
          points="107.64 0 107.64 185.16 0 185.16 0 19.92 54.6 19.92 54.6 0 107.64 0"
        />
        <g id="A">
          <path
            className="apartment-text"
            fill={selectedApartment === 'apartment_A_P3' ? '#483b2b' : '#c6c7c9'}
            d="M54.99,120.93c-12.15,0-22-9.85-22-22s9.85-22,22-22,22,9.85,22,22-9.85,22-22,22ZM54.99,79.88c-10.57,0-19.12,8.56-19.12,19.12s8.56,19.12,19.12,19.12,19.12-8.56,19.12-19.12-8.56-19.12-19.12-19.12Z"
          />
          <path
            className="apartment-text"
            fill={selectedApartment === 'apartment_A_P3' ? '#483b2b' : '#c6c7c9'}
            d="M59.81,103.89h-10.5l-1.94,5.32h-3.31l8.7-23.94h3.59l8.63,23.94h-3.31l-1.94-5.32s.07,0,.07,0ZM58.95,101.38l-4.31-12.15-4.31,12.15h8.7-.07Z"
          />
        </g>
      </g>

      <g
        id="apartment_B_P3"
        className="apartment-group"
        onClick={(e) => {
          e.stopPropagation()
          onEventApartment('apartment_B_P3')
        }}
      >
        <polygon
          className="apartment-surface"
          fill={selectedApartment === 'apartment_B_P3' ? '#ffc46a' : '#c6c7c9'}
          points="218.28 19.92 218.28 185.16 110.64 185.16 110.64 0 163.56 0 163.56 19.92 218.28 19.92"
        />
        <g id="B">
          <path
            className="apartment-text"
            fill={selectedApartment === 'apartment_B_P3' ? '#483b2b' : '#c6c7c9'}
            d="M163.4,121.3c-12.49,0-22.61-9.94-22.61-22.19s10.12-22.19,22.61-22.19,22.61,9.94,22.61,22.19-10.12,22.19-22.61,22.19h0ZM163.4,79.82c-10.86,0-19.66,8.63-19.66,19.29s8.79,19.29,19.66,19.29,19.66-8.63,19.66-19.29-8.79-19.29-19.66-19.29h0Z"
          />
          <path
            className="apartment-text"
            fill={selectedApartment === 'apartment_B_P3' ? '#483b2b' : '#c6c7c9'}
            d="M170.34,99.83c.74.58,1.33,1.31,1.77,2.18s.67,1.74.67,2.76-.3,2.32-.96,3.34c-.67,1.02-1.55,1.74-2.81,2.32-1.18.58-2.66.87-4.29.87h-9.24v-24.3h8.87c1.7,0,3.1.29,4.29.8,1.18.58,2.07,1.31,2.66,2.18.59.94.89,1.96.89,3.12s-.37,2.61-1.18,3.55c-.81.94-1.85,1.6-3.1,2.03.89.15,1.7.51,2.44,1.09v.07h0ZM158.74,97.44h5.39c1.48,0,2.66-.36,3.55-1.02.81-.73,1.26-1.67,1.26-2.9s-.44-2.18-1.26-2.9-2-1.02-3.55-1.02h-5.32v7.83h-.07ZM168.2,107.52c.89-.73,1.33-1.74,1.33-3.12s-.44-2.39-1.4-3.19c-.96-.8-2.22-1.16-3.77-1.16h-5.62v8.56h5.69c1.63,0,2.88-.36,3.77-1.09h0Z"
          />
        </g>
      </g>

      <g
        id="apartment_D_P3"
        className="apartment-group"
        onClick={(e) => {
          e.stopPropagation()
          onEventApartment('apartment_D_P3')
        }}
      >
        <polygon
          className="apartment-surface"
          fill={selectedApartment === 'apartment_D_P3' ? '#ffc46a' : '#c6c7c9'}
          points="107.52 245.52 107.52 369.24 58.56 369.24 58.56 388.08 9 388.08 9 369.24 0 369.24 0 245.52 107.52 245.52"
        />
        <g id="D">
          <path
            className="apartment-text"
            fill={selectedApartment === 'apartment_D_P3' ? '#483b2b' : '#c6c7c9'}
            d="M55.23,329.27c-12.49,0-22.61-9.94-22.61-22.19s10.12-22.19,22.61-22.19,22.61,9.94,22.61,22.19-10.12,22.19-22.61,22.19ZM55.23,287.86c-10.86,0-19.66,8.63-19.66,19.29s8.79,19.29,19.66,19.29,19.66-8.63,19.66-19.29-8.79-19.29-19.66-19.29Z"
          />
          <path
            className="apartment-text"
            fill={selectedApartment === 'apartment_D_P3' ? '#483b2b' : '#c6c7c9'}
            d="M60.99,296.49c2,1.02,3.47,2.39,4.51,4.21s1.55,3.99,1.55,6.45-.52,4.64-1.55,6.45-2.59,3.19-4.51,4.21c-2,.94-4.29,1.45-7.02,1.45h-7.69v-24.3h7.69c2.66,0,5.03.51,7.02,1.45v.07h0ZM61.29,314.11c1.7-1.67,2.51-3.99,2.51-6.96s-.81-5.37-2.51-7.03c-1.7-1.67-4.14-2.54-7.32-2.54h-4.43v19.07h4.43c3.18,0,5.62-.8,7.32-2.47v-.07h0Z"
          />
        </g>
      </g>

      <g
        id="apartment_C_P3"
        className="apartment-group"
        onClick={(e) => {
          e.stopPropagation()
          onEventApartment('apartment_C_P3')
        }}
      >
        <polygon
          className="apartment-surface"
          fill={selectedApartment === 'apartment_C_P3' ? '#ffc46a' : '#c6c7c9'}
          points="218.28 245.4 218.28 369.24 209.28 369.24 209.28 388.08 159.72 388.08 159.72 369.24 110.52 369.24 110.52 245.4 218.28 245.4"
        />
        <g id="C">
          <path
            className="apartment-text"
            fill={selectedApartment === 'apartment_C_P3' ? '#483b2b' : '#c6c7c9'}
            d="M163.41,329.09c-12.49,0-22.61-9.94-22.61-22.19s10.12-22.19,22.61-22.19,22.61,9.94,22.61,22.19-10.12,22.19-22.61,22.19h0ZM163.41,287.61c-10.86,0-19.66,8.63-19.66,19.29s8.79,19.29,19.66,19.29,19.66-8.63,19.66-19.29-8.79-19.29-19.66-19.29h0Z"
          />
          <path
            className="apartment-text"
            fill={selectedApartment === 'apartment_C_P3' ? '#483b2b' : '#c6c7c9'}
            d="M153.14,300.59c1.11-1.89,2.59-3.34,4.43-4.42s3.99-1.6,6.28-1.6,5.03.65,7.09,1.89c2,1.31,3.47,3.12,4.43,5.44h-3.84c-.67-1.45-1.7-2.61-2.96-3.41s-2.81-1.16-4.66-1.16-3.25.36-4.66,1.16c-1.4.8-2.44,1.89-3.25,3.34-.81,1.45-1.18,3.12-1.18,5.08s.37,3.63,1.18,5.08,1.85,2.54,3.25,3.34,2.96,1.16,4.66,1.16,3.33-.36,4.66-1.16c1.26-.8,2.29-1.89,2.96-3.34h3.84c-.89,2.32-2.36,4.13-4.43,5.37-2,1.23-4.36,1.89-7.09,1.89s-4.36-.51-6.28-1.6c-1.85-1.09-3.4-2.54-4.43-4.42-1.11-1.89-1.63-3.99-1.63-6.38s.52-4.5,1.63-6.38v.15Z"
          />
        </g>
      </g>
    </g>
  </svg>
)
export default ModelThree
