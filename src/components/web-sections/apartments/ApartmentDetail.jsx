import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MdOutlineArrowBack, MdOutlineArrowOutward } from 'react-icons/md'
import { Card } from '../home/components/card'
import Button from '../home/components/button'
import apartmentData from './utils/apartmentData.json'

const ApartmentDetail = () => {
  const { apartmentId } = useParams()
  const navigate = useNavigate()

  const apartment = apartmentData[apartmentId]

  if (!apartment) {
    return (
      <div className="custom-container mt-20 px-4">
        <h2>Departamento no encontrado</h2>
        <Button onClick={() => navigate('/apartments')} className="mt-4">
          <MdOutlineArrowBack size="1.2em" className="mr-2" />
          Volver a apartamentos
        </Button>
      </div>
    )
  }

  return (
    <div className="custom-container mt-20 px-4">
      {/* Header con botón de volver */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={() => navigate('/apartments')}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600"
        >
          <MdOutlineArrowBack size="1.2em" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold">{apartment.title}</h1>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Columna izquierda - Información principal */}
        <div className="space-y-6">
          {/* Card de información básica */}
          <Card hasGradient className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{apartment.type}</h2>
                <p className="text-lg text-gray-600">{apartment.area}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-orange-500">{apartment.price}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">{apartment.description}</p>

            <div className="flex gap-4">
              <Button className="flex-1 flex items-center justify-center gap-2">
                Consultar precio
                <MdOutlineArrowOutward size="1.2em" />
              </Button>
              <Button className="flex-1 bg-gray-600 hover:bg-gray-700 flex items-center justify-center gap-2">
                Agendar visita
                <MdOutlineArrowOutward size="1.2em" />
              </Button>
            </div>
          </Card>

          {/* Card de características */}
          <Card hasGradient className="p-6">
            <h3 className="text-xl font-bold mb-4">Características</h3>
            <div className="grid grid-cols-2 gap-2">
              {apartment.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Card de amenities */}
          <Card hasGradient className="p-6">
            <h3 className="text-xl font-bold mb-4">Amenities del edificio</h3>
            <div className="grid grid-cols-2 gap-2">
              {apartment.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Columna derecha - Galería de imágenes */}
        <div className="space-y-6">
          {/* Imagen principal */}
          <Card hasGradient className="p-4">
            <h3 className="text-xl font-bold mb-4">Galería de imágenes</h3>
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
              <img
                src={apartment.images[0]}
                alt={`${apartment.title} - Imagen principal`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="w-full h-full bg-gray-300 rounded-lg hidden items-center justify-center">
                <span className="text-gray-600">Imagen no disponible</span>
              </div>
            </div>

            {/* Miniaturas */}
            <div className="grid grid-cols-4 gap-2">
              {apartment.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded overflow-hidden">
                  <img
                    src={image}
                    alt={`${apartment.title} - Imagen ${index + 2}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="w-full h-full bg-gray-300 rounded hidden items-center justify-center">
                    <span className="text-gray-500 text-xs">N/A</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Plano del departamento */}
          <Card hasGradient className="p-4">
            <h3 className="text-xl font-bold mb-4">Plano del departamento</h3>
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={apartment.floorPlan}
                alt={`Plano de ${apartment.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="w-full h-full bg-gray-300 rounded-lg hidden items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Plano no disponible</p>
                  <Button className="text-sm">
                    Solicitar plano
                    <MdOutlineArrowOutward size="1em" className="ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Sección de contacto */}
      <Card hasGradient className="p-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">¿Interesado en este departamento?</h3>
          <p className="text-gray-700 mb-6">
            Nuestro equipo de ventas está listo para ayudarte con toda la información que necesitas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button className="flex-1 flex items-center justify-center gap-2">
              Llamar ahora
              <MdOutlineArrowOutward size="1.2em" />
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2">
              WhatsApp
              <MdOutlineArrowOutward size="1.2em" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ApartmentDetail
