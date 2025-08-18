import { Card } from './components/card'
import Button from './components/button'

import { FiBox } from 'react-icons/fi'
import { MdOutline3dRotation } from 'react-icons/md'

export default function SectionCallTo() {
  return (
    <div className="flex flex-col min-d:flex-row items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)] min-d:h-[90vh] ">
      <div className="w-full min-d:flex-2  flex flex-col gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] bg-[url('/src/assets/sectioncto/plano.png')]  bg-cover ">
        <Card hasGradient className="w-full flex-col min-d:h-full justify-between ">
          <div className="flex-grow-0 text-transparent flex-shrink-0 basis-1 w-full"></div>
          <div className="w-full flex flex-col font-[var(--font-weight-bold)] text-(length:--text-menu) py-10 min-d:justify-end">
            <h3 className="text-subtitleS text-[var(--color-three)] leading-14">
              Explorá el proyecto y sus planos
            </h3>
          </div>
          <div className="flex flex-col">
            <p className="text-[var(--color-three)] mb-6">
              Explorá los planos detallados de cada unidad, desde departamentos hasta oficinas.
              Navegá por el edificio, seleccioná cada piso y visualizá su distribución.
            </p>
            <Button
              onClick={() => console.log('Ver planos')}
              className="bg-[var(--color-one)] self-start"
              icon={<FiBox size="2em" />}
            >
              Ver planos
            </Button>
          </div>
        </Card>
      </div>

      <div className="w-full flex flex-col min-d:flex-1 gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] ">
        <section className="flex gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] min-d:flex-1   bg-cover">
          <Card className="w-full min-d:flex-1 flex flex-col justify-between bg-slate-300">
            <div className="flex-grow"></div>
            <div className="flex-1 w-full flex flex-col justify-end">
              <p className="text-[var(--color-three)] mb-4 text-sm">
                Recorré el edificio en 3D y descubrí sus espacios, niveles y unidades con una vista
                integral e interactiva.
              </p>
              <Button
                onClick={() => console.log('Recorrido del edificio')}
                className="bg-[var(--color-one)] self-start text-xs"
                icon={<MdOutline3dRotation size="2em" />}
              >
                Recorrido del edificio
              </Button>
            </div>
          </Card>
        </section>

        {/* Segunda card pequeña */}
        <section className="min-d:flex-1 ">
          <Card className="w-full h-full min-d:flex-1 bg-gray-100 flex flex-col justify-between">
            <div className="flex-grow"></div>
            <div className="flex-1 w-full flex flex-col justify-end">
              <p className="text-[var(--color-three)] mb-4 text-sm">
                Ingresá al departamento modelo y explorá cada ambiente en detalle a través de un
                recorrido 3D realista e inmersivo.
              </p>
              <Button
                onClick={() => console.log('Recorrido de la unidad')}
                className="bg-[var(--color-one)] self-start text-xs"
                icon={<MdOutline3dRotation size="2em" />}
              >
                Recorrido de la unidad
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
