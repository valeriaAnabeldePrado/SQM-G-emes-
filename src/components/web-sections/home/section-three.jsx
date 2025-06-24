import { FaArrowRight } from 'react-icons/fa'
import Button from './components/button'

export default function SectionThree() {
  return (
    <div className="py-[var(--pading-y)] flex">
      <div
        className="flex-1/2 
        
"
      >
        <h3 className="text-(length:--text-subtitle) pb-6">
          Una zona de continua continua{' '}
          <span className="inline-block font-bold rounded-full text-(lenght:--color-one)">
            renovación urbana
          </span>
          , próxima a Ciudad Universitaria y Plaza España, redeado de bares, restaurantes y vida
          cultural
        </h3>
        <Button icon={<FaArrowRight />}>Ver en mapas</Button>
      </div>
      <div className="flex-1 bg-gray-300 ">
        <h1>LOGO</h1>
      </div>
    </div>
  )
}
