import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MdOutlineArrowBack, MdOutlineArrowOutward } from 'react-icons/md'
import { Card } from '../home/components/card'
import Button from '../home/components/button'
import Footer from '../home/components/Footer'
import apartmentData from './utils/apartmentData.json'

const ApartmentDetail = () => {
  const { apartmentId } = useParams()
  const navigate = useNavigate()

  const apartment = apartmentData[apartmentId]

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
    const floorNumber = getFloorNumber(apartmentId)
    if (!floorNumber) return 'modelThree' // default

    if (floorNumber >= 1 && floorNumber <= 3) return 'modelOne'
    if (floorNumber === 4) return 'modelTwo'
    if (floorNumber >= 5 && floorNumber <= 6) return 'modelThree'
    if (floorNumber >= 7 && floorNumber <= 10) return 'modelFour'
    if (floorNumber >= 11 && floorNumber <= 13) return 'modelFive'

    return 'modelThree' // default
  }

  // Función para generar el SVG de referencia del apartamento
  const renderApartmentReference = (apartmentId) => {
    const letter = getApartmentLetter(apartmentId)
    const layout = getFloorLayout(apartmentId)
    if (!letter) return null

    // Para ModelFour (pisos 7-10) que solo tiene A, B, C
    if (layout === 'modelFour') {
      return (
        <div className="w-full max-w-[180px] mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h4 className="text-sm font-semibold text-[var(--color-three)] mb-2 text-center">
              Ubicación en planta
            </h4>
            <svg
              data-name="Capa 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 218.4 387.96"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '200px'
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

    // Para otros layouts (ModelThree con A, B, C, D) - layout original
    return (
      <div className="w-full max-w-[180px] mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h4 className="text-sm font-semibold text-[var(--color-three)] mb-2 text-center">
            Ubicación en planta
          </h4>
          <svg
            data-name="Capa 2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 218.28 388.08"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '200px'
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
          <h1 className="text-4xl font-bold text-[var(--color-three)]">
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
              <p className="font-bold text-[var(--color-three)] mb-4">
                <span className="inline-block font-bold rounded-full text-[var(--color-one)] text-4xl">
                  {apartment.area}
                </span>
              </p>
              <p className="text-lg text-[var(--color-three)] font-medium">{apartment.type}</p>
            </Card>
          </div>

          {/* Card de características - Ocupa 3 rows en desktop */}
          <div className="min-[768px]:row-span-3 min-[768px]:col-span-1">
            <Card hasGradient className="flex flex-col h-full">
              <h3 className="text-xl font-bold text-[var(--color-three)] mb-4">Características</h3>
              <div className="space-y-3 flex-1">
                {apartment.features.map((characteristic, index) => (
                  <p key={index} className="text-[var(--color-three)] mb-1">
                    {characteristic}
                  </p>
                ))}
              </div>

              {/* SVG de referencia de ubicación */}
              <div className="mt-6 pt-4 border-t border-white/20">
                {renderApartmentReference(apartmentId)}
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
