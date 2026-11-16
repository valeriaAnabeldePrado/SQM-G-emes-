/**
 * Foto satelital del piso para la entrada tipo drone (ver
 * scripts/edificio-3d/bake-satellite.py). Cuadrado de `size` metros centrado en
 * el origen local, alineado con x (Pueyrredón) y z (hacia Peredo): la fila 0 de
 * la imagen es z = -size/2 y la columna 0, x = -size/2.
 * Sentinel-2 cloudless 2016 de EOX, CC BY 4.0.
 */
export const SATELLITE = { url: '/edificio-3d/satelite.jpg', size: 8000 }

export const SATELLITE_CREDIT =
  'Sentinel-2 cloudless – s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)'
