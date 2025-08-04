import React from 'react'

const ModelSix = ({ onEventApartment, selectedApartment }) => (
  <>
    <svg
      id="PlantaSix"
      data-name="Capa 2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 218.16 349.44"
    >
      <style>
        {`   .cls-1 {
        fill: #ffc46a;
      }

      .cls-2 {
        fill: #483b2b;
      }

      .cls-3 {
        fill: #c6c7c9;
      }`}
      </style>

      <g id="Capa_1-2" data-name="Capa 1">
        <rect className="cls-3" y="168.24" width="180.48" height="54.36" />

        <g
          id="apartment_A_P6"
          className="apartment-group"
          onClick={(e) => {
            e.stopPropagation()
            onEventApartment('apartment_A_P6')
          }}
        >
          <rect
            className="apartment-surface"
            fill={selectedApartment === 'apartment_A_P6' ? '#ffc46a' : '#c6c7c9'}
            width="218.16"
            height="165.24"
          />
          <g id="A">
            <path
              className="apartment-text"
              fill={selectedApartment === 'apartment_A_P6' ? '#483b2b' : '#c6c7c9'}
              d="M110.35,100.62c-12.15,0-22-9.85-22-22s9.85-22,22-22,22,9.85,22,22-9.85,22-22,22ZM110.35,59.57c-10.57,0-19.12,8.56-19.12,19.12s8.56,19.12,19.12,19.12,19.12-8.56,19.12-19.12-8.56-19.12-19.12-19.12Z"
            />
            <path
              className="apartment-text"
              fill={selectedApartment === 'apartment_A_P6' ? '#483b2b' : '#c6c7c9'}
              d="M115.17,83.58h-10.5l-1.94,5.32h-3.31l8.7-23.94h3.59l8.63,23.94h-3.31l-1.94-5.32s.07,0,.07,0ZM114.3,81.06l-4.31-12.15-4.31,12.15h8.7-.07Z"
            />
          </g>
        </g>

        <g
          id="apartment_B_P6"
          className="apartment-group"
          onClick={(e) => {
            e.stopPropagation()
            onEventApartment('apartment_B_P6')
          }}
        >
          <rect
            className="apartment-surface"
            fill={selectedApartment === 'apartment_B_P6' ? '#ffc46a' : '#c6c7c9'}
            y="225.6"
            width="218.16"
            height="123.84"
          />
          <g id="B">
            <path
              className="apartment-text"
              fill={selectedApartment === 'apartment_B_P6' ? '#483b2b' : '#c6c7c9'}
              d="M110.3,310.95c-12.49,0-22.61-9.94-22.61-22.19s10.12-22.19,22.61-22.19,22.61,9.94,22.61,22.19-10.12,22.19-22.61,22.19h0ZM110.3,269.46c-10.86,0-19.66,8.63-19.66,19.29s8.79,19.29,19.66,19.29,19.66-8.63,19.66-19.29-8.79-19.29-19.66-19.29h0Z"
            />
            <path
              className="apartment-text"
              fill={selectedApartment === 'apartment_B_P6' ? '#483b2b' : '#c6c7c9'}
              d="M117.24,289.48c.74.58,1.33,1.31,1.77,2.18s.67,1.74.67,2.76-.3,2.32-.96,3.34c-.67,1.02-1.55,1.74-2.81,2.32-1.18.58-2.66.87-4.29.87h-9.24v-24.3h8.87c1.7,0,3.1.29,4.29.8,1.18.58,2.07,1.31,2.66,2.18.59.94.89,1.96.89,3.12s-.37,2.61-1.18,3.55c-.81.94-1.85,1.6-3.1,2.03.89.15,1.7.51,2.44,1.09v.07h0ZM105.64,287.09h5.39c1.48,0,2.66-.36,3.55-1.02.81-.73,1.26-1.67,1.26-2.9s-.44-2.18-1.26-2.9-2-1.02-3.55-1.02h-5.32v7.83h-.07ZM115.1,297.17c.89-.73,1.33-1.74,1.33-3.12s-.44-2.39-1.4-3.19c-.96-.8-2.22-1.16-3.77-1.16h-5.62v8.56h5.69c1.63,0,2.88-.36,3.77-1.09h0Z"
            />
          </g>
        </g>
      </g>
    </svg>
  </>
)

export default ModelSix
