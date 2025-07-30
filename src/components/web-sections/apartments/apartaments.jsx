import React from 'react'
import PlanoEdificio from '../../../assets/Corte'
import { Card } from '../home/components/card'
import { useState } from 'react'

// Importar los componentes de los modelos
import ModelOne from '../../../assets/floors/ModelOne'
import ModelNine from '../../../assets/floors/ModelNine'
import ModelFive from '../../../assets/floors/ModelFive'
import ModelTen from '../../../assets/floors/ModelTen'

const Apartaments = () => {
  const [selectedFloor, setSelectedFloor] = useState(null)

  const handleFloorClick = (floorId) => {
    setSelectedFloor(floorId)
  }

  const handleContainerClick = () => {
    setSelectedFloor(null)
  }

  // Función para renderizar el componente según el piso seleccionado
  const renderFloorComponent = (floorId) => {
    switch (floorId) {
      case 'p00-modelOne':
        return <ModelOne />
      case 'p01-03-modelNine':
        return <ModelNine />
      case 'p05-06-modelFive':
        return <ModelFive />
      case 'p07-p10-modelTen':
        return <ModelTen />
      case 'plantaAlta':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Planta Alta</h2>
            <p>Información de la planta alta...</p>
          </div>
        )
      case 'pisoDoce':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Piso 12</h2>
            <p>Información del piso 12...</p>
          </div>
        )
      case 'pisoOnce':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Piso 11</h2>
            <p>Información del piso 11...</p>
          </div>
        )
      case 'pisoDiez':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Piso 10</h2>
            <p>Información del piso 10...</p>
          </div>
        )
      case 'pisoNueve':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Piso 9</h2>
            <p>Información del piso 9...</p>
          </div>
        )
      default:
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Información del {selectedFloor}</h2>
            <p>Contenido específico para {selectedFloor}</p>
          </div>
        )
    }
  }
  return (
    <div className="custom-container mt-20 px-4 " onClick={handleContainerClick}>
      <h2 className="h-[12vh] ">Conoce nuestras unidades disponibles </h2>
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
