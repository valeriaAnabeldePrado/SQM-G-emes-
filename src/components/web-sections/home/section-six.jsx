import React, { useState } from 'react'
import { Card } from './components/card'
import { CardArrow } from './components/card-arrow'
import bed from '/src/assets/section-six/dormitorio.png'
import dpto from '/src/assets/section-six/dpto.png'
import galleryOne from '/src/assets/section-six/galleryOne.jpg'
import galleryTwo from '/src/assets/section-six/galleryTwo.jpg'
import deptoCompleto from '/src/assets/section-six/depa1.jpg'
import galleryFour from '/src/assets/section-six/galleryFour.png'

const cardsData = [
  {
    img: galleryOne,
    alt: 'detailsOne'
  },

  {
    img: deptoCompleto,
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
  const [modalImage, setModalImage] = useState(null)

  const openModal = (img) => {
    setModalImage(img)
  }

  const closeModal = () => {
    setModalImage(null)
  }

  return (
    <div
      id="gallery"
      className="flex flex-col  items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)] min-d:flex-col"
    >
      <div
        className="cursor-pointer aspect-square w-full max-w-[90vw] max-h-[70vw] mx-auto rounded-[var(--border-radius-phone)] min-d:rounded-[var(--border-radius-tablet)] min-extra:rounded-[var(--border-radius-note)] min-note:rounded-[var(--border-radius-desktop)] p-[var(--padding-cards)] bg-[url('/src/assets/section-six/galeria1.jpg')] flex justify-center gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] bg-cover cursor-pointer transition-transform duration-300"
        onClick={() => openModal('/src/assets/section-six/galeria1.jpg')}
      ></div>

      <div
        className=" aspect-square w-full max-w-[90vw] max-h-[70vw] mx-auto rounded-[var(--border-radius-phone)] min-d:rounded-[var(--border-radius-tablet)] min-extra:rounded-[var(--border-radius-note)] min-note:rounded-[var(--border-radius-desktop)] p-[var(--padding-cards)] bg-[url('/src/assets/section-six/depa2.jpg')] flex justify-center gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] bg-cover cursor-pointer transition-transform duration-300"
        onClick={() => openModal('/src/assets/section-six/depa2.jpg')}
      ></div>
      {/*---------------------  Sector numero 3 */}
      <div className="flex flex-col min-d:flex-row items-stretch gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] h-full">
        {/* Card principal - full width en mobile, flex-1 en desktop */}
        <div className="w-full min-d:flex-1 flex flex-col gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)]">
          <div className="w-full relative h-screen  min-d:h-[700px] ">
            <img
              src={bed}
              alt="bannerRender"
              className=" absolute top-0 left-0 w-full object-cover h-full rounded-[var(--border-radius-phone)] min-d:rounded-[var(--border-radius-tablet)] min-extra:rounded-[var(--border-radius-note)] min-note:rounded-[var(--border-radius-desktop)] cursor-pointer transition-transform duration-300"
              onClick={() => openModal(bed)}
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
                className="absolute top-0 left-0 w-full object-cover h-full rounded-[var(--border-radius-phone)] min-d:rounded-[var(--border-radius-tablet)] min-extra:rounded-[var(--border-radius-note)] min-note:rounded-[var(--border-radius-desktop)] cursor-pointer  transition-transform duration-300"
                onClick={() => openModal(dpto)}
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
              className="absolute inset-0 object-cover  min-d:transition-transform min-d:duration-100 min-d:ease-in-out w-full h-full z-0 cursor-pointer"
              style={{ pointerEvents: 'auto', objectPosition: 'center' }}
              onClick={() => openModal(img)}
            />
          </CardArrow>
        ))}
      </div>

      {/* Modal para mostrar imagen ampliada - Solo desktop */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 min-d:flex items-center justify-center z-500 hidden transition-opacity duration-300 ease-in-out"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={closeModal}
        >
          <div className="relative w-[80vw] h-[80vh] flex items-center justify-center transform scale-95 transition-transform duration-300 ease-in-out ">
            <img
              src={modalImage}
              alt="Imagen ampliada"
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="cursor-pointer absolute text-center top-4 right-4 text-white text-4xl bg-black bg-opacity-60 pt-2 pb-4 px-5 rounded-full flex items-center justify-center hover:bg-opacity-80  transition-all duration-200 ease-in-out"
              onClick={closeModal}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
