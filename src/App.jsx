import './App.css'
import NavBar from './components/ui-components-generics/navBar/NavBar'
import BannerResponsive from './components/web-sections/home/banner-responsive'
import SectionBanner from './components/web-sections/home/section-banner'
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
      <div className="custom-container mx-auto px-4  ">
        <div className="min-d:block hidden">
          <SectionBanner />
        </div>
        <BannerResponsive />
        <SectionTwo />
        <SectionThree />
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
