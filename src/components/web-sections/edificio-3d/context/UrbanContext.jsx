import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { createBoxList } from '../architecture/boxes'
import { MergedBoxes } from '../architecture/MergedBoxes'
import { MaterialsContext, useMaterials } from '../architecture/materialsContext'
import { addBuildingBounds } from '../architecture/buildingBounds'
import {
  CONTEXT_FULL_HEIGHT,
  corridor,
  createContextDepthMaterial,
  createContextMaterial
} from '../architecture/viewCorridor'
import { Panes } from '../architecture/Panes'
import { CANAL, CANAL_HALF, axisPoints, openStretches } from './canal'
import { Canada } from './Canada'
import contextData from './contextData.json'
import { buildNeighbors } from './neighbors'
import { Pocito } from './Pocito.jsx'
import { replacesPocitoVolume } from './pocito.js'
import { Plaza } from './Plaza.jsx'
import { insidePlaza } from './plaza.js'
import { StreetLights } from './StreetLights'
import { SIDEWALK_HEIGHT, STREETS, STREET_LENGTH, crossings, segmentsBetween } from './streets'
import { StreetProps } from './StreetProps'

const GROUND = -SIDEWALK_HEIGHT

function buildStreets() {
  const b = createBoxList()
  const L = STREET_LENGTH / 2

  for (const street of Object.values(STREETS)) {
    // Veredas elevadas, cortadas en las esquinas con calles transversales
    for (const [z0, z1] of [
      [street.lineNorth, street.curbNorth],
      [street.curbSouth, street.lineSouth]
    ]) {
      for (const [x0, x1] of segmentsBetween(-L, L, crossings(z0, z1))) {
        b.add('sidewalk', x0, x1, GROUND, 0, z0, z1)
      }
    }
    b.add('asphalt', -L, L, GROUND, GROUND + 0.02, street.curbNorth, street.curbSouth)
  }

  // Línea central discontinua de Pueyrredón
  const { curbNorth, curbSouth } = STREETS.pueyrredon
  const center = (curbNorth + curbSouth) / 2
  for (let x = -L; x < L; x += 7)
    b.add('marking', x, x + 3, GROUND, GROUND + 0.025, center - 0.06, center + 0.06)

  // Resto de las calles del barrio (OSM), como tramos rectos con solape en las uniones
  contextData.roads.forEach((road, r) => {
    const top = GROUND + 0.012 + (r % 6) * 0.001
    for (let i = 0; i < road.p.length - 1; i++) {
      const [ax, az] = road.p[i]
      const [bx, bz] = road.p[i + 1]
      const length = Math.hypot(bx - ax, bz - az) + road.w * 0.5
      const cx = (ax + bx) / 2
      const cz = (az + bz) / 2
      const rot = Math.atan2(-(bz - az), bx - ax)
      b.add(
        'asphalt',
        cx - length / 2,
        cx + length / 2,
        GROUND,
        top,
        cz - road.w / 2,
        cz + road.w / 2,
        rot
      )
    }
  })
  return b
}

function buildNeighborList() {
  const b = createBoxList()
  buildNeighbors(b)
  return b
}

/**
 * Linderos del lote reconstruidos desde Street View, con sus ventanas
 * encendibles. En el modo entorno bajo se hunden con toda su arquitectura
 * (materiales y sombras con `sink`, ver viewCorridor.js).
 */
function Neighbors() {
  const materials = useMaterials()
  const list = useMemo(buildNeighborList, [])
  const depth = useMemo(() => createContextDepthMaterial('sink'), [])
  useEffect(() => () => depth.dispose(), [depth])
  const contextMaterials = useMemo(() => {
    const keys = new Set([...list.items.map((item) => item.material), 'glassInterior'])
    return Object.fromEntries([...keys].map((key) => [key, createContextMaterial(materials[key])]))
  }, [materials, list])
  useEffect(() => () => Object.values(contextMaterials).forEach((m) => m.dispose()), [contextMaterials])
  return (
    <MaterialsContext.Provider value={contextMaterials}>
      <group name="linderos">
        <MergedBoxes list={list} customDepthMaterial={depth} />
        <Panes panes={list.panes} />
      </group>
    </MaterialsContext.Provider>
  )
}

/** Separa una geometría no indexada según sus grupos (tapas / laterales). */
function splitGroups(geometry) {
  return geometry.groups.map(({ start, count }) => {
    const part = new THREE.BufferGeometry()
    for (const name of ['position', 'normal', 'uv']) {
      const attr = geometry.getAttribute(name)
      const size = attr.itemSize
      part.setAttribute(
        name,
        new THREE.BufferAttribute(attr.array.slice(start * size, (start + count) * size), size)
      )
    }
    return part
  })
}

function paint(geometry, hex) {
  const color = new THREE.Color(hex)
  const count = geometry.getAttribute('position').count
  const array = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) array.set([color.r, color.g, color.b], i * 3)
  geometry.setAttribute('color', new THREE.BufferAttribute(array, 3))
}

