import * as THREE from 'three'

/** Bounds repeat per vertex so each building can fade inside a merged mesh. */
export function addBuildingBounds(geometry, buildings, verticesPerBuilding) {
  if (!buildings.some(Boolean)) return
  const count = geometry.getAttribute('position').count
  const min = new Float32Array(count * 3)
  const max = new Float32Array(count * 3)
  buildings.forEach((bounds, i) => {
    if (!bounds) return
    for (let v = 0; v < verticesPerBuilding; v++) {
      const offset = (i * verticesPerBuilding + v) * 3
      min.set(bounds.min, offset)
      max.set(bounds.max, offset)
    }
  })
  geometry.setAttribute('aBuildingMin', new THREE.BufferAttribute(min, 3))
  geometry.setAttribute('aBuildingMax', new THREE.BufferAttribute(max, 3))
}
