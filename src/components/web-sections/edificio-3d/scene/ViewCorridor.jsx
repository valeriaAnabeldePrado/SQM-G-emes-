import { useFrame, useThree } from '@react-three/fiber'
import { corridor } from '../architecture/viewCorridor'

/** Mantiene el corredor de visión alineado con la cámara y su punto de mira. */
export function ViewCorridor() {
  const controls = useThree((s) => s.controls)
  useFrame(({ camera }) => {
    const target = controls?.target
    if (!target) return
    corridor.uCamPos.value.copy(camera.position)
    const forward = corridor.uViewForward.value.subVectors(target, camera.position)
    corridor.uFocusDistance.value = forward.length()
    forward.normalize()
    const right = corridor.uViewRight.value.crossVectors(forward, camera.up).normalize()
    corridor.uViewUp.value.crossVectors(right, forward).normalize()
  })
  return null
}
