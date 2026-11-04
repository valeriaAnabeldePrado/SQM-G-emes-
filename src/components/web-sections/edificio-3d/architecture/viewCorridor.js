import * as THREE from 'three'

// Altura sin recorte del entorno (más alta que cualquier edificio de OSM)
export const CONTEXT_FULL_HEIGHT = 1000

// Uniforms compartidos: solo cambian al mover la cámara o la hora del día.
export const corridor = {
  uCamPos: { value: new THREE.Vector3() },
  uViewForward: { value: new THREE.Vector3(0, 0, -1) },
  uViewRight: { value: new THREE.Vector3(1, 0, 0) },
  uViewUp: { value: new THREE.Vector3(0, 1, 0) },
  uFocusDistance: { value: 1 },
  uCorridorRadius: { value: 5.5 },
  uContextWash: { value: 0.14 },
  uContextSaturation: { value: 0.55 },
  // Entorno bajo: los edificios de OSM se recortan a esta altura (ver withViewCorridor)
  uContextHeight: { value: CONTEXT_FULL_HEIGHT }
}

const VERTEX_HEAD = /* glsl */ `
attribute vec3 aBuildingMin;
attribute vec3 aBuildingMax;
uniform vec3 uCamPos;
uniform vec3 uViewForward;
uniform vec3 uViewRight;
uniform vec3 uViewUp;
uniform float uFocusDistance;
uniform float uCorridorRadius;
varying float vContextCoverage;
`

const VERTEX_BODY = /* glsl */ `
#include <begin_vertex>
{
  vec3 buildingMax = aBuildingMax;
  #ifdef CONTEXT_CLAMP
    buildingMax.y = min(buildingMax.y, uContextHeight);
  #endif
  vec3 halfSize = (buildingMax - aBuildingMin) * 0.5;
  vec3 offset = (aBuildingMin + buildingMax) * 0.5 - uCamPos;
  float along = dot(offset, uViewForward);
  float depth = dot(halfSize, abs(uViewForward));
  // Bounds proyectados: también contempla edificios altos y pisos abiertos.
  vec2 extent = vec2(dot(halfSize, abs(uViewRight)), dot(halfSize, abs(uViewUp)));
  vec2 center = vec2(dot(offset, uViewRight), dot(offset, uViewUp));
  float separation = length(max(abs(center) - extent, vec2(0.0)));
  float radius = uCorridorRadius * clamp(along / max(uFocusDistance, 0.001), 0.0, 1.0);
  float overlap = 1.0 - smoothstep(radius, radius + 4.0, separation);
  float beforeFocus = 1.0 - smoothstep(uFocusDistance - 3.0, uFocusDistance, along - depth);
  float ahead = smoothstep(0.0, 2.0, along + depth);
  float tagged = step(0.001, length(halfSize));
  vContextCoverage = 1.0 - overlap * beforeFocus * ahead * tagged;
}
`

// Recorte de altura de los prismas extruidos: el techo baja a uContextHeight y
// los muros se acortan. Las UV de los laterales de ExtrudeGeometry bajan 1 por
// metro de altura: se corren lo mismo que el vértice para que la fachada
// conserve la escala de sus ventanas.
const CLAMP_HEAD = /* glsl */ `
#define CONTEXT_CLAMP
uniform float uContextHeight;
`

const CLAMP_POSITION = /* glsl */ `
#include <begin_vertex>
transformed.y = min(transformed.y, uContextHeight);
`

const CLAMP_UV = /* glsl */ `
#include <uv_vertex>
{
  float lift = max(position.y - uContextHeight, 0.0);
  #ifdef USE_MAP
    vMapUv = (mapTransform * vec3(MAP_UV + vec2(0.0, lift), 1.0)).xy;
  #endif
  #ifdef USE_EMISSIVEMAP
    vEmissiveMapUv = (emissiveMapTransform * vec3(EMISSIVEMAP_UV + vec2(0.0, lift), 1.0)).xy;
  #endif
}
`

// Hundimiento de los edificios modelados (linderos, Pocito): cada uno baja hasta
// que su techo queda a la altura del corte, con toda su arquitectura. Lo que
// arranca por encima del corte (las grúas sobre una torre) no asoma.
const SINK_HEAD = /* glsl */ `
attribute vec3 aBuildingMin;
attribute vec3 aBuildingMax;
uniform float uContextHeight;
`

