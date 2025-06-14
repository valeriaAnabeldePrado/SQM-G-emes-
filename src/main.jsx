import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import ApartamentSection from './components/web-sections/inmersive/apartament/ApartamentSection.jsx';
import BuildSection from './components/web-sections/inmersive/build/BuildSection.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <Routes>
      <Route path="/" element={<App />} />
      <Route path="/inmersive-apartament" element={<ApartamentSection/>}/>
      <Route path="/inmersive-build" element={<BuildSection/>}/>
    </Routes>
  </BrowserRouter>
)
