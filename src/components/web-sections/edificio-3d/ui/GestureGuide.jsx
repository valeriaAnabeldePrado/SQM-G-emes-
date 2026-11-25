import { MdOutlineSwipe, MdOutlineTouchApp } from 'react-icons/md'

// En pantallas táctiles se habla de tocar y deslizar; con mouse, de clic y arrastrar
const touch = () => window.matchMedia?.('(pointer: coarse)').matches ?? false

/**
 * Guía de gestos al terminar el recorrido de entrada: qué se puede hacer con
 * la escena (girar y elegir un piso). No intercepta nada: el primer toque la
 * cierra (ver Edificio3D) y la escena recibe ese toque igual.
 */
export function GestureGuide() {
  const coarse = touch()
  const items = [
    {
      icon: <MdOutlineSwipe aria-hidden="true" className="edificio-hand-swipe h-9 w-9" />,
      title: coarse ? 'Deslizá' : 'Arrastrá',
      text: 'para girar alrededor del edificio'
    },
    {
      icon: <MdOutlineTouchApp aria-hidden="true" className="edificio-hand-tap h-9 w-9" />,
      title: coarse ? 'Tocá un piso' : 'Hacé clic en un piso',
      text: 'para ver sus unidades'
    }
  ]
  return (
    <div
      role="status"
      className="edificio-fade-in pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-6 rounded-3xl bg-darck/75 px-6 py-5 text-white shadow-lg backdrop-blur-md md:gap-10 md:px-9"
    >
      {items.map(({ icon, title, text }) => (
        <div key={title} className="flex w-32 flex-col items-center gap-2 text-center md:w-40">
          {icon}
          <span className="text-sm font-medium leading-tight">{title}</span>
          <span className="text-xs leading-snug text-white/75">{text}</span>
        </div>
      ))}
    </div>
  )
}
