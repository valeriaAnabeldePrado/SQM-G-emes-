import { Link } from 'react-router-dom'
import banner from '../../../../assets/banner/bannerOk.png'

const MESSAGES = {
  unsupported: {
    title: 'Tu navegador no puede mostrar el modelo 3D',
    text: 'Necesita WebGL 2. Probá con Chrome, Edge, Firefox o Safari actualizados, o activá la aceleración por hardware.'
  },
  lost: {
    title: 'El modelo 3D se detuvo',
    text: 'El dispositivo liberó la memoria gráfica (pasa en algunos celulares). Recargá la página para verlo de nuevo.'
  }
}

/** Alternativa sin 3D: el render de fachada y un mensaje claro. */
export function Fallback({ reason }) {
  const { title, text } = MESSAGES[reason]
  return (
    <div className="relative flex h-screen h-[100svh] w-full items-end overflow-hidden bg-darck">
      <img
        src={banner}
        alt="Fachada de VIVRA Güemes"
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="relative m-4 max-w-md rounded-2xl bg-white/90 p-5 shadow-sm backdrop-blur-md md:m-8">
        <span className="block font-coco text-lg text-darck">{title}</span>
        <span className="mt-1 block text-sm text-darck/70">{text}</span>
        <div className="mt-4 flex gap-2">
          {reason === 'lost' ? (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-darck px-4 py-2 text-xs text-white"
            >
              Recargar
            </button>
          ) : null}
          <Link to="/" className="rounded-full bg-darck/10 px-4 py-2 text-xs text-darck">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
