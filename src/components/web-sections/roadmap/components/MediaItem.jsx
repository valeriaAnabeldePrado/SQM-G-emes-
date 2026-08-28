import { MdPlayArrow } from 'react-icons/md'
import { isVideo, posterFor } from '../utils/media'

/**
 * Única pieza que sabe distinguir foto de video.
 *
 * variant="preview"  el video se muestra como su poster con un botón de play encima.
 *                    Nada de <video> en la grilla: 10 elementos multimedia por etapa
 *                    descargarían metadata que casi nadie va a mirar.
 * variant="full"     el <video> real, con controles.
 */
const MediaItem = ({ item, variant = 'preview', className = '', fallback, badge = 'lg' }) => {
  const video = isVideo(item.src)

  if (video && variant === 'full') {
    return (
      <video
        key={item.src}
        src={item.src}
        poster={posterFor(item.src)}
        controls
        playsInline
        preload="metadata"
        className={className}
      />
    )
  }

  const src = video ? posterFor(item.src) : item.src

  const image = (
    <img
      src={src}
      alt={item.alt || 'Avance de obra'}
      loading="lazy"
      decoding="async"
      onError={fallback ? (e) => (e.currentTarget.src = fallback) : undefined}
      className={className}
    />
  )

  // Sin badge no hace falta envolver: el wrapper estiraba la foto a todo el ancho
  // del contenedor y la dejaba pegada al borde izquierdo en el modal.
  if (!video) return image

  return (
    <div className="relative w-full h-full">
      {image}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span
          className={`flex items-center justify-center rounded-full bg-black/45 backdrop-blur-sm ring-1 ring-white/70 transition-transform duration-300 group-hover:scale-110 ${
            badge === 'sm' ? 'w-7 h-7' : 'w-16 h-16'
          }`}
        >
          <MdPlayArrow size={badge === 'sm' ? 16 : 34} className="text-white translate-x-px" />
        </span>
      </span>
    </div>
  )
}

export default MediaItem
