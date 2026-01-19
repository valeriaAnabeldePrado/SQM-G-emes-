// Función para detectar el piso según el nombre del mesh
export function detectarPiso(nombre) {
  if (!nombre) return null

  // Debug para oficinas
  if (nombre.includes('OFI')) {
    console.log('🔍 detectarPiso checking:', nombre)
  }

  // PRIMERO: Pisos numerados - buscar patrón de 1 o 2 dígitos seguidos de letra
  // Ejemplos: "1A", "07B", "10C", "14A_DUPLEX", "DEPTO_10C", "piso10C", "14D_PB"
  // ESTO DEBE IR ANTES de buscar "PB" para evitar falsos positivos como "14D_PB"
  const letterMatch = nombre.match(/(\d{1,2})([A-E])/i)
  if (letterMatch) {
    const floorNumber = parseInt(letterMatch[1])
    return `P${floorNumber.toString().padStart(2, '0')}`
  }

  // Planta Baja (después de buscar números+letras)
  // Buscar "PB" pero no si ya tiene números delante (evitar 14D_PB)
  if (
    nombre.includes('LOCAL') ||
    nombre.includes('OFI_PB') ||
    nombre.includes('OFI PB') ||
    nombre.includes('oficina_pb') ||
    (nombre.includes('PB') && !nombre.match(/\d{1,2}[A-E]/i))
  ) {
    if (nombre.includes('OFI')) console.log('✅ Matched as PB')
    return 'PB'
  }

  // Oficinas Pisos 1, 2, 3 - detectar varios patrones
  // Patrones: OFI_P1, OFI P1, OFI_p1, oficina_p1, etc.
  if (nombre.includes('OFI_P') || nombre.includes('OFI P')) {
    const match = nombre.match(/OFI[_ ]P(\d{1,2})/i)
    if (match) {
      const floorNumber = parseInt(match[1])
      const result = `P${floorNumber.toString().padStart(2, '0')}`
      console.log('✅ Matched OFI pattern, returning:', result)
      return result
    }
  }

  const officeMatch = nombre.match(/oficina[_ ]p(\d{1,2})/i)
  if (officeMatch) {
    const floorNumber = parseInt(officeMatch[1])
    return `P${floorNumber.toString().padStart(2, '0')}`
  }

  // Oficinas con patrón XO (1O, 2O, 3O, etc.)
  const officeOMatch = nombre.match(/^(\d{1,2})O$/i)
  if (officeOMatch) {
    const floorNumber = parseInt(officeOMatch[1])
    return `P${floorNumber.toString().padStart(2, '0')}`
  }

  // Pisos solo numero (ej: "Piso 1", "Level 01")
  const floorMatch = nombre.match(/(?:piso|level|floor)[_ ]?0?(\d{1,2})/i)
  if (floorMatch) {
    const floorNumber = parseInt(floorMatch[1])
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
