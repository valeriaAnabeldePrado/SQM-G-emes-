import React from 'react'
import PlanoEdificio from '../../../assets/Corte'
import { Card } from '../home/components/card'
import { useState } from 'react'

import ModelOne from '../../../assets/floors/ModelOne'
import ModelTwo from '../../../assets/floors/ModelTwo'
import ModelFour from '../../../assets/floors/ModelFour'
import ModelFive from '../../../assets/floors/ModelFive'
import ModelThree from '../../../assets/floors/ModelThree'
import ModelSeven from '../../../assets/floors/ModelSeven'
import ModelSix from '../../../assets/floors/ModelSix'
import ModelEight from '../../../assets/floors/ModelEight'

const Apartaments = () => {
  const [selectedFloor, setSelectedFloor] = useState(null)

  const handleFloorClick = (floorId) => {
    setSelectedFloor(floorId)
  }

  const handleContainerClick = () => {
    setSelectedFloor(null)
  }

  const renderFloorComponent = () => {
    switch (selectedFloor) {
      case 'p01-modelOne':
      case 'p02-modelOne':
      case 'p03-modelOne':
        return <ModelOne />
      case 'p04-modelTwo':
        return <ModelTwo />
      case 'p05-modelThree':
      case 'p06-modelThree':
        return <ModelThree />
      case 'p07-modelFour':
      case 'p08-modelFour':
      case 'p09-modelFour':
      case 'p10-modelFour':
        return <ModelFour />
      case 'p11-modelFive':
      case 'p12-modelSix':
        return <ModelFive />
      case 'plantaAlta':
        return <ModelSix />
      case 'asador':
        return <ModelSeven />
      default:
        return null
    }
  }
  return (
    <div className="custom-container mt-20 px-4 " onClick={handleContainerClick}>
      <h2 className="h-auto ">Conoce nuestras unidades disponibles </h2>
      <section className="flex max-md:flex-col h-full max-lg:mt-8  items-center justify-center gap-4 mt-2">
        <div className="h-[70vh] flex-1 " onClick={(e) => e.stopPropagation()}>
          <PlanoEdificio onEvent={handleFloorClick} selectedFloor={selectedFloor} />
        </div>
        <div id="dinamic-card" className="flex-1 " onClick={(e) => e.stopPropagation()}>
          {!selectedFloor ? (
            <section className="flex flex-col gap-4 w-full">
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
            <Card hasGradient className="min-h-[25vh] overflow-auto">
              {renderFloorComponent(selectedFloor)}
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}

export default Apartaments
