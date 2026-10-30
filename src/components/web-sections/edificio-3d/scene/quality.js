/**
 * Niveles de calidad. La escena arranca en el que corresponde al equipo y baja
 * sola si al mover la cámara no sostiene ~30 FPS.
 *   dpr:   tope de resolución (en pantallas retina 2x cuesta 4 veces más)
 *   ao:    oclusión ambiental (null = sin AO)
 *   bloom: brillo de las luces de noche
 *   far:   edificios lejanos del contexto urbano
 *   smaa:  antialias (sin él los bordes se ven serruchados, pero ahorra una pasada)
 *   shadow: tamaño del mapa de sombras (se escala a la mitad en celulares)
 */
export const QUALITY_TIERS = [
  { id: 'minima', dpr: 0.75, ao: null, bloom: false, far: false, smaa: false, shadow: 1024 },
  { id: 'baja', dpr: 1, ao: null, bloom: false, far: false, smaa: true, shadow: 2048 },
  {
    id: 'media',
    dpr: 1.25,
    ao: { quality: 'performance', halfRes: true },
    bloom: true,
    far: true,
    smaa: true,
    shadow: 2048
  },
  {
    id: 'alta',
    dpr: 1.5,
    ao: { quality: 'medium', halfRes: false },
    bloom: true,
    far: true,
    smaa: true,
    shadow: 2048
  }
]

const BY_ID = Object.fromEntries(QUALITY_TIERS.map((tier, i) => [tier.id, i]))

// Render por software (sin aceleración): la escena va a 1-2 FPS, no tiene sentido
const SOFTWARE_GPU = /swiftshader|llvmpipe|softpipe|software|basic render/i
// GPUs de celulares de entrada y gráficos integrados anteriores a ~2016
const WEAK_GPU =
  /adreno \(tm\) ([2-5]\d\d|60\d|61[0-2])\b|mali-(4\d\d|t\d+|g(31|51|52|57))\b|powervr|intel.*\bhd graphics|\bgma\b|videocore/i

/** Nombre de la GPU según el navegador (en Safari es solo "Apple GPU"). */
function gpuName() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2')
    if (!gl) return ''
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const name = gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER) || ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return name
  } catch {
    return ''
  }
}

/**
 * Nivel inicial: `?calidad=alta|media|baja|minima` lo fuerza (para comparar o
 * depurar); si no, se decide por la GPU y el equipo:
 *   - sin aceleración por hardware: `software` (se ofrece la alternativa sin 3D)
 *   - GPU de entrada o equipo con muy poca memoria o núcleos: baja
 *   - celulares y equipos modestos: media
 *   - el resto: alta
 */
export function initialQuality() {
  const forced = new URLSearchParams(window.location.search).get('calidad')
  if (forced in BY_ID) return { tier: BY_ID[forced], forced: true, software: false }

  const gpu = gpuName()
  const touch = window.matchMedia?.('(pointer: coarse)').matches
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 8
  const weak = WEAK_GPU.test(gpu) || cores <= 2 || memory <= 2
  const modest = touch || window.innerWidth < 768 || cores <= 4 || memory <= 4
  const tier = weak ? BY_ID.baja : modest ? BY_ID.media : BY_ID.alta
  return { tier, forced: false, software: SOFTWARE_GPU.test(gpu) }
}
