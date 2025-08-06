import BannerImage from '../../../assets/banner/full.jpg'
import Button from './components/button'
import { Card } from './components/card'

const SectionBanner = () => {
  return (
    <div
      className="w-full h-screen min-h-[400px] max-h-[1000px] items-center justify-center relative min-d:flex"
      style={{
        backgroundImage: `url(${BannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Contenido del banner */}
      <div className="w-full flex flex-col items-center justify-center text-center px-20 min-d:items-start  min-d:justify-between min-d:text-right">
        <Card className="flex flex-col items-center max-w-md min-d:items-start p-10 rounded-3xl relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))',
              backdropFilter: 'blur(5px)',
              zIndex: 0
            }}
          ></div>
          <div className="relative z-10 flex-1 flex flex-col items-center text-center min-d:items-start min-d:text-left p-10">
            <h1 className="text-(length:--text-title-huge) font-bold mb-2 drop-shadow-lg text-white leading-10">
              VIVRA
            </h1>
            <h2 className="text-(length:--text-subtitleS) font-medium drop-shadow-lg text-white">
              GÜEMES
            </h2>
            <p className="text-(length:--text-menu-sub) drop-shadow-lg leading-relaxed text-white mt-4 hidden min-d:block">
              Un proyecto que combina diseño contemporáneo, calidad constructiva y ubicación
              estratégica
            </p>
          </div>

          {/* Botones */}
          <div className="relative z-10 flex gap-4 mt-6 p-10 ">
            <Button onClick={() => console.log('Ver planos')}>Ver planos</Button>
            <Button onClick={() => console.log('Vista 3D')}>Vista 3D</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SectionBanner
