import { Card } from './components/card'
import { CardArrow } from './components/card-arrow'
import buildE from '/src/assets/section-six/hori.png'
import bed from '/src/assets/section-six/dormitorio.png'
import dpto from '/src/assets/section-six/dpto.png'
import galleryOne from '/src/assets/section-six/galleryOne.jpg'
import galleryTwo from '/src/assets/section-six/galleryTwo.png'
import galleryThree from '/src/assets/section-six/galleryThree.png'
import galleryFour from '/src/assets/section-six/galleryFour.png'

const cardsData = [
  {
    img: galleryOne,
    alt: 'detailsOne'
  },

  {
    img: galleryThree,
    alt: 'detailsThree'
  },
  {
    img: galleryTwo,
    alt: 'detailsTwo'
  },
  {
    img: galleryFour,
    alt: 'detailsFour'
  }
]
export default function SectionSix() {
  return (
    <div
      id="gallery"
      className="flex flex-col  items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)] min-d:flex-col"
    >
      <div className="relative w-full h-screen ">
        <img
          src={buildE}
          alt="bannerRender"
          className="absolute top-0 left-0 w-full object-cover h-full rounded-[var(--border-radius-phone)] min-d:rounded-[var(--border-radius-tablet)] min-extra:rounded-[var(--border-radius-note)] min-note:rounded-[var(--border-radius-desktop)]"
        />
      </div>

      <div className="h-screen rounded-[var(--border-radius-phone)] min-d:rounded-[var(--border-radius-tablet)] min-extra:rounded-[var(--border-radius-note)] min-note:rounded-[var(--border-radius-desktop)] p-[var(--padding-cards)] bg-[url('/src/assets/section-six/dpto.png')] flex justify-center gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] w-full bg-cover">
        <div className="flex-1"></div>
        <div className="min-d:flex-1 h-[65%] flex flex-col items-center justify-center gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] md:flex-col min-d:h-full">
          <Card className="flex-1 w-full relative flex justify-start items-start overflow-hidden">
            <div
              className="absolute inset-0 bg-[var(--color-beige)]"
              style={{ zIndex: 0 }}
              aria-hidden="true"
            />
            {/* Contenido encima */}
            <div className="relative z-10 p-4">
              <h3 className="text-(length:--text-menu) text-[var(color-three)]">
                Una propuesta <strong>estetica y habitable</strong>
              </h3>
            </div>
          </Card>
          <Card className="flex-1/2 w-full relative overflow-hidden">
            {/* Fondo con opacidad */}
            <div
              className="absolute inset-0 bg-[var(--color-beige)]"
              style={{ zIndex: 0 }}
              aria-hidden="true"
            />
            {/* Contenido encima */}
            <div className="relative z-10 p-4 h-full flex justify-end items-end">
              <h3 className="text-(length:--text-menu)  text-[var(color-three)]">
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
          <div className="w-full relative h-screen  min-d:h-[700px] ">
            <img
              src={bed}
              alt="bannerRender"
              className="absolute top-0 left-0 w-full object-cover h-full rounded-[var(--border-radius-phone)] min-d:rounded-[var(--border-radius-tablet)] min-extra:rounded-[var(--border-radius-note)] min-note:rounded-[var(--border-radius-desktop)]"
            />
          </div>
        </div>

        {/* Container de las dos cards pequeñas */}
        <div className="w-full min-d:flex-1 flex flex-col gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)]">
          {/* Primera card pequeña */}
          <section className="flex gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] min-d:flex-1">
            <div className="w-full relative    ">
              <img
                src={dpto}
                alt="bannerRender"
                className="absolute top-0 left-0 w-full object-cover h-full rounded-[var(--border-radius-phone)] min-d:rounded-[var(--border-radius-tablet)] min-extra:rounded-[var(--border-radius-note)] min-note:rounded-[var(--border-radius-desktop)]"
              />
            </div>
          </section>

          {/* Segunda card pequeña */}
          <section className="flex gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] min-d:flex-1">
            <Card className="w-full min-d:flex-1 bg-[var(--color-two)] flex flex-col ">
              <div className="flex w-full justify-end"></div>
              <div className="min-d:block hidden flex-grow-0 flex-shrink-0 basis-1/3 w-full"></div>
              <div className="flex-1 w-full">LOGO</div>
            </Card>
          </section>
        </div>
      </div>
      {/*--------------------- sector numero 4 */}
      <div className="flex  flex-col min-d:flex-row items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] ">
        {cardsData.map(({ img, alt }, index) => (
          <CardArrow
            key={index}
            className="flex-1 min-w-0 overflow-hidden transition-all duration-300 min-d:hover:flex-[4] flex flex-col h-[700px] relative"
          >
            <div className="min-d:hidden h-[60vh]"></div>
            <img
              src={img}
              alt={alt}
              className="absolute inset-0 object-cover min-d:group-hover:scale-125 min-d:transition-transform min-d:duration-100 min-d:ease-in-out w-full h-full z-0"
              style={{ pointerEvents: 'none', objectPosition: 'center' }}
            />
          </CardArrow>
        ))}
      </div>
    </div>
  )
}
