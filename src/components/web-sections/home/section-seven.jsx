import { Card } from './components/card'
import { FaRegBuilding } from 'react-icons/fa'
import { IoCubeOutline } from 'react-icons/io5'

// Componente principal con cards componentizadas
export default function SectionSeven() {
  return (
    <div className="flex flex-col min-d:flex-row items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)] h-full">
      {/* Card principal - full width en mobile, flex-1 en desktop */}
      <div className="w-full min-d:flex-1 flex flex-col gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)]">
        <Card className="w-full bg-[var(--color-two)] flex-col min-d:h-full ">
          <div className="flex-grow-0 text-transparent flex-shrink-0 basis-1 w-full"></div>
          <div className="w-full flex flex-col font-[var(--font-weight-bold)] text-(length:--text-menu) py-[var(--pading-y)] min-d:justify-end min-d:h-full">
            <h3>Pensado para habitar, </h3>
            <h3>Proyectado para perdurar </h3>
          </div>
          <div className="">
            <p>
              SQM Güemes es más que arquitectura: es una propuesta que se adapta a nuevas formas de
              habitar y trabajar. Su ubicación privilegiada, calidad constructiva y eficiencia
              energética lo convierten en una opción atractiva para vivir o invertir con visión a
              futuro.
            </p>
          </div>
        </Card>
      </div>

      {/* Container de las dos cards pequeñas */}
      <div className="w-full min-d:flex-1 flex flex-col gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)]">
        {/* Primera card pequeña */}
        <section className="flex gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] min-d:flex-1">
          <Card className="w-full min-d:flex-1 bg-[var(--color-one)] flex flex-col ">
            <div className="flex w-full justify-end">
              <FaRegBuilding size="4em" />
            </div>
            <div className="min-d:block hidden flex-grow-0 flex-shrink-0 basis-1/3 w-full"></div>
            <div className="flex-1 w-full">
              <p>Experiencia</p>
              <p>Inmersiva del edificio</p>
            </div>
          </Card>
        </section>

        {/* Segunda card pequeña */}
        <section className="min-d:flex-1">
          <Card className="w-full min-d:flex-1 bg-[var(--color-one)] flex flex-col ">
            <div className="flex w-full justify-end">
              <IoCubeOutline size="4em" />
            </div>
            <div className="flex-grow-0 flex-shrink-0 basis-1/3 w-full"></div>
            <div className="flex-1 w-full">
              <p>Visita Nuestro</p>
              <p>departamento modelo</p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
