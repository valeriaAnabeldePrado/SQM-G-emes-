import { Card } from './components/card'

// Componente principal con cards componentizadas
export default function SectionSeven() {
  return (
    <div className="flex items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)]">
      <Card className="flex-1 bg-[var(--color-two)] flex-col">
        <div className="w-full font-[var(--font-weight-bold)] text-(length:--text-menu) py-[var(--pading-y)]">
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
      <div className=" flex-1 flex gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] flex-col">
        <section className="flex-1  h-60 flex gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)]">
          <Card className="flex-1  bg-[var(--color-one)] flex-col">
            <div className="flex-1/3"></div>
            <div className="flex-1/3"></div>
            <div className="flex-1/3">
              <p>Visita Nuestro</p>
              <p>departamento modelo</p>{' '}
            </div>
          </Card>
        </section>
        <section className="flex-1 ">
          <Card className=" bg-[var(--color-one)]">otra</Card>
        </section>
      </div>
    </div>
  )
}
