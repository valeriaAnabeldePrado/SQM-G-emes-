import React, { useState } from 'react'
import { Transition } from '@headlessui/react'
import { IoClose, IoMenu } from 'react-icons/io5'
import { useLocation } from 'react-router-dom'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const onlyMobileRoutes = ['/inmersive-apartament', '/apartments']
  const showOnlyMobile = onlyMobileRoutes.includes(location.pathname)

  const toggleMenu = () => setIsOpen(!isOpen)

  const routes = [
    { id: 1, name: 'Edificio', path: '/inmersive-apartament' },
    { id: 2, name: 'Departamentos', path: '/apartments' },
    { id: 3, name: 'Galería', path: '#gallery' },
    { id: 4, name: 'Contacto', path: '#contact' }
  ]
  const routesPhone = [
    { id: 1, name: 'Ubicación', path: '#location' },
    { id: 2, name: 'Características', path: '#characte' },
    { id: 3, name: 'Galería', path: '#gallery' },
    { id: 4, name: 'Contacto', path: '#contact' }
  ]

  return (
    <div
      className={`fixed z-50 min-d:top-4 top-8 px-6 ${
        showOnlyMobile
          ? 'w-[400px] right-2 min-sm:right-[5%] flex flex-col items-end'
          : 'custom-container w-full'
      }`}
    >
      <nav
        className={`px-6 py-[1.2rem] min-note:py-[2rem] min-d:px-12 flex items-center justify-between rounded-full backdrop-blur-lg ${
          showOnlyMobile ? 'w-[300px] justify-end' : 'w-full'
        }`}
        style={{
          border: '2px solid var(--color-border)',
          background: 'var(--gradient-alt)'
        }}
      >
        {/* LOGO - Solo se muestra en rutas normales */}
        {!showOnlyMobile && <div className="text-xl font-bold text-[var(--color-dark)]">LOGO</div>}

        {/* DESKTOP MENU - Solo se muestra en rutas normales (/) y pantallas grandes */}
        <div
          className={`${
            showOnlyMobile ? 'hidden' : 'hidden min-d:flex'
          } space-x-16 font-bold text-[var(--color-three)] text-menu`}
        >
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

        {/* MOBILE TOGGLE - Se muestra en rutas especiales SIEMPRE o en rutas normales solo en mobile */}
        <div className={`${showOnlyMobile ? 'flex' : 'flex min-d:hidden'}`}>
          <button onClick={toggleMenu} className="text-[var(--color-three)] transition">
            {isOpen ? (
              <IoClose className="text-4xl transition-transform rotate-90" />
            ) : (
              <IoMenu className="text-4xl" />
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN MENU - Se muestra en rutas especiales SIEMPRE o en rutas normales solo en mobile */}
      <Transition
        show={isOpen}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 -translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-4"
      >
        <div
          className={`${showOnlyMobile ? 'flex ' : 'flex min-d:hidden'} flex-col mt-2 rounded-[45px] px-8 py-6 text-right font-bold text-[var(--color-three)] text-menu backdrop-blur-lg z-40 relative ${
            showOnlyMobile ? 'w-[300px] ml-auto' : ''
          }`}
          style={{
            border: '2px solid var(--color-border)',
            background: 'var(--gradient-alt)'
          }}
        >
          {routesPhone.map((route) => (
            <a
              key={route.id}
              href={route.path}
              className="block py-2 hover:text-[var(--color-one)] transition-colors"
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
