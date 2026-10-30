import * as THREE from 'three'

// Texturas procedurales en canvas: no hay que descargar imágenes y cada una
// representa un tamaño real (en metros) para combinar con las UV métricas.

function seeded(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function canvasTexture(width, height, metersX, metersY, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  draw(canvas.getContext('2d'), width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1 / metersX, 1 / metersY)
  texture.anisotropy = 8
  return texture
}

function speckle(ctx, w, h, rand, count, alpha) {
  for (let i = 0; i < count; i++) {
    const v = rand() < 0.5 ? 0 : 255
    ctx.fillStyle = `rgba(${v},${v},${v},${rand() * alpha})`
    ctx.fillRect(rand() * w, rand() * h, 1 + rand() * 2, 1 + rand() * 2)
  }
}

/** Porcelanato de exterior 60 x 60 cm (1,20 x 1,20 m). */
export function tileTexture(base = '#77736d') {
  return canvasTexture(256, 256, 1.2, 1.2, (ctx, w, h) => {
    const rand = seeded(3)
    ctx.fillStyle = base
    ctx.fillRect(0, 0, w, h)
    speckle(ctx, w, h, rand, 3000, 0.1)
    ctx.strokeStyle = 'rgba(30,30,30,0.35)'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, w / 2 - 2, h / 2 - 2)
    ctx.strokeRect(w / 2 + 1, 1, w / 2 - 2, h / 2 - 2)
    ctx.strokeRect(1, h / 2 + 1, w / 2 - 2, h / 2 - 2)
    ctx.strokeRect(w / 2 + 1, h / 2 + 1, w / 2 - 2, h / 2 - 2)
  })
}

/** Vereda de baldosas grises de 40 x 40 cm (2 x 2 m). */
export function sidewalkTexture() {
  return canvasTexture(512, 512, 2, 2, (ctx, w, h) => {
    const rand = seeded(17)
    const n = 5
    const s = w / n
    ctx.fillStyle = '#8f8b84'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const tone = 178 + Math.floor(rand() * 18)
        ctx.fillStyle = `rgb(${tone},${tone - 3},${tone - 9})`
        ctx.fillRect(i * s + 1.5, j * s + 1.5, s - 3, s - 3)
      }
    }
    speckle(ctx, w, h, rand, 14000, 0.12)
  })
}

/**
 * Fachada genérica para el contexto: 4 x 4 módulos de 3 x 3 m (12 x 12 m) con
 * revoque claro, línea de losa y un vano por módulo. Devuelve también el mapa
 * de ventanas encendidas para la noche (un 35 % al azar, para que no se note la
 * repetición).
 */
export function facadeTextures() {
  const n = 4
  const size = 512
  const m = size / n
  const rand = seeded(23)
  const lit = Array.from({ length: n * n }, () => rand() < 0.35)
  const color = canvasTexture(size, size, 12, 12, (ctx) => {
    ctx.fillStyle = '#e0e3e3'
    ctx.fillRect(0, 0, size, size)
    speckle(ctx, size, size, rand, 9000, 0.05)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const x = i * m
        const y = j * m
        ctx.fillStyle = '#d5dada'
        ctx.fillRect(x, y + m * 0.9, m, m * 0.1)
        ctx.fillStyle = '#b5c0c6'
        ctx.fillRect(x + m * 0.2, y + m * 0.22, m * 0.6, m * 0.5)
        ctx.fillStyle = 'rgba(255,255,255,0.18)'
        ctx.fillRect(x + m * 0.2, y + m * 0.22, m * 0.6, m * 0.12)
      }
    }
  })
  const emissive = canvasTexture(size, size, 12, 12, (ctx) => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, size, size)
    lit.forEach((on, k) => {
      if (!on) return
      const x = (k % n) * m
      const y = Math.floor(k / n) * m
      const warm = 200 + Math.floor(rand() * 55)
      ctx.fillStyle = `rgb(255,${warm},${Math.floor(warm * 0.62)})`
      ctx.fillRect(x + m * 0.2, y + m * 0.22, m * 0.6, m * 0.5)
    })
  })
  return { color, emissive }
}

/** Ladrillo visto (pilares del edificio vecino), 1,2 x 1,2 m. */
export function brickTexture() {
  return canvasTexture(256, 256, 1.2, 1.2, (ctx, w, h) => {
    const rand = seeded(41)
    const rows = 16
    const bh = h / rows
    const bw = w / 5
    ctx.fillStyle = '#b9aea4'
    ctx.fillRect(0, 0, w, h)
    for (let r = 0; r < rows; r++) {
      const offset = r % 2 ? bw / 2 : 0
      for (let c = -1; c < 6; c++) {
        const t = rand()
        ctx.fillStyle = `rgb(${150 + t * 40},${82 + t * 25},${60 + t * 18})`
        ctx.fillRect(c * bw + offset + 1.5, r * bh + 1.5, bw - 3, bh - 3)
      }
    }
    speckle(ctx, w, h, rand, 3000, 0.1)
  })
}

/** Mancha de luz radial para el piso bajo cada farol (se suma de noche). */
export function lightPoolTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,214,160,1)')
  g.addColorStop(0.35, 'rgba(255,190,120,0.45)')
  g.addColorStop(1, 'rgba(255,170,100,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/**
 * Ramillete de hojas con alfa para los árboles (tarjetas cruzadas). Se dibujan
 * hojas elípticas en distintos verdes; el centro queda más denso.
 */
export function leavesTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')
  const rand = seeded(29)
  for (let i = 0; i < 520; i++) {
    const a = rand() * Math.PI * 2
    const r = Math.sqrt(rand()) * 110
    const x = 128 + Math.cos(a) * r
    const y = 128 + Math.sin(a) * r
    const g = 70 + Math.floor(rand() * 70)
    ctx.fillStyle = `rgb(${Math.floor(g * 0.62)},${Math.floor(g * 0.85) + 12},${Math.floor(g * 0.5)})`
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rand() * Math.PI)
    ctx.beginPath()
    ctx.ellipse(0, 0, 9 + rand() * 6, 4 + rand() * 2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

/** Persiana de enrollar de aluminio (tablillas de 5 cm), 1 x 1 m. */
export function shutterTexture() {
  return canvasTexture(64, 256, 1, 1, (ctx, w, h) => {
    ctx.fillStyle = '#9a9c9e'
    ctx.fillRect(0, 0, w, h)
    for (let y = 0; y < h; y += h / 20) {
      ctx.fillStyle = 'rgba(40,42,44,0.45)'
      ctx.fillRect(0, y, w, 2)
      ctx.fillStyle = 'rgba(255,255,255,0.25)'
      ctx.fillRect(0, y + 2, w, 1)
    }
  })
}
