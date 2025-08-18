import React from 'react'
import './models.css'

const ModelTwelve = ({ onEventApartment, selectedApartment, selectedFloor = 'p01' }) => {
  // Extraer el número de piso del selectedFloor (p01, p02)
  const floorNumber = selectedFloor ? selectedFloor.slice(1, 3) : '01'

  // Generar IDs dinámicos basados en el piso
  const apartmentIds = {
    A: `apartment_A_P${parseInt(floorNumber)}`,
    B: `apartment_B_P${parseInt(floorNumber)}`,
    C: `apartment_C_P${parseInt(floorNumber)}`,
    D: `apartment_D_P${parseInt(floorNumber)}`,
    Oficina: `Oficina_P${parseInt(floorNumber)}`
  }

  return (
    <div
      className="floor-plan-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px'
      }}
    >
      {/* PNG principal como fondo */}
      <img
        src="/planos/123/12/plano.png"
        alt={`Planta piso ${parseInt(floorNumber)}`}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          maxHeight: '100%',
          objectFit: 'contain'
        }}
      />

      {/* SVG superpuesto para interactividad - usando el SVG original del ModelOne */}
      <svg
        className="animateInPlant"
        id="plantaOne"
        data-name="Capa 2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 218.28 718.92"
        style={{
          position: 'absolute',
          top: '0.5%',
          left: '0.5%',
          width: '95%',
          height: '95%',
          pointerEvents: 'none'
        }}
      >
        <g id="Capa_1-2" data-name="Capa 1">
          <g
            id={apartmentIds.A}
            className="apartment-group"
            onClick={(e) => {
              e.stopPropagation()
              onEventApartment(apartmentIds.A)
            }}
            style={{ pointerEvents: 'all' }}
          >
            <polygon
              className="apartment-surface"
              fill={
                selectedApartment === apartmentIds.A ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
              }
              stroke={selectedApartment === apartmentIds.A ? '#ffc46a' : 'transparent'}
              strokeWidth="2"
              points="107.64 0 107.64 185.16 0 185.16 0 19.8 54.6 19.8 54.6 0 107.64 0"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            />
            <g id="A_p1">
              <path
                className="apartment-text"
                fill={selectedApartment === apartmentIds.A ? '#483b2b' : '#666'}
                d="M55.51,123.04c-12.15,0-22-9.85-22-22s9.85-22,22-22,22,9.85,22,22-9.85,22-22,22ZM55.51,81.99c-10.57,0-19.12,8.56-19.12,19.12s8.56,19.12,19.12,19.12,19.12-8.56,19.12-19.12-8.56-19.12-19.12-19.12Z"
              />
              <path
                className="apartment-text"
                fill={selectedApartment === apartmentIds.A ? '#483b2b' : '#666'}
                d="M60.32,106.01h-10.5l-1.94,5.32h-3.31l8.7-23.94h3.59l8.63,23.94h-3.31l-1.94-5.32s.07,0,.07,0ZM59.46,103.49l-4.31-12.15-4.31,12.15h8.7-.07Z"
              />
            </g>
          </g>
          <g
            id={apartmentIds.D}
            className="apartment-group"
            onClick={(e) => {
              e.stopPropagation()
              onEventApartment(apartmentIds.D)
            }}
            style={{ pointerEvents: 'all' }}
          >
            <rect
              className="apartment-surface"
              fill={
                selectedApartment === apartmentIds.D ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
              }
              stroke={selectedApartment === apartmentIds.D ? '#ffc46a' : 'transparent'}
              strokeWidth="2"
              y="255.88"
              width="107.64"
              height="164.88"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            />
            <g id="D_P1">
              <path
                className="apartment-text"
                fill={selectedApartment === apartmentIds.D ? '#483b2b' : '#666'}
                d="M54.84,352.54c-12.49,0-22.61-9.94-22.61-22.19s10.12-22.19,22.61-22.19,22.61,9.94,22.61,22.19-10.12,22.19-22.61,22.19ZM54.84,311.13c-10.86,0-19.66,8.63-19.66,19.29s8.79,19.29,19.66,19.29,19.66-8.63,19.66-19.29-8.79-19.29-19.66-19.29Z"
              />
              <path
                className="apartment-text"
                fill={selectedApartment === apartmentIds.D ? '#483b2b' : '#666'}
                d="M60.6,319.76c2,1.02,3.47,2.39,4.51,4.21s1.55,3.99,1.55,6.45-.52,4.64-1.55,6.45-2.59,3.19-4.51,4.21c-2,.94-4.29,1.45-7.02,1.45h-7.69v-24.3h7.69c2.66,0,5.03.51,7.02,1.45v.07h0ZM60.9,337.38c1.7-1.67,2.51-3.99,2.51-6.96s-.81-5.37-2.51-7.03c-1.7-1.67-4.14-2.54-7.32-2.54h-4.43v19.07h4.43c3.18,0,5.62-.8,7.32-2.47v-.07h0Z"
              />
            </g>
          </g>
          <g
            id={apartmentIds.B}
            className="apartment-group"
            onClick={(e) => {
              e.stopPropagation()
              onEventApartment(apartmentIds.B)
            }}
            style={{ pointerEvents: 'all' }}
          >
            <polygon
              className="apartment-surface"
              fill={
                selectedApartment === apartmentIds.B ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
              }
              stroke={selectedApartment === apartmentIds.B ? '#ffc46a' : 'transparent'}
              strokeWidth="2"
              points="218.28 19.8 218.28 185.16 110.64 185.16 110.64 0 163.68 0 163.68 19.8 218.28 19.8"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            />
            <g id="B_P1">
              <path
                className="apartment-text"
                fill={selectedApartment === apartmentIds.B ? '#483b2b' : '#666'}
                d="M164.24,122.8c-12.49,0-22.61-9.94-22.61-22.19s10.12-22.19,22.61-22.19,22.61,9.94,22.61,22.19-10.12,22.19-22.61,22.19h0ZM164.24,81.31c-10.86,0-19.66,8.63-19.66,19.29s8.79,19.29,19.66,19.29,19.66-8.63,19.66-19.29-8.79-19.29-19.66-19.29h0Z"
              />
              <path
                className="apartment-text"
                fill={selectedApartment === apartmentIds.B ? '#483b2b' : '#666'}
                d="M171.19,101.33c.74.58,1.33,1.31,1.77,2.18s.67,1.74.67,2.76-.3,2.32-.96,3.34c-.67,1.02-1.55,1.74-2.81,2.32-1.18.58-2.66.87-4.29.87h-9.24v-24.3h8.87c1.7,0,3.1.29,4.29.8,1.18.58,2.07,1.31,2.66,2.18.59.94.89,1.96.89,3.12s-.37,2.61-1.18,3.55c-.81.94-1.85,1.6-3.1,2.03.89.15,1.7.51,2.44,1.09v.07h0ZM159.58,98.94h5.39c1.48,0,2.66-.36,3.55-1.02.81-.73,1.26-1.67,1.26-2.9s-.44-2.18-1.26-2.9-2-1.02-3.55-1.02h-5.32v7.83h-.07ZM169.04,109.02c.89-.73,1.33-1.74,1.33-3.12s-.44-2.39-1.4-3.19c-.96-.8-2.22-1.16-3.77-1.16h-5.62v8.56h5.69c1.63,0,2.88-.36,3.77-1.09h0Z"
              />
            </g>
          </g>
          <g
            id={apartmentIds.C}
            className="apartment-group"
            onClick={(e) => {
              e.stopPropagation()
              onEventApartment(apartmentIds.C)
            }}
            style={{ pointerEvents: 'all' }}
          >
            <rect
              className="apartment-surface"
              fill={
                selectedApartment === apartmentIds.C ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
              }
              stroke={selectedApartment === apartmentIds.C ? '#ffc46a' : 'transparent'}
              strokeWidth="2"
              x="110.64"
              y="255.88"
              width="107.64"
              height="164.88"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            />
            <g id="C_P1">
              <path
                className="apartment-text"
                fill={selectedApartment === apartmentIds.C ? '#483b2b' : '#666'}
                d="M164.11,352.29c-12.49,0-22.61-9.94-22.61-22.19s10.12-22.19,22.61-22.19,22.61,9.94,22.61,22.19-10.12,22.19-22.61,22.19h0ZM164.11,310.81c-10.86,0-19.66,8.63-19.66,19.29s8.79,19.29,19.66,19.29,19.66-8.63,19.66-19.29-8.79-19.29-19.66-19.29h0Z"
              />
              <path
                className="apartment-text"
                fill={selectedApartment === apartmentIds.C ? '#483b2b' : '#666'}
                d="M153.83,323.79c1.11-1.89,2.59-3.34,4.43-4.42s3.99-1.6,6.28-1.6,5.03.65,7.09,1.89c2,1.31,3.47,3.12,4.43,5.44h-3.84c-.67-1.45-1.7-2.61-2.96-3.41s-2.81-1.16-4.66-1.16-3.25.36-4.66,1.16c-1.4.8-2.44,1.89-3.25,3.34-.81,1.45-1.18,3.12-1.18,5.08s.37,3.63,1.18,5.08,1.85,2.54,3.25,3.34,2.96,1.16,4.66,1.16,3.33-.36,4.66-1.16c1.26-.8,2.29-1.89,2.96-3.34h3.84c-.89,2.32-2.36,4.13-4.43,5.37-2,1.23-4.36,1.89-7.09,1.89s-4.36-.51-6.28-1.6c-1.85-1.09-3.4-2.54-4.43-4.42-1.11-1.89-1.63-3.99-1.63-6.38s.52-4.5,1.63-6.38v.15Z"
              />
            </g>
          </g>
          <g
            id={apartmentIds.Oficina}
            className="apartment-group"
            onClick={(e) => {
              e.stopPropagation()
              onEventApartment(apartmentIds.Oficina)
            }}
            style={{ pointerEvents: 'all' }}
          >
            <rect
              className="apartment-surface"
              y="610.36"
              width="218.28"
              height="230.56"
              fill={
                selectedApartment === apartmentIds.Oficina
                  ? 'rgba(255, 196, 106, 0.4)'
                  : 'transparent'
              }
              stroke={selectedApartment === apartmentIds.Oficina ? '#ffc46a' : 'transparent'}
              strokeWidth="2"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            />
            <g id="Oficina_P1">
              <path
                className="apartment-text"
                fill={selectedApartment === apartmentIds.Oficina ? '#483b2b' : '#666'}
                d="M61.05,663.33c-1.29-.72-2.31-1.72-3.06-3.01-.75-1.29-1.13-2.74-1.13-4.36s.38-3.06,1.13-4.34,1.77-2.28,3.06-3c1.29-.72,2.7-1.08,4.24-1.08s2.97.36,4.26,1.08c1.29.72,2.31,1.72,3.05,3,.74,1.28,1.11,2.73,1.11,4.34s-.37,3.07-1.11,4.36c-.74,1.29-1.76,2.29-3.05,3.01-1.29.72-2.71,1.08-4.26,1.08s-2.95-.36-4.24-1.08ZM68.21,661.32c.85-.5,1.52-1.21,2.01-2.14.48-.93.72-2,.72-3.22s-.24-2.29-.72-3.2c-.48-.92-1.15-1.62-2.01-2.11-.86-.49-1.83-.74-2.92-.74s-2.06.25-2.92.74c-.86.49-1.52,1.2-2.01,2.11-.48.92-.72,1.99-.72,3.2s.24,2.29.72,3.22c.48.93,1.15,1.64,2.01,2.14.85.5,1.83.75,2.92.75s2.06-.25,2.92-.75Z"
              />
              <path
                className="apartment-text"
                fill={selectedApartment === apartmentIds.Oficina ? '#483b2b' : '#666'}
                d="M86.08,647.75v2.21h-7v4.87h5.46v2.21h-5.46v7.21h-2.71v-16.49h9.71Z"
              />
              <path
                className="apartment-text"
                d="M91.3,647.75v16.49h-2.71v-16.49h2.71Z"
                fill={selectedApartment === apartmentIds.Oficina ? '#483b2b' : '#666'}
              />
              <path
                fill={selectedApartment === apartmentIds.Oficina ? '#483b2b' : '#666'}
                className="apartment-text"
                d="M95.09,651.62c.75-1.28,1.77-2.28,3.06-3,1.29-.72,2.7-1.08,4.24-1.08,1.76,0,3.32.43,4.69,1.29,1.37.86,2.36,2.08,2.98,3.67h-3.25c-.43-.87-1.02-1.52-1.78-1.95-.76-.43-1.64-.64-2.63-.64-1.09,0-2.06.25-2.92.74-.86.49-1.52,1.2-2.01,2.11-.48.92-.72,1.99-.72,3.2s.24,2.29.72,3.2c.48.92,1.15,1.63,2.01,2.12.85.5,1.83.75,2.92.75,1,0,1.87-.21,2.63-.64.76-.43,1.35-1.08,1.78-1.95h3.25c-.62,1.58-1.61,2.8-2.98,3.66-1.37.85-2.93,1.28-4.69,1.28-1.55,0-2.97-.36-4.25-1.08-1.28-.72-2.3-1.72-3.05-3-.75-1.28-1.13-2.73-1.13-4.34s.38-3.06,1.13-4.34Z"
              />
              <path
                className="apartment-text"
                d="M115.91,647.75v16.49h-2.71v-16.49h2.71Z"
                fill={selectedApartment === apartmentIds.Oficina ? '#483b2b' : '#666'}
              />
              <path
                className="apartment-text"
                fill={selectedApartment === apartmentIds.Oficina ? '#483b2b' : '#666'}
                d="M133.02,664.25h-2.71l-8.14-12.32v12.32h-2.71v-16.52h2.71l8.14,12.3v-12.3h2.71v16.52Z"
              />
              <path
                className="apartment-text"
                fill={selectedApartment === apartmentIds.Oficina ? '#483b2b' : '#666'}
                d="M146.53,660.88h-6.91l-1.19,3.37h-2.82l5.91-16.52h3.13l5.91,16.52h-2.85l-1.19-3.37ZM145.77,658.67l-2.68-7.67-2.71,7.67h5.39Z"
              />
              <path
                className="apartment-text"
                fill={selectedApartment === apartmentIds.Oficina ? '#483b2b' : '#666'}
                d="M155.57,663.83c-.89-.39-1.58-.94-2.09-1.65-.51-.71-.76-1.54-.76-2.49h2.9c.06.71.34,1.3.84,1.76.5.46,1.2.69,2.1.69s1.66-.23,2.18-.68c.52-.45.78-1.03.78-1.74,0-.55-.16-1-.49-1.35-.32-.35-.73-.62-1.21-.81-.48-.19-1.15-.4-2.01-.62-1.08-.28-1.95-.57-2.62-.87-.67-.29-1.25-.75-1.72-1.36s-.71-1.44-.71-2.47c0-.95.24-1.78.71-2.49s1.14-1.26,1.99-1.64c.85-.38,1.84-.57,2.97-.57,1.6,0,2.91.4,3.93,1.2,1.02.8,1.59,1.9,1.7,3.29h-2.99c-.05-.6-.33-1.12-.86-1.54-.52-.43-1.21-.64-2.06-.64-.78,0-1.41.2-1.9.59-.49.4-.74.97-.74,1.71,0,.51.15.92.46,1.25.31.32.7.58,1.17.77.48.19,1.12.4,1.95.62,1.09.3,1.98.6,2.67.9.69.3,1.27.76,1.76,1.39.48.63.72,1.46.72,2.5,0,.84-.23,1.63-.68,2.37-.45.74-1.11,1.34-1.97,1.79-.86.45-1.88.68-3.05.68-1.11,0-2.1-.19-2.99-.58Z"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}

export default ModelTwelve