function footprint(p) {
  let area = 0
  let cx = 0
  let cz = 0
  for (let i = 0; i < p.length; i++) {
    const [x0, z0] = p[i]
    const [x1, z1] = p[(i + 1) % p.length]
    const cross = x0 * z1 - x1 * z0
    area += cross
    cx += (x0 + x1) * cross
    cz += (z0 + z1) * cross
  }
  area /= 2
  return { area: Math.abs(area), cx: cx / (6 * area), cz: cz / (6 * area) }
}

// Altura de los edificios de alrededor en el modo entorno bajo (y de la
// manzana de enfrente siempre): PB y un piso, como una maqueta de contexto
const LOW_HEIGHT = 6
// Por encima de todo el entorno (grúas de Pocito, 124 m): desde acá baja el corte
const CONTEXT_MAX_HEIGHT = 130

// Manzana de enfrente, entre Alvear, Pueyrredón, Belgrano y Fructuoso Rivera:
// queda baja. Sus edificios (uno de 43 m pegado a la avenida) se interponían
// entre la cámara y la fachada en las vistas General y Aérea, a medias
// recortados por el corredor de visión, y confundían más de lo que ubicaban.
const FRONT_BLOCK = { x0: -32, x1: 73.5, z0: -83, z1: -16 }

function centroidIn({ p }, { x0, x1, z0, z1 }) {
  const x = p.reduce((sum, v) => sum + v[0], 0) / p.length
  const z = p.reduce((sum, v) => sum + v[1], 0) / p.length
  return x > x0 && x < x1 && z > z0 && z < z1
}

/** Altura con la que se dibuja: la manzana de enfrente queda baja. */
function displayHeight(building) {
  return centroidIn(building, FRONT_BLOCK) ? Math.min(building.h, LOW_HEIGHT) : building.h
}

// Tonos de fachada y techo para que el barrio no sea una maqueta uniforme:
// revoques claros variados; techos de membrana, losa, tejas y chapa (galpones).
const FACADE_TONES = ['#ffffff', '#f1e6d4', '#e4e4e4', '#dccfc2', '#f4eee4', '#cfc8be']
const ROOF_TONES = ['#a9a49c', '#bdb8b0', '#8e8a85', '#a5806a', '#c8c5bf']
const SHED_ROOF = '#9aa3a8'

/** Prisma de un edificio del contexto: [techo, laterales] pintados, con sus bounds. */
function extrudeFootprint(p, h, i, shed = false) {
  const shape = new THREE.Shape(p.map(([x, z]) => new THREE.Vector2(x, -z)))
  const extruded = new THREE.ExtrudeGeometry(shape, { depth: h - GROUND, bevelEnabled: false })
  extruded.rotateX(-Math.PI / 2)
  extruded.translate(0, GROUND, 0)
  const [caps, walls] = splitGroups(extruded)
  extruded.computeBoundingBox()
  const bounds = { min: extruded.boundingBox.min.toArray(), max: extruded.boundingBox.max.toArray() }
  paint(walls, FACADE_TONES[i % FACADE_TONES.length])
  paint(caps, shed ? SHED_ROOF : ROOF_TONES[(i * 7) % ROOF_TONES.length])
  for (const part of [caps, walls]) addBuildingBounds(part, [bounds], part.getAttribute('position').count)
  extruded.dispose()
  return [caps, walls]
}

/**
 * Edificios del contexto extruidos (huellas de Overture con altura medida de
 * Google Open Buildings 2.5D, ver bake-heights.py): laterales con fachada
 * genérica (ventanas que se encienden de noche) y techos con tono propio.
 * Todo en dos meshes; los que tapan la vista se ocultan (viewCorridor.js).
 */

