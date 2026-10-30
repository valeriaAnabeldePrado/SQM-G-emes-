/**
 * Niveles de calidad. La escena arranca en el que corresponde al equipo y baja
 * sola si al mover la cámara no sostiene ~30 FPS.
 *   dpr: tope de resolución (en pantallas retina 2x cuesta 4 veces más)
 *   ao:  oclusión ambiental (null = sin AO)
 */
export const QUALITY_TIERS = [
  { id: 'baja', dpr: 1, ao: null },
  { id: 'media', dpr: 1.25, ao: { quality: 'performance', halfRes: true } },
  { id: 'alta', dpr: 1.5, ao: { quality: 'medium', halfRes: false } }
]

const BY_ID = Object.fromEntries(QUALITY_TIERS.map((tier, i) => [tier.id, i]))

/**
 * Nivel inicial: `?calidad=alta|media|baja` lo fuerza (para comparar o depurar);
 * si no, celulares y equipos con pocos núcleos o poca memoria arrancan en media.
 */
export function initialQuality() {
  const forced = new URLSearchParams(window.location.search).get('calidad')
  if (forced in BY_ID) return { tier: BY_ID[forced], forced: true }

  const touch = window.matchMedia?.('(pointer: coarse)').matches
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 8
  const modest = touch || window.innerWidth < 768 || cores <= 4 || memory <= 4
  return { tier: modest ? BY_ID.media : BY_ID.alta, forced: false }
}
