import React from 'react'
import { Card } from './components/card'
import { FaInstagram } from 'react-icons/fa'
import { RiMailOpenLine } from 'react-icons/ri'
import { LuMapPin } from 'react-icons/lu'
import ContactForm from './components/formData'

const SectionFooter = () => {
  return (
    <footer className="bg-[var(--color-three)] w-full pt-12 pb-0">
      <div className="custom-container mx-auto px-4 flex flex-col min-d:flex-row gap-12 min-d:gap-20 items-start">
        {/* Columna izquierda: branding, texto, datos, redes */}
        <div className="w-full min-d:w-1/2 flex flex-col gap-6 items-center min-d:items-start justify-center">
          <div className="text-2xl font-extrabold text-white mb-2 tracking-wide">VIVRA Güemes</div>
          <div className="text-white text-base opacity-90 mb-2 text-center min-d:text-left">
            Av. Pueyrredón 377 · Córdoba Capital
          </div>
          <div className="text-white text-sm opacity-80 mb-4 text-center min-d:text-left">
            ¿Querés saber más? Escribinos o seguinos en redes para conocer más sobre el proyecto.
          </div>
          <div className="flex flex-row gap-6 items-center justify-center min-d:justify-start">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <FaInstagram size="2em" color="white" />
            </a>
            <a href="mailto:info@vivraguemes.com" className="hover:scale-110 transition-transform">
              <RiMailOpenLine size="2em" color="white" />
            </a>
            <a
              href="https://goo.gl/maps/xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <LuMapPin size="2em" color="white" />
            </a>
          </div>
        </div>
        {/* Columna derecha: formulario */}
        <div id="contact" className="w-full min-d:w-1/2 flex flex-col justify-center">
          <Card className="w-full bg-[var(--color-two)] flex-col p-8 rounded-2xl shadow-xl flex justify-center items-center">
            <h3 className="text-[var(--color-three)] text-lg min-note:text-body min-d:text-button text-center font-semibold mb-6">
              Escribinos y te contactamos
            </h3>
            <ContactForm />
          </Card>
        </div>
      </div>
      <div className="w-full text-center text-white text-xs opacity-60 mt-10 pb-4">
        © {new Date().getFullYear()} VIVRA Güemes. Todos los derechos reservados.
      </div>
    </footer>
  )
}

export default SectionFooter
