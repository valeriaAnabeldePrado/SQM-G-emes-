# Entrada tipo drone — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Al entrar a `/edificio-3d`, un vuelo de ~8 s baja desde 6 km sobre una foto satelital de Córdoba hasta la vista general, con el barrio creciendo desde el suelo y VIVRA destacado, y termina invitando a elegir unidad.

**Architecture:** La foto se hornea una vez con un script (Sentinel-2 2016, CC BY) a `public/`. La matemática del vuelo (pose de cámara y capas según altura) vive en un módulo puro testeable. `CameraRig` maneja la cámara cuadro a cuadro y le pasa las capas a `Scene`, que las aplica sobre uniforms ya existentes (`corridor.uContextHeight`, saturación y lavado del contexto), niebla, planos de la cámara, cielo y la opacidad del plano satelital.

**Tech Stack:** React 19, React Three Fiber 9, drei 10, Three 0.179, Tailwind 4, Vite 6. Tests con `node --test`. Script con Python 3 + Pillow + numpy (ya instalados).

**Spec:** `docs/superpowers/specs/2026-11-16-intro-drone-design.md`

## Global Constraints

- Imagen: solo `s2cloudless_3857` (2016, CC BY 4.0). Nunca `s2cloudless-2018`+ (CC BY-NC-SA).
- Atribución exacta en el pie: `Sentinel-2 cloudless – s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)`.
- Sin cuentas, claves ni servicios en tiempo de ejecución: la foto se sirve desde `public/edificio-3d/satelite.jpg`, ≤ 700 KB.
- Vuelo ~8 s, arranque a 6.000 m, norte arriba; termina exactamente en `homeView(aspect)`.
- Siempre se puede saltear (botón "Saltar", clic, arrastre, rueda, tecla); con `prefers-reduced-motion: reduce` no hay vuelo ni descarga de la foto.
- Fuera del vuelo, la escena queda idéntica a hoy (cámara near 0,5 / far 3000, niebla del preset, cielo 4000, `uContextSaturation` 0,55, `uContextWash` 0,14, `uContextHeight` según "Entorno bajo").
- Textos de interfaz en español rioplatense; `<span>` y no `<p>` para textos chicos (App.css fija el tamaño de los `<p>`).
- Trabajar en una rama nueva `feat/intro-drone` desde `main`, en un worktree: el checkout actual tiene cambios sin commitear del formulario SMTP que no se tocan.

## Review Focus

- Cambio de tamaño de ventana o rotación del celular durante el vuelo: el vuelo debe terminar en el encuadre del tamaño nuevo, sin salto (la pose final se recalcula con el aspecto actual en cada cuadro).
- Saltear en cualquier momento (incluso en el primer cuadro): todo vuelve exactamente al estado normal (niebla, near/far, cielo, uniforms, sombras, controles habilitados) y la foto se descarta.
- Calidad que baja sola durante el vuelo (`QualityMonitor`): el vuelo sigue y termina bien aunque cambie la resolución.
- Hora de noche (`?hora=noche`): el vuelo se ve legible (la foto es de día; se oscurece con la luz de la escena) y al aterrizar la noche queda como hoy.
- Activar "Entorno bajo" justo después de aterrizar: el barrio baja desde la altura completa, sin quedar trabado en la altura del vuelo.

---

### Task 1: Rama, worktree y spec

**Files:**
- Move: `docs/superpowers/specs/2026-11-16-intro-drone-design.md` y este plan al worktree

- [ ] **Step 1:** Crear el worktree con superpowers:using-git-worktrees, rama `feat/intro-drone` desde `main`. Correr `pnpm install` dentro.
- [ ] **Step 2:** Mover spec y plan (están sin commitear en el checkout principal) al worktree; borrarlos del checkout principal.
- [ ] **Step 3:** Verificar línea base: `node --test tests/edificio-focus.test.mjs tests/pocito.test.mjs tests/plan-walls.test.mjs` → todo PASS.
- [ ] **Step 4: Commit** `docs(edificio-3d): diseño y plan de la entrada tipo drone`

### Task 2: Foto satelital horneada y créditos

**Files:**
- Create: `scripts/edificio-3d/bake-satellite.py`
- Create: `public/edificio-3d/satelite.jpg` (generado)
- Create: `src/components/web-sections/edificio-3d/context/satellite.js`
- Modify: `src/components/web-sections/edificio-3d/ui/Overlay.jsx` (línea de créditos, ~166)
- Test: `tests/intro-drone.test.mjs`

**Interfaces:**
- Produces: `SATELLITE = { url: '/edificio-3d/satelite.jpg', size: 8000 }` en `context/satellite.js` (metros de lado, centrado en el origen local).

