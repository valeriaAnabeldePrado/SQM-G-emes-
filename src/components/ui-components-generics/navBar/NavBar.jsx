import React, { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { Transition } from '@headlessui/react'
import { IoClose, IoMenu } from 'react-icons/io5'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const routes = [
    { id: 1, name: 'Home', path: '/' },
    { id: 2, name: 'Edificio', path: '/inmersive-apartament' },
    { id: 3, name: 'Departamento', path: '/inmersive-build' },
    { id: 3, name: 'Galería', path: '#gallery' },
    { id: 4, name: 'Contacto', path: '#contact' }
  ]

  return (
    <div className="fixed custom-container w-full h-[130px] flex items-center justify-center  z-50 top-7 px-20">
      <nav
        className="w-full px-4  flex items-center justify-between rounded-full backdrop-blur-lg "
        style={{
          border: '2px solid var(--color-border)',
          background: 'var(--gradient-alt)',
          padding: '2rem 4.5rem',
          height: '130px'
        }}
      >
        <div className="flex items-center justify-between  h-16 w-full">
          <div className="flex items-center">
            <div className="text-xl font-bold text-[var(--color-dark)] min-d:flex ">LOGO</div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden d:flex space-x-16 font-bold text-[var(--color-three)] text-menu">
            {routes.map((route) =>
              typeof route.name === 'string' ? (
                <a
                  key={route.id}
                  href={route.path}
                  className="hover:text-[var(--color-one)] transition-colors"
                >
                  {route.name}
                </a>
              ) : (
                <div key={route.id}>{route.name}</div>
              )
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="d:hidden">
            <button onClick={toggleMenu} className="  text-[var(--color-three)] transition">
              {isOpen ? (
                <IoClose className="text-4xl transition-transform rotate-90" />
              ) : (
                <IoMenu className="text-4xl" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN */}
        <Transition
          show={isOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="d:hidden mt-4 flex flex-col space-y-4 font-bold text-[var(--color-three)] text-menu">
            {routes.map((route) =>
              typeof route.name === 'string' ? (
                <a
                  key={route.id}
                  href={route.path}
                  className="hover:text-[var(--color-one)] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {route.name}
                </a>
              ) : (
                <div key={route.id}>
                  {/* Versión simplificada del menú "Inmersivo" para mobile */}
                  <p className="mb-2">Inmersivo</p>
                  <a
                    href="/inmersive-apartament"
                    className="block text-sm text-[var(--color-three)] hover:text-[var(--color-one)] mb-1"
                    onClick={() => setIsOpen(false)}
                  >
                    Explora el departamento
                  </a>
                  <a
                    href="/inmersive-build"
                    className="block text-sm text-[var(--color-three)] hover:text-[var(--color-one)]"
                    onClick={() => setIsOpen(false)}
                  >
                    Explora el edificio
                  </a>
                </div>
              )
            )}
          </div>
        </Transition>
      </nav>
    </div>
  )
}

export default NavBar
