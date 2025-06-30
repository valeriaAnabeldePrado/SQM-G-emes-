import React, { useState } from 'react'
import { Transition } from '@headlessui/react'
import { IoClose, IoMenu } from 'react-icons/io5'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const routes = [
    { id: 1, name: 'Edificio', path: '/inmersive-apartament' },
    { id: 2, name: 'Departamento', path: '/inmersive-build' },
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
    <div className="fixed custom-container w-full z-50 min-d:top-4 top-8 px-6">
      <nav
        className="w-full px-6 py-[1.6rem] min-d:py-[3rem] flex items-center justify-between rounded-full backdrop-blur-lg"
        style={{
          border: '2px solid var(--color-border)',
          background: 'var(--gradient-alt)'
        }}
      >
        <div className="text-xl font-bold text-[var(--color-dark)]">LOGO</div>

        {/* DESKTOP MENU */}
        <div className="hidden d:flex space-x-16 font-bold text-[var(--color-three)] text-menu">
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

        {/* MOBILE TOGGLE */}
        <div className="d:hidden">
          <button onClick={toggleMenu} className="text-[var(--color-three)] transition">
            {isOpen ? (
              <IoClose className="text-4xl transition-transform rotate-90" />
            ) : (
              <IoMenu className="text-4xl" />
            )}
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN MENU */}
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
          className="d:hidden mt-2 rounded-[45px] px-8 py-6 text-right font-bold text-[var(--color-three)] text-menu backdrop-blur-lg z-40 relative"
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
