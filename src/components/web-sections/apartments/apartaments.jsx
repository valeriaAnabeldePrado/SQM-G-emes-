import { Card } from '../home/components/card'
import { useState } from 'react'
//import { useNavigate } from 'react-router-dom'
import ModelpbDptos from '../../../assets/floors/modelPb'
import Button from '../home/components/button'
import { MdOutlineArrowOutward } from 'react-icons/md'
import apartmentData from './utils/apartmentData.json'
import CorteNew from '../../../assets/CorteNew'
import './apartmentAnimate.css'
import SectionFooter from '../home/section-footer'
import ModelOneTwoThreeFourFive from '../../../assets/floors/ModeloneFive'
import ModelpbOficinas from '../../../assets/floors/ModelpbOficinas'
import ModelPOneOfi from '../../../assets/floors/ModelPOneOfi'
import ModelPTwoOfi from '../../../assets/floors/ModelPdosOfi'
import ModelPTreeOfi from '../../../assets/floors/ModelPTresOfi'
import ModelPSix from '../../../assets/floors/ModelPSix'
import ModelPSevenTen from '../../../assets/floors/ModelPSevenTen'
import ModelElevenThirteen from '../../../assets/floors/ModelElevenThirteen'
import ModelFourTeen from '../../../assets/floors/ModelFourTeen'
import ModelFiveTeen from '../../../assets/floors/ModelFiveTeen'
import ModelSixTeen from '../../../assets/floors/ModelSIxTeen'

const Apartaments = () => {
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [selectedApartment, setSelectedApartment] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [letter, setLetter] = useState('')
  //const navigate = useNavigate()

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

  // const handleViewPlans = () => {
  //   if (selectedApartment) {
  //     navigate(`/apartments/${selectedApartment}`)
  //   }
  // }

  const renderApartmentPreview = (apartmentId) => {
    const apartmentInfo = apartmentData[apartmentId]
    return (
      <p className="text-xs font-normal text-[var(--color-three)]/70">
        {apartmentInfo?.title || `${apartmentInfo?.type || 'Información no disponible'}`}{' '}
      </p>
    )
  }

  const renderFloorComponent = () => {
    switch (selectedFloor) {
      case 'plantaBaja':
        return (
          <ModelpbDptos
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      case 'plantaBajaOficina':
        return (
          <ModelpbOficinas
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      case 'pisoUnoOficina':
        return (
          <ModelPOneOfi
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      case 'pisoDosOficina':
        return (
          <ModelPTwoOfi
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      case 'pisoTresOficina':
        return (
          <ModelPTreeOfi
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      case 'pisoUno':
      case 'pisoDos':
      case 'pisoTres':
      case 'pisoCuatro':
      case 'pisoCinco':
        return (
          <ModelOneTwoThreeFourFive
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
            selectedLetter={setLetter}
          />
        )
      case 'pisoSeis':
        return (
          <ModelPSix
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
          <ModelPSevenTen
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )

      case 'pisoOnce':
      case 'pisoDoce':
      case 'pisoTrece':
        return (
          <ModelElevenThirteen
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      case 'pisoCatorceAbc':
        return (
          <ModelFourTeen
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )

      case 'pisoQuinceAbc':
        return (
          <ModelFiveTeen
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )

      case 'pisoDieciseis':
        return (
          <ModelSixTeen
            onEventApartment={handlerApartment}
            selectedApartment={selectedApartment}
            selectedFloor={selectedFloor}
          />
        )
      default:
        return null
    }
  }
  const selectedOk = () => {
    switch (selectedFloor) {
      case 'plantaBajaOficina':
        return 'Planta baja Oficina'
      case 'pisoUnoOficina':
        return 'Piso uno Oficina'
      case 'pisoDosOficina':
        return 'Piso dos Oficina'
      case 'pisoTresOficina':
        return 'Piso tres Oficina'
      case 'plantaBaja':
        return 'Planta baja Departamentos'
      case 'pisoUno':
        return 'Piso uno'
      case 'pisoDos':
        return 'Piso dos'
      case 'pisoTres':
        return 'Piso tres'
      case 'pisoCuatro':
        return 'Piso cuatro'
      case 'pisoCinco':
        return 'Piso cinco'
      case 'pisoSeis':
        return 'Piso seis'
      case 'pisoSiete':
        return 'Piso siete'
      case 'pisoOcho':
        return 'Piso ocho'
      case 'pisoNueve':
        return 'Piso nueve'
      case 'pisoDiez':
        return 'Piso diez'
      case 'pisoOnce':
        return 'Piso once'
      case 'pisoDoce':
        return 'Piso doce'
      case 'pisoTrece':
        return 'Piso trece'
      case 'pisoCatorceAbc':
        return 'Piso catorce'
      case 'pisoQuinceAbc':
        return 'Piso quince'
      case 'pisoDieciseis':
        return 'Piso dieciseis'
      default:
        return null
    }
  }
  let selectedFloorOnly = selectedOk()
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
                <div className="flex-1  w-full rounded-t-2xl overflow-hidden ">
                  {renderFloorComponent(selectedFloor)}
                </div>

                <div className="flex w-full justify-evenly flex-col items-stretch gap-4 xl:gap-6 mt-4 xl:mt-6">
                  <div className="flex-1 space-y-3">
                    <div
                      key={selectedFloor}
                      className="flex flex-row items-center gap-4 floorTextAnimate text-[var(--color-one)] font-semibold  bg-white/20 rounded-lg p-3 border border-white/30 backdrop-blur-sm"
                    >
                      <p style={{ fontSize: '1.5rem' }}>{selectedFloorOnly} </p>
                      {selectedApartment ? renderApartmentPreview(selectedApartment) : ''}
                    </div>
                    <p className="text-sm lg:text-lg text-[var(--color-three)] ml-1">
                      Selecciona un departamento para ver más detalles y acceder a los planos
                      completos.
                    </p>
                  </div>

                  <div className="flex items-end lg:items-center">
                    {/* <Button
                      className={`w-full lg:w-auto lg:min-w-[200px] flex items-center justify-center gap-3 px-6 py-3
                                  transition-all duration-300 transform hover:scale-105
                                  ${
                                    !selectedApartment
                                      ? 'bg-gray-400 cursor-not-allowed opacity-60 hover:scale-100'
                                      : 'shadow-lg hover:shadow-xl'
                                  }`}
                      // onClick={selectedApartment ? handleViewPlans : () => {}}
                      //disabled={!selectedApartment}
                      disabled={true}
                    >
                      <span className="font-medium">Proximamente</span>
                      <MdOutlineArrowOutward
                        size="1.4em"
                        color={selectedApartment ? 'white' : '#9CA3AF'}
                      />
                    </Button> */}
                    <p className="text-sm lg:text-lg text-center text-[var(--color-three)] opacity-70 w-full p-3 ml-1">
                      Proximamente planos disponibles.
                    </p>
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
