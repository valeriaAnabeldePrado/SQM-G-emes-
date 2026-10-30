import * as THREE from 'three'
import { addBuildingBounds } from './buildingBounds.js'

/**
 * Vidrio con "interior mapping": cada paño dibuja una habitación detrás
 * (paredes, piso, techo, un mueble, cortinas y a veces la luz encendida)
 * calculando la intersección del rayo de la cámara con una caja virtual.
 * El reflejo del cielo lo pone el material estándar (fresnel + entorno HDRI);
 * el interior se suma como emisivo, atenuado por el mismo fresnel.
 *
 * Tipos de paño (parte entera de la semilla):
 *   0 vivienda, 1 vivienda con cortinas corridas, 2 local, 3 oficina
 * Sumando NEIGHBOR_PANE el paño es de un edificio vecino: de noche se encienden
 * menos ambientes y más tenues, para que no compitan con VIVRA.
 */
export const PANE_KIND = { home: 0, curtains: 1, shop: 2, office: 3 }
export const NEIGHBOR_PANE = 4

const VERTEX_HEAD = /* glsl */ `
attribute vec2 aPaneUv;
attribute vec4 aPane;
attribute vec3 aRoom;
varying vec3 vWorldPos;
varying vec2 vPaneUv;
varying vec4 vPane;
varying vec3 vRoom;
`

const VERTEX_BODY = /* glsl */ `
#include <begin_vertex>
vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
vPaneUv = aPaneUv;
vPane = aPane;
vRoom = aRoom;
`

const FRAGMENT_HEAD = /* glsl */ `
uniform float uNight;
varying vec3 vWorldPos;
varying vec2 vPaneUv;
varying vec4 vPane;
varying vec3 vRoom;

float paneHash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

vec3 paneInterior() {
  float w = vPane.x;
  float h = vPane.y;
  // La semilla llega interpolada con error de redondeo: se cuantiza para que el
  // hash no cambie de un píxel a otro
  float seed = floor(vPane.z * 4096.0 + 0.5) / 4096.0;
  float kind = floor(seed);
  bool neighbor = kind > 3.5;
  if (neighbor) kind -= 4.0;
  float s = fract(seed) + 0.013;
  float inward = vPane.w;
  float floorY = -vRoom.x;
  float ceilY = vRoom.y;
  float depth = vRoom.z;

  // Rayo en coordenadas del paño: x a la derecha vista desde afuera, z hacia adentro
  vec3 rd = normalize(vWorldPos - cameraPosition);
  vec3 d = vec3(-inward * rd.x, rd.y, max(inward * rd.z, 0.02));
  vec3 p = vec3((vPaneUv.x - 0.5) * w, vPaneUv.y * h, 0.0);

  float halfW = w * 0.5 + 0.5 + paneHash(s * 13.1) * 0.9;
  float tx = d.x > 0.0 ? (halfW - p.x) / d.x : (p.x + halfW) / max(-d.x, 1e-4);
  float ty = d.y > 0.0 ? (ceilY - p.y) / d.y : (p.y - floorY) / max(-d.y, 1e-4);
  float tz = depth / d.z;
  float t = min(tx, min(ty, tz));
  vec3 hit = p + d * t;

  bool shop = kind > 1.5 && kind < 2.5;
  bool office = kind > 2.5;
  vec3 wall = mix(vec3(0.86, 0.82, 0.76), vec3(0.78, 0.8, 0.82), paneHash(s * 7.7));
  if (shop || office) wall = vec3(0.92, 0.91, 0.89);
  vec3 col;
  if (t == tz) {
    col = wall;
    // Mueble o cuadro contra la pared del fondo
    float fx = hit.x - (paneHash(s * 3.3) - 0.5) * halfW;
    float fh = 0.5 + paneHash(s * 5.1) * 0.9;
    if (abs(fx) < 0.45 + paneHash(s * 4.4) * 0.6 && hit.y - floorY < fh) {
      col = mix(vec3(0.32, 0.24, 0.18), vec3(0.55, 0.55, 0.57), paneHash(s * 9.9));
    }
  } else if (t == tx) {
    col = wall * 0.82;
  } else if (d.y > 0.0) {
    col = vec3(0.93);
    if (shop || office) {
      // Luminarias en el cielorraso
      vec2 g = fract(hit.xz / vec2(1.8, 2.4)) - 0.5;
      if (length(g) < 0.09) col = vec3(4.0, 3.8, 3.4);
    }
  } else {
    col = office ? vec3(0.42, 0.42, 0.44) : vec3(0.46, 0.34, 0.24);
  }

  // Luz natural que entra por la ventana y se apaga hacia el fondo
  // De día la habitación se ve oscura contra el exterior; de noche se encienden
  // más ambientes y la luz artificial pasa a dominar
  float daylight = (0.05 + 0.17 * exp(-hit.z * 0.7)) * (1.0 - 0.9 * uNight);
  float litChance = neighbor ? mix(0.86, 0.64, uNight) : mix(0.78, 0.38, uNight);
  float lit = (shop || office) ? 1.0 : step(litChance, paneHash(s * 21.7));
  vec3 lamp = vec3(1.0, 0.78, 0.52) * (shop ? 0.85 : office ? 0.3 : 0.5) * (1.0 + 0.25 * uNight);
  if (neighbor) lamp *= 0.65;
  col *= daylight + lit * lamp;

  // Cortinas y rollers de las viviendas, con un tono de tela por paño
  if (kind < 1.5) {
    float tone = paneHash(s * 41.9);
    vec3 fabric = tone < 0.45 ? vec3(0.95, 0.94, 0.91) : tone < 0.8 ? vec3(0.9, 0.83, 0.72) : vec3(0.68, 0.69, 0.7);
    // La tela toma la luz de afuera y, si el ambiente está encendido, la de adentro
    float glow = 0.5 * (1.0 - 0.85 * uNight) + lit * (0.35 + 0.15 * uNight);

    // Voile a 12 cm del vidrio: casi cerrado en el tipo 1; si no, en parte de
    // los paños, a ambos lados o corrido hacia uno solo
    float pick = paneHash(s * 31.3);
    float amount = kind > 0.5 ? 0.38 + pick * 0.12 : pick < 0.45 ? 0.12 + pick * 0.45 : 0.0;
    float side = paneHash(s * 17.9);
    vec3 pc = p + d * (0.12 / d.z);
    float xs = pc.x / w + 0.5;
    if ((xs < amount && side > 0.25) || (xs > 1.0 - amount && side < 0.75)) {
      float folds = 0.88 + 0.12 * sin(pc.x * 9.0 + paneHash(s) * 6.0);
      col = mix(col, fabric * folds * glow, 0.86);
    }

    // Roller pegado al vidrio, bajado desde arriba hasta una altura variable
    if (paneHash(s * 53.1) < 0.25) {
      float drop = 0.15 + paneHash(s * 61.7) * 0.55;
      vec3 pr = p + d * (0.06 / d.z);
      float below = pr.y / h - (1.0 - drop);
      if (below > 0.0) {
        // Barra de peso en el borde inferior
        float hem = 0.7 + 0.3 * smoothstep(0.0, 0.025, below);
        col = mix(col, fabric * 0.92 * glow * hem, 0.95);
      }
    }
  }
  return col;
}
`

