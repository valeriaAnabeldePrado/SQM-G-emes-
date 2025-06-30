import React from 'react'
import { CardArrow } from './components/card-arrow'

const featuresData = [
  {
    title: 'Pisos de porcelanato Eliane Town',
    description:
      'En palieres, áreas comunes y baños se utiliza porcelanato rectificado símil cemento, brindando durabilidad, estilo contemporáneo y fácil mantenimiento.'
  },
  {
    title: 'Confort sostenible',
    description:
      ' Sistema centralizado de agua caliente sanitaria que optimiza el consumo energético de cada unidad.'
  },
  {
    title: 'Cocinas funcionales y modernas',
    description:
      'Muebles bajo mesada de diseño contemporáneo, equipadas con anafe eléctrico, herrajes de cierre suave y mesadas de granito natural.'
  }
]
const SectionFive = () => {
  return (
    <div>
      <div className="flex flex-col items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] pb-[var(--pading-y)]">
        {featuresData.map((feature, index) => (
          <CardArrow
            key={index}
            className="flex-1 min-w-0  overflow-hidden transition-all duration-300 min-d:hover:flex-[2] flex-col"
            hasGradient={true}
            hideGradientOnHover={true}
            isRed={true}
          >
            <h3 className="w-full  py-4 text-subtitleS text-[var(--color-three)]">
              {feature.title}
            </h3>
            <div
              className="min-d:max-h-1 text-[var(--color-three)] min-d:overflow-hidden min-d:opacity-0 min-d:group-hover:max-h-96 min-d:group-hover:opacity-100 min-d:transition-all min-d:duration-700 w-full"
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <p>{feature.description}</p>
            </div>
          </CardArrow>
        ))}
      </div>
    </div>
  )
}
export default SectionFive
