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
import Footer from '../home/components/Footer'
import apartmentData from './utils/apartmentData.json'

const ApartmentDetail = () => {
  const { apartmentId } = useParams()
  const navigate = useNavigate()

  const apartment = apartmentData[apartmentId]
  console.log(apartment)

  // Función para obtener la letra del apartamento
  const getApartmentLetter = (apartmentId) => {
    if (!apartmentId) return null
    const parts = apartmentId.split('_')
    return parts[1] // apartment_A_P5 -> A
  }

  // Función para obtener el número de piso del apartmentId
  const getFloorNumber = (apartmentId) => {
    if (!apartmentId) return null
    const parts = apartmentId.split('_')
    const floorPart = parts[2] // apartment_A_P5 -> P5
    return parseInt(floorPart.slice(1)) // P5 -> 5
  }

  // Función para determinar qué layout usar según el piso
  const getFloorLayout = (apartmentId) => {
    // Detectar duplex por el ID
    if (
      apartmentId.includes('duplex_') ||
      apartmentId.includes('estudio_') ||
      apartmentId.includes('entrepiso_')
    ) {
      return 'modelDuplex'
    }

    const floorNumber = getFloorNumber(apartmentId)
    if (!floorNumber) return 'modelThree' // default
    if (floorNumber >= 1 && floorNumber <= 3) return 'modelOne'
    if (floorNumber === 4) return 'modelTwo'
    if (floorNumber >= 5 && floorNumber <= 6) return 'modelThree'
    if (floorNumber >= 7 && floorNumber <= 10) return 'modelFour'
    if (floorNumber >= 11 && floorNumber <= 12) return 'modelFive'
    if (floorNumber === 13) return 'modelSix'
    if (floorNumber === 14) return 'modelSeven'
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
      return <MdBed size={40} />
    }
    if (
      featureLower.includes('baño') ||
      featureLower.includes('bathroom') ||
      featureLower.includes('toilette')
    ) {
      return <MdBathtub size={30} />
    }
    if (
      featureLower.includes('m²') ||
      featureLower.includes('metro') ||
      featureLower.includes('superficie')
    ) {
      return <MdSquareFoot size={30} />
    }
    if (
      featureLower.includes('balcón') ||
      featureLower.includes('terraza') ||
      featureLower.includes('balcony')
    ) {
      return <MdBalcony size={40} />
    }
    if (featureLower.includes('cocina') || featureLower.includes('kitchen')) {
      return <MdKitchen size={40} />
    }
    if (
      featureLower.includes('estacionamiento') ||
      featureLower.includes('parking') ||
      featureLower.includes('cochera')
    ) {
      return <MdLocalParking size={40} />
    }
    if (
      featureLower.includes('ambiente') ||
      featureLower.includes('living') ||
      featureLower.includes('sala')
    ) {
      return <MdHome size={40} />
    }
    // Icono por defecto
    return <MdViewQuilt size={40} />
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
        maxHeight: '100px',
        fontSize: '12px'
      },
      normal: {
        container: 'w-full max-w-[140px] lg:max-w-[180px] mx-auto',
        maxHeight: '150px',
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
              viewBox="0 0 400 600"
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
              <g id="Capa_1-2" data-name="Capa 1">
                {/* Duplex A - Área superior izquierda */}
                <g className="apartment-group">
                  <rect
                    fill={letter === 'A' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    x="20"
                    y="20"
                    width="160"
                    height="200"
                  />
                  {letter === 'A' && (
                    <g>
                      <circle
                        cx="100"
                        cy="120"
                        r="20"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="100"
                        y="127"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        A
                      </text>
                    </g>
                  )}
                </g>

                {/* Estudio B - Área superior derecha */}
                <g className="apartment-group">
                  <rect
                    fill={letter === 'B' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    x="200"
                    y="20"
                    width="180"
                    height="140"
                  />
                  {letter === 'B' && (
                    <g>
                      <circle
                        cx="290"
                        cy="90"
                        r="20"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="290"
                        y="97"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        B
                      </text>
                    </g>
                  )}
                </g>

                {/* Área gris central */}
                <rect
                  x="200"
                  y="180"
                  width="180"
                  height="120"
                  fill="#f0f0f0"
                  stroke="#ddd"
                  strokeWidth="1"
                />

                {/* Duplex C - Área inferior derecha */}
                <g className="apartment-group">
                  <rect
                    fill={letter === 'C' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    x="200"
                    y="320"
                    width="180"
                    height="260"
                  />
                  {letter === 'C' && (
                    <g>
                      <circle
                        cx="290"
                        cy="450"
                        r="20"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="290"
                        y="457"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        C
                      </text>
                    </g>
                  )}
                </g>

                {/* Entrepiso E - Área inferior izquierda */}
                <g className="apartment-group">
                  <rect
                    fill={letter === 'E' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    x="20"
                    y="240"
                    width="160"
                    height="340"
                  />
                  {letter === 'E' && (
                    <g>
                      <circle
                        cx="100"
                        cy="410"
                        r="20"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="100"
                        y="417"
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

    // Para ModelSix (piso 13) que solo tiene A y B
    if (layout === 'modelSix') {
      return (
        <div className="w-full max-w-[140px] lg:max-w-[180px] mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-2 lg:p-3">
            <h4 className="text-xs lg:text-sm font-semibold text-[var(--color-three)] mb-2 text-center">
              Ubicación en planta
            </h4>
            <svg
              id="PlantaSix"
              data-name="Capa 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 218.16 349.44"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '150px'
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
              <g id="Capa_1-2" data-name="Capa 1">
                {/* Rectángulo central transparente */}
                <rect
                  y="168.24"
                  width="180.48"
                  height="54.36"
                  fill="#f0f0f0"
                  stroke="#ddd"
                  strokeWidth="1"
                />

                {/* Departamento A */}
                <g className="apartment-group">
                  <rect
                    fill={letter === 'A' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    width="218.16"
                    height="165.24"
                  />
                  {letter === 'A' && (
                    <g>
                      <circle
                        cx="110"
                        cy="80"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="110"
                        y="86"
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
                  <rect
                    fill={letter === 'B' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    y="225.6"
                    width="218.16"
                    height="123.84"
                  />
                  {letter === 'B' && (
                    <g>
                      <circle
                        cx="110"
                        cy="287"
                        r="22"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="110"
                        y="293"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                      >
                        B
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

    // Para ModelSeven (piso 14 - quincho/asador)
    if (layout === 'modelSeven') {
      return (
        <div className="w-full max-w-[140px] lg:max-w-[180px] mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-2 lg:p-3">
            <h4 className="text-xs lg:text-sm font-semibold text-[var(--color-three)] mb-2 text-center">
              Ubicación en planta
            </h4>
            <svg
              id="PlantaSeven"
              data-name="Capa 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 218.45 238.14"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '150px'
              }}
            >
              <defs>
                <style>{`
                  .apartment-text {
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    font-weight: bold;
                  }
                `}</style>
              </defs>
              <g id="Capa_1-2" data-name="Capa 1">
                {/* Quincho/Asador - área completa */}
                <g className="apartment-group">
                  <rect
                    fill={letter === 'A' ? '#ffc46a' : '#e8e8e8'}
                    stroke="#999"
                    strokeWidth="1"
                    width="218.45"
                    height="238.14"
                  />
                  {letter === 'A' && (
                    <g>
                      <circle
                        cx="109"
                        cy="119"
                        r="30"
                        fill="none"
                        stroke="#483b2b"
                        strokeWidth="2"
                      />
                      <text
                        x="109"
                        y="127"
                        textAnchor="middle"
                        className="apartment-text"
                        fill="#483b2b"
                        fontSize="12"
                      >
                        QUINCHO
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

    // Para otros layouts (ModelThree con A, B, C, D) - layout original
    return (
      <div className="w-full max-w-[140px] lg:max-w-[180px] mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-2 lg:p-3">
          <h4 className="text-xs lg:text-sm font-semibold text-[var(--color-three)] mb-2 text-center">
            Ubicación en planta
          </h4>
          <svg
            data-name="Capa 2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 218.28 388.08"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '150px'
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
          <h2 className="text-[var(--color-three)] text-2xl mb-4">Departamento no encontrado</h2>
          <Button onClick={() => navigate('/apartments')} className="mt-4">
            <MdOutlineArrowBack size="1.2em" className="mr-2" />
            Volver a apartamentos
          </Button>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="custom-container  mt-14 px-4 ">
        <div className="flex items-center gap-6 mb-12">
          <Button
            onClick={() => navigate('/apartments')}
            className="z-50 flex items-center cursor-pointer gap-2 bg-[var(--color-three)] hover:bg-opacity-90 text-white px-6 py-3 rounded-full"
          >
            <MdOutlineArrowBack size="1.2em" />
            Volver
          </Button>
          <h1 className="text-xl font-bold text-[var(--color-three)]">
            {apartment.title.replace(' - Piso 1', '')}
          </h1>
        </div>

        <div className="grid grid-cols-1 min-[768px]:grid-cols-2 min-[768px]:grid-rows-4 gap-6 min-[768px]:h-[75vh]">
          <div className="min-[768px]:row-span-4 min-[768px]:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-lg h-full overflow-hidden">
              {apartment.floorPlan !== '' ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={apartment.floorPlan}
                    alt={`Plano de ${apartment.title}`}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
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

          <div className="min-[768px]:row-span-1 min-[768px]:col-span-1">
            <Card hasGradient className="flex flex-col h-full">
              <div className="flex items-center justify-around mb-4 w-full">
                <div>
                  <p className="font-bold text-[var(--color-three)] mb-1">
                    <span className="inline-block font-bold rounded-full text-[var(--color-one)] text-4xl">
                      {apartment.area}
                    </span>
                  </p>
                  <p className="text-lg text-[var(--color-three)] font-medium">{apartment.type}</p>
                </div>

                {/* Ubicación en planta - ahora en la parte superior */}
                <div className="flex-shrink-0">
                  {renderApartmentReference(apartmentId, 'compact')}
                </div>
              </div>
            </Card>
          </div>

          {/* Card de características - Ocupa 3 rows en desktop */}
          <div className="min-[768px]:row-span-3 min-[768px]:col-span-1">
            <Card hasGradient className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-3xl font-bold text-[var(--color-three)]">Características</h3>
              </div>

              {/* Layout horizontal: características a la izquierda, sin ubicación */}
              <div className="flex flex-col gap-1 flex-1">
                {/* Características con diseño mejorado e iconos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
                  {apartment.features.map((characteristic, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] group"
                    >
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {getFeatureIcon(characteristic)}
                      </div>
                      <p className="text-[var(--color-three)] text-sm lg:text-base leading-relaxed font-medium flex-1">
                        {characteristic}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Elemento decorativo */}
                <div className="mt-2 p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3 text-[var(--color-three)]/80">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white"
                      >
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-semibold block">Calidad Premium</span>
                      <span className="text-xs opacity-80">Materiales de primera línea</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <Card hasGradient className="flex flex-col my-8">
          <p className="text-[var(--color-three)] text-base mb-6 leading-relaxed">
            <span className="font-bold">Lorem ipsum dolor sit amet,</span> consectetur adipiscing
            elit, sed do eiusmod, Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
            corporis incidunt blanditiis tempora dicta? Quidem possimus quod tempora, corporis
            voluptate explicabo, nisi iure consequatur est repudiandae maxime facere suscipit
            deleniti.
          </p>
          <Button className=" bg-[var(--color-one)] cursor-pointer hover:bg-opacity-90 text-white py-3 px-6 rounded-full flex items-center justify-center gap-3 font-medium min-2xl:w-[300px] ">
            Descargar plano
            <MdOutlineArrowOutward size="1.2em" />
          </Button>
        </Card>
      </div>
      <section className="custom-container">
        <Footer />
      </section>
    </>
  )
}

export default ApartmentDetail
