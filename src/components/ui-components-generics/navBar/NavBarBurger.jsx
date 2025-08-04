import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri'

const NavBarBurger = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const menuItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Características', href: '/#characte' },
    { name: 'Galería', href: '/#gallery' },
    { name: 'Contacto', href: '/#contact' },
    { name: 'Apartamentos', href: '/apartments' },
    { name: 'Vista 3D Edificio', href: '/inmersive-build' },
    { name: 'Vista 3D Apartamento', href: '/inmersive-apartament' }
  ]

  return (
    <div className="fixed z-50 top-8 px-6  right-2 min-sm:right-[5%] flex flex-col items-end">
      <nav
        className="px-6 py-[1.2rem] min-note:py-[2rem] min-d:px-12 flex items-center justify-end rounded-full backdrop-blur-lg "
        style={{
          border: '2px solid var(--color-border)',
          background: 'var(--gradient-alt)'
        }}
      >
        {/* Burger button */}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md text-[var(--color-three)] hover:text-[var(--color-one)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-one)]"
        >
          {isMenuOpen ? <RiCloseLine className="h-6 w-6" /> : <RiMenu3Line className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          className="mt-4 w-[300px] backdrop-blur-lg rounded-[45px] shadow-lg px-8 py-6"
          style={{
            border: '2px solid var(--color-border)',
            background: 'var(--gradient-alt)'
          }}
        >
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="block py-2 text-base font-medium text-[var(--color-three)] hover:text-[var(--color-one)] transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NavBarBurger
