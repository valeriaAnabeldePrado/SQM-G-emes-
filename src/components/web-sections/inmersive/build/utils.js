// Función para detectar el piso según el nombre del mesh
export function detectarPiso(nombre) {
  if (!nombre) return null

  // Planta Baja
  if (nombre.includes('PB') || nombre.includes('LOCAL') || nombre.includes('OFI_PB')) {
    return 'PB'
  }

  // Pisos numerados (P1, P2, P10, P14, etc)
  const match = nombre.match(/^(\d+)[A-Z_]/)
  if (match) {
    const floorNumber = parseInt(match[1])
    if (floorNumber >= 14 && floorNumber <= 15) {
      return 'P14' // Agrupamos P14 y P15 bajo la clave P14
    }
    return `P${floorNumber}`
  }

  // Terraza Amenities
  if (nombre.includes('PISCINA') || nombre.includes('QUINCHO')) {
    return 'TERRAZA_PISCINA'
  }

  // Ignorar pasillos y planos auxiliares
  if (nombre.includes('PASILLO') || nombre.includes('Plane')) {
    return null
  }

  return null
}

// Configuración de materiales para realismo
export function configureMaterial(material) {
  if (material) {
    material.roughness = 0.6
    material.metalness = 0.1
    material.envMapIntensity = 0.5
  }
}
