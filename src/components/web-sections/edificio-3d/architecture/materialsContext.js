import { createContext, useContext } from 'react'

export const MaterialsContext = createContext(null)

/** Materiales compartidos de la escena (ver MaterialsProvider). */
export function useMaterials() {
  return useContext(MaterialsContext)
}
