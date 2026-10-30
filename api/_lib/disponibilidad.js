// Disponibilidad de unidades a partir de la planilla publicada que usa el
// cotizador. La planilla trae más datos (precios, propietarios, accesos): acá
// solo se leen y exponen piso, unidad, tipo, m², orientación y estado.

export const SHEET_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQUyX-qiTffYYEpg24qid-fA2fc0TqMMJscPPYrZbBu-yedrF6pWkr261ZiYQONi55VKbUQJ6tdapmO/pub?output=csv'

/** CSV con comillas y saltos de línea dentro de campos. */
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else field += c
  }
  if (field || row.length) rows.push([...row, field])
  return rows
}

/** "Planta Baja (Av. Pueyrredon)" -> "PB", "Planta Baja (Angelo Peredo)" -> "PB-Peredo". */
function normalizeFloor(value) {
  const text = value.trim()
  if (/^planta baja/i.test(text)) return /peredo/i.test(text) ? 'PB-Peredo' : 'PB'
  return text
}

export function parseAvailability(csv) {
  const rows = parseCsv(csv)
  const header = rows.findIndex((r) => r[0]?.trim() === 'Piso')
  if (header < 0) return []
  const col = Object.fromEntries(rows[header].map((name, i) => [name.trim(), i]))
  return rows
    .slice(header + 1)
    .filter((r) => r[col.Piso]?.trim() && r[col.Unidad]?.trim())
    .map((r) => ({
      piso: normalizeFloor(r[col.Piso]),
      unidad: r[col.Unidad].trim().replace(/^Local.*/i, 'Local'),
      tipo: r[col.Tipo]?.trim() || '',
      m2: Number.parseFloat((r[col.M2] || '').replace(',', '.')) || null,
      orientacion: r[col.Orientacion]?.trim() || '',
      disponible: /^disponible$/i.test(r[col.Estado]?.trim() || '')
    }))
}

export async function fetchAvailability() {
  const response = await fetch(SHEET_CSV, { headers: { 'User-Agent': 'vivra-edificio-3d' } })
  if (!response.ok) throw new Error(`Planilla: HTTP ${response.status}`)
  return parseAvailability(await response.text())
}
