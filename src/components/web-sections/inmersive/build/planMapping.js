// Mapeo de meshes del edificio a sus respectivos planos PNG
export function getFloorPlanImage(meshName) {
  // Planta Baja (P00)
  if (meshName.includes('PB_C')) return '/plantas-individuales/PLANTA P00° DPTO C.png'
  if (meshName.includes('PB_D')) return '/plantas-individuales/PLANTA P00° DPTO D.png'
  if (meshName.includes('LOCAL_PB')) return '/plantas-individuales/PLANTA P00° LOCAL.png'
  if (meshName.includes('OFI_PB')) return '/plantas-individuales/PLANTA P00° OFICINAS.png'

  // Extraer número de piso y letra del departamento
  const match = meshName.match(/^(\d+)([A-Z])/)
  if (!match) return null

  const pisoNum = parseInt(match[1])
  const dpto = match[2]

  // Pisos 1 a 13 - DPTO A y B (mismo plano)
  if (pisoNum >= 1 && pisoNum <= 13 && (dpto === 'A' || dpto === 'B')) {
    return `/plantas-individuales/PLANTA P01° A P13° DPTO ${dpto}.png`
  }

  // Pisos 1 a 2 - OFICINAS
  if (pisoNum >= 1 && pisoNum <= 2 && dpto === 'O') {
    return '/plantas-individuales/PLANTA P01° A P2° OFICINAS.png'
  }

  // Piso 3 - OFICINAS
  if (pisoNum === 3 && dpto === 'O') {
    return '/plantas-individuales/PLANTA P03° OFICINAS.png'
  }

  // Pisos 1 a 5 - DPTO C y D
  if (pisoNum >= 1 && pisoNum <= 5 && (dpto === 'C' || dpto === 'D')) {
    return `/plantas-individuales/PLANTA P01° A P5° DPTO ${dpto}.png`
  }

  // Piso 6 - DPTO C y D
  if (pisoNum === 6 && (dpto === 'C' || dpto === 'D')) {
    return `/plantas-individuales/PLANTA P06° DPTO ${dpto}.png`
  }

  // Pisos 7 a 10 - DPTO C
  if (pisoNum >= 7 && pisoNum <= 10 && dpto === 'C') {
    return '/plantas-individuales/PLANTA P07° A P10° DPTO C.png'
  }

  // Pisos 11 a 13 - DPTO C y D
  if (pisoNum >= 11 && pisoNum <= 13 && (dpto === 'C' || dpto === 'D')) {
    return `/plantas-individuales/PLANTA P11° A P13° DPTO ${dpto}.png`
  }

  // Piso 14 - DPTO A, B, C, D, E
  if (pisoNum === 14 && ['A', 'B', 'C', 'D', 'E'].includes(dpto)) {
    // Buscar si hay nombres especiales tipo 14A_PB, 14B_PB, 14C_PB
    if (meshName.includes('14A_PB') || meshName === '14A') {
      return '/plantas-individuales/PLANTA P14° DPTO A.png'
    }
    if (meshName.includes('14B_PB') || meshName === '14B') {
      return '/plantas-individuales/PLANTA P14° DPTO B.png'
    }
    if (meshName.includes('14C_PB') || meshName === '14C') {
      return '/plantas-individuales/PLANTA P14° DPTO C.png'
    }
    return `/plantas-individuales/PLANTA P14° DPTO ${dpto}.png`
  }

  // Piso 15 - DPTO A, B, C, D, E
  if (pisoNum === 15 && ['A', 'B', 'C', 'D', 'E'].includes(dpto)) {
    // Buscar si hay nombres especiales tipo 15A_PA, 15B_PA, etc
    if (meshName.includes('15A_PA') || meshName === '15A') {
      return '/plantas-individuales/PLANTA P15° DPTO A.png'
    }
    if (meshName.includes('15B_PA') || meshName === '15B') {
      return '/plantas-individuales/PLANTA P15° DPTO B.png'
    }
    if (meshName.includes('15C_PA') || meshName === '15C') {
      return '/plantas-individuales/PLANTA P15° DPTO C.png'
    }
    if (meshName.includes('15D_PA') || meshName === '15D') {
      return '/plantas-individuales/PLANTA P15° DPTO D.png'
    }
    if (meshName.includes('15E_PA') || meshName === '15E') {
      return '/plantas-individuales/PLANTA P15° DPTO E.png'
    }
    return `/plantas-individuales/PLANTA P15° DPTO ${dpto}.png`
  }

  return null
}
