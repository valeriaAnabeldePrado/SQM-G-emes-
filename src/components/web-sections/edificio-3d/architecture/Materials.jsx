import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { BUILDING_HEIGHT, HALF, TOWER } from '../buildings/vivra-guemes/config'
import { createInteriorGlassMaterial } from './interiorGlass'
import { corridor, withViewCorridor } from './viewCorridor'
import { withWeathering } from './weathering'
import { MaterialsContext } from './materialsContext'
import {
  brickTexture,
  facadeTextures,
  leavesTexture,
  lightPoolTexture,
  shutterTexture,
  sidewalkTexture,
  tileTexture
} from './textures'

// Texturas reales (Poly Haven, CC0) en /public/edificio-3d, con su tamaño físico
// en metros para combinarlas con las UV métricas de las cajas.
const SCANNED = {
  hormigon: { size: 2.71, files: ['hormigon_color.jpg', 'hormigon_normal.jpg'] },
  muro: { size: 2.4, files: ['muro_color.jpg', 'muro_normal.jpg'] },
  asfalto: { size: 2.08, files: ['asfalto_color.jpg', 'asfalto_normal.jpg'] },
  piedra: { size: 2, files: ['piedra_color.jpg', 'piedra_normal.jpg'] }
}
const TEXTURE_URLS = Object.values(SCANNED).flatMap((t) => t.files.map((f) => `/edificio-3d/${f}`))

function prepare(texture, meters, isColor) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1 / meters, 1 / meters)
  texture.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

// Lambert no recibe la luz ambiente del HDRI: se suma la propia textura como
// emisiva tenue para que las copas en sombra no queden negras
function leavesMaterial() {
  const map = leavesTexture()
  return new THREE.MeshLambertMaterial({
    map,
    emissiveMap: map,
    emissive: '#ffffff',
    emissiveIntensity: 0.45,
    alphaTest: 0.45,
    side: THREE.DoubleSide
  })
}

