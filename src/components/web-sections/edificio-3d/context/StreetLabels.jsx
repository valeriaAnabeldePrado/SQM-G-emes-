import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CANAL, CANAL_DEPTH, canalAxisX } from './canal'
import contextData from './contextData.json'
import { SIDEWALK_HEIGHT, STREETS } from './streets'

// Nombres de calles pintados sobre la calzada, como en los mapas 3D: un plano
// con textura de canvas por cartel (la misma tipografía del sitio), sin
// descargar fuentes ni geometría de texto.

const GROUND = -SIDEWALK_HEIGHT + 0.06
const LETTER_HEIGHT = 2.3 // m
const MAX_DISTANCE = 150 // m desde el lote: más lejos no aporta y ensucia
const PER_STREET = 2

const short = (name) =>
  name
    .replace(/^Avenida /, 'Av. ')
    .replace(/^Pasaje /, 'Pje. ')
    .replace(/^General /, 'Gral. ')

/** Puntos a lo largo de una polilínea, cada `step` metros, con su dirección. */
function samples(points, step) {
  const out = []
  let next = step / 2
  let walked = 0
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, az] = points[i]
    const [bx, bz] = points[i + 1]
    const length = Math.hypot(bx - ax, bz - az)
    if (!length) continue
    while (next <= walked + length) {
      const t = (next - walked) / length
      out.push({
        x: ax + (bx - ax) * t,
        z: az + (bz - az) * t,
        dx: (bx - ax) / length,
        dz: (bz - az) / length
      })
      next += step
    }
    walked += length
  }
  return out
}

/** Elige hasta PER_STREET posiciones por calle, cerca del lote y separadas. */
function layout() {
  const streets = new Map()
  const add = (name, pts, y = GROUND) => {
    const list = streets.get(name) ?? []
    list.push({ pts, y })
    streets.set(name, list)
  }
  const pu = STREETS.pueyrredon
  const pe = STREETS.peredo
  add('Av. Pueyrredón', [
    [-180, (pu.curbNorth + pu.curbSouth) / 2],
    [180, (pu.curbNorth + pu.curbSouth) / 2]
  ])
  add('Ángelo de Peredo', [
    [-180, (pe.curbNorth + pe.curbSouth) / 2],
    [180, (pe.curbNorth + pe.curbSouth) / 2]
  ])
  for (const road of contextData.roads) if (road.n) add(short(road.n), road.p)
  if (CANAL) {
    const pts = CANAL.axis.map(([x, z]) => [x, z])
    add('La Cañada', pts, -CANAL_DEPTH + 0.08)
  }

  const labels = []
  for (const [name, parts] of streets) {
    const candidates = parts
      .flatMap(({ pts, y }) => samples(pts, 18).map((s) => ({ ...s, y })))
      .map((s) => ({ ...s, dist: Math.hypot(s.x, s.z - 20) }))
      .filter((s) => s.dist < MAX_DISTANCE)
      .sort((a, b) => a.dist - b.dist)
    const chosen = []
    for (const c of candidates) {
      if (chosen.length >= PER_STREET) break
      // A más de 70 m de otro cartel de la misma calle; en el canal, sobre el eje
      if (chosen.some((o) => Math.hypot(o.x - c.x, o.z - c.z) < 70)) continue
      if (name === 'La Cañada') c.x = canalAxisX(c.z)
      chosen.push(c)
    }
    for (const c of chosen) labels.push({ name, ...c })
  }
  return labels
}

function labelTexture(text) {
  const font = `600 96px "Coco Gothic", "Poppins", system-ui, sans-serif`
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = font
  const width = Math.ceil(ctx.measureText(text).width) + 60
  canvas.width = width
  canvas.height = 140
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 14
  ctx.strokeStyle = 'rgba(30, 32, 36, 0.55)'
  ctx.strokeText(text, width / 2, 74)
  ctx.fillStyle = '#ffffff'
  ctx.fillText(text, width / 2, 74)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return { texture, aspect: width / canvas.height }
}

/** Ángulo del cartel para que el texto corra en la dirección (dx, dz). */
const angleFor = (dx, dz) => Math.atan2(-dz, dx)

const cameraRight = new THREE.Vector3()

export function StreetLabels({ night = 0 }) {
  const labels = useMemo(layout, [])
  const [fontReady, setFontReady] = useState(false)
  useEffect(() => {
    let alive = true
    document.fonts?.ready.then(() => alive && setFontReady(true))
    return () => {
      alive = false
    }
  }, [])

  const items = useMemo(() => {
    if (!fontReady) return []
    const textures = new Map()
    return labels.map((label) => {
      if (!textures.has(label.name)) textures.set(label.name, labelTexture(label.name))
      return { ...label, ...textures.get(label.name) }
    })
  }, [labels, fontReady])

  const resources = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)
    const materials = new Map()
    for (const item of items) {
      if (materials.has(item.name)) continue
      materials.set(
        item.name,
        new THREE.MeshBasicMaterial({
          map: item.texture,
          transparent: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -2
        })
      )
    }
    return { geometry, materials }
  }, [items])
  useEffect(
    () => () => {
      resources.geometry.dispose()
      resources.materials.forEach((m) => {
        m.map?.dispose()
        m.dispose()
      })
    },
    [resources]
  )
  // De noche no encandilan: blanco más tenue
  useEffect(() => {
    resources.materials.forEach((m) => {
      m.opacity = 0.92 - night * 0.35
    })
  }, [resources, night])

  // Que se lean siempre de izquierda a derecha: si la cámara queda del otro
  // lado, el cartel gira 180° (un producto escalar por cartel y cuadro)
  const meshes = useRef([])
  useFrame(({ camera }) => {
    cameraRight.setFromMatrixColumn(camera.matrixWorld, 0)
    items.forEach((item, i) => {
      const mesh = meshes.current[i]
      if (!mesh) return
      const ahead = item.dx * cameraRight.x + item.dz * cameraRight.z >= 0
      const angle = ahead ? angleFor(item.dx, item.dz) : angleFor(-item.dx, -item.dz)
      if (mesh.rotation.y !== angle) mesh.rotation.y = angle
    })
  })

  return (
    <group name="nombres-calles">
      {items.map((item, i) => (
        <mesh
          key={i}
          ref={(mesh) => {
            meshes.current[i] = mesh
          }}
          geometry={resources.geometry}
          material={resources.materials.get(item.name)}
          position={[item.x, item.y, item.z]}
          scale={[LETTER_HEIGHT * 1.4 * item.aspect, 1, LETTER_HEIGHT * 1.4]}
          renderOrder={2}
        />
      ))}
    </group>
  )
}
