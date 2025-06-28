import React from 'react'
import { Card } from './components/card'
import { FaInstagram } from 'react-icons/fa'
import { RiMailOpenLine } from 'react-icons/ri'
import { LuMapPin } from 'react-icons/lu'
import ContactForm from './components/formData'

const SectionFooter = () => {
  return (
    <footer className="bg-[var(--color-three)] w-full">
      <div className="flex flex-col min-d:flex-row  items-stretch  gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] py-[var(--pading-y)] min-note:h-[100vh] custom-container mx-auto px-4">
        {/* Container de las dos cards pequeñas */}
        <div className="w-full  min-d:flex-1 mt-0 min-note:mt-28 min-note:h-[90%] min-extra:h-[83vh]  flex flex-col gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] ">
          {/* Primera card pequeña */}
          <section className="flex  h-[30%] gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] min-d:flex-1">
            <Card hasGradient className="w-full min-d:flex-1flex flex-col">
              <div className="min-extra:block hidden flex-grow-0 flex-shrink-0 basis-1/3 w-full"></div>
              <div className="flex-1 w-full">
                <h3 className="min-note:text-body min-d:text-button text-menu  text-white">
                  <strong>Conecta</strong> con quienes hacen realidad el proyecto
                </h3>
              </div>
            </Card>
          </section>

          <section className="flex h-[15%] gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] min-d:flex-1">
            <Card hasGradient className="w-full min-d:flex-1flex flex-col ">
              <div className="min-extra:block hidden flex-grow-0 flex-shrink-0 basis-1/3 w-full "></div>
              <div className="flex items-center w-full gap-5">
                <FaInstagram size="3em" color="white" />
                <h3 className="text-white min-note:text-body min-d:text-button text-menu">
                  Nuestro instagram
                </h3>
              </div>
            </Card>
          </section>
          <section className="flex h-[15%] gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] min-d:flex-1">
            <Card hasGradient className="w-full min-d:flex-1flex flex-col ">
              <div className="min-extra:block hidden flex-grow-0 flex-shrink-0 basis-1/3 w-full"></div>
              <div className="flex gap-5 items-center w-full">
                <RiMailOpenLine size="3em" color="white" />
                <h3 className="text-white min-note:text-body min-d:text-button text-menu">
                  Contacto
                </h3>
              </div>
            </Card>
          </section>
          <section className="flex h-[15%] gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)] min-d:flex-1">
            <Card hasGradient className="w-full min-d:flex-1flex flex-col ">
              <div className="min-extra:block hidden flex-grow-0 flex-shrink-0 basis-1/3 w-full"></div>
              <div className="flex gap-5 items-center w-full">
                <LuMapPin size="3em" color="white" />
                <h3 className="text-white min-note:text-body min-d:text-button text-menu">
                  Ubicación
                </h3>
              </div>
            </Card>
          </section>
        </div>
        <div className="w-full min-d:flex-1 flex mt-0 min-note:mt-28 min-note:h-[90%] h-full flex-col gap-[var(--generic-gap-tablet)] min-d:gap-[var(--generic-gap-desktop)]">
          <Card className="w-full bg-[var(--color-two)] flex-col h-full ">
            <div>
              <h3 className="text-[var(--color-three)] min-note:text-body min-d:text-button text-menu">
                Estamos a disposición para responder tus preguntas, contarte más sobre el proceso y
                brindarte toda la información que necesitás.
              </h3>
            </div>
            <ContactForm />
          </Card>
        </div>
      </div>
    </footer>
  )
}

export default SectionFooter