const SINK_POSITION = /* glsl */ `
#include <begin_vertex>
{
  float excess = max(aBuildingMax.y - uContextHeight, 0.0);
  if (uContextHeight < aBuildingMin.y) excess += 10000.0;
  transformed.y -= excess;
}
`

const FRAGMENT_HEAD = /* glsl */ `
uniform float uContextWash;
uniform float uContextSaturation;
`

const FRAGMENT_COVERAGE = /* glsl */ `
#include <clipping_planes_fragment>
// Misma trama en muros, techos y vidrios: las capas no rellenan los huecos.
// No requiere ordenar transparencias, otro render pass ni animación continua.
if (vContextCoverage < 0.999) {
  float threshold = fract(52.9829189 * fract(dot(floor(gl_FragCoord.xy), vec2(0.06711056, 0.00583715))));
  if (vContextCoverage <= threshold) discard;
}
`

const FRAGMENT_TONE = /* glsl */ `
float contextLuma = dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722));
outgoingLight = mix(vec3(contextLuma), outgoingLight, uContextSaturation);
#ifdef USE_FOG
  outgoingLight = mix(outgoingLight, fogColor, uContextWash);
#endif
#include <opaque_fragment>
`

/**
 * `fade`: se calan los edificios que tapan la vista. En el modo entorno bajo,
 * con `clamp` los prismas del entorno se recortan a `corridor.uContextHeight`
 * y con `sink` (solo sin `fade`) los edificios modelados se hunden hasta ahí.
 */
export function withViewCorridor(material, { fade = true, clamp = false, sink = false } = {}) {
  const compile = material.onBeforeCompile
  const cacheKey = material.customProgramCacheKey()
  material.onBeforeCompile = function (shader, renderer) {
    compile.call(this, shader, renderer)
    Object.assign(shader.uniforms, corridor)
    if (clamp) {
      shader.vertexShader =
        CLAMP_HEAD +
        shader.vertexShader
          .replace('#include <begin_vertex>', CLAMP_POSITION)
          .replace('#include <uv_vertex>', CLAMP_UV)
    }
    if (sink) {
      shader.vertexShader =
        SINK_HEAD + shader.vertexShader.replace('#include <begin_vertex>', SINK_POSITION)
    }
    if (fade) {
      shader.vertexShader = VERTEX_HEAD + shader.vertexShader.replace('#include <begin_vertex>', VERTEX_BODY)
      shader.fragmentShader = 'varying float vContextCoverage;\n' + shader.fragmentShader
        .replace('#include <clipping_planes_fragment>', FRAGMENT_COVERAGE)
    }
    shader.fragmentShader = FRAGMENT_HEAD + shader.fragmentShader
      .replace('#include <opaque_fragment>', FRAGMENT_TONE)
  }
  material.customProgramCacheKey = () =>
    `${cacheKey}|view-corridor-v5:${fade ? 'fade' : 'solid'}:${clamp ? 'clamp' : sink ? 'sink' : 'full'}`
  return material
}

/** Sombras del entorno con el mismo recorte (`clamp`) o hundimiento (`sink`) que sus materiales. */
export function createContextDepthMaterial(mode = 'clamp') {
  const material = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking })
  const [head, body] = mode === 'sink' ? [SINK_HEAD, SINK_POSITION] : [CLAMP_HEAD, CLAMP_POSITION]
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uContextHeight = corridor.uContextHeight
    shader.vertexShader = head + shader.vertexShader.replace('#include <begin_vertex>', body)
  }
  material.customProgramCacheKey = () => `context-depth-${mode}`
  return material
}

/** Los linderos detallados se suavizan sin ocultar su arquitectura. */
export function createContextMaterial(base) {
  const material = base.clone()
  material.name = `context:${base.name || base.type}`
  material.clippingPlanes = base.clippingPlanes
  material.userData = base.userData
  material.onBeforeCompile = base.onBeforeCompile
  material.customProgramCacheKey = base.customProgramCacheKey
  return withViewCorridor(material, { fade: false, sink: true })
}
