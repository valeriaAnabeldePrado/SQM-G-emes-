// Mapeo de meshes del edificio a sus respectivos planos PNG
export function getFloorPlanImage(meshName) {
  if (!meshName) return null
  const name = meshName.toLowerCase()

  // Amenities P16 (Solarium, Quinchos)
  if (
    name.includes('solarium') ||
    name.includes('quincho') ||
    name.includes('quicho')
  ) {
    return '/plantass/P16 amenities.png'
  }

  // Planta Baja (P00)
  if (name.includes('pb_c')) return '/plantass/PB C.png'
  if (name.includes('pb_d')) return '/plantass/PB D.png'
  if (name.includes('local')) return '/plantass/Local.png'
  if (name.includes('ofi_pb') || name.includes('ofi pb') || name.includes('oficina_pb')) {
    return '/plantass/PB OFICINA.png'
  }

  // Oficinas Pisos 1 a 3
  if (
    name.includes('oficina_p1') ||
    name.includes('ofi_p1') ||
    name.includes('ofi p1') ||
    name === '1o'
  ) {
    return '/plantass/P01 a P02 Oficinas.png'
  }
  if (
    name.includes('oficina_p2') ||
    name.includes('ofi_p2') ||
    name.includes('ofi p2') ||
    name === '2o'
  ) {
    return '/plantass/P01 a P02 Oficinas.png'
  }
  if (name.includes('oficina_p3') || name === '3o') return '/plantass/P03 OFICINAS.png'

  // Extraer número de piso y letra del departamento
  const match = meshName.match(/^(\d+)([A-Z])/)
  if (!match) return null

  const pisoNum = parseInt(match[1])
  const dpto = match[2]

  // Pisos 1 a 13 - DPTO A y B (mismo plano)
  if (pisoNum >= 1 && pisoNum <= 13 && (dpto === 'A' || dpto === 'B')) {
    return `/plantass/P01 A P13 ${dpto}.png`
  }

  // Pisos 1 a 5 - DPTO C y D
  if (pisoNum >= 1 && pisoNum <= 5 && dpto === 'C') {
    return '/plantass/P01 a P05 C.png'
  }
  if (pisoNum >= 1 && pisoNum <= 5 && dpto === 'D') {
    return '/plantass/P01 A P05 D.png'
  }

  // Piso 6 - DPTO C y D
  if (pisoNum === 6 && dpto === 'C') {
    return '/plantass/P6 C.png'
  }
  if (pisoNum === 6 && dpto === 'D') {
    return '/plantass/P6 D.png'
  }

  // Pisos 7 a 10 - DPTO C
  if (pisoNum >= 7 && pisoNum <= 10 && dpto === 'C') {
    return '/plantass/P7 a P10 C.png'
  }

  // Pisos 11 a 13 - DPTO C y D
  if (pisoNum >= 11 && pisoNum <= 13 && dpto === 'C') {
    return '/plantass/P11 A P13 C.png'
  }
  if (pisoNum >= 11 && pisoNum <= 13 && dpto === 'D') {
    return '/plantass/P11 A P13 D.png'
  }

  // Piso 14 - DPTO A, B, C, D, E
  if (pisoNum === 14) {
    if (dpto === 'A') return '/plantass/P14 A .png'
    if (dpto === 'B') return '/plantass/P14 B.png'
    if (dpto === 'C') return '/plantass/P14 C.png'
    if (dpto === 'D') return '/plantass/P14 D.png'
    if (dpto === 'E') return '/plantass/P14 E.png'
  }

  // Piso 15 - DPTO A, B, C, D, E
  if (pisoNum === 15) {
    if (dpto === 'A') return '/plantass/P15 A.png'
    if (dpto === 'B') return '/plantass/P15 B.png'
    if (dpto === 'C') return '/plantass/P15 C.png'
    if (dpto === 'D') return '/plantass/P15 D.png'
    if (dpto === 'E') return '/plantass/P15 E.png'
  }

  return null
}