const FRAGMENT_BODY = /* glsl */ `
#include <emissivemap_fragment>
{
  float paneFresnel = 0.04 + 0.96 * pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 5.0);
  totalEmissiveRadiance += paneInterior() * (1.0 - paneFresnel);
}
`

export function createInteriorGlassMaterial() {
  const material = new THREE.MeshStandardMaterial({
    color: '#000000',
    roughness: 0.04,
    metalness: 0,
    envMapIntensity: 1.2
  })
  // uNight (0 = día, 1 = noche) se comparte con todos los programas compilados
  const uniforms = { uNight: { value: 0 } }
  material.userData.uniforms = uniforms
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uNight = uniforms.uNight
    shader.vertexShader =
      VERTEX_HEAD + shader.vertexShader.replace('#include <begin_vertex>', VERTEX_BODY)
    shader.fragmentShader =
      FRAGMENT_HEAD +
      shader.fragmentShader.replace('#include <emissivemap_fragment>', FRAGMENT_BODY)
  }
  material.customProgramCacheKey = () => 'interior-glass-v2'
  return material
}

/**
 * Geometría de paños: un quad por vano, con las medidas de la habitación en
 * atributos. Los paños son planos verticales que miran hacia ±z.
 */
export function buildPaneGeometry(panes) {
  const n = panes.length
  const position = new Float32Array(n * 12)
  const normal = new Float32Array(n * 12)
  const paneUv = new Float32Array(n * 8)
  const pane = new Float32Array(n * 16)
  const room = new Float32Array(n * 12)
  const index = new Uint32Array(n * 6)

  panes.forEach((p, i) => {
    const w = p.to - p.from
    const h = p.top - p.bottom
    // u = derecha vista desde afuera: para un paño que mira a -z es -x
    const corners = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1]
    ]
    corners.forEach(([u, v], k) => {
      const x = p.inward > 0 ? p.to - u * w : p.from + u * w
      position.set([x, p.bottom + v * h, p.plane], (i * 4 + k) * 3)
      normal.set([0, 0, -p.inward], (i * 4 + k) * 3)
      paneUv.set([u, v], (i * 4 + k) * 2)
      pane.set([w, h, p.kind + p.seed, p.inward], (i * 4 + k) * 4)
      room.set([p.bottom - p.roomFloor, p.roomCeiling - p.bottom, p.depth], (i * 4 + k) * 3)
    })
    const b = i * 4
    index.set([b, b + 1, b + 2, b, b + 2, b + 3], i * 6)
  })

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normal, 3))
  geometry.setAttribute('aPaneUv', new THREE.BufferAttribute(paneUv, 2))
  geometry.setAttribute('aPane', new THREE.BufferAttribute(pane, 4))
  geometry.setAttribute('aRoom', new THREE.BufferAttribute(room, 3))
  geometry.setIndex(new THREE.BufferAttribute(index, 1))
  addBuildingBounds(
    geometry,
    panes.map((p) => p.building),
    4
  )
  geometry.computeBoundingSphere()
  return geometry
}