- [ ] **Step 1: Test que falla**

```js
import { SATELLITE } from '../src/components/web-sections/edificio-3d/context/satellite.js'
test('satellite image is baked, square and light', () => {
  assert.equal(SATELLITE.size, 8000)
  const file = new URL('../public' + SATELLITE.url, import.meta.url)
  const bytes = fs.readFileSync(file)
  assert.ok(bytes.length <= 700 * 1024)
  // JPEG SOF0/SOF2: alto y ancho
  assert.deepEqual(jpegSize(bytes), { width: 1024, height: 1024 })
})
```
(`jpegSize` es un helper del test que busca el marcador `0xFFC0`/`0xFFC2`.)

- [ ] **Step 2:** `node --test tests/intro-drone.test.mjs` → FAIL (módulo inexistente).
- [ ] **Step 3: Script.** Reusa `LAT0, LON0, UX, UY, FRONT_LINE_V` importando `bake-osm-context.py` con `importlib` (como `bake-heights.py`). Descarga teselas z14 de `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/14/{fila}/{columna}.jpg` (la fila es y), con `curl -sf -A vivra-edificio-3d`, cubriendo el cuadrado local ±4000 m más una tesela de margen. Para cada píxel de salida (1024×1024): fila r → z = −4000 + (r + 0,5)·7,8125; columna c → x = −4000 + (c + 0,5)·7,8125. Inversa de `to_local` (la matriz es su propia inversa): `u = x`, `v = z + FRONT_LINE_V`, `este = u·UX + v·UY`, `norte = u·UY − v·UX`, `lon = LON0 + este / (111320·cos LAT0)`, `lat = LAT0 + norte / 110540`; de ahí a píxel Mercator z14 y muestreo bilineal (numpy). JPEG calidad 85, progresivo. Con `--debug RUTA` además escribe un PNG con las calles de `contextData.json` en rojo encima.
- [ ] **Step 4:** Correr `python3 scripts/edificio-3d/bake-satellite.py --debug <scratchpad>/sat-debug.png`. Mirar el PNG: las calles rojas deben caer sobre las calles de la foto y el eje de La Cañada sobre el canal. Si están espejadas o giradas, corregir la inversa antes de seguir.
- [ ] **Step 5:** Crear `context/satellite.js` con `SATELLITE`. Agregar la atribución exacta (Global Constraints) a la línea de créditos de `Overlay.jsx`, después de OpenStreetMap, separada con ` · `.
- [ ] **Step 6:** `node --test tests/intro-drone.test.mjs` → PASS.
- [ ] **Step 7: Commit** `feat(edificio-3d): foto satelital Sentinel-2 horneada para la entrada`

### Task 3: Matemática del vuelo (módulo puro)

**Files:**
- Create: `src/components/web-sections/edificio-3d/scene/introFlight.js`
- Test: `tests/intro-drone.test.mjs`

**Interfaces:**
- Consumes: `LOT` de `buildings/vivra-guemes/config.js`, `CONTEXT_FULL_HEIGHT` de `architecture/viewCorridor.js`.
- Produces:
  - `INTRO = { duration: 8, startAltitude: 6000, startPolarDeg: 3, sweepDeg: 25 }`
  - `NORTH = [-0.3389946, -0.9407883]` (norte geográfico en el plano local x, z)
  - `introPose(t: number, home: {position: number[3], target: number[3], fov: number}) → {position: number[3], target: number[3], fov: number}`
  - `introLayers(altitude: number, t: number) → { satellite: number, contextHeight: number, maquette: number, fogScale: number }`
  - `FINAL_LAYERS = introLayers(0, 1)`

- [ ] **Step 1: Tests que fallan**

```js
const home = { position: [17, 20, -92], target: [0, 16, 9], fov: 35 }
test('flight starts high, near-vertical and north-up', () => {
  const p = introPose(0, home)
  assert.ok(Math.abs(p.position[1] - 6000) < 300)
  const dx = p.target[0] - p.position[0], dz = p.target[2] - p.position[2]
  const h = Math.hypot(dx, dz)
  assert.ok(h / p.position[1] < Math.tan((4 * Math.PI) / 180))
  assert.ok((dx * NORTH[0] + dz * NORTH[1]) / h > 0.99) // la pantalla mira al norte
})
test('flight lands exactly on the home view', () => {
  const p = introPose(1, home)
  for (const k of ['position', 'target']) p[k].forEach((v, i) => assert.ok(Math.abs(v - home[k][i]) < 1e-6))
  assert.equal(p.fov, home.fov)
})
test('altitude always decreases and the tilt comes late', () => {
  let last = Infinity
  for (let i = 0; i <= 100; i++) {
    const p = introPose(i / 100, home)
    assert.ok(p.position[1] < last); last = p.position[1]
    if (i <= 60) {
      const h = Math.hypot(p.target[0] - p.position[0], p.target[2] - p.position[2])
      assert.ok(Math.atan2(h, p.position[1] - p.target[1]) < (20 * Math.PI) / 180)
    }
  }
})
test('layers: photo and maquette above, real neighborhood below', () => {
  assert.deepEqual(introLayers(6000, 0), { satellite: 1, contextHeight: 0, maquette: 1, fogScale: 20 })
  assert.deepEqual(FINAL_LAYERS, { satellite: 0, contextHeight: CONTEXT_FULL_HEIGHT, maquette: 0, fogScale: 1 })
  assert.equal(introLayers(400, 0.7).satellite > 0 && introLayers(400, 0.7).satellite < 1, true)
})
```

