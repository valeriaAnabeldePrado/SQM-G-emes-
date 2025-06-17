import { Card } from './components/card'

// Componente principal con cards componentizadas
export default function SectionTwo() {
  return (
    <div className="flex items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)]">
      <div className=" flex-1 flex gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] flex-col">
        <section className="flex-1  h-60 flex gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)]">
          <Card className="flex-1 flex-col " hasGradient={true}>
            <h2 className="text-(length:--text-title-huge) font-[var(--font-weight-bold)] leading-none text-[var(--color-one)] ">
              46
            </h2>
            <div className="items-start w-full">
              <p>Unidades</p>
              <p>Disponibles</p>
            </div>
          </Card>
          <Card
            className="flex-1 font-[var(--font-weight-bold)] flex-col w-full items-start"
            hasGradient
          >
            <div className="flex-1/2"></div>
            <div>
              <p>Bloque</p>
              <p>Coorporativo</p>
              <p>Comercial</p>
            </div>
          </Card>
        </section>
        <section className="flex-1 ">
          <Card className="h-60 bg-[var(--color-two)] flex-col">
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
      <Card className="flex-1 bg-red-500 flex-col" hasGradient>
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
  )
}