// Materiales PBR compartidos por toda la escena. Las claves son las mismas que
// usan las listas de cajas (createBoxList().add('concrete', ...)).
function createMaterials(loaded) {
  const scanned = {}
  Object.entries(SCANNED).forEach(([name, { size }], i) => {
    scanned[name] = {
      map: prepare(loaded[i * 2], size, true),
      normalMap: prepare(loaded[i * 2 + 1], size, false)
    }
  })
  const deckMap = tileTexture('#6e6a65')
  const patioMap = tileTexture('#b9b2a6')
  const sidewalkMap = sidewalkTexture()
  const facade = facadeTextures()

  const std = (params, extra = {}) =>
    Object.assign(new THREE.MeshStandardMaterial(params), { userData: extra })
  // Contexto urbano con corredor de visión (ver viewCorridor.js). Cerca: PBR
  // como el resto (recibe la luz del cielo). Lejos: Lambert, más barato por
  // píxel, con un relleno de luz ambiente en el emisivo.
  const corridorStd = (params) => withViewCorridor(std(params))
  const corridorLambert = (params) => withViewCorridor(new THREE.MeshLambertMaterial(params))

  return {
    // Hormigón visto liso de las bandas y cantos (foto de detalle)
    concrete: withWeathering(
      std({
        ...scanned.hormigon,
        color: '#ffffff',
        roughness: 0.82,
        normalScale: new THREE.Vector2(0.8, 0.8)
      })
    ),
    // Muro entre ventanas: hormigón granulado gris, más oscuro que las bandas
    block: withWeathering(
      std({
        ...scanned.muro,
        color: '#ffffff',
        roughness: 0.92,
        normalScale: new THREE.Vector2(0.7, 0.7)
      }),
      0.7
    ),
    plaster: withWeathering(std({ ...scanned.hormigon, color: '#ece7de', roughness: 0.9 }), 0.6),
    groove: std({ color: '#6b6761', roughness: 0.9 }),
    lintel: std({ color: '#ecebe7', roughness: 0.5, metalness: 0.2 }),
    pipe: std({ color: '#a9abad', roughness: 0.4, metalness: 0.7 }),
    // Carpinterías: aluminio natural (foto), blanco y negro (P16 y oficinas)
    frameMetal: std({ color: '#c3c6c8', roughness: 0.32, metalness: 0.85 }),
    frameLight: std({ color: '#e9e7e2', roughness: 0.45, metalness: 0.3 }),
    frameDark: std({ color: '#1e2022', roughness: 0.5, metalness: 0.45 }),
    glass: std({ color: '#0d1216', roughness: 0.05, metalness: 0.2, envMapIntensity: 1.3 }),
    glassInterior: createInteriorGlassMaterial(),
    glassShop: std(
      {
        color: '#9fb2bd',
        roughness: 0.05,
        metalness: 0.6,
        transparent: true,
        opacity: 0.38,
        depthWrite: false
      },
      { noShadow: true }
    ),
    glassRailing: std(
      {
        color: '#d7e6ec',
        roughness: 0.05,
        metalness: 0.2,
        transparent: true,
        opacity: 0.22,
        depthWrite: false
      },
      { noShadow: true }
    ),
    railing: std({ color: '#1f2123', roughness: 0.45, metalness: 0.6 }),
    railingLight: std({ color: '#ecebe7', roughness: 0.45, metalness: 0.3 }),
    perforated: std({ color: '#8e9194', roughness: 0.5, metalness: 0.7 }),
    // Chapa perforada de los paneles pivotantes: se ve el vidrio detrás
    panel: std(
      { color: '#5b5e61', roughness: 0.6, metalness: 0.45, transparent: true, opacity: 0.82 },
      { noShadow: true }
    ),
    // Interior visto a través del vidrio de PB de oficinas
    interior: std({
      color: '#e6dccb',
      emissive: '#a08b6c',
      emissiveIntensity: 0.55,
      roughness: 0.9
    }),
    deck: std({ map: deckMap, roughness: 0.8 }),
    patio: std({ map: patioMap, roughness: 0.85 }),
    water: std({
      color: '#2f7f9e',
      roughness: 0.04,
      metalness: 0.15,
      emissive: '#0f4a5e',
      emissiveIntensity: 0.4
    }),
    grass: std({ color: '#6f8a4d', roughness: 1 }),
    // Ropa tendida en los balcones
    fabricWhite: std({ color: '#ecebe6', roughness: 0.95 }, { noShadow: true }),
    fabricBlue: std({ color: '#5a7894', roughness: 0.95 }, { noShadow: true }),
    fabricTerracotta: std({ color: '#b86b4b', roughness: 0.95 }, { noShadow: true }),
    fabricSand: std({ color: '#d8c7a6', roughness: 0.95 }, { noShadow: true }),
    hedge: std({ color: '#55703f', roughness: 1 }),
    // Entorno
    sidewalk: std({ map: sidewalkMap, color: '#bab6ae', roughness: 0.92 }),
    asphalt: std({ ...scanned.asfalto, roughness: 0.95 }),
    curb: std({ color: '#bdb8b0', roughness: 0.9 }),
    marking: std({ color: '#e8e6df', roughness: 0.8 }),
    // Contexto OSM: el color de cada edificio va por vértice; de noche se
    // encienden ventanas desde el mapa emisivo
    contextFacade: corridorStd({
      map: facade.color,
      emissiveMap: facade.emissive,
      emissive: '#ffffff',
      emissiveIntensity: 0,
      vertexColors: true,
      roughness: 0.95
    }),
    contextRoof: corridorStd({ vertexColors: true, roughness: 1 }),
    // A lo lejos: solo color por edificio, sin textura ni sombras
    contextFar: corridorLambert({
      vertexColors: true,
      emissive: '#8f8a84',
      emissiveIntensity: 0.45
    }),
    // Vecinos inmediatos (Street View): revoque beige con ventanas y aires
    // acondicionados, y edificio de balcones con pilares de ladrillo
    beige: withWeathering(std({ ...scanned.hormigon, color: '#d6cdbd', roughness: 0.9 }), 0.9),
    cream: withWeathering(std({ ...scanned.hormigon, color: '#f1e9da', roughness: 0.9 }), 0.9),
    greyConcrete: withWeathering(
      std({ ...scanned.hormigon, color: '#bdbab4', roughness: 0.9 }),
      0.9
    ),
    rawConcrete: withWeathering(std({ ...scanned.muro, color: '#d8d4cc', roughness: 0.95 }), 0.9),
    shutter: std({ map: shutterTexture(), roughness: 0.55, metalness: 0.4 }),
    shutterWhite: std({ map: shutterTexture(), color: '#ffffff', roughness: 0.6 }),
    safetyMesh: Object.assign(
      new THREE.MeshStandardMaterial({
        color: '#d9622e',
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        roughness: 0.9
      }),
      { userData: { noShadow: true } }
    ),
    whitePlaster: withWeathering(
      std({ ...scanned.hormigon, color: '#f4f2ee', roughness: 0.9 }),
      0.9
    ),
    brick: std({ map: brickTexture(), roughness: 0.9 }),
    redSteel: std({ color: '#b5462f', roughness: 0.55, metalness: 0.4 }),
    acUnit: std({ color: '#e8e8e6', roughness: 0.6 }),
    roofMembrane: std({ color: '#9b9790', roughness: 0.95 }),
    // La Cañada: muros de piedra, fondo de hormigón y un hilo de agua
    stone: std({ ...scanned.piedra, roughness: 0.95, normalScale: new THREE.Vector2(1.2, 1.2) }),
    canalFloor: std({ ...scanned.muro, color: '#8f8a83', roughness: 0.9 }),
    canalWater: std({ color: '#3d4d4f', roughness: 0.08, metalness: 0.3 }),
    // Faroles: el cabezal se enciende de noche (con bloom) y la luz en el piso
    // es una mancha aditiva, no una luz real
    lampPole: std({ color: '#3a3d40', roughness: 0.5, metalness: 0.6 }),
    lampHead: std({ color: '#d9d6cf', emissive: '#ffd49a', emissiveIntensity: 0 }),
    lightPool: Object.assign(
      new THREE.MeshBasicMaterial({
        map: lightPoolTexture(),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      }),
      { userData: { noShadow: true } }
    ),
    trunk: new THREE.MeshLambertMaterial({ color: '#4f4034', emissive: '#2a221b' }),
    // Follaje con Lambert: mucho más barato por píxel que PBR, y las hojas se
    // superponen en muchas capas (es lo que más cuesta en las vistas peatonales)
    leaves: leavesMaterial(),
    carPaintLight: std({ color: '#e7e7e5', roughness: 0.3, metalness: 0.5 }),
    carPaintDark: std({ color: '#1c1d20', roughness: 0.3, metalness: 0.5 }),
    carPaintGrey: std({ color: '#8d9196', roughness: 0.3, metalness: 0.5 }),
    carGlass: std({ color: '#20262b', roughness: 0.1, metalness: 0.8 }),
    tire: std({ color: '#151515', roughness: 0.9 })
  }
}

