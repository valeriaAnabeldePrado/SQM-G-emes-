import { MdArrowOutward } from 'react-icons/md'
import Button from './components/button'

export default function SectionThree() {
  return (
    <div className="py-[var(--pading-y)] flex gap-10">
      <div
        className="flex-1/3 
        
"
      >
        <h3 className="text-(length:--text-subtitle) text-[var(--color-three)] pb-16 leading-20">
          Una zona de continua continua{' '}
          <span className="inline-block font-bold rounded-full text-(lenght:--color-one)">
            renovación urbana
          </span>
          , próxima a Ciudad Universitaria y Plaza España, redeado de bares, restaurantes y vida
          cultural.
        </h3>
        <Button icon={<MdArrowOutward size={25} />}>Ver en mapas</Button>
      </div>
      <div className="flex-1 bg-gray-300 ">
        <h1>LOGO</h1>
      </div>
    </div>
  )
}
