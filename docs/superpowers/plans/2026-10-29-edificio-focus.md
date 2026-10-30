# VIVRA visual focus implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Give VIVRA clearer visual priority while preserving loading speed and interaction responsiveness.

**Architecture:** Keep the existing merged geometry, shared textures, demand rendering and adaptive quality. Attach per-building bounds to contextual geometry and use the existing camera uniforms to dissolve only obstructing buildings, with the same screen-space coverage across their walls, roofs and windows. Muted contextual materials and a more frontal aerial angle complete the change.

**Tech Stack:** Existing React, React Three Fiber, Three.js and Vite. Node's built-in test runner; no new dependencies or downloaded assets.

**Spec:** The proposal in this chat, approved by the user's request to implement on the same branch: softer surroundings, selective fading, improved aerial framing.

## Global constraints

- Work on the existing `feat/edificio-3d` branch and preserve all pre-existing changes.
- Preserve on-demand rendering, geometry batching and shared texture resources.
- Do not add continuous animation, extra render passes or asset requests.
- Leave changes available for review without committing the user's pre-existing untracked feature.

## Review focus

- Neighbor windows, railings and roofs must fade together without affecting VIVRA materials.
- Buildings fully behind the focus point must remain visible; general, pedestrian, office and floor views must work.
- Day, sunset and night must retain readable lighting and window illumination.
- Unrelated tower and street geometry must avoid the new attributes and material treatment.
- Shader composition, clipping planes and material disposal must preserve existing behavior.

### Task 1: Context visibility and geometry metadata

**Files:** `architecture/boxes.js`, `architecture/interiorGlass.js`, `architecture/buildingBounds.js`, `architecture/viewCorridor.js`, `context/neighbors.js`, `context/UrbanContext.jsx`, `scene/ViewCorridor.jsx`, `tests/edificio-focus.test.mjs`.

**Interfaces:** `list.building(build)` groups geometry by a single physical building; `tagBuildingBounds(geometry, min, max)` writes immutable per-vertex bounds; `createContextMaterial(base)` shares textures, cut planes and original shader uniforms while adding the contextual shader.

- [x] Write and run failing geometry/material integration tests: separate bounds survive material merging, panes receive matching bounds, tower geometry is untouched, custom shaders and shared resources survive wrapping.
- [x] Implement per-building tags for all six detailed neighbors and extruded surroundings.
- [x] Replace abrupt corridor discard with a smooth screen-space dissolve, preserving opaque batching. Update camera vectors in place.
- [x] Run `node --test tests/edificio-focus.test.mjs`; all cases must pass.

### Task 2: Visual balance and verification

**Files:** `architecture/textures.js`, `architecture/Materials.jsx`, `context/UrbanContext.jsx`, `scene/CameraRig.jsx`.

- [x] Reduce visual contrast/saturation of contextual buildings, keeping VIVRA's materials intact and night treatment restrained.
- [x] Adjust the aerial angle to show more facade and less obstruction from the adjacent building.
- [x] Compare production build output against baseline; no extra downloaded assets or render passes.
- [x] Verify desktop general/aerial/front/offices, an open floor and night through the running app; inspect shader errors.
- [x] Run targeted tests, lint changed files and production build; report pre-existing warnings separately.
- [x] Request an independent review of the change against the saved source baseline and address material findings.

## Progress

- Baseline source copied to `/tmp/vivra-focus-before/edificio-3d` before implementation.
- User selected direct implementation in the current branch; continue through verification without another approval step.

- Completed: Node suite 3/3, changed-file lint clean, production build successful. Existing build warnings remain unchanged.
- Real WebGL regression fixture: 4/4 cases pass, including fully background buildings 10 cm, 1 m and 3 m beyond the focus plane. The review finding was reproduced before fixing.
- Browser checks: general, aerial, street, offices, floor 10 and night render correctly without new shader errors. Existing development websocket configuration requires a refresh to receive changes.
- Cost: approximately 1.1 KB additional compressed JavaScript and 1.6 MB generated bounds buffers for detailed neighbors; no downloaded assets, render passes or extra neighbor meshes. No cross-device FPS benchmark was performed.
- Independent review: one P2 background-fade boundary fixed and verified; no remaining findings.

## Correction: keep the immediate neighbors

The user reported that the adjacent buildings disappeared. The projection corridor was treating these detailed linderos as complete occluders even in the home view. Immediate neighbors now receive only the softer color treatment, with fading disabled and a separate shader cache key; generic contextual occluders keep their corridor behavior. The real WebGL regression reproduced 0/256 visible pixels before the fix and 256/256 after. All five graphical cases and the three Node tests pass.

## User-supplied height correction

The second building to the left when viewing the Pueyrredón front (context footprint x=22.0..52.4, z=0.1..18.4; current index 3802) matches the roof height of the immediate beige neighbor. Corrected contextData.json height from 66.2 m to 41.25 m, equal to that neighbor’s 4.2 m ground floor plus 13 × 2.85 m floors. Footprint and all other context records are unchanged. Preserve this correction if regenerating the geographic context.

## User-supplied nearby skyline correction

The user identified the exaggerated contextual towers in a screenshot and specified about 14 floors in general. The 35 nearby contextual volumes above 43.2 m (not marked far) are now capped at 43.2 m, an approximate 14-storey reference. Lower buildings, distant context, footprints, and the earlier 41.25 m correction remain unchanged. This only edits existing height data and adds no runtime work or assets. Preserve the corrections if regenerating contextData.json.