function ContextBuildings({ showFar }) {
  const materials = useMaterials()
  // Sombras con el mismo recorte de altura que el modo entorno bajo
  const depth = useMemo(createContextDepthMaterial, [])
  useEffect(() => () => depth.dispose(), [depth])
  const tiles = useMemo(() => {
    // Por sector y nivel de detalle: cerca (con textura y sombras) / lejos
    const groups = new Map()
    contextData.buildings.forEach((building, i) => {
      if (replacesPocitoVolume(building) || insidePlaza(building)) return
      const { p, far } = building
      const h = displayHeight(building)
      const { area, cx, cz } = footprint(p)
      const [caps, walls] = extrudeFootprint(p, h, i, area > 700 && h <= 9)
      // Cerca: una sola pieza. Lejos: 4 cuadrantes alrededor del lote, para que
      // la placa descarte los que quedan fuera de cuadro
      const quadrant = Math.floor((Math.atan2(cz - 20, cx) + Math.PI) / (Math.PI / 2)) % 4
      const key = far ? `far-${quadrant}` : 'near'
      if (!groups.has(key)) groups.set(key, { far: Boolean(far), roofs: [], sides: [] })
      groups.get(key).roofs.push(caps)
      groups.get(key).sides.push(walls)
    })
    return [...groups].map(([key, g]) => {
      // Lejos comparten material: techos y fachadas en un solo mesh
      const merged = g.far
        ? { key, far: true, all: mergeGeometries([...g.roofs, ...g.sides]) }
        : { key, far: false, roofs: mergeGeometries(g.roofs), sides: mergeGeometries(g.sides) }
      ;[...g.roofs, ...g.sides].forEach((part) => part.dispose())
      return merged
    })
  }, [])
  useEffect(
    () => () => tiles.forEach((t) => [t.all, t.roofs, t.sides].forEach((g) => g?.dispose())),
    [tiles]
  )

  return tiles.map(({ key, far, all, roofs, sides }) =>
    far ? (
      showFar && <mesh key={key} geometry={all} material={materials.contextFar} />
    ) : (
      <group key={key}>
        <mesh
          geometry={sides}
          material={materials.contextFacade}
          customDepthMaterial={depth}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={roofs}
          material={materials.contextRoof}
          customDepthMaterial={depth}
          castShadow
          receiveShadow
        />
      </group>
    )
  )
}

/**
 * Baja (o sube) el entorno con una animación: el corte va de arriba de todo a
 * LOW_HEIGHT; los edificios de OSM y Pocito se recortan y los linderos se
 * hunden. Las sombras están horneadas (BakeShadows): se recalculan
 * mientras dura.
 */
// El corte se anima en una escala cúbica: los edificios cercanos (hasta ~45 m)
// se mueven durante la mayor parte de la animación y no solo al final
const RANGE = CONTEXT_MAX_HEIGHT - LOW_HEIGHT
const heightAt = (p) => LOW_HEIGHT + RANGE * p ** 3
const progressAt = (h) => Math.cbrt(Math.max(0, Math.min(h, CONTEXT_MAX_HEIGHT) - LOW_HEIGHT) / RANGE)

function useContextHeight(low) {
  const gl = useThree((s) => s.gl)
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    const uniform = corridor.uContextHeight
    if (!low && uniform.value >= CONTEXT_FULL_HEIGHT) return
    const state = { p: progressAt(uniform.value) }
    const refresh = () => {
      gl.shadowMap.needsUpdate = true
      invalidate()
    }
    const tween = gsap.to(state, {
      p: low ? 0 : 1,
      duration: 1.6,
      ease: 'power1.inOut',
      onUpdate: () => {
        uniform.value = heightAt(state.p)
        refresh()
      },
      onComplete: () => {
        uniform.value = low ? LOW_HEIGHT : CONTEXT_FULL_HEIGHT
        refresh()
      }
    })
    refresh()
    return () => tween.kill()
  }, [low, gl, invalidate])
}

/** Suelo del barrio (veredas), con el recorte de La Cañada entre puentes. */
function Ground() {
  const materials = useMaterials()
  const geometry = useMemo(() => {
    const E = 800
    const shape = new THREE.Shape([
      new THREE.Vector2(-E, -E),
      new THREE.Vector2(E, -E),
      new THREE.Vector2(E, E),
      new THREE.Vector2(-E, E)
    ])
    if (CANAL) {
      for (const [z0, z1] of openStretches()) {
        const pts = axisPoints(z0, z1)
        const left = pts.map(([x, z]) => new THREE.Vector2(x - CANAL_HALF, -z))
        const right = pts.map(([x, z]) => new THREE.Vector2(x + CANAL_HALF, -z)).reverse()
        shape.holes.push(new THREE.Path([...left, ...right]))
      }
    }
    // Las UV de ShapeGeometry son las coordenadas de la forma: metros reales
    const ground = new THREE.ShapeGeometry(shape)
    ground.rotateX(-Math.PI / 2)
    ground.translate(0, GROUND, 0)
    return ground
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])

  return <mesh geometry={geometry} material={materials.sidewalk} receiveShadow />
}

/**
 * Barrio alrededor del edificio. Con `low` (entorno bajo) todos los edificios
 * de alrededor bajan a LOW_HEIGHT para ver mejor VIVRA: los de OSM se
 * recortan, los linderos se hunden con su arquitectura y Pocito se recorta como
 * el resto. Calles, árboles, la plaza y los faroles no cambian.
 */
export function UrbanContext({ night = 0, showFar = true, low = false }) {
  const streets = useMemo(buildStreets, [])
  useContextHeight(low)
  return (
    <group name="contexto-urbano">
      <Ground />
      <MergedBoxes list={streets} />
      <Canada />
      <Neighbors />
      {/* En calidad baja el barrio lejano no se dibuja */}
      <ContextBuildings showFar={showFar} />
      <Pocito />
      <Plaza />
      <StreetProps />
      <StreetLights night={night} />
    </group>
  )
}
