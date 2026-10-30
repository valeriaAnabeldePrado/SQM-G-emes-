// Colores y etiquetas de estado de las unidades en la planta.

export const STATUS = {
  disponible: { color: '#3fcf8e', label: 'Disponible' },
  vendida: { color: '#9aa1a8', label: 'No disponible' },
  amenity: { color: '#3d8fd6', label: 'Amenities' },
  sinDato: { color: '#e8a93a', label: 'Consultar' }
}

/** Estado de una unidad según la planilla (o sin dato si no cargó). */
export function unitStatus(unit, availability) {
  if (unit.amenity) return STATUS.amenity
  const row = availability?.[unit.sheet]
  if (!row) return STATUS.sinDato
  return row.disponible ? STATUS.disponible : STATUS.vendida
}
