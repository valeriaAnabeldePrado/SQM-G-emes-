import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  MdOutlineArrowBack,
  MdOutlineArrowOutward,
  MdBed,
  MdBathtub,
  MdSquareFoot,
  MdBalcony,
  MdKitchen,
  MdLocalParking,
  MdHome,
  MdViewQuilt
} from 'react-icons/md'
import { Card } from '../home/components/card'
import Button from '../home/components/button'
import apartmentData from './utils/apartmentData.json'
import SectionFooter from '../home/section-footer'

const ApartmentDetail = () => {
  const { apartmentId } = useParams()
  const navigate = useNavigate()

  const apartment = apartmentData[apartmentId]
  console.log(apartment)

  // Función para obtener la letra del apartamento
  const getApartmentLetter = (apartmentId) => {
    if (!apartmentId) return null
    const lower = apartmentId.toLowerCase()
    if (lower.startsWith('local')) return 'LOCAL'
    if (lower.startsWith('oficina')) return 'OFICINA'
    const parts = apartmentId.split('_')
    return parts[1] // apartment_A_P5 -> A
  }

  // Función para obtener el número de piso del apartmentId
  const getFloorNumber = (apartmentId) => {
    if (!apartmentId) return null
    const parts = apartmentId.split('_')
    const floorPart = parts[2] // apartment_A_P5 -> P5
    if (!floorPart) return null
    // soportar casos como P00 o PB o nombres sin P
    const match = floorPart.match(/P(\d+)/i)
    if (match) return parseInt(match[1], 10)
    return null
  }

  // Función para determinar qué layout usar según el piso
  const getFloorLayout = (apartmentId) => {
    // Detectar oficinas
    if (apartmentId.includes('oficina_')) {
      const floorNumber = getFloorNumber(apartmentId)
      if (floorNumber === 0 || !floorNumber) return 'modelDuplex' // oficina PB
      return 'modelOficina' // oficinas pisos 1-4
    }

    // Detectar duplex por el ID
    if (
      apartmentId.includes('duplex_') ||
      apartmentId.includes('estudio_') ||
      apartmentId.includes('entrepiso_')
    ) {
      return 'modelDuplex'
    }

    const floorNumber = getFloorNumber(apartmentId)
    if (floorNumber === 0) return 'modelDuplex'
    if (!floorNumber) return 'modelThree' // default
    if (floorNumber >= 1 && floorNumber <= 3) return 'modelOne'
    if (floorNumber === 4) return 'modelTwo'
    if (floorNumber >= 5 && floorNumber <= 6) return 'modelThree'
    if (floorNumber >= 7 && floorNumber <= 10) return 'modelFour'
    if (floorNumber >= 11 && floorNumber <= 13) return 'modelFive'
    if (floorNumber === 14) return 'modelFourteen'
    if (floorNumber === 15) return 'modelFifteen'
    return 'modelThree' // default
  }

  // Función para obtener el icono apropiado según la característica
  const getFeatureIcon = (feature) => {
    const featureLower = feature.toLowerCase()

    if (
      featureLower.includes('dormitorio') ||
      featureLower.includes('habitación') ||
      featureLower.includes('bedroom')
    ) {
      return <MdBed size={16} />
    }
    if (
      featureLower.includes('baño') ||
      featureLower.includes('bathroom') ||
      featureLower.includes('toilette')
    ) {
      return <MdBathtub size={16} />
    }
    if (
      featureLower.includes('m²') ||
      featureLower.includes('metro') ||
      featureLower.includes('superficie')
    ) {
      return <MdSquareFoot size={16} />
    }
    if (
      featureLower.includes('balcón') ||
      featureLower.includes('terraza') ||
      featureLower.includes('balcony')
    ) {
      return <MdBalcony size={16} />
    }
    if (featureLower.includes('cocina') || featureLower.includes('kitchen')) {
      return <MdKitchen size={16} />
    }
    if (
      featureLower.includes('estacionamiento') ||
      featureLower.includes('parking') ||
      featureLower.includes('cochera')
    ) {
      return <MdLocalParking size={16} />
    }
    if (
      featureLower.includes('ambiente') ||
      featureLower.includes('living') ||
      featureLower.includes('sala')
    ) {
      return <MdHome size={16} />
    }
    // Icono por defecto
    return <MdViewQuilt size={16} />
  }

  // Función para generar el SVG de referencia del apartamento
  const renderApartmentReference = (apartmentId, size = 'normal') => {
    const letter = getApartmentLetter(apartmentId)
    const layout = getFloorLayout(apartmentId)
    if (!letter) return null

    // Configuración de tamaños según el contexto
    const sizeConfig = {
      compact: {
        container: 'w-[80px] lg:w-[100px]',

        fontSize: '12px'
      },
      normal: {
        container: 'w-full max-w-[140px] lg:max-w-[180px] mx-auto',

        fontSize: '16px'
      }
    }

    const config = sizeConfig[size] || sizeConfig.normal

    // Para ModelDuplex (planta baja con duplex A, C, estudio B y entrepiso E)
    if (layout === 'modelDuplex') {
      return (
        <div className={config.container}>
          <div className="bg-white rounded-lg border border-gray-200 p-2 lg:p-3">
            <svg
              id="PlantaDuplex"
              data-name="Capa 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 223.98 701.13"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: config.maxHeight
              }}
            >
              <defs>
                <style>{`
                  .cls-3{fill:#ffc46a}
                  .cls-4{fill:#483b2b}
                `}</style>
              </defs>
              <g id="Capa_1-2" data-name="Capa 1">
                {/* dpto-a-PB */}
                <g className="apartment-group">
                  <path
                    className="apartment-surface"
                    d="M223.98 229.74V399.3h-63.42V254.12H143.2v-24.38h80.78z"
                    fill={letter === 'A' ? 'rgba(255, 196, 106, 0.4)' : 'rgba(200, 200, 200, 0.3)'}
                    stroke={letter === 'A' ? '#ffc46a' : '#999'}
                    strokeWidth="2"
                  />
                  {letter === 'A' && (
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
                <g className="apartment-group">
                  <path
                    className="apartment-surface"
                    d="M65.61 256.56h92.51v142.2H65.61z"
                    fill={letter === 'B' ? 'rgba(255, 196, 106, 0.4)' : 'rgba(200, 200, 200, 0.3)'}
                    stroke={letter === 'B' ? '#ffc46a' : '#999'}
                    strokeWidth="2"
                  />
                  {letter === 'B' && (
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
                <g className="apartment-group">
                  <path
                    className="apartment-surface"
                    d="M89.27 229.74v24.38H63.53v144.93L0 399.3V229.74h89.27z"
                    fill={letter === 'C' ? 'rgba(255, 196, 106, 0.4)' : 'rgba(200, 200, 200, 0.3)'}
                    stroke={letter === 'C' ? '#ffc46a' : '#999'}
                    strokeWidth="2"
                  />
                  {letter === 'C' && (
                    <g>
                      <path
                        d="M31.43 316.48c-12.49 0-22.61-9.94-22.61-22.19s10.12-22.19 22.61-22.19 22.61 9.94 22.61 22.19-10.12 22.19-22.61 22.19Zm0-41.48c-10.86 0-19.66 8.63-19.66 19.29s8.79 19.29 19.66 19.29 19.66-8.63 19.66-19.29S42.3 275 31.43 275Z"
                        className="cls-4"
                      />
                      <path
                        d="M21.15 287.98c1.11-1.89 2.59-3.34 4.43-4.42s3.99-1.6 6.28-1.6 5.03.65 7.09 1.89c2 1.31 3.47 3.12 4.43 5.44h-3.84c-.67-1.45-1.7-2.61-2.96-3.41s-2.81-1.16-4.66-1.16-3.25.36-4.66 1.16c-1.4.8-2.44 1.89-3.25 3.34s-1.18 3.12-1.18 5.08.37 3.63 1.18 5.08s1.85 2.54 3.25 3.34 2.96 1.16 4.66 1.16s3.33-.36 4.66-1.16c1.26-.8 2.29-1.89 2.96-3.34h3.84c-.89 2.32-2.36 4.13-4.43 5.37-2 1.23-4.36 1.89-7.09 1.89s-4.36-.51-6.28-1.6c-1.85-1.09-3.4-2.54-4.43-4.42-1.11-1.89-1.63-3.99-1.63-6.38s.52-4.5 1.63-6.38v.15-.03Z"
                        className="cls-4"
                      />
                    </g>
                  )}
                </g>

                {/* Local-PB */}
                <g className="apartment-group">
                  <path
                    className="apartment-surface"
                    d="M180.27 0v120.8l-91.12-.13v.13l.12 32.5H0V0h180.27z"
                    fill={
                      letter === 'LOCAL' ? 'rgba(255, 196, 106, 0.4)' : 'rgba(200, 200, 200, 0.3)'
                    }
                    stroke={letter === 'LOCAL' ? '#ffc46a' : '#999'}
                    strokeWidth="2"
                  />
                  {letter === 'LOCAL' && (
                    <path
                      d="M55.96 41.28h5.49v2.15H53.3V27.2h2.66v14.08ZM66.9 42.53a7.876 7.876 0 0 1-3.01-2.97c-.74-1.27-1.11-2.7-1.11-4.28s.37-3.01 1.11-4.27a7.895 7.895 0 0 1 3.01-2.95c1.27-.71 2.66-1.06 4.17-1.06s2.92.35 4.19 1.06a7.8 7.8 0 0 1 3 2.95c.73 1.26 1.1 2.69 1.1 4.27s-.37 3.02-1.1 4.28a7.782 7.782 0 0 1-3 2.97c-1.27.71-2.67 1.06-4.19 1.06s-2.9-.35-4.17-1.06Zm7.04-1.98c.84-.49 1.5-1.19 1.97-2.1.47-.91.71-1.96.71-3.16s-.24-2.25-.71-3.15c-.47-.9-1.13-1.6-1.97-2.08-.84-.48-1.8-.72-2.87-.72s-2.03.24-2.87.72c-.84.48-1.5 1.18-1.97 2.08-.47.9-.71 1.95-.71 3.15s.24 2.25.71 3.16c.47.91 1.13 1.61 1.97 2.1s1.8.74 2.87.74s2.03-.25 2.87-.74ZM82.19 31.01a7.895 7.895 0 0 1 3.01-2.95c1.27-.71 2.66-1.06 4.17-1.06 1.73 0 3.26.42 4.61 1.27 1.35.85 2.32 2.05 2.93 3.61h-3.2c-.42-.86-1-1.49-1.75-1.91-.75-.42-1.61-.63-2.59-.63-1.07 0-2.03.24-2.87.72-.84.48-1.5 1.18-1.97 2.08-.47.9-.71 1.95-.71 3.15s.24 2.25.71 3.15c.47.9 1.13 1.6 1.97 2.09.84.49 1.8.74 2.87.74.98 0 1.84-.21 2.59-.63.75-.42 1.33-1.06 1.75-1.91h3.2c-.61 1.56-1.58 2.75-2.93 3.6-1.35.84-2.88 1.26-4.61 1.26-1.53 0-2.92-.35-4.18-1.06a7.94 7.94 0 0 1-3-2.95c-.74-1.26-1.11-2.69-1.11-4.27s.37-3.01 1.11-4.27ZM109.8 40.12h-6.79l-1.17 3.32h-2.78l5.81-16.25h3.08l5.81 16.25h-2.8l-1.17-3.32Zm-.75-2.17-2.64-7.54-2.66 7.54h5.3ZM118.95 41.28h5.49v2.15h-8.15V27.2h2.66v14.08Z"
                      className="cls-4"
                    />
                  )}
                </g>

                {/* ofi-pb */}
                <g className="apartment-group">
                  <path
                    className="apartment-surface"
                    d="M0 610.16h223.98v150H0z"
                    fill={
                      letter === 'OFICINA' ? 'rgba(255, 196, 106, 0.4)' : 'rgba(200, 200, 200, 0.3)'
                    }
                    stroke={letter === 'OFICINA' ? '#ffc46a' : '#999'}
                    strokeWidth="2"
                  />
                  {letter === 'OFICINA' && (
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

    // Para ModelOficina (oficinas pisos 1-4)
    if (layout === 'modelOficina') {
      return (
        <div className={config.container}>
          <div className="bg-white rounded-lg border border-gray-200 p-2 lg:p-3">
            <svg
              id="PlantaOficina"
              data-name="Capa 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 218.28 388.08"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: config.maxHeight
              }}
            >
              <defs>
                <style>{`
                  .apartment-text {
                    font-family: Arial, sans-serif;
                    font-size: ${config.fontSize};
                    font-weight: bold;
                  }
                `}</style>
              </defs>
              <g data-name="Capa 1">
                {/* Rectángulo central */}
                <rect
                  x="0"
                  y="188.16"
                  width="180.48"
                  height="54.36"
                  fill="#f0f0f0"
                  stroke="#ddd"
                  strokeWidth="1"
                />

                {/* Departamento A */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'A' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="107.64 0 107.64 185.16 0 185.16 0 19.92 54.6 19.92 54.6 0 107.64 0"
                  />
                  {letter === 'A' && (
                    <g>
                      <circle
                        cx="54"
                        cy="92.5"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="54"
                        y="98"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        A
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento B */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'B' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="218.28 19.92 218.28 185.16 110.64 185.16 110.64 0 163.56 0 163.56 19.92 218.28 19.92"
                  />
                  {letter === 'B' && (
                    <g>
                      <circle
                        cx="164"
                        cy="92.5"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="164"
                        y="98"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        B
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento D (Oficina) */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'OFICINA' || letter === 'D' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="107.52 245.52 107.52 369.24 58.56 369.24 58.56 388.08 9 388.08 9 369.24 0 369.24 0 245.52 107.52 245.52"
                  />
                  {(letter === 'OFICINA' || letter === 'D') && (
                    <g>
                      <circle
                        cx="54"
                        cy="307"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="54"
                        y="313"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                        fontSize="10"
                      >
                        OFI
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento C */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'C' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="218.28 245.4 218.28 369.24 209.28 369.24 209.28 388.08 159.72 388.08 159.72 369.24 110.52 369.24 110.52 245.4 218.28 245.4"
                  />
                  {letter === 'C' && (
                    <g>
                      <circle
                        cx="164"
                        cy="307"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="164"
                        y="313"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        C
                      </text>
                    </g>
                  )}
                </g>
              </g>
            </svg>
          </div>
        </div>
      )
    }

    // Para ModelFour (pisos 7-10) que solo tiene A, B, C
    if (layout === 'modelFour') {
      return (
        <div className={config.container}>
          <div className="bg-white rounded-lg border border-gray-200 p-2 lg:p-3">
            <svg
              data-name="Capa 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 218.4 387.96"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: config.maxHeight
              }}
            >
              <defs>
                <style>{`
                  .apartment-text {
                    font-family: Arial, sans-serif;
                    font-size: ${config.fontSize};
                    font-weight: bold;
                  }
                `}</style>
              </defs>
              <g data-name="Capa 1">
                {/* Rectángulo central */}
                <rect
                  x=".24"
                  y="188.04"
                  width="180.48"
                  height="54.36"
                  fill="#f0f0f0"
                  stroke="#ddd"
                  strokeWidth="1"
                />

                {/* Departamento A */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'A' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="107.88 0 107.88 185.16 .24 185.16 .24 19.8 54.84 19.8 54.84 0 107.88 0"
                  />
                  {letter === 'A' && (
                    <g>
                      <circle
                        cx="55"
                        cy="92.5"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="55"
                        y="98"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        A
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento B */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'B' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="218.4 19.8 218.4 185.16 110.76 185.16 110.76 0 163.8 0 163.8 19.8 218.4 19.8"
                  />
                  {letter === 'B' && (
                    <g>
                      <circle
                        cx="164"
                        cy="92.5"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="164"
                        y="98"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        B
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento C */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'C' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="218.28 245.4 218.28 369.12 209.4 369.12 209.4 387.96 159.72 387.96 159.72 369.12 58.56 369.12 58.56 387.96 9 387.96 9 369.12 0 369.12 0 245.4 218.28 245.4"
                  />
                  {letter === 'C' && (
                    <g>
                      <circle
                        cx="109"
                        cy="307"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="109"
                        y="313"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        C
                      </text>
                    </g>
                  )}
                </g>
              </g>
            </svg>
          </div>
        </div>
      )
    }

    // Para ModelFive (pisos 11-12) con A, B, C, D (4 departamentos)
    if (layout === 'modelFive') {
      return (
        <div className={config.container}>
          <div className="bg-white rounded-lg border border-gray-200 p-2 lg:p-3">
            <svg
              data-name="Capa 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 218.4 387.96"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: config.maxHeight
              }}
            >
              <defs>
                <style>{`
                  .apartment-text {
                    font-family: Arial, sans-serif;
                    font-size: ${config.fontSize};
                    font-weight: bold;
                  }
                `}</style>
              </defs>
              <g data-name="Capa 1">
                {/* Rectángulo central */}
                <rect
                  x=".24"
                  y="188.04"
                  width="180.48"
                  height="54.36"
                  fill="#f0f0f0"
                  stroke="#ddd"
                  strokeWidth="1"
                />

                {/* Departamento A */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'A' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="107.88 0 107.88 185.16 .24 185.16 .24 19.8 54.84 19.8 54.84 0 107.88 0"
                  />
                  {letter === 'A' && (
                    <g>
                      <circle
                        cx="55"
                        cy="92.5"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="55"
                        y="98"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        A
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento B */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'B' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="218.4 19.8 218.4 185.16 110.76 185.16 110.76 0 163.8 0 163.8 19.8 218.4 19.8"
                  />
                  {letter === 'B' && (
                    <g>
                      <circle
                        cx="164"
                        cy="92.5"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="164"
                        y="98"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        B
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento C */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'C' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="218.28 245.4 218.28 369.24 209.28 369.24 209.28 388.08 159.72 388.08 159.72 369.24 110.52 369.24 110.52 245.4 218.28 245.4"
                  />
                  {letter === 'C' && (
                    <g>
                      <circle
                        cx="164"
                        cy="307"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="164"
                        y="313"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        C
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento D */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'D' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="107.52 245.52 107.52 369.24 58.56 369.24 58.56 388.08 9 388.08 9 369.24 0 369.24 0 245.52 107.52 245.52"
                  />
                  {letter === 'D' && (
                    <g>
                      <circle
                        cx="54"
                        cy="307"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="54"
                        y="313"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        D
                      </text>
                    </g>
                  )}
                </g>
              </g>
            </svg>
          </div>
        </div>
      )
    }

    // Para ModelSix (piso 13) con A, B, C, D (4 departamentos)
    if (layout === 'modelSix') {
      return (
        <div className={config.container}>
          <div className="bg-white rounded-lg border border-gray-200 p-2 lg:p-3">
            <svg
              data-name="Capa 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 218.4 387.96"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: config.maxHeight
              }}
            >
              <defs>
                <style>{`
                  .apartment-text {
                    font-family: Arial, sans-serif;
                    font-size: ${config.fontSize};
                    font-weight: bold;
                  }
                `}</style>
              </defs>
              <g data-name="Capa 1">
                {/* Rectángulo central */}
                <rect
                  x=".24"
                  y="188.04"
                  width="180.48"
                  height="54.36"
                  fill="#f0f0f0"
                  stroke="#ddd"
                  strokeWidth="1"
                />

                {/* Departamento A */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'A' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="107.88 0 107.88 185.16 .24 185.16 .24 19.8 54.84 19.8 54.84 0 107.88 0"
                  />
                  {letter === 'A' && (
                    <g>
                      <circle
                        cx="55"
                        cy="92.5"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="55"
                        y="98"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        A
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento B */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'B' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="218.4 19.8 218.4 185.16 110.76 185.16 110.76 0 163.8 0 163.8 19.8 218.4 19.8"
                  />
                  {letter === 'B' && (
                    <g>
                      <circle
                        cx="164"
                        cy="92.5"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="164"
                        y="98"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        B
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento C */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'C' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="218.28 245.4 218.28 369.24 209.28 369.24 209.28 388.08 159.72 388.08 159.72 369.24 110.52 369.24 110.52 245.4 218.28 245.4"
                  />
                  {letter === 'C' && (
                    <g>
                      <circle
                        cx="164"
                        cy="307"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="164"
                        y="313"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        C
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento D */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'D' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="107.52 245.52 107.52 369.24 58.56 369.24 58.56 388.08 9 388.08 9 369.24 0 369.24 0 245.52 107.52 245.52"
                  />
                  {letter === 'D' && (
                    <g>
                      <circle
                        cx="54"
                        cy="307"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="54"
                        y="313"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        D
                      </text>
                    </g>
                  )}
                </g>
              </g>
            </svg>
          </div>
        </div>
      )
    }

    // Para ModelFourteen (piso 14 - duplex con A, B, C, D, E)
    if (layout === 'modelFourteen') {
      return (
        <div className={config.container}>
          <div className="bg-white rounded-lg border border-gray-200 p-2 lg:p-3">
            <svg
              id="PlantaFourteen"
              data-name="Capa 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 609 420"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: config.maxHeight
              }}
            >
              <defs>
                <style>{`
                  .apartment-text {
                    font-family: Arial, sans-serif;
                    font-size: ${config.fontSize};
                    font-weight: bold;
                  }
                `}</style>
              </defs>
              <g id="Duplex" transform="translate(3, 45)">
                {/* Pasillo central */}
                <polygon
                  className="pasillo"
                  points="380.41 59.32 380.41 342.56 285.87 342.56 285.87 207.15 248.4 207.15 248.4 116.57 279.66 116.57 279.66 135.59 285.87 135.59 285.87 59.32 380.41 59.32"
                  fill="rgba(147, 149, 152, 0.3)"
                />

                {/* Departamento A */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'A' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="279.66 211.49 279.66 342.18 26.37 342.18 26.37 322.97 0 322.97 0 247.27 26.37 247.27 26.37 230.88 248.4 230.88 248.4 211.49 279.66 211.49"
                  />
                  {letter === 'A' && (
                    <g>
                      <circle
                        cx="140"
                        cy="285"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="140"
                        y="291"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        A
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento B */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'B' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="243.69 116.57 243.69 226.17 26.37 226.17 26.37 209.79 0 209.79 0 132.96 26.37 132.96 26.37 116.57 243.69 116.57"
                  />
                  {letter === 'B' && (
                    <g>
                      <circle
                        cx="120"
                        cy="175"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="120"
                        y="181"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        B
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento C */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'C' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="279.66 .19 279.66 112.05 26.37 112.05 26.37 95.67 0 95.67 0 19.78 26.37 19.78 26.37 .19 279.66 .19"
                  />
                  {letter === 'C' && (
                    <g>
                      <circle
                        cx="140"
                        cy="65"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="140"
                        y="71"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        C
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento D */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'D' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="603 12.62 603 93.6 568.73 93.6 568.73 168.17 386.62 168.17 386.62 0 574.94 0 574.94 12.62 603 12.62"
                  />
                  {letter === 'D' && (
                    <g>
                      <circle
                        cx="495"
                        cy="85"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="495"
                        y="91"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        D
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento E */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'E' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="603 249.15 603 330.13 574.94 330.13 574.94 342.56 386.81 342.56 386.81 174.57 568.73 174.57 568.73 249.15 603 249.15"
                  />
                  {letter === 'E' && (
                    <g>
                      <circle
                        cx="495"
                        cy="265"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="495"
                        y="271"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        E
                      </text>
                    </g>
                  )}
                </g>
              </g>
            </svg>
          </div>
        </div>
      )
    }

    // Para ModelFifteen (piso 15 - último piso con A, B, C, D, E)
    if (layout === 'modelFifteen') {
      return (
        <div className={config.container}>
          <div className="bg-white rounded-lg border border-gray-200 p-2 lg:p-3">
            <svg
              id="PlantaFifteen"
              data-name="Capa 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 609 420"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: config.maxHeight
              }}
            >
              <defs>
                <style>{`
                  .apartment-text {
                    font-family: Arial, sans-serif;
                    font-size: ${config.fontSize};
                    font-weight: bold;
                  }
                `}</style>
              </defs>
              <g id="DuplexUltimoPiso" transform="translate(3, 45)">
                {/* Pasillo reducido */}
                <polygon
                  className="pasillo"
                  points="383.35 230.08 383.35 341 289.3 341 289.3 229.9 383.35 230.08"
                  fill="rgba(147, 149, 152, 0.3)"
                />

                {/* Departamento A */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'A' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="282.93 229.71 282.93 341 31.11 341 31.11 330.04 0 330.04 0 245.08 31.11 245.08 31.11 229.71 282.93 229.71"
                  />
                  {letter === 'A' && (
                    <g>
                      <circle
                        cx="140"
                        cy="295"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="140"
                        y="301"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        A
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento B */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'B' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="327.7 133.41 327.7 225.03 31.11 225.03 31.11 212.62 1.16 212.62 1.16 127.66 31.11 127.66 31.11 116.17 282.93 116.17 282.93 133.41 327.7 133.41"
                  />
                  {letter === 'B' && (
                    <g>
                      <circle
                        cx="160"
                        cy="185"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="160"
                        y="191"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        B
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento C */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'C' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="282.93 .19 282.93 111.48 31.11 111.48 31.11 98.62 1.17 98.62 1.17 13.66 31.11 13.66 31.11 .19 282.93 .19"
                  />
                  {letter === 'C' && (
                    <g>
                      <circle
                        cx="140"
                        cy="70"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="140"
                        y="76"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        C
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento D */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'D' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="603.56 10.14 603.56 95.09 576.9 95.09 576.9 237.02 474.6 237.02 474.6 186.05 383.35 186.05 383.35 225.4 333.89 225.4 333.89 133.41 383.35 133.41 383.35 .19 474.6 .19 576.9 0 576.9 10.14 603.56 10.14"
                  />
                  {letter === 'D' && (
                    <g>
                      <circle
                        cx="490"
                        cy="115"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="490"
                        y="121"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        D
                      </text>
                    </g>
                  )}
                </g>

                {/* Departamento E */}
                <g className="apartment-group">
                  <polygon
                    fill={letter === 'E' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    points="602.39 246.41 602.39 331.37 576.9 331.37 576.9 341 388.04 341 388.04 192.24 468.41 192.24 468.41 243.2 576.9 243.2 576.9 246.41 602.39 246.41"
                  />
                  {letter === 'E' && (
                    <g>
                      <circle
                        cx="495"
                        cy="300"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="495"
                        y="306"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        E
                      </text>
                    </g>
                  )}
                </g>
              </g>
            </svg>
          </div>
        </div>
      )
    }

    return (
      <div className="w-full max-w-[140px] lg:max-w-[180px] mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-2 lg:p-3">
          <svg
            data-name="Capa 2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 218.28 388.08"
            style={{
              width: '100%',
              height: 'auto'
            }}
          >
            <defs>
              <style>{`
                .apartment-text {
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  font-weight: bold;
                }
              `}</style>
            </defs>
            <g data-name="Capa 1">
              {/* Rectángulo central */}
              <rect
                x="0"
                y="188.16"
                width="180.48"
                height="54.36"
                fill="#f0f0f0"
                stroke="#ddd"
                strokeWidth="1"
              />

              {/* Departamento A */}
              <g className="apartment-group">
                <polygon
                  fill={letter === 'A' ? '#ffc46a' : '#e8e8e8'}
                  stroke="#999"
                  strokeWidth="1"
                  points="107.64 0 107.64 185.16 0 185.16 0 19.92 54.6 19.92 54.6 0 107.64 0"
                />
                {letter === 'A' && (
                  <g>
                    <circle cx="54" cy="92.5" r="22" fill="none" stroke="#483b2b" strokeWidth="2" />
                    <text
                      x="54"
                      y="98"
                      textAnchor="middle"
                      className="apartment-text"
                      fill="#483b2b"
                    >
                      A
                    </text>
                  </g>
                )}
              </g>

              {/* Departamento B */}
              <g className="apartment-group">
                <polygon
                  fill={letter === 'B' ? '#ffc46a' : '#e8e8e8'}
                  stroke="#999"
                  strokeWidth="1"
                  points="218.28 19.92 218.28 185.16 110.64 185.16 110.64 0 163.56 0 163.56 19.92 218.28 19.92"
                />
                {letter === 'B' && (
                  <g>
                    <circle
                      cx="164"
                      cy="92.5"
                      r="22"
                      fill="none"
                      stroke="#483b2b"
                      strokeWidth="2"
                    />
                    <text
                      x="164"
                      y="98"
                      textAnchor="middle"
                      className="apartment-text"
                      fill="#483b2b"
                    >
                      B
                    </text>
                  </g>
                )}
              </g>

              {/* Departamento D */}
              <g className="apartment-group">
                <polygon
                  fill={letter === 'D' ? '#ffc46a' : '#e8e8e8'}
                  stroke="#999"
                  strokeWidth="1"
                  points="107.52 245.52 107.52 369.24 58.56 369.24 58.56 388.08 9 388.08 9 369.24 0 369.24 0 245.52 107.52 245.52"
                />
                {letter === 'D' && (
                  <g>
                    <circle cx="54" cy="307" r="22" fill="none" stroke="#483b2b" strokeWidth="2" />
                    <text
                      x="54"
                      y="313"
                      textAnchor="middle"
                      className="apartment-text"
                      fill="#483b2b"
                    >
                      D
                    </text>
                  </g>
                )}
              </g>

              {/* Departamento C */}
              <g className="apartment-group">
                <polygon
                  fill={letter === 'C' ? '#ffc46a' : '#e8e8e8'}
                  stroke="#999"
                  strokeWidth="1"
                  points="218.28 245.4 218.28 369.24 209.28 369.24 209.28 388.08 159.72 388.08 159.72 369.24 110.52 369.24 110.52 245.4 218.28 245.4"
                />
                {letter === 'C' && (
                  <g>
                    <circle cx="164" cy="307" r="22" fill="none" stroke="#483b2b" strokeWidth="2" />
                    <text
                      x="164"
                      y="313"
                      textAnchor="middle"
                      className="apartment-text"
                      fill="#483b2b"
                    >
                      C
                    </text>
                  </g>
                )}
              </g>
            </g>
          </svg>
        </div>
      </div>
    )
  }

  if (!apartment) {
    return (
      <>
        <div className="custom-container mt-20 px-4">
          <h2 className="text-threetext-2xl mb-4">Departamento no encontrado</h2>
          <Button onClick={() => navigate('/apartments')} className="mt-4">
            <MdOutlineArrowBack size="1.2em" className="mr-2" />
            Volver a apartamentos
          </Button>
        </div>
        <SectionFooter />
      </>
    )
  }

  return (
    <>
      <div className="custom-container  mt-14   px-4 ">
        <div className="flex md:items-center items-start md:flex-row flex-col gap-6 mb-12">
          <Button
            onClick={() => navigate('/apartments')}
            className="z-50 flex items-center cursor-pointer gap-2 bg-three hover:bg-opacity-90 text-white px-6 py-3 rounded-full"
          >
            <MdOutlineArrowBack size="1.2em" />
            Volver
          </Button>
          <h1 className="text-xl font-bold text-three">
            {apartment.title.replace(' - Piso 1', '')}
          </h1>
        </div>

        <div className="grid grid-cols-1 min-[768px]:grid-cols-2 min-[768px]:grid-rows-[1.1fr_1fr_1fr_1fr] gap-6 min-[768px]:h-[75vh]">
          <div className="min-[768px]:row-span-4 min-[768px]:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-lg h-full overflow-hidden">
              {apartment.floorPlan !== '' ? (
                <div className="w-full h-full flex flex-col gap-4">
                  {/* Primer plano principal */}
                  <div
                    className={`${apartment['floorExtra-d'] ? 'h-1/2' : 'h-full'} flex items-center justify-center`}
                  >
                    {console.log('ApartmentDetail rendering floorPlan:', apartment.floorPlan)}
                    <img
                      src={apartment.floorPlan}
                      alt={`Plano principal de ${apartment.title}`}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>

                  {/* Segundo plano (floorExtra-d) si existe */}
                  {apartment['floorExtra-d'] && (
                    <div className="h-1/2 flex items-center justify-center">
                      <img
                        src={apartment['floorExtra-d']}
                        alt={`Plano adicional de ${apartment.title}`}
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="mb-4">Plano no disponible</p>
                    <Button className="text-sm bg-[var(--color-one)]">
                      Solicitar plano
                      <MdOutlineArrowOutward size="1em" className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="min-[768px]:row-span-1 min-[768px]:col-span-1 ">
            <Card hasGradient className="flex flex-col h-full justify-center">
              <div className="flex w-full ">
                <div className="grid grid-cols-1 gap-2 w-full">
                  {apartment.superficiePropia && (
                    <div className="flex justify-between items-end border-b border-[var(--color-three)]/10 pb-1">
                      <span className="text-xs text-[var(--color-three)] uppercase opacity-70">
                        Sup. Propia
                      </span>
                      <span className="text-xl font-bold text-[var(--color-one)]">
                        {apartment.superficiePropia}
                      </span>
                    </div>
                  )}
                  {apartment.superficieTotal && (
                    <div className="flex justify-between items-end border-b border-[var(--color-three)]/10 pb-1">
                      <span className="text-xs text-[var(--color-three)] uppercase opacity-70">
                        Sup. Total
                      </span>
                      <span className="text-xl font-bold text-[var(--color-one)]">
                        {apartment.superficieTotal}
                      </span>
                    </div>
                  )}
                  {apartment.balcones && (
                    <div className="flex justify-between items-end border-b border-[var(--color-three)]/10 pb-1">
                      <span className="text-xs text-[var(--color-three)] uppercase opacity-70">
                        Balcones / Patio
                      </span>
                      <span className="text-xl font-bold text-[var(--color-one)]">
                        {apartment.balcones}
                      </span>
                    </div>
                  )}
                  {!apartment.superficieTotal && apartment.area && (
                    <div className="flex justify-between items-end border-b border-[var(--color-three)]/10 pb-1">
                      <span className="text-xs text-[var(--color-three)] uppercase opacity-70">
                        Superficie
                      </span>
                      <span className="text-xl font-bold text-[var(--color-one)]">
                        {apartment.area}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-[var(--color-three)] font-medium mt-1">
                    {apartment.type}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="min-[768px]:row-span-3 min-[768px]:col-span-1">
            <Card
              id="cardInfo"
              hasGradient
              className="flex flex-row min-lg:gap-6 gap-4 h-full overflow-hidden p-6"
            >
              <div className="apartmentSVGcontainer">
                {renderApartmentReference(apartmentId, 'compact')}
              </div>

              <section className="flex-1 flex flex-col justify-start">
                {/* Header con título principal */}
                <header className="mb-4 border-b border-white/20 pb-2">
                  <h3 className="text-2xl lg:text-3xl font-bold text-[var(--color-three)] mb-1">
                    Características
                  </h3>
                  <div className="flex items-center gap-2 text-[var(--color-three)]/70 bg-[#e2d8ce4d] p-2 rounded-xl">
                    <MdOutlineArrowOutward size="1em" className="text-[var(--color-one)]" />
                    <span className="text-xs py-2 font-semibold text-[var(--color-one)] ">
                      Calidad Premium
                    </span>
                  </div>
                </header>

                {/* Lista de características más compacta */}
                <div className="flex-1">
                  {apartment.features.map((characteristic, index) => (
                    <div key={index} className="flex items-center gap-3 pb-2">
                      <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0">
                        <div className="text-[var(--color-one)]">
                          {getFeatureIcon(characteristic)}
                        </div>
                      </div>
                      <p className="text-[var(--color-three)] textApartmentC leading-relaxed">
                        {characteristic}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </Card>
          </div>
        </div>
        <Card hasGradient className="flex flex-col my-8">
          <p className="text-[var(--color-three)] text-modal mb-6 leading-relaxed">
            {apartment.copy}
          </p>
          <Button
            disabled
            className=" bg-[var(--color-one)] cursor-not-allowed opacity-50 text-white py-3 px-6 rounded-full flex items-center justify-between w-full font-medium min-[400px]:w-[300px] "
          >
            Descargar plano
            <MdOutlineArrowOutward size="1.2em" />
          </Button>
        </Card>
      </div>
      <section className="custom-container">
        <SectionFooter />
      </section>
    </>
  )
}

export default ApartmentDetail
