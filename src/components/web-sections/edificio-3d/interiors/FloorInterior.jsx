import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Html, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { buildBoxGeometries, createBoxList } from '../architecture/boxes'
import { buildFloorEdges } from '../buildings/vivra-guemes/tower'
import { createBuildWave } from './buildWave'
import { floorCatalog } from './catalog'
import { buildFurniture } from './furniture'
import { createInteriorMaterials } from './interiorMaterials'
import { cachedPlan } from './planCache'
import { unitStatus } from './status'

const WALL_HEIGHT = 1.6 // muros cortados a esta altura, como una planta en corte
const SILL = 0.9 // antepecho de las ventanas
const WIDE_WINDOW = 2.0 // m: más ancho es un ventanal/puerta balcón (vidrio desde el piso)
const OVERLAY_LIFT = 0.04
// El piso se arma mientras la cámara llega (ver CameraRig, 1,6 s) y el corte
// baja (ver MaterialsProvider, 1,3 s)
const REVEAL_DELAY = 0.45
const REVEAL_DURATION = 1.5

function centroid(points) {
  const sx = points.reduce((s, p) => s + p[0], 0)
  const sz = points.reduce((s, p) => s + p[1], 0)
  return [sx / points.length, sz / points.length]
}

/**
 * Rectángulo de piso sobre la planta, de (px0, py0) a (px1, py1) en píxeles.
 * `uv` en metros para conservar el tamaño del cerámico en todos los pisos.
 */
function floorQuad(plan, [px0, py0, px1, py1]) {
  const corners = [
    [px0, py0],
    [px1, py0],
    [px1, py1],
    [px0, py1]
  ]
  const world = corners.map(([px, py]) => plan.toWorld(px, py))
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(world.flatMap(([x, z]) => [x, 0, z])), 3)
  )
  geometry.setAttribute(
    'uv',
    new THREE.BufferAttribute(new Float32Array(world.flatMap(([x, z]) => [z, x])), 2)
  )
  geometry.setIndex([0, 2, 1, 0, 3, 2])
  geometry.computeVertexNormals()
  return geometry
}

/** Solado con la forma de las unidades: cubre balcones y terrazas. */
function unitFloors(units, plan) {
  const parts = units.flatMap((unit) =>
    unit.polygons.map((points) => {
      const shape = new THREE.Shape(
        points.map(([px, py]) => {
          const [x, z] = plan.toWorld(px, py)
          return new THREE.Vector2(x, -z)
        })
      )
      const geometry = new THREE.ShapeGeometry(shape).rotateX(-Math.PI / 2)
      // UV en metros como el resto del solado
      const pos = geometry.attributes.position
      const uv = geometry.attributes.uv
      for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getZ(i), pos.getX(i))
      return geometry
    })
  )
  if (!parts.length) return null
  const merged = mergeGeometries(parts)
  parts.forEach((g) => g.dispose())
  return merged
}

/** Detalle corto para la etiqueta: tipo y m² de la planilla o de la ficha. */
function unitSummary(unit, row) {
  if (unit.amenity) return null
  const type = row?.tipo || unit.info?.type
  const m2 = row?.m2 ? `${row.m2.toLocaleString('es-AR')} m²` : unit.info?.superficieTotal
  return [type, m2].filter(Boolean).join(' · ')
}

/** Aparición de cada unidad, demorada según su distancia al centro de la onda. */
function unitReveal(reveal, [cx, cz], center, radius) {
  const delay = Math.min(1, Math.hypot(cx - center[0], cz - center[1]) / radius) * 0.5
  return Math.min(1, Math.max(0, (reveal - delay) / 0.5))
}

