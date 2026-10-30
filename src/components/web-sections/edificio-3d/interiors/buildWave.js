// "Onda de construcción" para el interior de un piso: muros y muebles crecen
// desde la losa con un desfase según la distancia a un centro. Se hace en el
// shader de vértices (un uniform compartido), sin objetos ni draw calls extra.

export function createBuildWave() {
  return {
    uBuild: { value: 0 }, // 0 = nada construido, 1 = todo
    uBuildCenter: { value: [0, 0] }, // x, z en el sistema del edificio
    uBuildRadius: { value: 14 }
  }
}

const HEAD = /* glsl */ `
uniform float uBuild;
uniform vec2 uBuildCenter;
uniform float uBuildRadius;
`

const BODY = /* glsl */ `
#include <begin_vertex>
{
  float bwDelay = clamp(distance(transformed.xz, uBuildCenter) / uBuildRadius, 0.0, 1.0) * 0.6;
  float bwT = clamp((uBuild - bwDelay) / 0.4, 0.0, 1.0);
  bwT = bwT * bwT * (3.0 - 2.0 * bwT);
  transformed.y *= max(bwT, 0.001);
}
`

/** Aplica la onda a un material (geometría con y local desde 0 = losa). */
export function withBuildWave(material, wave) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, wave)
    shader.vertexShader = HEAD + shader.vertexShader.replace('#include <begin_vertex>', BODY)
  }
  material.customProgramCacheKey = () => 'build-wave-v1'
  return material
}
