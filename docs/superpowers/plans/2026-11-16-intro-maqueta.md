# Vuelo corto y barrio en maqueta — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Sacar la foto satelital, acortar el vuelo a ~5 s desde ~1.000 m sobre el mapa del modelo y dejar el barrio en tono maqueta como aspecto normal.

**Architecture:** `introFlight.js` pierde la capa `satellite` y la `maquette`; el tono del barrio pasa a una función pura `contextTone(night, level)` en `viewCorridor.js` que usa `applyNight` (Materials.jsx) siempre. `useIntroLayers` solo maneja altura del barrio, niebla, planos de cámara y Pocito.

**Spec:** `docs/superpowers/specs/2026-11-16-intro-drone-design.md` (sección "Revisión 2026-11-16").

## Global Constraints
- VIVRA y sus materiales no cambian. Saltar, invitación y reducir movimiento quedan igual.
- `MAQUETTE` (0 = como antes, 1 = blanco total) es el único valor que regula el tono; en DEV `?maqueta=<0..1>` lo pisa para comparar.
- Sin foto: se borran `context/Satellite.jsx`, `context/satellite.js`, `public/edificio-3d/satelite.jpg`, `scripts/edificio-3d/bake-satellite.py` y el crédito de Sentinel-2.

## Review Focus
- Saltar en cualquier momento deja niebla, near/far y altura del barrio normales.
- "Entorno bajo" sigue funcionando con el tono nuevo.
- De noche las ventanas encendidas de VIVRA siguen destacando.

### Task 1: Tono maqueta permanente
**Files:** `architecture/viewCorridor.js`, `architecture/Materials.jsx`, `tests/intro-drone.test.mjs`
**Produces:** `MAQUETTE = 0.6`, `contextTone(night: number, level = MAQUETTE) → { wash, saturation }`.
- [ ] Test: `contextTone(0, 0)` = `{ wash: 0.14, saturation: 0.55 }` (el tono de hoy); `contextTone(0, 1)` = `{ wash: 0.5, saturation: 0 }`; `contextTone(1, 0)` = `{ wash: 0.14 * 0.06, saturation: 0.8 }` (la noche de hoy). Correr → FAIL.
- [ ] Implementar: `wash = (0.14 + 0.36·level)·(1 − 0.94·night)`, `saturation = (0.55 + 0.25·night)·(1 − level)`. `applyNight` lo usa; `level` sale de `?maqueta=` en DEV o `MAQUETTE`. Correr → PASS.

### Task 2: Vuelo corto sin foto
**Files:** `scene/introFlight.js`, `scene/Scene.jsx`, `scene/SceneEnvironment.jsx`, `ui/Overlay.jsx`, borrar los archivos de la foto, `tests/intro-drone.test.mjs`
- [ ] Tests: `introPose(0)` a 1.000 m (±50), norte arriba, casi cenital; aterriza exacto; altura siempre baja; inclinación tarde. `introLayers(1000, 0)` = `{ contextHeight: 0, fogScale: 1000 / 300 }`; `FINAL_LAYERS` = `{ contextHeight: CONTEXT_FULL_HEIGHT, fogScale: 1 }`; `introLayers(400, 0.5).contextHeight` entre 0 y 120. Borrar el test de la imagen. Correr → FAIL.
- [ ] `INTRO = { duration: 5, startAltitude: 1000, … }`; crecimiento entre 700 y 200 m. Sacar `satellite` y `maquette` de las capas; sacar del `Scene` la foto, el tono capturado y la escala del cielo (a 1.000 m la cámara queda dentro del domo). Correr → PASS.

### Task 3: Verificación
- [ ] Capturas `?intro=0`, `0.5`, `0.9`, aterrizaje, noche, y `?intro=no&maqueta=0.3|0.6|1` para elegir el tono con el usuario.
- [ ] Suite completa, lint de `edificio-3d`, `pnpm build`. Commit.
