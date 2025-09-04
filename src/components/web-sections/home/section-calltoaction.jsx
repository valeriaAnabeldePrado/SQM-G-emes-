import { Card } from './components/card'
import Button from './components/button'
import { FiBox } from 'react-icons/fi'
import { MdOutline3dRotation, MdTimeline } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

export default function SectionCallTo() {
  const navigate = useNavigate()

  const handleNavigateToApartments = () => {
    navigate('/apartments')
  }

  const handleNavigateToInmersive = () => {
    navigate('/inmersive-build')
  }
  const handleNavigateToUnidad = () => {
    navigate('/inmersive-apartament')
  }
  const handleNavigateToRoadmap = () => {
    navigate('/roadmap')
  }
  return (
    <>
      <div className="flex flex-col min-d:flex-row items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-7  ">
        <div className="w-full flex flex-col gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] bg-[url('/src/assets/sectioncto/plano.png')]  bg-cover ">
          <Card hasGradient className="w-full flex-col min-d:h-full justify-between ">
            <div className="w-full flex flex-col font-[var(--font-weight-bold)] text-(length:--text-menu) py-10 min-d:justify-end">
              <h3 className="text-subtitleS text-[var(--color-three)] min-lg:leading-14 leading-10">
                Explorá el proyecto y sus planos
              </h3>
            </div>
            <div className="flex flex-col w-full">
              <p className="text-[var(--color-three)] mb-6">
                Explorá los planos detallados de cada unidad, desde departamentos hasta oficinas.
                Navegá por el edificio, seleccioná cada piso y visualizá su distribución.
              </p>
              <Button
                onClick={handleNavigateToApartments}
                className="bg-[var(--color-one)] self-start min-md:w-[300px] w-full justify-between"
                icon={<FiBox size="2em" />}
              >
                Ver planos
              </Button>
            </div>
          </Card>
        </div>

        <div className="  flex  flex-col min-d:flex-1 gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] ">
          <div className="flex flex-col gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] min-d:flex-1">
            {/* Primera card pequeña - Unidad */}
            <section className="min-d:flex-1">
              <Card hasGradient className="w-full h-full bg-gray-100 flex flex-col justify-between">
                <div className="flex-grow"></div>
                <div className="flex-1 w-full flex flex-col justify-end">
                  <p className="text-[var(--color-three)] mb-4 text-sm">
                    Ingresá al departamento modelo y explorá cada ambiente en detalle a través de un
                    recorrido realista e inmersivo.
                  </p>
                  <Button
                    onClick={handleNavigateToUnidad}
                    className="bg-[var(--color-one)] self-start min-md:w-[350px] w-full justify-between"
                    icon={<FiBox size="2em" />}
                  >
                    Recorrido de la unidad
                  </Button>
                </div>
              </Card>
            </section>

            {/* Segunda card pequeña - Roadmap */}
            <section className="min-d:flex-1">
              <Card hasGradient className="w-full h-full bg-gray-200 flex flex-col justify-between">
                <div className="flex-grow"></div>
                <div className="flex-1 w-full flex flex-col justify-end">
                  <p className="text-[var(--color-three)] mb-4 text-sm">
                    Seguí el avance de obra mes a mes con fotos reales del proceso constructivo.
                    Conocé cada etapa del desarrollo.
                  </p>
                  <Button
                    onClick={handleNavigateToRoadmap}
                    className="bg-[var(--color-one)] self-start min-md:w-[350px] w-full justify-between"
                    icon={<MdTimeline size="2em" />}
                  >
                    Ver avance de obra
                  </Button>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </div>

      <Card
        hasGradient
        className="w-full min-d:flex-1 min-md:flex hidden flex-col justify-between bg-slate-300"
      >
        <div className="flex-1 w-full flex flex-col justify-end">
          <h3 className="text-[var(--color-three)]  min-md:text-4xl mb-10">
            Recorré el edificio en 3D y descubrí sus espacios, niveles y unidades con una vista
            integral e interactiva.
          </h3>
          <Button
            onClick={handleNavigateToInmersive}
            className="bg-[var(--color-one)] self-start min-md:w-[350px] justify-between"
            icon={<MdOutline3dRotation size="2em" />}
          >
            Recorrido del edificio
          </Button>
        </div>
      </Card>
    </>
  )
}
