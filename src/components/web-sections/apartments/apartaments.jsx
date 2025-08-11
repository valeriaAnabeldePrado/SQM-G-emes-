import React from 'react'
import PlanoEdificio from '../../../assets/Corte'
import { Card } from '../home/components/card'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../home/components/Footer'
import ModelOne from '../../../assets/floors/ModelOne'
import ModelTwo from '../../../assets/floors/ModelTwo'
import ModelThree from '../../../assets/floors/ModelThree'
import ModelFour from '../../../assets/floors/ModelFour'
import ModelFive from '../../../assets/floors/ModelFive'
import ModelSix from '../../../assets/floors/ModelSix'
import ModelSeven from '../../../assets/floors/ModelSeven'
import Button from '../home/components/button'
import { MdOutlineArrowOutward } from 'react-icons/md'
import apartmentData from './utils/apartmentData.json'

import './apartmentAnimate.css'

const Apartaments = () => {
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [selectedApartment, setSelectedApartment] = useState(null)
  const navigate = useNavigate()

  const handleFloorClick = (floorId) => {
    setSelectedFloor(floorId)
  }

  const handleContainerClick = () => {
    setSelectedFloor(null)
  }

  const handlerApartment = (apartmentID) => {
    setSelectedApartment(apartmentID)
  }

  const handleViewPlans = () => {
    if (selectedApartment) {
      navigate(`/apartments/${selectedApartment}`)
    }
  }

  // Función para obtener la letra del apartamento
  const getApartmentLetter = (apartmentId) => {
    if (!apartmentId) return null
    const parts = apartmentId.split('_')
    return parts[1] // apartment_A_P5 -> A
  }

  // Función para generar el mini SVG del apartamento seleccionado
  const renderApartmentPreview = (apartmentId) => {
    const letter = getApartmentLetter(apartmentId)
    if (!letter) return null

    // Obtener información del apartamento desde el JSON
    const apartmentInfo = apartmentData[apartmentId]

    return (
      <div className="flex items-center gap-3 bg-white/20 rounded-lg p-3">
        <div className="w-12 h-12 flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="2"
              y="2"
              width="44"
              height="44"
              fill="#ffc46a"
              stroke="#483b2b"
              strokeWidth="2"
              rx="4"
            />
            <circle cx="24" cy="24" r="12" fill="none" stroke="#483b2b" strokeWidth="2" />
            <text
              x="24"
              y="28"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#483b2b"
              fontFamily="Arial, sans-serif"
            >
              {letter}
            </text>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-three)]">Departamento {letter}</p>
          <p className="text-xs text-[var(--color-three)]/70">
            {apartmentInfo?.title || `${apartmentInfo?.type || 'Información disponible'}`}
          </p>
        </div>
      </div>
    )
  }

  const renderFloorComponent = () => {
    console.log('selectedFloor en renderFloorComponent:', selectedFloor)
    switch (selectedFloor) {
      // Pisos 1-3: ModelOne
      case 'p01-modelOne':
      case 'p02-modelOne':
      case 'p03-modelOne':
        return (
          <ModelOne
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      // Piso 4: ModelTwo
      case 'p04-modelTwo':
        return (
          <ModelTwo
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      // Pisos 5-6: ModelThree
      case 'p05-modelThree':
      case 'p06-modelThree':
        return (
          <ModelThree
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      // Pisos 7-10: ModelFour
      case 'p07-modelFour':
      case 'p08-modelFour':
      case 'p09-modelFour':
      case 'p10-modelFour':
        return (
          <ModelFour
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      // Pisos 11-12: ModelFive
      case 'p11-modelFive':
      case 'p12-modelFive':
        return (
          <ModelFive
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      // Planta Alta: ModelSix
      case 'plantaAlta':
        return (
          <ModelSix
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      // Piso 14: ModelSeven
      case 'p14-modelSeven':
        return (
          <ModelSeven
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      // Asador: ModelSeven
      case 'asador':
        return (
          <ModelSeven
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      default:
        return null
    }
  }
  return (
    <>
      <div className=" custom-container mt-14 px-4 " onClick={handleContainerClick}>
        <h2 className=" text-(length:--text-subtitle) text-[var(--color-three)] pb-5 ">
          Conoce nuestras{' '}
          <span className="inline-block font-bold rounded-full text-(lenght:--color-one)">
            unidades disponibles
          </span>
        </h2>

        <section className="flex max-md:flex-col h-full max-lg:mt-8  items-center justify-center gap-4 mt-2">
          <div className=" flex-1 " onClick={(e) => e.stopPropagation()}>
            <PlanoEdificio onEvent={handleFloorClick} selectedFloor={selectedFloor} />
          </div>
          <div id="dinamic-card" className="flex-1 relative" onClick={(e) => e.stopPropagation()}>
            {!selectedFloor ? (
              <section className="flex flex-col gap-4 w-full justify-center items-center animatedIn  min-[768px]:h-[74vh]">
                <Card hasGradient className="h-[25vh]">
                  <p className="text-[var(--color-three)] text-modal">
                    Conocé cada unidad del edificio.{' '}
                    <span className="inline-block font-bold rounded-full text-(lenght:--color-one)">
                      Hacé clic en el piso que quieras para ver su planta y los departamentos
                      disponibles.
                    </span>
                  </p>
                </Card>
                <section className="flex flex-row gap-4">
                  <Card hasGradient className="flex-1 flex-col gap-6 text-[var(--color-three)]">
                    <h3 className="text-modal font-bold"> Tipos de Unidades</h3>
                    <div className="space-y-2">
                      <p className="text-sm">• Estudios y 1 ambiente</p>
                      <p className="text-sm">• Departamentos 2 y 3 ambientes</p>
                      <p className="text-sm">• Duplex con patio</p>
                      <p className="text-sm">• Local comercial</p>
                      <p className="text-sm">• Quincho con terraza</p>
                    </div>
                  </Card>
                  <Card hasGradient className="flex-1 flex-col gap-6 text-[var(--color-three)]">
                    <h3 className="text-modal font-bold">📐 Características</h3>
                    <div className="space-y-2">
                      <p className="text-sm">• Desde 32m² hasta 89m²</p>
                      <p className="text-sm">• Balcones y terrazas</p>
                      <p className="text-sm">• Cocinas integradas</p>
                      <p className="text-sm">• Baños completos</p>
                      <p className="text-sm">• Espacios optimizados</p>
                    </div>
                  </Card>
                </section>
              </section>
            ) : (
              <Card
                hasGradient
                id="apartments-model"
                className="overflow-hidden flex flex-col lg:flex-row min-xl:gap-6 gap-4 animatedIn min-h-[500px]"
              >
                <div className="flex-1 lg:flex-2 bg-white rounded-2xl p-6 flex items-center justify-center min-h-[400px]">
                  {renderFloorComponent(selectedFloor)}
                </div>
                <div className="flex-1 flex flex-col justify-between gap-8 lg:gap-16 p-2">
                  <div className="space-y-4">
                    <p className="text-modal text-[var(--color-three)]">
                      Selecciona un departamento para ver más detalles y acceder a los planos
                      completos.
                    </p>
                    {selectedApartment ? (
                      renderApartmentPreview(selectedApartment)
                    ) : (
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-sm text-[var(--color-three)]/80">
                          Ningún departamento seleccionado
                        </p>
                      </div>
                    )}
                  </div>
                  <Button
                    className="w-full lg:w-auto flex items-center justify-center lg:justify-between gap-2"
                    onClick={handleViewPlans}
                    disabled={!selectedApartment}
                  >
                    Ver planos <MdOutlineArrowOutward size="1.5em" color="white" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </section>
      </div>
      <section className="custom-container mt-8">
        <Footer />
      </section>
    </>
  )
}

export default Apartaments
