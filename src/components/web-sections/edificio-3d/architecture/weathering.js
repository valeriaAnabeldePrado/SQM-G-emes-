// Desgaste del hormigón y los revoques, calculado en el shader (no descarga nada
// y cuesta unas pocas operaciones por píxel):
//   - variación de tono en manchas de varios metros, que rompe la repetición
//     de la textura escaneada (cada 2-3 m se veía el mismo paño)
//   - chorreaduras verticales finas, más marcadas abajo de cada losa, como deja
//     la lluvia al escurrir por el canto de los balcones

const VERTEX_HEAD = /* glsl */ `
varying vec3 vWeatherPos;
`

const VERTEX_BODY = /* glsl */ `
#include <project_vertex>
vec4 weatherPos = vec4(transformed, 1.0);
#ifdef USE_INSTANCING
  weatherPos = instanceMatrix * weatherPos;
#endif
vWeatherPos = (modelMatrix * weatherPos).xyz;
`

const FRAGMENT_HEAD = /* glsl */ `
varying vec3 vWeatherPos;
uniform float uWeather;

float weatherHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float weatherNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(weatherHash(i), weatherHash(i + vec2(1.0, 0.0)), f.x),
    mix(weatherHash(i + vec2(0.0, 1.0)), weatherHash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}
`

const FRAGMENT_BODY = /* glsl */ `
#include <map_fragment>
{
  vec3 wp = vWeatherPos;
  // Manchas grandes (la cara horizontal usa x/z, las verticales x+z/y)
  vec2 planar = vec2(wp.x + wp.z, wp.y);
  float blotch = weatherNoise(planar * 0.22) * 0.65 + weatherNoise(planar * 0.9) * 0.35;
  // Chorreaduras: ruido estirado en vertical, que se desvanece al bajar desde
  // cada losa (piso cada ~2,95 m)
  float streak = weatherNoise(vec2((wp.x + wp.z) * 3.1, wp.y * 0.12));
  float fromSlab = fract(wp.y / 2.95);
  float drip = smoothstep(0.55, 0.95, streak) * smoothstep(0.0, 0.7, fromSlab);
  // ±6 % de tono en las manchas y hasta 14 % más oscuro en las chorreaduras
  float grime = 1.0 - uWeather * (0.12 * (blotch - 0.5) + 0.14 * drip);
  diffuseColor.rgb *= grime;
}
`

/**
 * Suma el desgaste a un MeshStandardMaterial. `amount` regula cuánto se nota
 * (1 = hormigón a la intemperie, menos para revoques pintados).
 */
export function withWeathering(material, amount = 1) {
  const uniforms = { uWeather: { value: amount } }
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uWeather = uniforms.uWeather
    shader.vertexShader =
      VERTEX_HEAD + shader.vertexShader.replace('#include <project_vertex>', VERTEX_BODY)
    shader.fragmentShader =
      FRAGMENT_HEAD + shader.fragmentShader.replace('#include <map_fragment>', FRAGMENT_BODY)
  }
  material.customProgramCacheKey = () => 'weathering-v1'
  return material
}
