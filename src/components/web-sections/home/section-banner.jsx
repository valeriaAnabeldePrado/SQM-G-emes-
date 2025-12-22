import BannerImage from '../../../assets/banner/full.jpg'
import Button from './components/button'
import { Card } from './components/card'
import { useNavigate } from 'react-router-dom'

const SectionBanner = () => {
  const navigate = useNavigate()

  const handleNavigateToApartments = () => {
    navigate('/apartments')
  }

  const handleNavigateToInmersive = () => {
    navigate('/new')
  }

  return (
    <div
      className="w-full h-screen min-h-[400px]  max-h-[1000px] items-center justify-center relative min-d:flex"
      style={{
        backgroundImage: `url(${BannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Contenido del banner */}
      <div className=" w-full flex flex-col min-d:h-auto h-full justify-center min-md:px-20 min-sm:px-14 px-8 min-md:pb-0 min-sm:pb-14 pb-8 min-lg:items-start  min-lg:justify-between ">
        <Card
          hasGradient
          className="flex flex-col items-center max-w-md min-d:items-start  rounded-3xl relative overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))',
              backdropFilter: 'blur(5px)',
              zIndex: 0
            }}
          ></div>
          <div className="relative z-10 flex-1 flex flex-col items-center text-center min-d:items-start min-d:text-left py-6 ">
            <img
              src="/vivra-logo.png"
              alt="VIVRA"
              className=" object-contain drop-shadow-lg logo-white"
            />

            <p className="text-(length:--text-menu-sub) drop-shadow-lg leading-relaxed text-white mt-4 ">
              Un proyecto que combina diseño contemporáneo, calidad constructiva y ubicación
              estratégica
            </p>
          </div>

          {/* Botones */}
          <div className="relative flex-row w-full z-10 md:flex gap-4 md:px-10 justify-center  items-center   ">
            <button
              onClick={handleNavigateToApartments}
              className="md:w-[150px] w-full p-4 rounded-full text-lg  cursor-pointer font-medium bg-[var(--color-one)] text-white hover:brightness-90 transition-all duration-300 ease-in-out flex min-2xl:gap-8 gap-2 items-center justify-center"
            >
              Ver planos
            </button>
            <button
              onClick={handleNavigateToInmersive}
              className="md:flex hidden p-4 md:w-[150px] w-[120px] rounded-full text-lg  cursor-pointer font-medium bg-[var(--color-one)] text-white hover:brightness-90 transition-all duration-300 ease-in-out  min-2xl:gap-8 gap-2 items-center justify-center"
            >
              Vista 3D
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SectionBanner
