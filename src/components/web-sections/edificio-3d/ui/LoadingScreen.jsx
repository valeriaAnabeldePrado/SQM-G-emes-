import { useEffect, useRef, useState } from 'react'

// El JS de la escena es ~1/5 de lo que se descarga (texturas y cielo son el resto)
export const CODE_SHARE = 20

// Lo mostrado no retrocede entre la pantalla de la ruta y la de la escena
let shown = 0

/**
 * Pantalla de carga con porcentaje. Sin `progress` es la fase del código (el
 * chunk de la escena no informa avance): la barra se acerca de a poco a
 * CODE_SHARE. Con `progress` (0-100) muestra ese valor; `done` la desvanece.
 */
export function LoadingScreen({ progress, done = false }) {
  const [value, setValue] = useState(shown)
  const [gone, setGone] = useState(false)
  const target = useRef(progress)
  target.current = progress

  useEffect(() => {
    if (done) return
    let frame
    const tick = () => {
      const goal = target.current ?? CODE_SHARE * 0.95
      // Se acerca al objetivo suave; en la fase de código, cada vez más lento
      const step = target.current == null ? 0.015 : 0.12
      shown = Math.max(shown, shown + (goal - shown) * step)
      setValue(shown)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [done])

  useEffect(() => {
    if (!done) return
    shown = 100
    setValue(100)
    const timer = setTimeout(() => {
      setGone(true)
      shown = 0 // la próxima visita a la página arranca de cero
    }, 600)
    return () => clearTimeout(timer)
  }, [done])

  if (gone) return null
  const percent = Math.min(100, Math.round(value))
  return (
    <div
      role="progressbar"
      aria-label="Cargando el modelo 3D"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#d6dee4] transition-opacity duration-500 ${
        done ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <span className="font-coco text-2xl text-darck">VIVRA Güemes</span>
      <span className="mt-1 text-xs text-darck/60">Cargando el modelo 3D</span>
      <div className="mt-5 h-1.5 w-56 overflow-hidden rounded-full bg-darck/10">
        <div
          className="h-full rounded-full bg-darck"
          style={{ width: `${percent}%`, transition: 'width 120ms linear' }}
        />
      </div>
      <span className="mt-2 text-xs tabular-nums text-darck/70">{percent}%</span>
    </div>
  )
}
