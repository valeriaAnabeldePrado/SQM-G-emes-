import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { createBoxList } from '../architecture/boxes'
import { MergedBoxes } from '../architecture/MergedBoxes'
import { MaterialsContext, useMaterials } from '../architecture/materialsContext'
import { addBuildingBounds } from '../architecture/buildingBounds'
import { createContextMaterial } from '../architecture/viewCorridor'
import { Panes } from '../architecture/Panes'
import { CANAL, CANAL_HALF, axisPoints, openStretches } from './canal'
import { Canada } from './Canada'
import contextData from './contextData.json'
import { buildNeighbors } from './neighbors'
import { Pocito } from './Pocito.jsx'
import { replacesPocitoVolume } from './pocito.js'
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

/** Linderos del lote reconstruidos desde Street View, con sus ventanas encendibles. */
function Neighbors() {
  const materials = useMaterials()
  const list = useMemo(buildNeighborList, [])
  const contextMaterials = useMemo(() => {
    const keys = new Set([...list.items.map((item) => item.material), 'glassInterior'])
    return Object.fromEntries([...keys].map((key) => [key, createContextMaterial(materials[key])]))
  }, [materials, list])
  useEffect(() => () => Object.values(contextMaterials).forEach((m) => m.dispose()), [contextMaterials])
  return (
    <MaterialsContext.Provider value={contextMaterials}>
      <group name="linderos">
        <MergedBoxes list={list} />
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

// Tonos de fachada y techo para que el barrio no sea una maqueta uniforme:
// revoques claros variados; techos de membrana, losa, tejas y chapa (galpones).
const FACADE_TONES = ['#ffffff', '#f1e6d4', '#e4e4e4', '#dccfc2', '#f4eee4', '#cfc8be']
const ROOF_TONES = ['#a9a49c', '#bdb8b0', '#8e8a85', '#a5806a', '#c8c5bf']
const SHED_ROOF = '#9aa3a8'

/**
 * Edificios del contexto extruidos (huellas de Overture con altura medida de
 * Google Open Buildings 2.5D, ver bake-heights.py): laterales con fachada
 * genérica (ventanas que se encienden de noche) y techos con tono propio.
 * Todo en dos meshes; los que tapan la vista se ocultan (viewCorridor.js).
 */

function ContextBuildings({ showFar }) {
  const materials = useMaterials()
  const tiles = useMemo(() => {
    // Por sector y nivel de detalle: cerca (con textura y sombras) / lejos
    const groups = new Map()
    contextData.buildings.forEach((building, i) => {
      if (replacesPocitoVolume(building)) return
      const { p, h, far } = building
      const shape = new THREE.Shape(p.map(([x, z]) => new THREE.Vector2(x, -z)))
      const extruded = new THREE.ExtrudeGeometry(shape, { depth: h - GROUND, bevelEnabled: false })
      extruded.rotateX(-Math.PI / 2)
      extruded.translate(0, GROUND, 0)
      const [caps, walls] = splitGroups(extruded)
      const { area, cx, cz } = footprint(p)
      const shed = area > 700 && h <= 9
      extruded.computeBoundingBox()
      const bounds = { min: extruded.boundingBox.min.toArray(), max: extruded.boundingBox.max.toArray() }
      paint(walls, FACADE_TONES[i % FACADE_TONES.length])
      paint(caps, shed ? SHED_ROOF : ROOF_TONES[(i * 7) % ROOF_TONES.length])
      for (const part of [caps, walls]) addBuildingBounds(part, [bounds], part.getAttribute('position').count)
      extruded.dispose()
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
        <mesh geometry={sides} material={materials.contextFacade} castShadow receiveShadow />
        <mesh geometry={roofs} material={materials.contextRoof} castShadow receiveShadow />
      </group>
    )
  )
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

export function UrbanContext({ night = 0, showFar = true }) {
  const streets = useMemo(buildStreets, [])
  return (
    <group name="contexto-urbano">
      <Ground />
      <MergedBoxes list={streets} />
      <Canada />
      <Neighbors />
      {/* En calidad baja el barrio lejano no se dibuja */}
      <ContextBuildings showFar={showFar} />
      <Pocito />
      <StreetProps />
      <StreetLights night={night} />
    </group>
  )
}
