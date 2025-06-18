import './App.css'
import Header from './components/web-sections/home/header/Header'

import SectionSeven from './components/web-sections/home/section-seven'
import SectionTwo from './components/web-sections/home/section-two'
function App() {
  return (
    <>
      {/* Aca va un padding generico */}
      <Header />
      <div className="container mx-auto px-4">
        <SectionTwo />
        <SectionSeven />
      </div>
    </>
  )
}

export default App
