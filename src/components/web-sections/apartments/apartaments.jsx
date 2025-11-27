import { Card } from '../home/components/card'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModelFourFive from '../../../assets/floors/ModelFourFive'
import ModelFour from '../../../assets/floors/ModelFour'
import ModelFive from '../../../assets/floors/ModelFive'
import ModelSix from '../../../assets/floors/ModelSix'
import ModelSeven from '../../../assets/floors/ModelSeven'
import ModelPb from '../../../assets/floors/modelPb'
import ModelTwelve from '../../../assets/floors/ModelTwelve'
import ModelThirteen from '../../../assets/floors/ModelThirteen'
import Button from '../home/components/button'
import { MdOutlineArrowOutward } from 'react-icons/md'
import apartmentData from './utils/apartmentData.json'
import CorteNew from '../../../assets/CorteNew'
import './apartmentAnimate.css'
import ModelTwo from '../../../assets/floors/ModelTwo'
import SectionFooter from '../home/section-footer'

const Apartaments = () => {
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [selectedApartment, setSelectedApartment] = useState(null)
  const [letter, setLetter] = useState('')
  const navigate = useNavigate()

  const tipologiesData = [
    'Estudios y Microviviendas',
    '1 Dormitorio',
    '2 Dormitorios',
    'Duplex 2 Dormitorios con Patio',
    'Quincho con Terraza'
  ]

  const amenitiesData = [
    'Desde 32m² hasta 89m²',
    'Balcones y Terrazas Privadas',
    'Cocinas Integradas Premium',
    'Baños Completos Revestidos'
  ]

  const handleFloorClick = (floorId) => {
    setSelectedFloor(floorId)
    setSelectedApartment(null)
  }

  const handleContainerClick = () => {
    setSelectedFloor(null)
    setSelectedApartment(null)
  }

  const handlerApartment = (apartmentID) => {
    setSelectedApartment(apartmentID)
  }

  const handleViewPlans = () => {
    if (selectedApartment) {
      navigate(`/apartments/${selectedApartment}`)
    }
  }

  const renderApartmentPreview = (apartmentId) => {
    const apartmentInfo = apartmentData[apartmentId]
    return (
      <div className="flex items-center gap-3 bg-white/20 rounded-lg p-3">
        <div className="w-12 h-12 flex items-center justify-center">{letter}</div>
        <div>
          <p className="text-xs text-[var(--color-three)]/70">
            {apartmentInfo?.title || `${apartmentInfo?.type || 'Información disponible'}`}{' '}
          </p>
        </div>
      </div>
    )
  }

  const renderFloorComponent = () => {
    switch (selectedFloor) {
      case 'plantaBaja':
        return (
          <ModelPb
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      case 'p01-modelOne':
      case 'p02-modelOne':
        return (
          <ModelTwelve
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      case 'p03-modelOne':
        return (
          <ModelThirteen
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      case 'p04-modelTwo':
        return (
          <ModelTwo
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      case 'p04-oficina':
        return (
          <ModelOficina04
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      case 'pisoCuatro':
      case 'pisoCinco':
        return (
          <ModelFourFive
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
            selectedLetter={setLetter}
          />
        )
      case 'pisoSeis':
        return (
          <ModelFourFive
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )

      case 'pisoSiete':
      case 'pisoOcho':
      case 'pisoNueve':
      case 'pisoDiez':
        return (
          <ModelFour
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )

      case 'pisoOnce':
      case 'pisoDoce':
      case 'pisoTrece':
        return (
          <ModelFive
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      case 'pisoCatorce':
        return (
          <ModelFive
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )

      case 'pisoQuince':
        return (
          <ModelSix
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )

      case 'pisoDieciseis':
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

        <section className="flex  relative max-[800px]:flex-col  h-full max-lg:mt-8  items-center justify-center gap-4 mt-2">
          <div className=" flex-1 " onClick={(e) => e.stopPropagation()}>
            <CorteNew onEvent={handleFloorClick} selectedFloor={selectedFloor} />
          </div>
          <div id="dinamic-card" className="flex-1  relative" onClick={(e) => e.stopPropagation()}>
            {!selectedFloor ? (
              <section className="flex flex-col  gap-3 w-full justify-center items-center animatedIn min-[768px]:h-[74vh]">
                <Card hasGradient className=" w-full">
                  <p className="text-[var(--color-three)] text-modal">
                    <span className="inline-block font-bold rounded-full text-(lenght:--color-one)">
                      Conocé cada unidad del edificio.{' '}
                    </span>{' '}
                    Hacé clic en el piso que quieras para ver su planta y los departamentos
                    disponibles.
                  </p>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                  <Card hasGradient className="flex-col gap-1 text-[var(--color-three)] ">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="textApartmentC  font-bold">Tipologías Disponibles</p>
                    </div>
                    <div className="space-y-1">
                      {tipologiesData.map((tipology, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20"
                        >
                          <p className="textApartmentC  font-normal">• {tipology}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card
                    hasGradient
                    className="flex-col gap-1 text-[var(--color-three)] justify-items-start"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <p className="textApartmentC  font-bold">Superficies y Amenities</p>
                    </div>
                    <div className="space-y-1">
                      {amenitiesData.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20"
                        >
                          <p className="textApartmentC  font-normal">• {amenity}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </section>
            ) : (
              <Card
                hasGradient
                borderStyleCustom="none"
                cardGradient="var(--gradient-card-opacityfull)"
                id="apartments-model"
                className="overflow-hidden flex flex-col animatedIn                            
                          
                           
                           shadow-2xl backdrop-blur-sm
                          "
              >
                <div className="flex-1  w-full rounded-t-2xl ">
                  {renderFloorComponent(selectedFloor)}
                </div>

                <div className="flex w-full justify-evenly flex-col items-stretch gap-4 lg:gap-6 py-4 lg:py-6 ">
                  <div className="flex-1 space-y-3">
                    <p className="text-sm lg:text-base text-[var(--color-three)] font-medium">
                      Selecciona un departamento para ver más detalles y acceder a los planos
                      completos.
                    </p>
                    {selectedApartment ? (
                      renderApartmentPreview(selectedApartment)
                    ) : (
                      <div className="bg-white/20 rounded-lg p-3 border border-white/30 backdrop-blur-sm">
                        <p className="text-xs lg:text-sm text-[var(--color-three)]/70 italic">
                          Ningún departamento seleccionado
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-end lg:items-center">
                    <Button
                      className={`w-full lg:w-auto lg:min-w-[200px] flex items-center justify-center gap-3 px-6 py-3
                                  transition-all duration-300 transform hover:scale-105
                                  ${
                                    !selectedApartment
                                      ? 'bg-gray-400 cursor-not-allowed opacity-60 hover:scale-100'
                                      : 'shadow-lg hover:shadow-xl'
                                  }`}
                      onClick={selectedApartment ? handleViewPlans : () => {}}
                      disabled={!selectedApartment}
                    >
                      <span className="font-medium">Ver planos</span>
                      <MdOutlineArrowOutward
                        size="1.4em"
                        color={selectedApartment ? 'white' : '#9CA3AF'}
                      />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </section>
      </div>
      <section className="custom-container mt-8">
        <SectionFooter />
      </section>
    </>
  )
}

export default Apartaments
