import React from 'react'
const NavBar = () => {
  const routes = [
    {id: 1, name: 'Home', path: '/'},
    {id: 2, name: 'Inmersivo', path: '/Inmersivo'},
    {id: 3, name: 'Galería', path: '/galeria'},
    {id: 4, name: 'Contacto', path: '/Contacto'},
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
      <div className="hidden md:flex space-x-6 font-bold text-[var(--color-three)] text-menu">
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