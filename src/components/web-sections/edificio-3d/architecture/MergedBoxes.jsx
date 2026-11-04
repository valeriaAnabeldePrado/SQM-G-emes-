import { useEffect, useMemo } from 'react'
import { buildBoxGeometries } from './boxes'
import { useMaterials } from './materialsContext'

/** Dibuja una lista de cajas (createBoxList) con un mesh por material. */
export function MergedBoxes({
  list,
  castShadow = true,
  receiveShadow = true,
  customDepthMaterial
}) {
  const materials = useMaterials()
  const geometries = useMemo(() => buildBoxGeometries(list), [list])
  useEffect(() => () => geometries.forEach((geometry) => geometry.dispose()), [geometries])

  return [...geometries].map(([key, geometry]) => {
    const material = materials[key]
    const shadows = !material.userData.noShadow
    return (
      <mesh
        key={key}
        geometry={geometry}
        material={material}
        customDepthMaterial={customDepthMaterial}
        castShadow={castShadow && shadows}
        receiveShadow={receiveShadow && shadows}
      />
    )
  })
}
