import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Button from './components/button'
import { RiBuilding2Line } from 'react-icons/ri'
import { FiBox } from 'react-icons/fi'
import BannerImage from '../../../assets/banner/mobile.png'

const BannerResponsive = () => {
  const titleRef = useRef(null)
  const paragraphRef = useRef(null)
  const buttonsRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } })

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 40, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)' }
    )
      .fromTo(
        paragraphRef.current,
        { opacity: 0, y: 40, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)' },
        '+=0.2'
      )
      .fromTo(
        buttonsRef.current,
        { opacity: 0, y: 40, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)' },
        '+=0.2'
      )
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-between h-screen overflow-hidden min-d:hidden">
      <img
        src={BannerImage}
        alt="Edificio SQM"
        className="absolute bottom-0 left-0 h-[90%]  object-cover z-0"
      />

      <div className="absolute z-10 bottom-2 right-0 px-6 pb-4 text-[var(--color-three)] w-[400px]">
        <div ref={titleRef}>
          <h1 className="min-[450px]:text-[5.5rem] text-7xl font-bold leading-none text-end">
            SQM
          </h1>
          <h1 className="min-[450px]:text-[5.5rem] text-7xl font-bold leading-none text-end">
            GÜEMES
          </h1>
        </div>
        <p ref={paragraphRef} className="text-gray-700 my-4 text-body text-end">
          Un proyecto que combina diseño contemporáneo, calidad constructiva y ubicación estratégica
        </p>
        <div ref={buttonsRef} className="space-y-4 min-[450px]:ml-0 ml-11">
          <Button className="min-[450px]:w-90 w-80 justify-between" icon={<FiBox size={23} />}>
            Ver departamento
          </Button>
          <Button
            className="min-[450px]:w-90 w-80 justify-between"
            icon={<RiBuilding2Line size={23} />}
          >
            Vista del edificio
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BannerResponsive
