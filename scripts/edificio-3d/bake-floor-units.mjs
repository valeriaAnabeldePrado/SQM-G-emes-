/**
 * Extrae los polígonos de cada unidad desde la página /apartments (los mismos
 * que se usan para elegir departamento sobre la planta) y los guarda en
 * coordenadas de píxel de la imagen de cada planta.
 *
 * Uso (con `pnpm dev` corriendo):
 *   node scripts/edificio-3d/bake-floor-units.mjs [http://localhost:5173] [ruta-a-chrome]
 *
 * Salida: src/components/web-sections/edificio-3d/interiors/floorUnits.json
 */
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const BASE = process.argv[2] || 'http://localhost:5173'
const CHROME = process.argv[3] || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../src/components/web-sections/edificio-3d/interiors/floorUnits.json'
)

// Grupo clickeable del corte (CorteNew) -> piso del edificio. Los pisos que
// comparten planta se miden una sola vez.
const FLOORS = [
  ['PB-PLANTA', 'PB'],
  ['PLANTA-UNO', 'P1-5'],
  ['PLANTA-SEIS', 'P6'],
  ['PLANTA-SIETE', 'P7-10'],
  ['PLANTA-ONCE', 'P11-13'],
  ['PLANTA-PISO-CATORCE-ABCDE', 'P14'],
  ['PLANTA-PISO-QUINCE-ABCDE', 'P15'],
  ['PLANTA-DIECISEIS', 'P16'],
  // Bloque de oficinas sobre Peredo
  ['PB-PLANTA-OFICINA', 'OF-PB'],
  ['PLANTA-UNO-OFICINA', 'OF1'],
  ['PLANTA-DOS-OFICINA', 'OF2'],
  ['PLANTA-TRES-OFICINA', 'OF3']
]

const browser = await chromium.launch({ executablePath: CHROME })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(`${BASE}/apartments`, { waitUntil: 'networkidle' })

const floors = {}
for (const [groupId, key] of FLOORS) {
  await page.locator(`#${groupId}`).first().dispatchEvent('click')
  await page.waitForTimeout(1200)
  floors[key] = await page.evaluate(() => {
    const container = document.querySelector('.floor-plan-container')
    const img = container.querySelector('img')
    const box = img.getBoundingClientRect()
    // object-fit: contain -> rectángulo real de la imagen dentro del <img>
    const scale = Math.min(box.width / img.naturalWidth, box.height / img.naturalHeight)
    const ox = box.left + (box.width - img.naturalWidth * scale) / 2
    const oy = box.top + (box.height - img.naturalHeight * scale) / 2
    const toImage = (el, x, y) => {
      const p = new DOMPoint(x, y).matrixTransform(el.getScreenCTM())
      return [+((p.x - ox) / scale).toFixed(1), +((p.y - oy) / scale).toFixed(1)]
    }
    const units = {}
    for (const shape of container.querySelectorAll('.plantasDptos, .oficinaPb')) {
      const group = shape.closest('g[id]')
      const label = group?.querySelector('text')?.textContent.trim()
      if (!label) continue
      let points
      if (shape.points) {
        points = [...shape.points].map((p) => toImage(shape, p.x, p.y))
      } else {
        const length = shape.getTotalLength()
        points = Array.from({ length: 48 }, (_, i) => {
          const p = shape.getPointAtLength((length * i) / 48)
          return toImage(shape, p.x, p.y)
        })
      }
      ;(units[label] ||= []).push(points)
    }
    return { image: new URL(img.src).pathname, size: [img.naturalWidth, img.naturalHeight], units }
  })
  console.log(key, floors[key].image, Object.keys(floors[key].units).join(','))
}
await browser.close()
writeFileSync(OUT, JSON.stringify({ floors }, null, 1))
console.log('->', OUT)