- [ ] **Step 2:** `node --test tests/intro-drone.test.mjs` → FAIL.
- [ ] **Step 3: Implementar.** Coordenadas esféricas alrededor del punto de mira: distancia interpolada en escala logarítmica (de `startAltitude / cos(startPolar)` a la distancia de `home`) con easing; ángulo polar de `startPolarDeg` al de `home` con `smoothstep(0.55, 1, t)`; acimut del que pone `NORTH` arriba al de `home` por el camino corto, más `sweepDeg · sin(π·t)` de giro extra que vuelve a 0 al final. Punto de mira: de `[0, 0, LOT.depth / 2]` a `home.target`. fov constante `home.fov`. En `t = 1` devolver `home` copiado (sin error numérico).
  Capas: `satellite = smoothstep(250, 600, altitude)` (1 arriba de 600 m, 0 abajo de 250 m); `rise = smoothstep` en log(altura) entre 1500 m (0) y 300 m (1), `contextHeight = rise === 1 ? CONTEXT_FULL_HEIGHT : 120 · rise³`; `maquette = 1 − smoothstep(0.85, 1, t)`; `fogScale = max(1, altitude / 300)`.
- [ ] **Step 4:** `node --test tests/intro-drone.test.mjs` → PASS.
- [ ] **Step 5: Commit** `feat(edificio-3d): trayectoria y capas del vuelo de entrada`

### Task 4: Vuelo en la escena

**Files:**
- Create: `src/components/web-sections/edificio-3d/context/Satellite.jsx`
- Modify: `scene/CameraRig.jsx`, `scene/Scene.jsx`, `scene/SceneEnvironment.jsx`, `interiors/Prewarm.jsx`

**Interfaces:**
- Consumes: `SATELLITE` (Task 2); `INTRO`, `introPose`, `introLayers`, `FINAL_LAYERS` (Task 3); `corridor` de `architecture/viewCorridor.js`.
- Produces:
  - `Satellite = forwardRef(() => mesh)`: plano `SATELLITE.size` en y = 0,05, `MeshBasicMaterial` con la foto, `transparent`, `depthWrite: false`, `fog: true`. Cuadrado interior ±800 m y anillo exterior como dos mallas que comparten la textura (UV sobre la foto completa); el ref expone `setMix(v)`, que cambia solo la opacidad del interior.
  - `CameraRig` recibe la prop `onIntroFrame(layers, altitude)` (la pasa `Scene`) y expone `rig.playIntro({ onEnd(), freezeAt?: number })` y `rig.skipIntro()`.
  - `Scene` recibe `intro: 'flying' | 'done' | 'off'` y `onIntroEnd()`; monta `<Satellite>` solo con `intro === 'flying'`, dentro del `Suspense` (la carga espera la foto).
  - `SceneEnvironment` acepta `skyRef` para escalar el domo del cielo.
  - `Prewarm` recibe `enabled` y arranca su temporizador recién cuando es `true`.

