import { HALF, LOT } from '../buildings/vivra-guemes/config'

// Lectura de las plantas (las mismas PNG de /apartments). Los muros están
// rellenos de gris claro (~186-191) con borde gris medio, y son más gruesos que
// el mobiliario, los textos y el rayado del piso (beige), así que se separan
// por color y por espesor.

const WALL_LUMA = [125, 197]
const NEUTRAL = 10 // tolerancia para "gris" (sin tinte)
const MIN_PIECE = 5 // px: descarta motas de mobiliario que sobreviven la apertura
const BOUNDS_PIECE = 12 // px: solo tramos largos definen el contorno de la planta

function wallMask(data, w, h) {
  const mask = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]
    const a = data[i * 4 + 3]
    const luma = (r + g + b) / 3
    mask[i] =
      a > 200 && luma > WALL_LUMA[0] && luma < WALL_LUMA[1] && Math.abs(r - b) < NEUTRAL ? 1 : 0
  }
  return mask
}

/** Apertura morfológica 2x2: borra trazos de 1 px (mobiliario, cotas, rayado). */
function openMask(mask, w, h) {
  const eroded = new Uint8Array(w * h)
  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const i = y * w + x
      eroded[i] = mask[i] & mask[i + 1] & mask[i + w] & mask[i + w + 1]
    }
  }
  const opened = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      opened[i] =
        eroded[i] |
        (x > 0 ? eroded[i - 1] : 0) |
        (y > 0 ? eroded[i - w] : 0) |
        (x > 0 && y > 0 ? eroded[i - w - 1] : 0)
    }
  }
  return opened
}

/**
 * Borra manchas chicas y redondeadas (maceteros y plantas pintados de gris; un
 * muro llena su caja casi entera, un círculo ~78 %) y piezas sueltas muy chicas
 * (sillas). Los muros reales siempre forman parte de un trazo más largo.
 */
function dropRoundBlobs(mask, w, h, maxSide, minSide) {
  const seen = new Uint8Array(w * h)
  const stack = []
  const pixels = []
  for (let start = 0; start < w * h; start++) {
    if (!mask[start] || seen[start]) continue
    stack.push(start)
    seen[start] = 1
    pixels.length = 0
    let x0 = w
    let y0 = h
    let x1 = 0
    let y1 = 0
    while (stack.length) {
      const i = stack.pop()
      pixels.push(i)
      const x = i % w
      const y = (i - x) / w
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
      for (const j of [i - 1, i + 1, i - w, i + w]) {
        if (j >= 0 && j < w * h && mask[j] && !seen[j] && Math.abs((j % w) - x) <= 1) {
          seen[j] = 1
          stack.push(j)
        }
      }
    }
    const bw = x1 - x0 + 1
    const bh = y1 - y0 + 1
    const fill = pixels.length / (bw * bh)
    const side = Math.max(bw, bh)
    // Redondas hasta maxSide, y cualquier pieza suelta muy chica (sillas en gris)
    if ((side <= maxSide && fill < 0.88) || side <= minSide) {
      for (const i of pixels) mask[i] = 0
    }
  }
  return mask
}

/** Largo del tramo de muro que pasa por cada píxel, por filas (o por columnas). */
function runLengths(mask, w, h, vertical) {
  const out = new Uint16Array(w * h)
  const [outer, inner] = vertical ? [w, h] : [h, w]
  const at = vertical ? (o, i) => i * w + o : (o, i) => o * w + i
  for (let o = 0; o < outer; o++) {
    let i = 0
    while (i < inner) {
      if (!mask[at(o, i)]) {
        i++
        continue
      }
      const start = i
      while (i < inner && mask[at(o, i)]) i++
      for (let k = start; k < i; k++) out[at(o, k)] = i - start
    }
  }
  return out
}

/**
 * Huecos en los muros: tramos de un mismo muro (horizontal o vertical, por su
 * espesor) separados por un hueco. Se clasifican por lo que dibuja el plano:
 *   ventana: dos o más líneas paralelas al muro que cruzan el hueco (marcos)
 *   puerta:  hueco limpio (queda abierto)
 *   corte:   menos de 30 cm (cotas o textos que pisan el muro): se rellena
 */
