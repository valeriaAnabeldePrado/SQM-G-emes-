// Función para detectar el piso según el nombre del mesh
export function detectarPiso(nombre) {
  if (!nombre) return null

  // Planta Baja
  if (nombre.includes('PB') || nombre.includes('LOCAL') || nombre.includes('OFI_PB')) {
    return 'PB'
  }

  // Pisos numerados - buscar patrón de 1 o 2 dígitos seguidos de letra EN CUALQUIER PARTE
  // Ejemplos: "1A", "07B", "10C", "14A_DUPLEX", "DEPTO_10C", "piso10C"
  const match = nombre.match(/(\d{1,2})([A-E])/i)
  if (match) {
    const floorNumber = parseInt(match[1])
    return `P${floorNumber.toString().padStart(2, '0')}`
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
