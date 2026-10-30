import { useEffect, useMemo } from 'react'
import { buildPaneGeometry } from './interiorGlass'
import { useMaterials } from './materialsContext'

/** Vidrios con interior simulado de una lista de cajas, todos en un solo mesh. */
export function Panes({ panes }) {
  const materials = useMaterials()
  const geometry = useMemo(() => buildPaneGeometry(panes), [panes])
  useEffect(() => () => geometry.dispose(), [geometry])
  if (!panes.length) return null
  return <mesh geometry={geometry} material={materials.glassInterior} receiveShadow />
}
