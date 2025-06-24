import { Card } from './components/card'
import { CardArrow } from './components/card-arrow'

export default function SectionSix() {
  return (
    <div className="flex  items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)] min-d:flex-col bg-gray-400 p-4">
      {/*--------------------- Sector render del edificio */}
      <Card className="" hasGradient />
      {/*---------------------Sector una propuesta... */}
      <div
        className="h-screen rounded-[var(--border-radius-tablet)] 
  min-d:rounded-[var(--border-radius-desktop)] p-[var(--padding-cards)] bg-[url('/src/assets/section-six/depto-main.png')] flex justify-center gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] w-full bg-cover"
      >
        <div className="flex-1"></div>
        <div className="flex-1 flex items-center justify-center gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] md:flex-col h-full">
          <Card className="flex-1 w-full relative overflow-hidden">
            {/* Fondo translúcido */}
            <div
              className="absolute inset-0 bg-gray-200"
              style={{ opacity: 0.3, zIndex: 0 }}
              aria-hidden="true"
            />
            {/* Contenido encima */}
            <div className="relative z-10 p-4">
              <h3 className="text-(length:--text-menu) text-white">
                Una propuesta <strong>estetica y habitable</strong>
              </h3>
            </div>
          </Card>
          <Card className="flex-1/2 w-full relative overflow-hidden">
            {/* Fondo con opacidad */}
            <div
              className="absolute inset-0 bg-gray-200"
              style={{ opacity: 0.3, zIndex: 0 }}
              aria-hidden="true"
            />
            {/* Contenido encima */}
            <div className="relative z-10 p-4">
              <h3 className="text-(length:--text-menu)  text-white">
                Cada imagen representa el equilibrio entre lo moderno y lo atemporal. Materialidades
                nobles, iluminación cuidada y proporciones pensadas al detalle.
              </h3>
            </div>
          </Card>
        </div>
      </div>
      {/*---------------------  Sector numero 3 */}
      <div className="flex flex-col min-d:flex-row items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] h-full">
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
                SQM Güemes es más que arquitectura: es una propuesta que se adapta a nuevas formas
                de habitar y trabajar. Su ubicación privilegiada, calidad constructiva y eficiencia
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
              <div className="flex w-full justify-end"></div>
              <div className="min-d:block hidden flex-grow-0 flex-shrink-0 basis-1/3 w-full"></div>
              <div className="flex-1 w-full">
                <p>Experiencia</p>
                <p>Inmersiva del edificio</p>
              </div>
            </Card>
          </section>

          {/* Segunda card pequeña */}
          <section className="flex gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] min-d:flex-1">
            <Card className="w-full min-d:flex-1 bg-[var(--color-one)] flex flex-col ">
              <div className="flex w-full justify-end"></div>
              <div className="min-d:block hidden flex-grow-0 flex-shrink-0 basis-1/3 w-full"></div>
              <div className="flex-1 w-full">
                <p>Experiencia</p>
                <p>Inmersiva del edificio</p>
              </div>
            </Card>
          </section>
        </div>
      </div>
      {/*--------------------- sector numero 4 */}
      <div className="flex flex-col min-d:flex-row items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)]">
        <CardArrow className="flex-1 min-w-0 overflow-hidden transition-all duration-300 min-d:hover:flex-[2] flex flex-col">
          <div className="min-d:opacity-0 min-d:group-hover:opacity-100 min-d:transition-opacity min-d:duration-300">
            <p>Contenido de la card 1</p>
          </div>
        </CardArrow>
        <CardArrow className="flex-1 min-w-0 overflow-hidden transition-all duration-300 min-d:hover:flex-[2] flex flex-col min-d:h-[var(--height-card)]">
          <div className="min-d:opacity-0 min-d:group-hover:opacity-100 min-d:transition-opacity min-d:duration-300 pl-8">
            <h2>Pisos vinílicos flotantes</h2>
            <p>
              En interiores de departamentos y oficinas, piso vinílico flotante tono roble arenado,
              que aporta calidez, confort y una estética moderna y acogedora.
            </p>
          </div>
        </CardArrow>
        <CardArrow className="flex-1 min-w-0 overflow-hidden transition-all duration-300 min-d:hover:flex-[2]">
          <div className="min-d:opacity-0 min-d:group-hover:opacity-100 min-d:transition-opacity min-d:duration-300">
            <p>Contenido de la card 3</p>
          </div>
        </CardArrow>
        <CardArrow className="flex-1 min-w-0 overflow-hidden transition-all duration-300 min-d:hover:flex-[2]">
          <div className="min-d:opacity-0 min-d:group-hover:opacity-100 min-d:transition-opacity min-d:duration-300">
            <p>Contenido de la card 4</p>
          </div>
        </CardArrow>
      </div>
    </div>
  )
}
