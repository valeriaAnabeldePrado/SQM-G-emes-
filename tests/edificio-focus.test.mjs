import assert from 'node:assert/strict'
import test from 'node:test'
import * as THREE from 'three'
import { createBoxList, buildBoxGeometries } from '../src/components/web-sections/edificio-3d/architecture/boxes.js'
import { buildPaneGeometry } from '../src/components/web-sections/edificio-3d/architecture/interiorGlass.js'
import * as visibility from '../src/components/web-sections/edificio-3d/architecture/viewCorridor.js'

const samplePane = {
  from: 1, to: 3, bottom: 2, top: 5, plane: -0.1, inward: 1,
  roomFloor: 0, roomCeiling: 6, depth: 3, kind: 0, seed: 0.4
}

test('merged walls and windows retain their own building bounds', () => {
  const list = createBoxList()
  assert.equal(typeof list.building, 'function', 'building grouping must be available')
  list.building(() => {
    list.add('wall', 0, 4, 0, 8, 0, 6)
    list.pane(samplePane)
  })
  list.building(() => list.add('wall', 10, 14, 0, 20, 2, 9))
  const walls = buildBoxGeometries(list).get('wall')
  const panes = buildPaneGeometry(list.panes)
  assert.equal(walls.getAttribute('position').count, 48, 'one merged mesh, no duplicated geometry')
  for (let i = 0; i < 48; i++) {
    const min = i < 24 ? [0, 0, -0.1] : [10, 0, 2]
    const max = i < 24 ? [4, 8, 6] : [14, 20, 9]
    for (const [name, expected] of [['aBuildingMin', min], ['aBuildingMax', max]]) {
      const values = walls.getAttribute(name).array.slice(i * 3, i * 3 + 3)
      values.forEach((value, k) => assert.ok(Math.abs(value - expected[k]) < 1e-6))
    }
  }
  assert.deepEqual(Array.from(panes.getAttribute('aBuildingMax').array), Array(4).fill([4, 8, 6]).flat())
  walls.dispose()
  panes.dispose()
})

test('untagged tower geometry does not allocate context attributes', () => {
  const list = createBoxList()
  list.add('wall', -4, 4, 0, 12, 0, 10)
  const geometry = buildBoxGeometries(list).get('wall')
  assert.equal(geometry.getAttribute('aBuildingMin'), undefined)
  assert.equal(geometry.getAttribute('aBuildingMax'), undefined)
  geometry.dispose()
})

test('context variants preserve live clipping planes, textures and original shader uniforms', () => {
  assert.equal(typeof visibility.createContextMaterial, 'function')
  const base = new THREE.MeshStandardMaterial({ map: new THREE.Texture() })
  const night = { value: 0.5 }
  base.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, -1, 0), 20)]
  base.onBeforeCompile = (shader) => { shader.uniforms.originalNight = night }
  base.customProgramCacheKey = () => 'original-window-shader'
  const context = visibility.createContextMaterial(base)
  const shader = {
    uniforms: {},
    vertexShader: THREE.ShaderLib.standard.vertexShader,
    fragmentShader: THREE.ShaderLib.standard.fragmentShader
  }
  context.onBeforeCompile(shader)
  assert.notEqual(context, base)
  assert.equal(context.map, base.map)
  assert.equal(context.clippingPlanes, base.clippingPlanes)
  base.clippingPlanes[0].constant = 10
  assert.equal(context.clippingPlanes[0].constant, 10)
  assert.equal(shader.uniforms.originalNight, night)
  assert.equal(shader.uniforms.uCamPos, visibility.corridor.uCamPos)
  assert.notEqual(context.customProgramCacheKey(), base.customProgramCacheKey())
  assert.equal(base.transparent, false)
  assert.equal(context.transparent, false, 'fading must preserve opaque rendering')
  context.dispose()
  base.map.dispose()
  base.dispose()
})
