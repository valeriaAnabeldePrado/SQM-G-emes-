import React from 'react'
import { FaInstagram } from 'react-icons/fa'
import { RiMailOpenLine } from 'react-icons/ri'
import { LuMapPin } from 'react-icons/lu'
import { MdOutlineArrowOutward } from 'react-icons/md'
import Button from '../../home/components/button'
import { Card } from '../../home/components/card'
import ContactForm from '../../home/components/formData'
import { LINKS } from '../../../../data/buildingInfo'

const Footer = () => {
  return (
    <footer className="bg-[var(--color-three)] w-full py-12 rounded-3xl">
      <div className="custom-container mx-auto px-4">
        <div className="flex flex-col min-[767px]:flex-row gap-8 min-d:gap-12 items-start">
          <div className="flex-1 flex flex-col gap-6  ">
            <div className="min-xl:text-6xl text-5xl font-extrabold text-white tracking-wide">
              VIVRA GÜEMES
            </div>

            <nav className="flex flex-col gap-2 text-white">
              <a href="/" className="hover:opacity-80 transition-opacity">
                Home
              </a>
              <a href="/apartments" className="hover:opacity-80 transition-opacity">
                Apartamentos
              </a>
              <a href="/roadmap" className="hover:opacity-80 transition-opacity">
                Roadmap
              </a>
              <a href="/#location" className="hover:opacity-80 transition-opacity">
                Ubicación
              </a>
              <a href="/#characte" className="hover:opacity-80 transition-opacity">
                Características
              </a>
              <a href="/#gallery" className="hover:opacity-80 transition-opacity">
                Galería
              </a>
              <a href="/#contact" className="hover:opacity-80 transition-opacity">
                Contacto
              </a>
            </nav>

            {/* Iconos sociales */}
            <div className="flex gap-4 items-center">
              <a
                href={LINKS.maps}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver VIVRA Güemes en Google Maps"
                title="Ver VIVRA Güemes en Google Maps"
                className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-[var(--color-three)] transition-all duration-300"
              >
                <LuMapPin size="1.2em" color="white" />
              </a>
              <a
                href={LINKS.email}
                aria-label="Escribinos por mail"
                title="Escribinos por mail"
                className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-[var(--color-three)] transition-all duration-300"
              >
                <RiMailOpenLine size="1.2em" color="white" />
              </a>
              <a
                href={LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de VIVRA Güemes"
                title="Instagram de VIVRA Güemes"
                className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-[var(--color-three)] transition-all duration-300"
              >
                <FaInstagram size="1.2em" color="white" />
              </a>
            </div>
          </div>
          <Card
            hasGradient
            className="flex-1 flex flex-col gap-6 bg-opacity-20 rounded-2xl p-8 backdrop-blur-sm border border-white border-opacity-20"
          >
            <ContactForm />
          </Card>
        </div>

        {/* Copyright */}
        <div className="w-full text-center text-white text-xs opacity-60 mt-10 pt-6 border-t border-white border-opacity-20">
          © {new Date().getFullYear()} VIVRA Güemes. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

export default Footer