- [ ] **Step 1: `playIntro` en CameraRig.** Deshabilita `OrbitControls` (`enabled = false`), corre `fly(INTRO.duration, …)` y en cada cuadro aplica `introPose(t, homeView(aspect actual))` a la cámara y al punto de mira; llama `onIntroFrame(introLayers(altitud, t), altitud)`. Al terminar o con `skipIntro()`: `apply('general', false)`, controles habilitados, `onIntroFrame(FINAL_LAYERS, altitud final)`, `onEnd()` una sola vez. Con `freezeAt` (solo DEV) se queda en ese `t` sin terminar.
- [ ] **Step 2: Capas en Scene.** El `onIntroFrame(layers, altitude)` que Scene pasa a CameraRig: `corridor.uContextHeight.value = layers.contextHeight` (cuando no hay "Entorno bajo"); saturación `0.55 · (1 − maquette)` y lavado `0.14 + 0.36 · maquette`; niebla `fogRange × fogScale`; `camera.near = max(0.5, altitud / 200)`, `camera.far = max(3000, altitud · 10)` con `updateProjectionMatrix`; escala del cielo `max(4000, camera.far · 0.8)`; `satellite.setMix(layers.satellite)`; `gl.shadowMap.needsUpdate = true` cada vez que `contextHeight` cambió más de 5 m y al final. Pasa `intro !== 'flying'` a `Prewarm`.
- [ ] **Step 3: Verificación visual a mitad de camino.** Agregar en DEV `?intro=<0..1>` → `freezeAt`. Con el servidor en un puerto libre y el script de capturas (memoria `webgl-screenshot-validation`), capturar `?hora=dia&intro=0`, `0.4`, `0.7`, `0.9` y sin parámetro (vuelo completo). Esperado: en 0 la foto llena la pantalla con la Cañada visible y sin bordes; en 0,4 aparecen las huellas del barrio; en 0,7 los edificios crecen, sin cielo cortado ni parpadeo del piso; en 0,9 la vista es casi la general con el barrio en tono maqueta; al final la escena es idéntica a la captura actual de `general.png`. Además: cambiar el viewport de 1440×900 a 900×1200 a mitad del vuelo → aterriza en el encuadre vertical sin salto.
- [ ] **Step 4:** Repetir las capturas 0 y final con `?hora=noche` y con `?calidad=minima`.
- [ ] **Step 5:** `node --test tests/*.test.mjs` y `pnpm eslint <archivos tocados>` → sin errores nuevos.
- [ ] **Step 6: Commit** `feat(edificio-3d): vuelo de entrada sobre la foto satelital`

### Task 5: Interfaz del vuelo (Saltar, aterrizaje, accesibilidad)

**Files:**
- Modify: `Edificio3D.jsx`, `ui/Overlay.jsx`, `ui/FloorPicker.jsx`

**Interfaces:**
- Consumes: `rig.playIntro`, `rig.skipIntro`; prop `intro` de `Scene` (Task 4).
- Produces: estado `intro` en `Edificio3D`: `'pending' → 'flying' → 'done'`, o `'off'` de entrada si `matchMedia('(prefers-reduced-motion: reduce)')` coincide o hay `?intro=no`. `Overlay` recibe `intro` y `onSkipIntro`; `FloorPicker` recibe `invite: boolean`.

- [ ] **Step 1: Arranque.** Cuando `ready` es `true` y `intro === 'pending'`, esperar los 600 ms del fundido de `LoadingScreen`, pasar a `'flying'` y llamar `rig.current.playIntro({ onEnd, freezeAt })` (`freezeAt` sale de `?intro=` en DEV). `onEnd` → `'done'` y `invite = true` durante 5 s.
- [ ] **Step 2: Saltar.** Mientras `intro === 'flying'`: `pointerdown` sobre el lienzo, `wheel` y `keydown` en `window` llaman `rig.current.skipIntro()` (listeners agregados y quitados con el estado). En `Overlay`, la barra de horas, el botón "Restablecer vista", la barra de vistas y el selector de pisos quedan `opacity-0 pointer-events-none` (con transición de 500 ms); el título queda; un botón "Saltar" ocupa el lugar de la barra de vistas, con el mismo estilo de píldora.
- [ ] **Step 3: Invitación.** Con `invite`, `FloorPicker` muestra una píldora "Elegí tu unidad" pegada al selector (a la izquierda de la columna en escritorio, arriba de la tira en celular) y un anillo que late (`animate-pulse`, `ring-2 ring-one`). Desaparece a los 5 s o con el primer hover o clic en un piso.
- [ ] **Step 4: Verificación.** Capturas a 1440×900 y 390×844: durante el vuelo (`?intro=0.5`) solo se ven el título y "Saltar"; al aterrizar aparece la invitación. Probar con Playwright: clic en "Saltar" a los 2 s y otra vez apenas empieza el vuelo → en menos de 300 ms la cámara está en la vista general, la niebla y near/far son los normales (`window.__edificio3d.get()`) y los controles responden a un arrastre; tocar "Entorno bajo" después de aterrizar → el barrio baja desde la altura completa; `emulateMedia({ reducedMotion: 'reduce' })` → no hay pedido de `satelite.jpg` en la red y la escena abre en la general.
- [ ] **Step 5:** `node --test tests/*.test.mjs`, `pnpm eslint <archivos tocados>`, `pnpm build` → sin errores nuevos; anotar el tamaño de `dist` contra `main` (solo debe sumar la foto y unos KB de JS).
- [ ] **Step 6: Commit** `feat(edificio-3d): saltar el vuelo e invitar a elegir unidad al aterrizar`
