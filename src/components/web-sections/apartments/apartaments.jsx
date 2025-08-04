import React from 'react'
import PlanoEdificio from '../../../assets/Corte'
import { Card } from '../home/components/card'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ModelOne from '../../../assets/floors/ModelOne'
import ModelTwo from '../../../assets/floors/ModelTwo'
import ModelThree from '../../../assets/floors/ModelThree'
import ModelFour from '../../../assets/floors/ModelFour'
import ModelFive from '../../../assets/floors/ModelFive'
import ModelSix from '../../../assets/floors/ModelSix'
import ModelSeven from '../../../assets/floors/ModelSeven'
import Button from '../home/components/button'
import { MdOutlineArrowOutward } from 'react-icons/md'
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

  console.log(selectedFloor)
  const renderFloorComponent = () => {
    switch (selectedFloor) {
      case 'p01-modelOne':
      case 'p02-modelOne':
      case 'p03-modelOne':
        return (
          <ModelOne onEventApartment={handlerApartment} selectedApartment={selectedApartment} />
        )
      case 'p04-modelTwo':
        return (
          <ModelTwo onEventApartment={handlerApartment} selectedApartment={selectedApartment} />
        )
      case 'p05-modelThree':
      case 'p06-modelThree':
        return (
          <ModelThree onEventApartment={handlerApartment} selectedApartment={selectedApartment} />
        )
      case 'p07-modelFour':
      case 'p08-modelFour':
      case 'p09-modelFour':
      case 'p10-modelFour':
        return (
          <ModelFour onEventApartment={handlerApartment} selectedApartment={selectedApartment} />
        )
      case 'p11-modelFive':
      case 'p12-modelSix':
        return (
          <ModelFive onEventApartment={handlerApartment} selectedApartment={selectedApartment} />
        )
      case 'plantaAlta':
        return (
          <ModelSix onEventApartment={handlerApartment} selectedApartment={selectedApartment} />
        )
      case 'asador':
        return (
          <ModelSeven onEventApartment={handlerApartment} selectedApartment={selectedApartment} />
        )
      default:
        return null
    }
  }
  return (
    <div className="custom-container mt-20 px-4 " onClick={handleContainerClick}>
      <h2 className="h-auto ">Conoce nuestras unidades disponibles </h2>
      <section className="flex max-md:flex-col h-full max-lg:mt-8  items-center justify-center gap-4 mt-2">
        <div className=" flex-1 " onClick={(e) => e.stopPropagation()}>
          <PlanoEdificio onEvent={handleFloorClick} selectedFloor={selectedFloor} />
        </div>
        <div id="dinamic-card" className="flex-1 relative" onClick={(e) => e.stopPropagation()}>
          {!selectedFloor ? (
            <section className="flex flex-col gap-4 w-full justify-center items-center animatedIn  h-[74vh]">
              <Card hasGradient className="h-[25vh]">
                <h2>Selecciona un piso para ver información detallada</h2>
                <p>Haz click en cualquier piso del edificio para conocer más detalles</p>
              </Card>
              <section className="flex flex-row gap-4">
                <Card hasGradient className="flex-1 flex-col gap-6">
                  <h3>Tipología</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
                </Card>
                <Card hasGradient className="flex-1 flex-col gap-6">
                  <h3>Tipología</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
                </Card>
              </section>
            </section>
          ) : (
            <Card
              hasGradient
              id="apartments-model"
              className="overflow-auto flex flex-row min-xl:gap-10 gap-5 animatedIn"
            >
              <div className="flex-2 bg-white rounded-2xl p-4 flex items-start justify-center">
                {renderFloorComponent(selectedFloor)}
              </div>
              <div className="flex flex-col justify-between min-sm:gap-16 gap-5">
                <p className="text-modal">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit exercitationem
                  ducimus inventore quod nesciunt perspiciatis praesentium
                </p>
                <Button
                  className="min-2xl:w-[250px] w-[160px] flex items-center justify-between"
                  onClick={handleViewPlans}
                >
                  Ver planos <MdOutlineArrowOutward size="1.5em" color="white" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}

export default Apartaments
