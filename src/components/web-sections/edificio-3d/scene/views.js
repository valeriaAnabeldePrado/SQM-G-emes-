/**
 * Vistas en las que el barrio baja solo ("Entorno bajo" automático): el bloque
 * de oficinas sobre Peredo queda encajonado entre las torres vecinas, que lo
 * tapan tanto desde la calle como desde arriba.
 */
export const lowForView = (view) => view === 'contrafrente' || view.startsWith('piso:of')