function wallOpenings(mask, data, w, h, scale) {
  const horizontalRun = runLengths(mask, w, h, false)
  const verticalRun = runLengths(mask, w, h, true)
  const thin = 0.42 * scale
  const maxGap = Math.round(3.6 * scale)
  const openings = []
  for (const axis of ['h', 'v']) {
    const along = axis === 'h' ? horizontalRun : verticalRun
    const across = axis === 'h' ? verticalRun : horizontalRun
    const [outer, inner] = axis === 'h' ? [h, w] : [w, h]
    const at = axis === 'h' ? (o, i) => o * w + i : (o, i) => i * w + o
    const gap = new Uint8Array(w * h)
    for (let o = 0; o < outer; o++) {
      let last = -1
      for (let i = 0; i < inner; i++) {
        const k = at(o, i)
        if (!mask[k]) continue
        if (along[k] > across[k] && across[k] <= thin) {
          if (last >= 0 && i - last - 1 >= 1 && i - last - 1 <= maxGap) {
            for (let g = last + 1; g < i; g++) gap[at(o, g)] = 1
          }
          last = i
        } else {
          last = -1
        }
      }
    }
    for (const [x0, y0, x1, y1] of components(gap, w, h)) {
      const length = axis === 'h' ? x1 - x0 : y1 - y0
      const thickness = axis === 'h' ? y1 - y0 : x1 - x0
      if (thickness < 3) continue
      if (length / scale < 0.3) {
        openings.push({ kind: 'corte', axis, rect: [x0, y0, x1, y1] })
        continue
      }
      // Filas paralelas al muro con trazo oscuro en casi todo el largo
      let lines = 0
      for (let o = axis === 'h' ? y0 : x0; o < (axis === 'h' ? y1 : x1); o++) {
        let ink = 0
        for (let i = axis === 'h' ? x0 : y0; i < (axis === 'h' ? x1 : y1); i++) {
          const k = at(o, i) * 4
          if ((data[k] + data[k + 1] + data[k + 2]) / 3 < 200 && data[k + 3] > 200) ink++
        }
        if (ink / length >= 0.7) lines++
      }
      openings.push({ kind: lines >= 2 ? 'ventana' : 'puerta', axis, rect: [x0, y0, x1, y1] })
    }
  }
  return openings
}

/**
 * Carpinterías dibujadas como muro: el plano dibuja puertas balcón y ventanales
 * como dos franjas grises finas (≤ 3 px) paralelas, con un trazo oscuro entre
 * ellas y cortadas por marcas negras cada tanto. Por color pasan por muro y
 * quedaban como tabiques de 7 cm partidos. Se detectan por píxel (espesor
 * real), se sacan de la máscara de muros y vuelven como paños de vidrio.
 */
function carpentry(mask, data, w, h, scale) {
  const horizontalRun = runLengths(mask, w, h, false)
  const verticalRun = runLengths(mask, w, h, true)
  const dark = (i) => !mask[i] && (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3 < 150
  const frame = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      if (!mask[i]) continue
      for (const [across, along, step] of [
        [horizontalRun, verticalRun, 1], // franja vertical: la línea se busca en x
        [verticalRun, horizontalRun, w] // franja horizontal: la línea se busca en y
      ]) {
        if (across[i] > 3 || along[i] < 6) continue
        // Bordes de esta franja en el espesor
        let lo = i
        while (mask[lo - step] && across[lo - step] <= 3) lo -= step
        let hi = i
        while (mask[hi + step] && across[hi + step] <= 3) hi += step
        // Línea oscura pegada (1-2 px) de algún lado; si sigue otra franja fina, también
        for (const [edge, dir] of [
          [hi, step],
          [lo, -step]
        ]) {
          const k = edge + dir
          if (k < 0 || k >= w * h || !dark(k)) continue
          let end = dark(k + dir) ? k + dir : k
          if (mask[end + dir] && across[end + dir] <= 3) end += dir
          const [a, b] = dir > 0 ? [lo, end] : [end, hi]
          for (let t = a; t <= b; t += step) frame[t] = 1
          break
        }
      }
    }
  }
  // Paños: componentes de carpintería unidos a lo largo (las marcas los cortan)
  const panes = []
  for (const r of components(frame, w, h)) {
    const v = r[3] - r[1] > r[2] - r[0]
    const pane = panes.find(
      (p) =>
        p.axis === (v ? 'v' : 'h') &&
        (v
          ? Math.abs(p.rect[0] - r[0]) <= 2 &&
            r[1] - p.rect[3] <= 0.45 * scale &&
            p.rect[1] - r[3] <= 0.45 * scale
          : Math.abs(p.rect[1] - r[1]) <= 2 &&
            r[0] - p.rect[2] <= 0.45 * scale &&
            p.rect[0] - r[2] <= 0.45 * scale)
    )
    if (pane) {
      const q = pane.rect
      pane.rect = [
        Math.min(q[0], r[0]),
        Math.min(q[1], r[1]),
        Math.max(q[2], r[2]),
        Math.max(q[3], r[3])
      ]
    } else panes.push({ kind: 'ventana', axis: v ? 'v' : 'h', rect: r })
  }
  // Se sacan de la máscara (también las marcas entre pedazos, para que no queden muñones)
  const kept = panes.filter(
    ({ rect: [x0, y0, x1, y1] }) =>
      Math.max(x1 - x0, y1 - y0) >= 0.6 * scale && Math.min(x1 - x0, y1 - y0) <= 0.25 * scale
  )
  for (const { rect } of kept) {
    const [x0, y0, x1, y1] = rect
    for (let y = y0; y < y1; y++) mask.fill(0, y * w + x0, y * w + x1)
  }
  return kept
}

