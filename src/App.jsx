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

function App() {
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
