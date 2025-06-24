import './App.css'
import Header from './components/web-sections/header/Header'
import SectionBanner from './components/web-sections/home/section-banner'
import SectionFive from './components/web-sections/home/section-five'
import SectionFour from './components/web-sections/home/section-four'
import SectionSeven from './components/web-sections/home/section-seven'
import SectionSix from './components/web-sections/home/section-six'
import SectionThree from './components/web-sections/home/section-three'
import SectionTwo from './components/web-sections/home/section-two'
function App() {
  return (
    <>
      {/* Aca va un padding generico */}
      <div className="container mx-auto px-4">
        <Header />

        <SectionBanner />
        <SectionTwo />
        <SectionThree />
        <SectionFour />
        <SectionFive />
        <SectionSix />
        <SectionSeven />
      </div>
    </>
  )
}

export default App
