import React from 'react'
import './App.css'
import BannerResponsive from './components/web-sections/home/banner-responsive'
import SectionBanner from './components/web-sections/home/section-banner'
import SectionCallTo from './components/web-sections/home/section-calltoaction'
import SectionFive from './components/web-sections/home/section-five'
import SectionFooter from './components/web-sections/home/section-footer'
import SectionFour from './components/web-sections/home/section-four'

import SectionSeven from './components/web-sections/home/section-seven'
import SectionSix from './components/web-sections/home/section-six'
import SectionThree from './components/web-sections/home/section-three'
import SectionTwo from './components/web-sections/home/section-two'

// Console branding - Easter egg para desarrolladores
const showConsoleBranding = () => {
  const styles = {
    title:
      'color: #06b6d4; font-size: 28px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);',
    subtitle: 'color: #8b5cf6; font-size: 18px; font-weight: bold;',
    text: 'color: #374151; font-size: 14px;',
    accent: 'color: #10b981; font-size: 14px; font-weight: bold;',
    warning: 'color: #ef4444; font-size: 12px; font-weight: bold;',
    highlight: 'color: #f59e0b; font-size: 16px; font-weight: bold;'
  }

  console.clear()
  console.log('%c☁️ SMARTCLOUD STUDIO', styles.title)
  console.log(
    '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    styles.accent
  )
  console.log('%c Desarrollamos soluciones digitales completas', styles.subtitle)
  console.log('%c', '')
  console.log('%c Nuestros servicios:', styles.highlight)
  console.log('%c Desarrollo Web & Software', styles.text)
  console.log('%c Identidad de Marca & Diseño', styles.text)
  console.log('%c Aplicaciones Mobile', styles.text)
  console.log('%c Arquitectura Cloud', styles.text)
  console.log('%c', '')
  console.log('%c¿Te gusta lo que ves? ¡Trabajemos juntos!', styles.text)
  console.log('%c Visita: https://www.smartcloudstudio.com/', styles.accent)
  console.log('%c Hablemos: contacto@smartcloudstudio.com', styles.accent)
  console.log('%c', '')
  console.log('%c  Esta web fue desarrollada con React + Three.js + Tailwind CSS', styles.text)
  console.log('%c', '')
  console.log('%c⚠️  Advertencia: Esta consola es para desarrolladores.', styles.warning)
  console.log(
    '%c   Si alguien te pidió que copies/pegues algo aquí, es probablemente una estafa.',
    styles.warning
  )
  console.log('%c', '')
  console.log(
    '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    styles.accent
  )

  // ASCII Art del logo SmartCloud
  console.log(
    `%c
                      ██████╗ ██████╗
                     ██╔════╝██╔
                     ╚█████╗ ██╔
                      ╚═══██╗██║
                     ██████╔╝╚██████╗
                      ╚═════╝ ╚═════╝
                      ☁️ STUDIO ☁️                                        
  `,
    'color: #06b6d4; font-family: monospace; font-size: 10px;'
  )
}

function App() {
  // Ejecutar el branding en la consola cuando se monta el componente
  React.useEffect(() => {
    showConsoleBranding()
  }, [])

  return (
    <>
      <SectionBanner />
      <div className="custom-container mx-auto px-4  ">
        <SectionThree />
        <SectionTwo />
        <SectionCallTo />
        <SectionFour />
        <SectionFive />
        <SectionSix />
        <SectionSeven />
      </div>
      <SectionFooter />
    </>
  )
}

export default App
