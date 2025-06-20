import React from 'react'
import { CardArrow } from './components/card-arrow'

export default function SectionFive() {
  return (
    <div className="py-[var(--pading-y)]">
      <div className="flex flex-col items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)]">
        <CardArrow
          className="flex-1 min-w-0 overflow-hidden transition-all duration-300 min-d:hover:flex-[2] flex-col"
          hasGradient={true}
          hideGradientOnHover={true}
        >
          <p className="w-full font-bold py-4">Pisos de porcelanato Eliane Town </p>
          <div
            className="min-d:max-h-1 min-d:overflow-hidden min-d:opacity-0 min-d:group-hover:max-h-96 min-d:group-hover:opacity-100 min-d:transition-all min-d:duration-700  w-full"
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <p>
              En palieres, áreas comunes y baños se utiliza porcelanato rectificado símil cemento,
              brindando durabilidad, estilo contemporáneo y fácil mantenimiento.
            </p>
          </div>
        </CardArrow>
        <CardArrow
          className="flex-1 min-w-0 overflow-hidden transition-all duration-300 min-d:hover:flex-[2] flex-col"
          hasGradient={true}
          hideGradientOnHover={true}
        >
          <p className="w-full font-bold py-4x">Eficiencia térmica inteligente </p>
          <div
            className="min-d:max-h-1 min-d:overflow-hidden min-d:opacity-0 min-d:group-hover:max-h-96 min-d:group-hover:opacity-100 min-d:transition-all min-d:duration-700  w-full"
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <p>
              Cerramientos exteriores con muro doble que mejoran el aislamiento térmico: ladrillo
              Corblock "Ceniza" al exterior y tabique cerámico interior con terminación en yeso
              proyectado.
            </p>
          </div>
        </CardArrow>
        <CardArrow
          className="flex-1 min-w-0 overflow-hidden transition-all duration-300 min-d:hover:flex-[2] flex-col"
          hasGradient={true}
          hideGradientOnHover={true}
        >
          <p className="w-full font-bold py-4">Confort sostenible </p>
          <div
            className="min-d:max-h-1 min-d:overflow-hidden min-d:opacity-0 min-d:group-hover:max-h-96 min-d:group-hover:opacity-100 min-d:transition-all min-d:duration-700  w-full"
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <p>
              Sistema centralizado de agua caliente sanitaria que optimiza el consumo energético de
              cada unidad
            </p>
          </div>
        </CardArrow>
      </div>
    </div>
  )
}
