import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { MdKeyboardArrowDown } from "react-icons/md";

const NavBar = () => {
  const routes = [
    {id: 1, name: 'Home', path: '/'},
    {id: 2,name:
      <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="flex w-full cursor-pointer justify-center items-center gap-x-4 outline-none focus:outline-none">
         <p className='pb-2'>Inmersivo</p>
         < MdKeyboardArrowDown/>
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <a
              href="/inmersive-apartament"
              className="block px-4 py-2 text-menu-sub text-[var(--color-three)] data-focus:bg-beige data-focus:outline-hidden"
            >
              Explora el departamento 
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="/inmersive-build"
              className="block px-4 py-2 text-menu-sub text-[var(--color-three)] data-focus:bg-beige data-focus:outline-hidden"
            >
              Explora el edificio
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>,
   
    },
    {id: 3, name: 'Galería', path: '#gallery'},
    {id: 4, name: 'Contacto', path: '#contact'},
  ]
   
  return (
    <div>
  <nav
    className="backdrop-blur-lg"
    style={{
      border: '2px solid var(--color-border)',
      background: 'var(--gradient-nav)',
      borderRadius: '999px',
      padding: '2rem 4.5rem',
      margin: '1rem auto',
      maxWidth: '90%',
      height:"130px"
    }}
  >
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center">
        <div className="text-xl font-bold text-[var(--color-dark)]">LOGOTIPO</div>
      </div>
      <div className="hidden md:flex space-x-16 font-bold text-[var(--color-three)] text-menu">
        {routes.map(route => (
          <a
            key={route.id}
            href={route.path}
            className="hover:text-[var(--color-one)] transition-colors"
          >
            {route.name}
          </a>
        ))}
      </div>
    </div>
  </nav>
</div>
  )
}

export default NavBar