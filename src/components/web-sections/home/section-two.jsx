import { Card } from './components/card'

// Componente principal con cards componentizadas
export default function SectionTwo() {
  return (
    <div className="flex flex-col min-d:flex-row items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)]">
      {/* Container de las 3 cards pequeñas */}
      <div className="w-full  flex gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] flex-col basis-1/2 ">
        {/* Sección superior con 2 cards horizontales */}
        <section className=" flex  md:flex-row gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] sm:flex-row basis-1/2">
          <Card className="flex-1 flex-col " hasGradient={true}>
            <h2 className="text-(length:--text-title-huge) font-[var(--font-weight-bold)] leading-none text-[var(--color-one)]">
              46
            </h2>
            <div className="min-d:items-start w-full items-center justify-center align-middle flex flex-col">
              <p>Unidades</p>
              <p>Disponibles</p>
            </div>
          </Card>
          <Card
            className="flex-1 font-[var(--font-weight-bold)] flex-col w-full min-d:items-start   "
            hasGradient
          >
            <div className="flex-1/2 items-center justify-center align-middle flex"></div>
            <div>
              <p>Bloque</p>
              <p>Coorporativo</p>
              <p>Comercial</p>
            </div>
          </Card>
        </section>
        {/* Sección inferior con 1 card */}
        <section className="basis-1/2 ">
          <Card className="w-full  bg-[var(--color-two)] flex-col">
            <div className="flex-1/2"></div>
            <div>
              <p>Ubicado en</p>
              <h2 className="font-[var(--font-weight-bold)] text-(length:--text-menu)">
                Av. Pueyrredón 387
              </h2>
            </div>
          </Card>
        </section>
      </div>

      {/* Card principal grande */}
      <div className="basis-1/2">
        <Card className="w-full min-d:flex-1 bg-red-500 flex-col h-full " hasGradient>
          <div className="flex-1"></div>
          <div className="">
            <p>
              En SQM Güemes, convergen estilo, funcionalidad y ubicación. Un proyecto moderno que
              redefine la forma de habitar y trabajar, integrando un bloque residencial con unidades
              de 1 y 2 dormitorios, microviviendas y dúplex, más un bloque corporativo ideal para
              oficinas y locales comerciales.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
