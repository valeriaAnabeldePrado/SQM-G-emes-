import React, { useState } from 'react'
import './models.css'

const ModelPb = ({ onEventApartment, selectedApartment }) => {
  console.log('ModelPb rendered with selectedApartment:', selectedApartment)

  // Estado para el hover en la imagen
  const [hoveredApartment, setHoveredApartment] = useState(null)

  // Generar IDs dinámicos basados en el piso PB (Planta Baja)
  const apartmentIds = {
  A: `duplex_A_PB`,
  B: `estudio_B_PB`,
  C: `duplex_C_PB`,
  LOCAL: `local_comercial_PB`,
  OFICINA: `oficina_A_P00`
  }

  // Función para determinar si un apartamento está activo
  const isApartmentActive = (apartmentId) => {
    return selectedApartment === apartmentId || hoveredApartment === apartmentId
  }

  // Manejadores de eventos
  // const handleMouseEnter = () => {
  //   // Lógica de hover si es necesaria
  // }

  const handleMouseLeave = () => {
    setHoveredApartment(null)
  }

  // Manejador de hover específico
  const handleHover = (apartmentId) => {
    setHoveredApartment(apartmentId)
  }

  // Manejador de click
  const handleClick = (apartmentId, e) => {
    e.stopPropagation()
  console.log('ModelPb clicked apartmentId:', apartmentId)
  onEventApartment(apartmentId)
  }

  return (
    <div
      className="floorplan-container animateInPlant"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px'
      }}
    >
      {/* PNG principal como fondo */}
      <img
        src="/planos/0/planta.png"
        alt="Planta del piso"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          maxHeight: '100%',
          objectFit: 'contain'
        }}
        onLoad={() => console.log('Imagen cargada correctamente')}
        onError={(e) => {
          console.log('Error cargando imagen:', e)
          e.target.style.display = 'none'
        }}
      />

      {/* SVG superpuesto para selecciones precisas */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}
      >
        <svg
          className="animateInPlant"
          id="PlantaBaja"
          xmlns="http://www.w3.org/2000/svg"
          data-name="Capa 2"
          viewBox="0 0 223.98 701.13"
          style={{
            position: 'absolute',
            top: '13%',
            left: '11%',
            width: '76%',
            height: '76%',
            pointerEvents: 'none'
          }}
        >
          <defs>
            <style>{'.cls-3{fill:#ffc46a}.cls-4{fill:#483b2b}'}</style>
          </defs>
          <g id="Capa_1-2" data-name="Capa 1">
            {/* dpto-a-PB */}
            <g
              id={apartmentIds.A}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.A, e)}
              style={{ cursor: 'pointer', pointerEvents: 'all' }}
            >
              <path
                className="apartment-surface"
                d="M223.98 229.74V399.3h-63.42V254.12H143.2v-24.38h80.78z"
                fill={
                  isApartmentActive(apartmentIds.A) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.A) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                onMouseEnter={() => handleHover(apartmentIds.A)}
                onMouseLeave={handleMouseLeave}
              />
              {isApartmentActive(apartmentIds.A) && (
                <g>
                  <path
                    d="M191.56 316.16c-12.15 0-22-9.85-22-22s9.85-22 22-22 22 9.85 22 22-9.85 22-22 22Zm0-41.05c-10.57 0-19.12 8.56-19.12 19.12s8.56 19.12 19.12 19.12 19.12-8.56 19.12-19.12-8.56-19.12-19.12-19.12Z"
                    className="cls-4"
                  />
                  <path
                    d="M196.37 299.13h-10.5l-1.94 5.32h-3.31l8.7-23.94h3.59l8.63 23.94h-3.31l-1.94-5.32h.08Zm-.86-2.52-4.31-12.15-4.31 12.15h8.7-.08Z"
                    className="cls-4"
                  />
                </g>
              )}
            </g>

            {/* dpto-b-PB */}
            <g
              id={apartmentIds.B}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.B, e)}
              style={{ cursor: 'pointer', pointerEvents: 'all' }}
            >
              <path
                className="apartment-surface"
                d="M65.61 256.56h92.51v142.2H65.61z"
                fill={
                  isApartmentActive(apartmentIds.B) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.B) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                onMouseEnter={() => handleHover(apartmentIds.B)}
                onMouseLeave={handleMouseLeave}
              />
              {isApartmentActive(apartmentIds.B) && (
                <g>
                  <path
                    d="M112.57 361.05c-12.49 0-22.61-9.94-22.61-22.19s10.12-22.19 22.61-22.19 22.61 9.94 22.61 22.19-10.12 22.19-22.61 22.19Zm0-41.49c-10.86 0-19.66 8.63-19.66 19.29s8.79 19.29 19.66 19.29 19.66-8.63 19.66-19.29-8.79-19.29-19.66-19.29Z"
                    className="cls-4"
                  />
                  <path
                    d="M119.52 339.58c.74.58 1.33 1.31 1.77 2.18s.67 1.74.67 2.76-.3 2.32-.96 3.34c-.67 1.02-1.55 1.74-2.81 2.32-1.18.58-2.66.87-4.29.87h-9.24v-24.3h8.87c1.7 0 3.1.29 4.29.8 1.18.58 2.07 1.31 2.66 2.18.59.94.89 1.96.89 3.12s-.37 2.61-1.18 3.55-1.85 1.6-3.1 2.03c.89.15 1.7.51 2.44 1.09v.07Zm-11.61-2.39h5.39c1.48 0 2.66-.36 3.55-1.02.81-.73 1.26-1.67 1.26-2.9s-.44-2.18-1.26-2.9-2-1.02-3.55-1.02h-5.32v7.83h-.07Zm9.46 10.08c.89-.73 1.33-1.74 1.33-3.12s-.44-2.39-1.4-3.19c-.96-.8-2.22-1.16-3.77-1.16h-5.62v8.56h5.69c1.63 0 2.88-.36 3.77-1.09Z"
                    className="cls-4"
                  />
                </g>
              )}
            </g>

            {/* dpto-c-PB */}
            <g
              id={apartmentIds.C}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.C, e)}
              style={{ cursor: 'pointer', pointerEvents: 'all' }}
            >
              <path
                className="apartment-surface"
                d="M89.27 229.74v24.38H63.53v144.93L0 399.3V229.74h89.27z"
                fill={
                  isApartmentActive(apartmentIds.C) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.C) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                onMouseEnter={() => handleHover(apartmentIds.C)}
                onMouseLeave={handleMouseLeave}
              />
              {isApartmentActive(apartmentIds.C) && (
                <g>
                  <path
                    d="M31.43 316.48c-12.49 0-22.61-9.94-22.61-22.19s10.12-22.19 22.61-22.19 22.61 9.94 22.61 22.19-10.12 22.19-22.61 22.19Zm0-41.48c-10.86 0-19.66 8.63-19.66 19.29s8.79 19.29 19.66 19.29 19.66-8.63 19.66-19.29S42.3 275 31.43 275Z"
                    className="cls-4"
                  />
                  <path
                    d="M21.15 287.98c1.11-1.89 2.59-3.34 4.43-4.42s3.99-1.6 6.28-1.6 5.03.65 7.09 1.89c2 1.31 3.47 3.12 4.43 5.44h-3.84c-.67-1.45-1.7-2.61-2.96-3.41s-2.81-1.16-4.66-1.16-3.25.36-4.66 1.16c-1.4.8-2.44 1.89-3.25 3.34s-1.18 3.12-1.18 5.08.37 3.63 1.18 5.08s1.85 2.54 3.25 3.34 2.96 1.16 4.66 1.16 3.33-.36 4.66-1.16c1.26-.8 2.29-1.89 2.96-3.34h3.84c-.89 2.32-2.36 4.13-4.43 5.37-2 1.23-4.36 1.89-7.09 1.89s-4.36-.51-6.28-1.6c-1.85-1.09-3.4-2.54-4.43-4.42-1.11-1.89-1.63-3.99-1.63-6.38s.52-4.5 1.63-6.38v.15-.03Z"
                    className="cls-4"
                  />
                </g>
              )}
            </g>

            {/* Local-PB */}
            <g
              id={apartmentIds.LOCAL}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.LOCAL, e)}
              style={{ cursor: 'pointer', pointerEvents: 'all' }}
            >
              <path
                className="apartment-surface"
                d="M180.27 0v120.8l-91.12-.13v.13l.12 32.5H0V0h180.27z"
                fill={
                  isApartmentActive(apartmentIds.LOCAL) ? 'rgba(255, 196, 106, 0.4)' : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.LOCAL) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                onMouseEnter={() => handleHover(apartmentIds.LOCAL)}
                onMouseLeave={handleMouseLeave}
              />
              {isApartmentActive(apartmentIds.LOCAL) && (
                <path
                  d="M55.96 41.28h5.49v2.15H53.3V27.2h2.66v14.08ZM66.9 42.53a7.876 7.876 0 0 1-3.01-2.97c-.74-1.27-1.11-2.7-1.11-4.28s.37-3.01 1.11-4.27a7.895 7.895 0 0 1 3.01-2.95c1.27-.71 2.66-1.06 4.17-1.06s2.92.35 4.19 1.06a7.8 7.8 0 0 1 3 2.95c.73 1.26 1.1 2.69 1.1 4.27s-.37 3.02-1.1 4.28a7.782 7.782 0 0 1-3 2.97c-1.27.71-2.67 1.06-4.19 1.06s-2.9-.35-4.17-1.06Zm7.04-1.98c.84-.49 1.5-1.19 1.97-2.1.47-.91.71-1.96.71-3.16s-.24-2.25-.71-3.15c-.47-.9-1.13-1.6-1.97-2.08-.84-.48-1.8-.72-2.87-.72s-2.03.24-2.87.72c-.84.48-1.5 1.18-1.97 2.08-.47.9-.71 1.95-.71 3.15s.24 2.25.71 3.16c.47.91 1.13 1.61 1.97 2.1s1.8.74 2.87.74s2.03-.25 2.87-.74ZM82.19 31.01a7.895 7.895 0 0 1 3.01-2.95c1.27-.71 2.66-1.06 4.17-1.06 1.73 0 3.26.42 4.61 1.27 1.35.85 2.32 2.05 2.93 3.61h-3.2c-.42-.86-1-1.49-1.75-1.91-.75-.42-1.61-.63-2.59-.63-1.07 0-2.03.24-2.87.72-.84.48-1.5 1.18-1.97 2.08-.47.9-.71 1.95-.71 3.15s.24 2.25.71 3.15c.47.9 1.13 1.6 1.97 2.09.84.49 1.8.74 2.87.74.98 0 1.84-.21 2.59-.63.75-.42 1.33-1.06 1.75-1.91h3.2c-.61 1.56-1.58 2.75-2.93 3.6-1.35.84-2.88 1.26-4.61 1.26-1.53 0-2.92-.35-4.18-1.06a7.94 7.94 0 0 1-3-2.95c-.74-1.26-1.11-2.69-1.11-4.27s.37-3.01 1.11-4.27ZM109.8 40.12h-6.79l-1.17 3.32h-2.78l5.81-16.25h3.08l5.81 16.25h-2.8l-1.17-3.32Zm-.75-2.17-2.64-7.54-2.66 7.54h5.3ZM118.95 41.28h5.49v2.15h-8.15V27.2h2.66v14.08Z"
                  className="cls-4"
                />
              )}
            </g>

            {/* ofi-pb */}
            <g
              id={apartmentIds.OFICINA}
              className="apartment-group"
              onClick={(e) => handleClick(apartmentIds.OFICINA, e)}
              style={{ cursor: 'pointer', pointerEvents: 'all' }}
            >
              <path
                className="apartment-surface"
                d="M0 610.16h223.98v150H0z"
                fill={
                  isApartmentActive(apartmentIds.OFICINA)
                    ? 'rgba(255, 196, 106, 0.4)'
                    : 'transparent'
                }
                stroke={isApartmentActive(apartmentIds.OFICINA) ? '#ffc46a' : 'transparent'}
                strokeWidth="2"
                onMouseEnter={() => handleHover(apartmentIds.OFICINA)}
                onMouseLeave={handleMouseLeave}
              />
              {isApartmentActive(apartmentIds.OFICINA) && (
                <path
                  d="M55.12 645.94a7.97 7.97 0 0 1-3.06-3.01c-.75-1.29-1.13-2.74-1.13-4.36s.38-3.06 1.13-4.34 1.77-2.28 3.06-3 2.7-1.08 4.24-1.08 2.97.36 4.26 1.08a7.92 7.92 0 0 1 3.05 3c.74 1.28 1.11 2.73 1.11 4.34s-.37 3.07-1.11 4.36-1.76 2.29-3.05 3.01c-1.29.72-2.71 1.08-4.26 1.08s-2.95-.36-4.24-1.08Zm7.16-2.01c.85-.5 1.52-1.21 2.01-2.14.48-.93.72-2 .72-3.22s-.24-2.29-.72-3.2c-.48-.92-1.15-1.62-2.01-2.11s-1.83-.74-2.92-.74-2.06.25-2.92.74c-.86.49-1.52 1.2-2.01 2.11-.48.92-.72 1.99-.72 3.2s.24 2.29.72 3.22s1.15 1.64 2.01 2.14c.85.5 1.83.75 2.92.75s2.06-.25 2.92-.75ZM80.15 630.36v2.21h-7v4.87h5.46v2.21h-5.46v7.21h-2.71v-16.49h9.71ZM85.37 630.36v16.49h-2.71v-16.49h2.71ZM89.16 634.23c.75-1.28 1.77-2.28 3.06-3s2.7-1.08 4.24-1.08c1.76 0 3.32.43 4.69 1.29s2.36 2.08 2.98 3.67h-3.25c-.43-.87-1.02-1.52-1.78-1.95s-1.64-.64-2.63-.64c-1.09 0-2.06.25-2.92.74s-1.52 1.2-2.01 2.11c-.48.92-.72 1.99-.72 3.2s.24 2.29.72 3.2c.48.92 1.15 1.63 2.01 2.12.85.5 1.83.75 2.92.75 1 0 1.87-.21 2.63-.64.76-.43 1.35-1.08 1.78-1.95h3.25c-.62 1.58-1.61 2.8-2.98 3.66-1.37.85-2.93 1.28-4.69 1.28-1.55 0-2.97-.36-4.25-1.08-1.28-.72-2.3-1.72-3.05-3s-1.13-2.73-1.13-4.34.38-3.06 1.13-4.34ZM109.98 630.36v16.49h-2.71v-16.49h2.71ZM127.09 646.86h-2.71l-8.14-12.32v12.32h-2.71v-16.52h2.71l8.14 12.3v-12.3h2.71v16.52ZM140.6 643.49h-6.91l-1.19 3.37h-2.82l5.91-16.52h3.13l5.91 16.52h-2.85l-1.19-3.37h.01Zm-.76-2.21-2.68-7.67-2.71 7.67h5.39ZM149.64 646.44c-.89-.39-1.58-.94-2.09-1.65s-.76-1.54-.76-2.49h2.9c.06.71.34 1.3.84 1.76s1.2.69 2.1.69 1.66-.23 2.18-.68c.52-.45.78-1.03.78-1.74 0-.55-.16-1-.49-1.35-.32-.35-.73-.62-1.21-.81-.48-.19-1.15-.4-2.01-.62-1.08-.28-1.95-.57-2.62-.87-.67-.29-1.25-.75-1.72-1.36s-.71-1.44-.71-2.47c0-.95.24-1.78.71-2.49s1.14-1.26 1.99-1.64 1.84-.57 2.97-.57c1.6 0 2.91.4 3.93 1.2 1.02.8 1.59 1.9 1.7 3.29h-2.99c-.05-.6-.33-1.12-.86-1.54-.52-.43-1.21-.64-2.06-.64-.78 0-1.41.2-1.9.59-.49.4-.74.97-.74 1.71 0 .51.15.92.46 1.25.31.32.7.58 1.17.77.48.19 1.12.4 1.95.62 1.09.3 1.98.6 2.67.9.69.3 1.27.76 1.76 1.39.48.63.72 1.46.72 2.5 0 .84-.23 1.63-.68 2.37s-1.11 1.34-1.97 1.79c-.86.45-1.88.68-3.05.68s-2.1-.19-2.99-.58h.02Z"
                  className="cls-4"
                />
              )}
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default ModelPb
