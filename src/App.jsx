import './App.css'
import Header from './components/web-sections/header/Header'
import SectionBanner from './components/web-sections/home/section-banner'
import SectionFive from './components/web-sections/home/section-five'
import SectionFour from './components/web-sections/home/section-four'
import SectionSeven from './components/web-sections/home/section-seven'
import SectionSix from './components/web-sections/home/section-six'
import SectionTwo from './components/web-sections/home/section-two'
function App() {
  return (
    <>
      {/* Aca va un padding generico */}
      <Header />
      <div className="container mx-auto px-4">
        <SectionBanner />
        <SectionTwo />
        <SectionFour />
        <SectionFive />
        <SectionSix />
        <SectionSeven />
      </div>
    </>
  )
}

export default App
