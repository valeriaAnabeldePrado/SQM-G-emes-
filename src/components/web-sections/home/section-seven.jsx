import { Card } from './components/card'
import { RiBuilding2Line } from 'react-icons/ri'
import { FiBox } from 'react-icons/fi'

// Componente principal con cards componentizadas
export default function SectionSeven() {
  return (
    <div className="flex flex-col min-d:flex-row items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)] min-d:h-[90vh] ">
      {/* Card principal - full width en mobile, flex-1 en desktop */}
      <div className="w-full min-d:flex-2  flex flex-col gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)]">
        <Card className="w-full bg-[var(--color-two)] flex-col min-d:h-full ">
          <div className="flex-grow-0 text-transparent flex-shrink-0 basis-1 w-full"></div>
          <div className="w-full flex flex-col font-[var(--font-weight-bold)] text-(length:--text-menu) py-[var(--pading-y)] min-d:justify-end min-d:h-full">
            <h3 className="text-subtitleS text-[var(--color-three)] min-lg:leading-14 leading-10">
              Pensado para habitar,{' '}
            </h3>
            <h3 className="text-subtitleS text-[var(--color-three)] min-lg:leading-14 leading-10">
              Proyectado para perdurar{' '}
            </h3>
          </div>
          <div>
            <p className="text-[var(--color-three)]">
              VIVRA Güemes es más que arquitectura: es una propuesta que se adapta a nuevas formas
              de habitar y trabajar. Su ubicación privilegiada, calidad constructiva y eficiencia
              energética lo convierten en una opción atractiva para vivir o invertir con visión a
              futuro.
            </p>
          </div>
        </Card>
      </div>

      {/* Container de las dos cards pequeñas */}
      <div className="w-full min-d:flex min-d:flex-1 min-d:flex-col hidden gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] ">
        {/* Primera card pequeña */}
        <section className="flex  gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] min-d:flex-1">
          <Card className="w-full cursor-pointer min-d:flex-1 bg-[var(--color-one)] flex flex-col ">
            <a href="/new" className=" w-full">
              <div className="flex w-full justify-end">
                <RiBuilding2Line size="4em" color="white" />
              </div>
              <div className="min-d:block hidden flex-grow-0 flex-shrink-0 basis-1/3 w-full"></div>
              <div className="flex-1 w-full">
                <h3 className="text-white  min-note:text-body text-menu">Experiencia</h3>
                <h3 className="text-white   min-note:text-body text-menu">
                  Inmersiva del edificio
                </h3>
              </div>
            </a>
          </Card>
        </section>

        {/* Segunda card pequeña */}
        <section className="min-d:flex-1 ">
          <Card className="w-full h-full cursor-pointer min-d:flex-1 bg-[var(--color-one)] flex flex-col ">
            <a href="/inmersive-apartament" className=" w-full">
              <div className="flex w-full justify-end">
                <FiBox size="4em" color="white" />
              </div>
              <div className="flex-grow-0 flex-shrink-0 basis-1/3 w-full"></div>
              <div className="flex-1 w-full">
                <h3 className="text-white min-note:text-body text-menu">Visita Nuestro</h3>
                <h3 className="text-white min-note:text-body text-menu">departamento modelo</h3>
              </div>
            </a>
          </Card>
        </section>
      </div>
    </div>
  )
}
