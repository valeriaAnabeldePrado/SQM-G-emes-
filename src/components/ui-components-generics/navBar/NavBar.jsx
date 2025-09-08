import React, { useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { IoClose, IoMenu } from 'react-icons/io5'
import { useLocation } from 'react-router-dom'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isHomePage, setIsHomePage] = useState(true)
  const location = useLocation()

  const toggleMenu = () => setIsOpen(!isOpen)

  // Detectar si estamos en la home o en otras secciones usando React Router
  useEffect(() => {
    const currentPath = location.pathname
    setIsHomePage(currentPath === '/' || currentPath === '')
  }, [location.pathname])

  const routes = [
    { id: 1, name: '3D inmersivo', path: '/inmersive-apartament' },
    { id: 2, name: 'Departamentos', path: '/apartments' },
    { id: 3, name: 'Avance de Obra', path: '/roadmap' },
    { id: 4, name: 'Galería', path: '#gallery' },
    { id: 5, name: 'Características', path: '/#characte' },
    { id: 6, name: 'Contacto', path: '#contact' }
  ]

  const routesBurger = [
    { id: 1, name: 'Inicio', path: '/' },
    { id: 2, name: 'Departamentos', path: '/apartments' },
    { id: 3, name: 'Avance de Obra', path: '/roadmap' },
    { id: 4, name: 'Características', path: '/#characte' },
    { id: 5, name: 'Galería', path: '/#gallery' },
    { id: 6, name: 'Contacto', path: '/#contact' },
    { id: 7, name: 'Vista 3D Edificio', path: '/inmersive-build' },
    { id: 8, name: 'Vista 3D Apartamento', path: '/inmersive-apartament' }
  ]

  return (
    <div
      className={`fixed z-70 min-d:top-4 min-d:left-2 top-8 px-6 right-2 min-sm:right-[5%] flex flex-col items-end pointer-events-none ${
        isHomePage
          ? ' min-d:custom-container min-d:w-full min-d:items-stretch min-d:px-8'
          : 'w-auto'
      }`}
    >
      <nav
        className={`px-6 py-[1.2rem] min-note:py-[2rem] flex items-center rounded-full backdrop-blur-lg pointer-events-auto ${
          isHomePage
            ? 'min-d:px-12 justify-end min-d:w-full min-d:justify-between'
            : 'justify-center'
        }`}
        style={{
          border: '2px solid var(--color-border)',
          background: 'var(--gradient-alt)'
        }}
      >
        {/* LOGO - Solo se muestra en desktop cuando estamos en home */}
        {isHomePage && (
          <div className="hidden min-d:flex min-d:items-center">
            <img src="/vivra-logo.png" alt="VIVRA Logo" className="h-8 w-auto mr-2 " />
          </div>
        )}

        {/* DESKTOP MENU - Solo se muestra en pantallas grandes Y solo en home */}
        {isHomePage && (
          <div className="hidden min-d:flex  space-x-16 font-bold text-[var(--color-three)] text-menu">
            {routes.map((route) => (
              <a
                key={route.id}
                href={route.path}
                className="hover:text-[var(--color-one)] transition-colors"
              >
                {route.name}
              </a>
            ))}
          </div>
        )}

        {/* MOBILE TOGGLE - Se muestra en mobile SIEMPRE, o en desktop cuando NO es home */}
        <div className={`flex ${isHomePage ? 'min-d:hidden' : ''}`}>
          <button
            onClick={toggleMenu}
            className="text-[var(--color-three)] hover:text-[var(--color-one)] transition-all duration-200 p-1"
          >
            {isOpen ? (
              <IoClose className="text-4xl transition-all duration-300 rotate-90" />
            ) : (
              <IoMenu className="text-4xl transition-all duration-300" />
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN MENU - Se muestra en mobile SIEMPRE, o en desktop cuando NO es home */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 translate-y-[-10px]"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-[-10px]"
      >
        <div
          className={`flex flex-col mt-4 rounded-[45px] px-8 py-6 text-right font-bold text-[var(--color-three)] text-menu backdrop-blur-lg z-80 relative w-[300px] ml-auto pointer-events-auto ${
            isHomePage ? 'min-d:hidden' : ''
          }`}
          style={{
            border: '2px solid var(--color-border)',
            background: 'var(--gradient-alt)'
          }}
        >
          {routesBurger.map((route) => (
            <a
              key={route.id}
              href={route.path}
              className={`block py-2 hover:text-[var(--color-one)] transition-colors ${
                route.id === 7 ? 'hidden md:block' : ''
              }`}
              onClick={() => setIsOpen(false)}
            >
              {route.name}
            </a>
          ))}
        </div>
      </Transition>
    </div>
  )
}

export default NavBar
