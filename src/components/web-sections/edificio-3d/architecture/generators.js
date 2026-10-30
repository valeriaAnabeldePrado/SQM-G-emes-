// Generadores procedurales de piezas repetitivas (muros con vanos, carpinterías,
// barandas). Trabajan sobre un plano de fachada:
//   axis 'x' → el muro corre a lo largo de x y su espesor está en z (frentes)
//   axis 'z' → corre a lo largo de z y su espesor está en x (laterales)
// `from`/`to` son posiciones sobre ese eje y `plane*` coordenadas sobre el espesor.

function addOnAxis(b, material, axis, a0, a1, y0, y1, p0, p1, rotY = 0) {
  if (axis === 'x') b.add(material, a0, a1, y0, y1, p0, p1, rotY)
  else b.add(material, p0, p1, y0, y1, a0, a1, rotY)
}

/**
 * Muro macizo con vanos rectangulares. Se parte en franjas verticales entre los
 * bordes de los vanos y en cada franja se rellena lo que no ocupa ningún vano.
 */
export function addWallWithOpenings(
  b,
  material,
  { axis = 'x', from, to, bottom, top, planeMin, planeMax, openings = [] }
) {
  const edges = [from, to]
  for (const o of openings) edges.push(o.from, o.to)
  const xs = [...new Set(edges)].filter((v) => v >= from && v <= to).sort((a, b) => a - b)

  for (let i = 0; i < xs.length - 1; i++) {
    const a0 = xs[i]
    const a1 = xs[i + 1]
    const mid = (a0 + a1) / 2
    const holes = openings
      .filter((o) => o.from < mid && o.to > mid)
      .map((o) => [Math.max(o.bottom, bottom), Math.min(o.top, top)])
      .sort((a, b) => a[0] - b[0])

    let y = bottom
    for (const [h0, h1] of holes) {
      if (h0 > y) addOnAxis(b, material, axis, a0, a1, y, h0, planeMin, planeMax)
      y = Math.max(y, h1)
    }
    if (y < top) addOnAxis(b, material, axis, a0, a1, y, top, planeMin, planeMax)
  }
}

/**
 * Carpintería con marco perimetral, parantes y travesaños, y vidrio al medio.
 * `face` es la cara exterior del muro y `inward` (+1/-1) hacia dónde queda el interior.
 * `mullions` divide el vano en partes iguales; `mullionsAt` fija posiciones exactas.
 * `room` ({ roomFloor, roomCeiling, depth, kind, seed }) reemplaza el vidrio por un
 * paño con interior simulado.
 */
export function addWindow(
  b,
  {
    axis = 'x',
    from,
    to,
    bottom,
    top,
    face,
    inward,
    frameMaterial,
    glassMaterial,
    mullions = 0,
    mullionsAt,
    transoms = [],
    profile = 0.05,
    depth = 0.07,
    reveal = 0.06,
    room
  }
) {
  const p0 = face + inward * reveal
  const p1 = face + inward * (reveal + depth)
  const pg = (p0 + p1) / 2
  const frame = (a0, a1, y0, y1) => addOnAxis(b, frameMaterial, axis, a0, a1, y0, y1, p0, p1)

  frame(from, to, bottom, bottom + profile)
  frame(from, to, top - profile, top)
  frame(from, from + profile, bottom, top)
  frame(to - profile, to, bottom, top)

  const positions =
    mullionsAt ??
    Array.from({ length: mullions }, (_, i) => from + ((to - from) * (i + 1)) / (mullions + 1))
  for (const m of positions) frame(m - profile / 2, m + profile / 2, bottom, top)
  for (const t of transoms) frame(from, to, t - profile / 2, t + profile / 2)

  // Con `room` el vidrio muestra una habitación detrás; si no, es una placa simple
  if (room && axis === 'x') {
    b.pane({ from, to, bottom, top, plane: pg, inward, ...room })
  } else {
    addOnAxis(b, glassMaterial, axis, from, to, bottom, top, pg - 0.01, pg + 0.01)
  }
}

/** Baranda de barrotes verticales con pasamanos y zócalo. */
export function addRailing(
  b,
  {
    axis = 'x',
    from,
    to,
    bottom,
    plane,
    material,
    height = 1.05,
    spacing = 0.12,
    bar = 0.022,
    rail = 0.045
  }
) {
  const p0 = plane - rail / 2
  const p1 = plane + rail / 2
  addOnAxis(b, material, axis, from, to, bottom + height - rail, bottom + height, p0, p1)
  addOnAxis(b, material, axis, from, to, bottom + 0.06, bottom + 0.06 + rail * 0.8, p0, p1)

  const count = Math.max(1, Math.round((to - from) / spacing))
  const step = (to - from) / count
  for (let i = 0; i <= count; i++) {
    const a = from + i * step
    const a0 = Math.max(from, a - bar / 2)
    const a1 = Math.min(to, a + bar / 2)
    addOnAxis(
      b,
      material,
      axis,
      a0,
      a1,
      bottom,
      bottom + height - rail,
      plane - bar / 2,
      plane + bar / 2
    )
  }
}

/** Baranda de vidrio con perfil inferior y pasamanos fino. */
export function addGlassRailing(
  b,
  { axis = 'x', from, to, bottom, plane, glassMaterial, capMaterial, height = 1.1 }
) {
  addOnAxis(b, capMaterial, axis, from, to, bottom, bottom + 0.08, plane - 0.04, plane + 0.04)
  addOnAxis(
    b,
    glassMaterial,
    axis,
    from,
    to,
    bottom + 0.08,
    bottom + height - 0.03,
    plane - 0.01,
    plane + 0.01
  )
  addOnAxis(
    b,
    capMaterial,
    axis,
    from,
    to,
    bottom + height - 0.03,
    bottom + height,
    plane - 0.02,
    plane + 0.02
  )
}
