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
    {
      id: 2,
      name: (
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="flex items-center gap-x-2 cursor-pointer outline-none focus:outline-none hover:text-[var(--color-one)] transition-colors">
            <span className="pb-1 ">Inmersivo</span>
            <MdKeyboardArrowDown />
          </MenuButton>
          <MenuItems className="absolute z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="py-1">
              <MenuItem>
                <a
                  href="/inmersive-apartament"
                  className="block px-4 py-2 font-normal text-menu-sub text-[var(--color-three)] hover:bg-[var(--color-beige-int)]"
                >
                  Explora el departamento
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="/inmersive-build"
                  className="block px-4 py-2 font-normal text-menu-sub text-[var(--color-three)] hover:bg-[var(--color-beige-int)]"
                >
                  Explora el edificio
                </a>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      )
    },
    { id: 3, name: 'Galería', path: '#gallery' },
    { id: 4, name: 'Contacto', path: '#contact' }
  ]

  return (
    <div>
      <nav
        className="backdrop-blur-lg fixed top-7 min-tablet:w-[85vw] min-tablet:left-[7.5vw]  max-tablet:max-w-[10%] max-tablet:right-7"
        style={{
          border: '2px solid var(--color-border)',
          background: 'var(--gradient-nav)',
          borderRadius: '999px',
          padding: '2rem 4.5rem',
          height: '130px'
        }}
      >
        <div className="flex items-center  min-tablet:justify-between max-tablet:justify-center h-16">
          <div className="flex items-center">
            <div className="text-xl font-bold text-[var(--color-dark)] min-tablet:flex max-tablet:hidden">
              LOGO
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden tablet:flex space-x-16 font-bold text-[var(--color-three)] text-menu">
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
          <div className="tablet:hidden">
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
          <div className="tablet:hidden mt-4 flex flex-col space-y-4 font-bold text-[var(--color-three)] text-menu">
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