function UnitOverlay({ unit, plan, y, status, row, selected, reveal, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const shapes = useMemo(
    () =>
      unit.polygons.map((points) => {
        const world = points.map(([px, py]) => plan.toWorld(px, py))
        const shape = new THREE.Shape(world.map(([x, z]) => new THREE.Vector2(x, -z)))
        const fill = new THREE.ShapeGeometry(shape).rotateX(-Math.PI / 2)
        const outline = new THREE.BufferGeometry().setFromPoints(
          world.map(([x, z]) => new THREE.Vector3(x, 0, z))
        )
        return { fill, outline, world }
      }),
    [unit, plan]
  )
  useEffect(
    () => () =>
      shapes.forEach((s) => {
        s.fill.dispose()
        s.outline.dispose()
      }),
    [shapes]
  )
  const [cx, cz] = centroid(shapes.flatMap((s) => s.world))
  const shown = reveal(cx, cz)
  const active = selected || hovered
  const summary = unitSummary(unit, row)
  const select = () => onSelect({ ...unit, center: [cx, y, cz] })

  return (
    <group position-y={y + OVERLAY_LIFT}>
      {shapes.map(({ fill, outline }, i) => (
        <group key={i}>
          <mesh
            geometry={fill}
            renderOrder={3}
            onPointerOver={(e) => {
              e.stopPropagation()
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = ''
            }}
            onClick={(e) => {
              e.stopPropagation()
              select()
            }}
          >
            <meshBasicMaterial
              color={status.color}
              transparent
              opacity={(active ? 0.5 : 0.3) * shown}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          <lineLoop geometry={outline} position-y={0.01} renderOrder={4}>
            <lineBasicMaterial
              color={status.color}
              transparent
              opacity={(active ? 1 : 0.75) * shown}
            />
          </lineLoop>
        </group>
      ))}
      <Html position={[cx, WALL_HEIGHT + 0.7, cz]} center zIndexRange={[5, 0]}>
        <button
          type="button"
          onClick={select}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex h-9 min-w-9 items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-white px-3 text-sm font-semibold text-white shadow-md transition-[box-shadow] duration-300"
          style={{
            background: status.color,
            opacity: shown,
            pointerEvents: shown > 0.5 ? 'auto' : 'none',
            transform: `translateY(${(1 - shown) * 14}px) scale(${(0.7 + 0.3 * shown) * (active ? 1.08 : 1)})`
          }}
        >
          {unit.letter}
          {active && summary ? (
            <span className="text-[11px] font-medium opacity-90">{summary}</span>
          ) : null}
        </button>
      </Html>
    </group>
  )
}

/**
 * Interior de un piso (de la torre o de las oficinas): losa real, muros
 * extruidos desde la planta, muebles detectados en ella y las unidades
 * pintadas según su disponibilidad. Lo de arriba se recorta con planos de
 * corte (ver MaterialsProvider). Al abrirse, el piso se construye en una onda
 * desde el centro mientras la cámara llega.
 */
export function FloorInterior({ id, availability, selectedKey, onSelect }) {
  const catalog = useMemo(() => floorCatalog(id), [id])
  const { floor } = catalog
  const texture = useTexture(catalog.image)
  const gl = useThree((s) => s.gl)
  const invalidate = useThree((s) => s.invalidate)
  const y = floor.base
  const [reveal, setReveal] = useState(0)

  // La planta no se dibuja: solo se lee para sacar muros, solados y muebles
  const plan = useMemo(
    () => cachedPlan(catalog.image, texture.image, floor.align),
    [catalog, texture, floor]
  )
  const center = useMemo(() => [0, (floor.box.zMin + floor.box.zMax) / 2], [floor])
  const radius = (floor.box.zMax - floor.box.zMin) / 2 + 2

  const resources = useMemo(() => {
    const wave = createBuildWave()
    wave.uBuildCenter.value = center
    wave.uBuildRadius.value = radius
    const b = createBoxList()
    for (const [px0, py0, px1, py1] of plan.walls) {
      const [xa, za] = plan.toWorld(px0, py0)
      const [xb, zb] = plan.toWorld(px1, py1)
      b.add('wall', xa, xb, 0, WALL_HEIGHT, za, zb)
      b.add('cap', xa, xb, WALL_HEIGHT, WALL_HEIGHT + 0.02, za, zb)
    }
    // Ventanas detectadas en la planta: antepecho, vidrio y marco
    for (const { axis, rect, door } of plan.windows) {
      const [xa, za] = plan.toWorld(rect[0], rect[1])
      const [xb, zb] = plan.toWorld(rect[2], rect[3])
      const [x0, x1, z0, z1] = [
        Math.min(xa, xb),
        Math.max(xa, xb),
        Math.min(za, zb),
        Math.max(za, zb)
      ]
      const span = axis === 'h' ? z1 - z0 : x1 - x0
      const sill = door || span > WIDE_WINDOW ? 0.05 : SILL
      b.add('wall', x0, x1, 0, sill, z0, z1)
      b.add('cap', x0, x1, sill, sill + 0.02, z0, z1)
      // Vidrio al centro del espesor y marco perimetral fino
      const [c, t] = axis === 'h' ? [(x0 + x1) / 2, 0.02] : [(z0 + z1) / 2, 0.02]
      const pane = (material, a0, a1, y0, y1, half) =>
        axis === 'h'
          ? b.add(material, c - half, c + half, y0, y1, a0, a1)
          : b.add(material, a0, a1, y0, y1, c - half, c + half)
      const [a0, a1] = axis === 'h' ? [z0, z1] : [x0, x1]
      pane('glass', a0, a1, sill + 0.02, WALL_HEIGHT, t)
      pane('frame', a0, a1, WALL_HEIGHT - 0.05, WALL_HEIGHT, 0.05)
      for (const a of [a0, (a0 + a1) / 2, a1 - 0.05])
        pane('frame', a, a + 0.05, sill, WALL_HEIGHT, 0.05)
    }
    if (floor.building === 'torre') buildFloorEdges(b, Number(floor.id))
    const furniture = buildFurniture(floor.plan, plan)
    // El solado queda dentro del volumen del edificio (la PB de oficinas incluye el patio)
    const [bx0, by0, bx1, by1] = plan.bounds
    const clipX0 = Math.max(bx0, plan.pixelAtZ(floor.box.zMin + 0.3))
    const clipX1 = Math.min(bx1, plan.pixelAtZ(floor.box.zMax))
    const materials = createInteriorMaterials(wave)
    return {
      wave,
      walls: buildBoxGeometries(b),
      furnitureBoxes: buildBoxGeometries(furniture.boxes),
      furnitureCylinders: furniture.cylinders,
      // Cerámico blanco continuo en toda la planta, sin superponer el rayado.
      tile: floorQuad(plan, [clipX0, by0, clipX1, by1]),
      balconies: unitFloors(catalog.units, plan),
      materials
    }
  }, [plan, floor, catalog, center, radius])
  useEffect(
    () => () => {
      resources.walls.forEach((g) => g.dispose())
      resources.furnitureBoxes.forEach((g) => g.dispose())
      Object.values(resources.furnitureCylinders).forEach((g) => g?.dispose())
      resources.tile.dispose()
      resources.balconies?.dispose()
      Object.values(resources.materials).forEach((m) => {
        if (!m.userData.sharedMap) m.map?.dispose()
        m.dispose()
      })
    },
    [resources]
  )

  // Construcción del piso; las sombras se recalculan al terminar
  useEffect(() => {
    const state = { t: 0 }
    const tween = gsap.to(state, {
      t: 1,
      delay: REVEAL_DELAY,
      duration: REVEAL_DURATION,
      ease: 'power2.out',
      onUpdate: () => {
        resources.wave.uBuild.value = state.t
        setReveal(state.t)
        invalidate()
      },
      onComplete: () => {
        gl.shadowMap.needsUpdate = true
        invalidate()
      }
    })
    return () => tween.kill()
  }, [gl, invalidate, resources])

  useLayoutEffect(() => {
    const floorFade = Math.min(1, reveal * 2.5)
    resources.materials.tile.opacity = floorFade
  }, [resources, reveal])

  const unitShown = (cx, cz) => unitReveal(reveal, [cx, cz], center, radius)

  return (
    <group name={`interior-${floor.id}`}>
      <mesh
        geometry={resources.tile}
        material={resources.materials.tile}
        position-y={y + 0.02}
        receiveShadow
      />
      {resources.balconies ? (
        <mesh
          geometry={resources.balconies}
          material={resources.materials.tile}
          position-y={y + 0.012}
          receiveShadow
        />
      ) : null}
      <group position-y={y}>
        {[...resources.walls, ...resources.furnitureBoxes].map(([key, geometry]) => (
          <mesh
            key={key}
            geometry={geometry}
            material={resources.materials[key]}
            castShadow={key !== 'cap'}
            receiveShadow
          />
        ))}
        {Object.entries(resources.furnitureCylinders).map(([key, geometry]) =>
          geometry ? (
            <mesh
              key={key}
              geometry={geometry}
              material={resources.materials[key]}
              castShadow
              receiveShadow
            />
          ) : null
        )}
      </group>
      {catalog.units.map((unit) => (
        <UnitOverlay
          key={unit.letter}
          unit={unit}
          plan={plan}
          y={y}
          status={unitStatus(unit, availability)}
          row={availability?.[unit.sheet]}
          selected={selectedKey === `${floor.id}-${unit.letter}`}
          reveal={unitShown}
          onSelect={(u) => onSelect({ ...u, floor: floor.id })}
        />
      ))}
    </group>
  )
}
