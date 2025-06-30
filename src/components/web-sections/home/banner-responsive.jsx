import { gsap } from 'gsap'
import BannerImage from '../../../assets/banner/mobile.png'
import { Card } from './components/card'
import { useGSAP } from '@gsap/react'

const BannerResponsive = () => {
  gsap.registerPlugin(useGSAP)

  useGSAP(() => {
    gsap.fromTo(
      '.containerAnimationOne',
      {
        opacity: 0,
        bottom: 200
      },
      {
        opacity: 1,
        bottom: 10,
        duration: 1.2,
        ease: 'power3.out'
      }
    )
  }, {})

  return (
    <div className="relative flex flex-col items-center justify-between h-screen overflow-hidden min-d:hidden">
      <img
        src={BannerImage}
        alt="Edificio SQM"
        className="absolute bottom-0 left-0 h-[95%] object-cover z-0"
      />

      <Card className="containerAnimationOne animationPhone min-[450px]:bg-transparent bg-[var(--color-two)] flex flex-col justify-end items-end absolute z-10 right-3 px-6 pb-4 text-[var(--color-three)] w-[350px] min-[450px]:w-[400px] backdrop-blur-2xl">
        <h1 className="min-[450px]:text-[5.5rem] text-7xl font-bold leading-none text-end self-end">
          SQM
        </h1>
        <h1 className="min-[450px]:text-[5.5rem] text-7xl font-bold leading-none text-end">
          GÜEMES
        </h1>

        <p className="text-[var(--color-three)] my-4 text-body font-medium text-end">
          Un proyecto que combina diseño contemporáneo, calidad constructiva y ubicación estratégica
        </p>
      </Card>
    </div>
  )
}

export default BannerResponsive
