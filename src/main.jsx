import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.jsx'
import Apartaments from './components/web-sections/apartments/apartaments.jsx'
import ApartamentSection from './components/web-sections/inmersive/apartament/ApartamentSection.jsx'
import BuildSection from './components/web-sections/inmersive/build/BuildSection.jsx'
import NavBar from './components/ui-components-generics/navBar/NavBar.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <NavBar></NavBar>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/inmersive-apartament" element={<Apartaments />} />
      <Route path="/inmersive-build" element={<BuildSection />} />
    </Routes>
  </BrowserRouter>
)
