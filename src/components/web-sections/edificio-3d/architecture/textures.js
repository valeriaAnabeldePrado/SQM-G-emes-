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

/**
 * Porcelanato símil madera clara de 20 x 120 cm, trabado a un tercio (renders
 * de los interiores), 2,4 x 2,4 m: tablas de tono apenas distinto con una veta
 * suave y juntas finas.
 */
export function plankTexture() {
  return canvasTexture(512, 512, 2.4, 2.4, (ctx, w, h) => {
    const rand = seeded(71)
    const rows = 12 // 0,2 m por tabla
    const rh = h / rows
    const pl = w / 2 // 1,2 m de largo
    ctx.fillStyle = '#b9ad9c'
    ctx.fillRect(0, 0, w, h)
    for (let r = 0; r < rows; r++) {
      const offset = ((r % 3) * pl) / 3
      for (let c = -1; c < 3; c++) {
        const x = c * pl + offset
        const t = rand()
        ctx.fillStyle = `rgb(${212 + t * 16},${203 + t * 14},${188 + t * 12})`
        ctx.fillRect(x + 1, r * rh + 1, pl - 2, rh - 2)
        // Veta: trazos largos y tenues a lo largo de la tabla
        for (let k = 0; k < 7; k++) {
          const y = r * rh + 3 + rand() * (rh - 6)
          ctx.fillStyle = `rgba(120,100,80,${0.05 + rand() * 0.06})`
          ctx.fillRect(x + rand() * pl * 0.3, y, pl * (0.4 + rand() * 0.6), 1)
        }
      }
    }
    speckle(ctx, w, h, rand, 4000, 0.05)
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
 * Adoquín de hormigón rojo de 20 x 10 cm en espiga (plaza sobre Belgrano), 1,6 x 1,6 m.
 * La espiga a 90° se repite con los vectores (1, 1) y (2, -2) en módulos de
 * 10 cm, así que el mosaico cierra cada 16 módulos; el tono de cada adoquín
 * sale de su posición dentro del mosaico para que coincida en los bordes.
 */
export function herringboneTexture() {
  const cells = 16
  const size = 512
  const u = size / cells
  return canvasTexture(size, size, 1.6, 1.6, (ctx) => {
    ctx.fillStyle = '#8a6a5f' // junta de arena
    ctx.fillRect(0, 0, size, size)
    const wrap = (v) => ((v % cells) + cells) % cells
    const tone = (x, y, kind) => {
      const h = Math.sin(wrap(x) * 12.9898 + wrap(y) * 78.233 + kind * 37.7) * 43758.5453
      return h - Math.floor(h)
    }
    const brick = (x, y, w, h, kind) => {
      const t = tone(x, y, kind)
      ctx.fillStyle = `rgb(${150 + t * 28},${92 + t * 20},${80 + t * 16})`
      for (const dx of [-cells, 0, cells]) {
        for (const dy of [-cells, 0, cells]) {
          ctx.fillRect((x + dx) * u + 1.5, (y + dy) * u + 1.5, w * u - 3, h * u - 3)
        }
      }
    }
    for (let i = -cells; i <= cells; i++) {
      for (let j = -cells / 2; j <= cells / 2; j++) {
        const x = i + 2 * j
        const y = i - 2 * j
        if (x < -2 || x > cells || y < -3 || y > cells) continue
        brick(x, y, 2, 1, 0)
        brick(x, y + 1, 1, 2, 1)
      }
    }
    speckle(ctx, size, size, seeded(53), 9000, 0.12)
  })
}

/** Baldosa roja de vereda de 40 x 40 cm con 16 panes (2 x 2 m). */
export function redTileTexture() {
  return canvasTexture(512, 512, 2, 2, (ctx, w) => {
    const rand = seeded(61)
    const n = 5
    const s = w / n
    ctx.fillStyle = '#6e4a40'
    ctx.fillRect(0, 0, w, w)
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const t = rand()
        const r = 150 + t * 22
        const g = 92 + t * 14
        const b = 80 + t * 12
        ctx.fillStyle = `rgb(${r},${g},${b})`
        ctx.fillRect(i * s + 1.5, j * s + 1.5, s - 3, s - 3)
        // Panes: ranuras finas que dividen la baldosa en 4 x 4
        ctx.fillStyle = `rgba(60,35,28,0.35)`
        for (let k = 1; k < 4; k++) {
          ctx.fillRect(i * s + (k * s) / 4 - 0.75, j * s + 2, 1.5, s - 4)
          ctx.fillRect(i * s + 2, j * s + (k * s) / 4 - 0.75, s - 4, 1.5)
        }
      }
    }
    speckle(ctx, w, w, rand, 12000, 0.12)
  })
}

/**
 * Fachada genérica para el contexto: 4 x 4 módulos de 3 x 3 m (12 x 12 m) con
 * revoque claro, línea de losa y un vano por módulo. Devuelve también el mapa
 * de ventanas encendidas para la noche.
 */
export function facadeTextures() {
  const n = 4
  const size = 512
  const m = size / n
  const rand = seeded(23)
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
  // Ventanas de noche en un mosaico de 8 x 8 módulos (24 m, el doble que el
  // color) para que la repetición no se lea. Pocas encendidas y desparejas:
  // cálidas con cortina o sin ella, alguna blanca fría, alguna tenue de TV
  const nightModules = n * 2
  const emissive = canvasTexture(size * 2, size * 2, 24, 24, (ctx) => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, size * 2, size * 2)
    for (let k = 0; k < nightModules * nightModules; k++) {
      if (rand() > 0.2) continue
      const x = (k % nightModules) * m + m * 0.2
      const y = Math.floor(k / nightModules) * m + m * 0.22
      const w = m * 0.6
      const h = m * 0.5
      const kind = rand()
      const level = 0.35 + rand() * 0.65
      const [r, g, b] =
        kind < 0.62
          ? [255, 196, 128]
          : kind < 0.82
            ? [255, 226, 178]
            : kind < 0.93
              ? [214, 228, 255]
              : [120, 150, 255]
      const tint = (a) => `rgba(${r},${g},${b},${a * level})`
      // Más luz abajo (la lámpara y el reflejo en el piso que se ve por el vano)
      const glow = ctx.createLinearGradient(0, y, 0, y + h)
      glow.addColorStop(0, tint(0.55))
      glow.addColorStop(1, tint(1))
      ctx.fillStyle = glow
      ctx.fillRect(x, y, w, h)
      // Cortina o persiana a medio bajar en parte de las ventanas
      if (rand() < 0.45) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)'
        ctx.fillRect(x, y, w, h * (0.2 + rand() * 0.5))
      }
      // Parante de la carpintería
      ctx.fillStyle = '#000'
      ctx.fillRect(x + w / 2 - 2, y, 4, h)
    }
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
