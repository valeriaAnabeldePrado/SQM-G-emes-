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
              <div className="space-y-3">
                {apartment.features.map((characteristic, index) => (
                  <p key={index} className="text-[var(--color-three)] mb-1">
                    {characteristic}
                  </p>
                ))}
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