/** Cajas envolventes de las regiones conectadas (4-vecinos) de una máscara. */
function components(mask, w, h) {
  const seen = new Uint8Array(w * h)
  const boxes = []
  const stack = []
  for (let start = 0; start < w * h; start++) {
    if (!mask[start] || seen[start]) continue
    seen[start] = 1
    stack.push(start)
    let x0 = w
    let y0 = h
    let x1 = 0
    let y1 = 0
    while (stack.length) {
      const i = stack.pop()
      const x = i % w
      const y = (i - x) / w
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
      const neighbors = [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]
      for (const j of neighbors) {
        if (j < 0 || j >= w * h || !mask[j] || seen[j]) continue
        seen[j] = 1
        stack.push(j)
      }
    }
    boxes.push([x0, y0, x1 + 1, y1 + 1])
  }
  return boxes
}

/** Rectángulos que cubren la máscara: tramos por fila fusionados hacia abajo. */
function maskToRects(mask, w, h) {
  const rects = []
  let open = new Map()
  for (let y = 0; y <= h; y++) {
    const runs = new Map()
    if (y < h) {
      for (let x = 0; x < w; ) {
        if (!mask[y * w + x]) {
          x++
          continue
        }
        const start = x
        while (x < w && mask[y * w + x]) x++
        runs.set(`${start}:${x}`, [start, x])
      }
    }
    const next = new Map()
    for (const [key, rect] of open) {
      if (runs.has(key)) {
        rect[3] = y + 1
        next.set(key, rect)
        runs.delete(key)
      } else {
        rects.push(rect)
      }
    }
    for (const [key, [x0, x1]] of runs) next.set(key, [x0, y, x1, y + 1])
    open = next
  }
  return rects.filter(([x0, y0, x1, y1]) => Math.max(x1 - x0, y1 - y0) >= MIN_PIECE)
}

/**
 * Lee la planta y devuelve los muros en píxeles y la transformación a metros.
 * Escala: el alto de los muros en la imagen es el ancho del lote (11 m); la
 * izquierda de la imagen mira a Pueyrredón (-z) y arriba es +x. `align` fija
 * en z el borde izquierdo de la planta ({ front }) o el derecho ({ rear }).
 */
export function readPlan(image, align) {
  const w = image.naturalWidth || image.width
  const h = image.naturalHeight || image.height
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(image, 0, 0)
  const { data } = ctx.getImageData(0, 0, w, h)
  const mask = openMask(wallMask(data, w, h), w, h)
  // ~0,8 m y ~0,55 m a la escala habitual de las plantas (~30 px/m)
  dropRoundBlobs(mask, w, h, 24, 17)
  // La escala sale del ancho del lote (alto de los muros en la imagen)
  let top = h
  let bottom = 0
  for (let i = 0; i < w * h; i++) {
    if (!mask[i]) continue
    const y = (i - (i % w)) / w
    if (y < top) top = y
    if (y > bottom) bottom = y
  }
  const lotScale = (bottom + 1 - top) / LOT.width
  const openings = wallOpenings(mask, data, w, h, lotScale)
  // Los cortes del dibujo se rellenan: el muro queda continuo
  for (const { kind, rect } of openings) {
    if (kind !== 'corte') continue
    const [x0, y0, x1, y1] = rect
    for (let y = y0; y < y1; y++) mask.fill(1, y * w + x0, y * w + x1)
  }
  const panes = carpentry(mask, data, w, h, lotScale)
  const walls = maskToRects(mask, w, h)
  const windows = [...openings.filter((o) => o.kind === 'ventana'), ...panes]

  let minX = w
  let minY = h
  let maxX = 0
  let maxY = 0
  for (const [x0, y0, x1, y1] of walls) {
    if (Math.max(x1 - x0, y1 - y0) < BOUNDS_PIECE) continue
    minX = Math.min(minX, x0)
    minY = Math.min(minY, y0)
    maxX = Math.max(maxX, x1)
    maxY = Math.max(maxY, y1)
  }
  // En el perímetro no hay puertas abiertas: un hueco sin marcos dibujados en un
  // muro exterior es una puerta balcón (vidrio desde el piso)
  const edge = Math.round(0.6 * lotScale)
  for (const o of openings) {
    if (o.kind !== 'puerta') continue
    const [x0, y0, x1, y1] = o.rect
    const onPerimeter =
      o.axis === 'h'
        ? y0 - minY <= edge || maxY - y1 <= edge
        : x0 - minX <= edge || maxX - x1 <= edge
    if (onPerimeter) windows.push({ ...o, kind: 'ventana', door: true })
  }
  const pxPerMeter = (maxY - minY) / LOT.width
  const z0 = align.rear != null ? align.rear - (maxX - minX) / pxPerMeter : align.front
  const toWorld = (px, py) => [HALF - (py - minY) / pxPerMeter, z0 + (px - minX) / pxPerMeter]
  const pixelAtZ = (z) => minX + (z - z0) * pxPerMeter
  return {
    width: w,
    height: h,
    scale: pxPerMeter,
    toWorld,
    walls,
    windows,
    bounds: [minX, minY, maxX, maxY],
    pixelAtZ
  }
}
