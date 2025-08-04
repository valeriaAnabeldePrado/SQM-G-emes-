import React from 'react'
import { FaInstagram } from 'react-icons/fa'
import { RiMailOpenLine } from 'react-icons/ri'
import { LuMapPin } from 'react-icons/lu'
import { MdOutlineArrowOutward } from 'react-icons/md'
import Button from '../button'

const Footer = () => {
  return (
    <footer className="bg-[var(--color-three)] w-full py-12">
      <div className="custom-container mx-auto px-4">
        <div className="flex flex-col min-d:flex-row gap-8 min-d:gap-12 items-center min-d:items-start">
          {/* Columna izquierda: Logo y navegación */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              {/* Logo placeholder - será reemplazado cuando exista */}
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500 font-medium">LOGO</span>
              </div>
              <div className="text-2xl font-extrabold text-white tracking-wide">VIVRA GÜEMES</div>
            </div>

            {/* Navegación */}
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
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-[var(--color-three)] transition-all duration-300"
              >
                <LuMapPin size="1.2em" />
              </a>
              <a
                href="mailto:info@vivraguemes.com"
                className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-[var(--color-three)] transition-all duration-300"
              >
                <RiMailOpenLine size="1.2em" />
              </a>
              <a
                href="https://goo.gl/maps/xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:text-[var(--color-three)] transition-all duration-300"
              >
                <FaInstagram size="1.2em" />
              </a>
            </div>
          </div>

          {/* Columna derecha: CTA */}
          <div className="flex-1 bg-[var(--color-two)] bg-opacity-20 rounded-2xl p-8 backdrop-blur-sm border border-white border-opacity-20">
            <h3 className="text-white text-xl font-semibold mb-4">
              Estamos a tu disposición para resolver cualquier duda.
            </h3>
            <Button className="w-full min-d:w-auto bg-[var(--color-one)] hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-3">
              Contáctanos
              <MdOutlineArrowOutward size="1.2em" />
            </Button>
          </div>
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