/** Ajusta lo que se "enciende" con la noche (0 = día, 1 = noche). */
function applyNight(materials, night) {
  corridor.uContextWash.value = 0.14 * (1 - night * 0.94)
  corridor.uContextSaturation.value = 0.55 + night * 0.25
  materials.glassInterior.userData.uniforms.uNight.value = night
  // Las ventanas del barrio acompañan las luces de VIVRA sin competir con ellas.
  materials.contextFacade.emissiveIntensity = night * 0.3
  // De noche la ciudad lejana se apaga (el relleno ambiente es luz de cielo)
  materials.contextFar.emissiveIntensity = 0.45 * (1 - night * 0.85)
  materials.lampHead.emissiveIntensity = night * 9
  materials.lightPool.opacity = night * 0.85
  // Pileta con luz subacuática: brilla, pero sin volverse un rectángulo celeste plano
  materials.water.emissiveIntensity = 0.4 + night * 0.5
}

const NO_CUT = 1e5
const CUT_TOP = BUILDING_HEIGHT + 6 // desde acá arranca a bajar el corte

/**
 * Corte por piso: todo lo que queda por encima de `cut.y` dentro del volumen
 * del edificio abierto (torre u oficinas) se descarta en el shader. Son cinco planos combinados por
 * intersección (arriba del corte, y dentro de la caja de la torre), así los
 * linderos y el resto de la escena no se tocan. Cambiar de piso solo mueve un
 * plano: no recompila nada.
 */
function createCutPlanes() {
  const x = HALF + 0.01 // incluye la cara exterior de las medianeras propias
  return [
    new THREE.Plane(new THREE.Vector3(0, -1, 0), NO_CUT),
    new THREE.Plane(new THREE.Vector3(1, 0, 0), -x),
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), -x),
    new THREE.Plane(new THREE.Vector3(0, 0, 1), -(TOWER.rearLow + 1.5)),
    new THREE.Plane(new THREE.Vector3(0, 0, -1), -1.4)
  ]
}

export function MaterialsProvider({ night = 0, cut = null, children }) {
  const loaded = useTexture(TEXTURE_URLS)
  const gl = useThree((s) => s.gl)
  const cutPlanes = useMemo(createCutPlanes, [])
  const materials = useMemo(() => {
    const created = createMaterials(loaded)
    for (const material of Object.values(created)) {
      material.clippingPlanes = cutPlanes
      material.clipIntersection = true
    }
    return created
  }, [loaded, cutPlanes])
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    applyNight(materials, night)
    invalidate()
  }, [materials, night, invalidate])
  // El corte baja (o sube) barriendo el edificio en lugar de saltar de golpe;
  // las sombras se recalculan una sola vez, al terminar
  const cutY = cut?.y ?? null
  const zMin = cut?.zMin
  const zMax = cut?.zMax
  useEffect(() => {
    const plane = cutPlanes[0]
    if (zMin != null) {
      cutPlanes[3].constant = -zMax
      cutPlanes[4].constant = zMin
    }
    // El corte queda siempre activo (sin piso abierto, el plano está fuera de
    // alcance): prenderlo y apagarlo cambia el programa de cada material y
    // obligaba a recompilar todo el edificio al abrir el primer piso
    gl.localClippingEnabled = true
    if (cutY == null && plane.constant >= NO_CUT) return
    const sweep = { y: plane.constant >= NO_CUT ? CUT_TOP : plane.constant }
    const tween = gsap.to(sweep, {
      y: cutY ?? CUT_TOP,
      duration: 1.3,
      ease: 'power2.inOut',
      onUpdate: () => {
        plane.constant = sweep.y
        invalidate()
      },
      onComplete: () => {
        plane.constant = cutY ?? NO_CUT
        gl.shadowMap.needsUpdate = true
        invalidate()
      }
    })
    return () => tween.kill()
  }, [gl, cutPlanes, cutY, zMin, zMax, invalidate])
  useEffect(
    () => () => {
      for (const material of Object.values(materials)) {
        material.map?.dispose()
        material.normalMap?.dispose()
        material.emissiveMap?.dispose()
        material.dispose()
      }
    },
    [materials]
  )
  return <MaterialsContext.Provider value={materials}>{children}</MaterialsContext.Provider>
}
