import React from 'react'
import NavBar from '../ui-components-generics/navBar/NavBar.jsx'

const Layout = ({ children }) => (
  <>
    <NavBar />
    {children}
  </>
)

export default Layout
