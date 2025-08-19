import React from 'react'
import { FaInstagram } from 'react-icons/fa'
import { RiMailOpenLine } from 'react-icons/ri'
import { LuMapPin } from 'react-icons/lu'
import { MdOutlineArrowOutward } from 'react-icons/md'
import Button from './button'
import { Card } from './card'

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
              <a href="/ubicacion" className="hover:opacity-80 transition-opacity">
                Ubicación
              </a>
              <a href="/caracteristicas" className="hover:opacity-80 transition-opacity">
                Características
              </a>
              <a href="/galeria" className="hover:opacity-80 transition-opacity">
                Galería
              </a>
              <a href="/contacto" className="hover:opacity-80 transition-opacity">
                Contacto
              </a>
            </nav>

            {/* Iconos sociales */}
            <div className="flex gap-4 items-center">
              <a
                href="https://maps.app.goo.gl/JfvX3Am17h85QaoS7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-[var(--color-three)] transition-all duration-300"
              >
                <LuMapPin size="1.2em" color="white" />
              </a>
              <a
                href="mailto:info@vivraguemes.com"
                className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-[var(--color-three)] transition-all duration-300"
              >
                <RiMailOpenLine size="1.2em" color="white" />
              </a>
              <a
                href="https://www.instagram.com/juarezbeltran_sa?igsh=djh1czJwcGN0YzIx"
                target="_blank"
                rel="noopener noreferrer"
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
            <h3 className="text-white text-xl font-semibold mb-4">
              Estamos a tu disposición para resolver cualquier duda.
            </h3>
            <Button className="w-full min-d:w-auto bg-[var(--color-one)] hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-3">
              Contáctanos
              <MdOutlineArrowOutward size="1.2em" />
            </Button>
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
