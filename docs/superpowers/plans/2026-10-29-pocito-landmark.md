# Pocito landmark implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a recognizable, lightweight representation of Pocito as it currently stands, as the user selected in chat.

**Architecture:** Procedural, opaque geometry merged by material. Keep the known first-tower footprint from OSM, use its documented 105 m height, represent the second tower as an unfinished frame near the September 2026 reported level 29, and retain the commercial podium and static cranes. Replace generic volumes only within the Pocito construction parcel. Preserve the school at the parcel's northern edge.

**Tech Stack:** Existing Three.js, React Three Fiber, merged boxes and shared context-tone uniforms. No new dependencies or downloaded models/textures.

**Spec:** User request to represent Pocito beyond Belgrano, explicitly choosing its present appearance rather than the completed three-tower project.

## Global constraints

- Continue on `feat/edificio-3d`, preserve prior edits and corrected neighborhood heights.
- Main footprint: local x=161.8..207.7, z=80.2..101.2 (OSM way 1352630863, height=105 m).
- Parcel: OSM way 689232652, between Turrado Juárez and Vélez Sarsfield; do not place it directly on Belgrano.
- Secondary tower placement/proportions are approximate, based on current aerial photographs and September 2026 progress. Do not add the unbuilt third tower.
- At most six opaque material batches plus one small locally drawn sign. No continuous animations, dynamic lights or shadow casting for this distant landmark.

## Review focus

- Replacement filtering must keep the neighboring school and surrounding buildings.
- The tower must retain its real taller silhouette, independent of the recent 14-floor contextual cap.
- Glass, frame, podium and unfinished tower must be readable from neighborhood viewing distance.
- Own geometry, textures and materials must be disposed without affecting shared materials.
- General/floor views and quality adaptation must keep working.

### Task 1: Geometry and site integration

**Files:** Create `context/pocito.js`, `context/Pocito.jsx`, `tests/pocito.test.mjs`; modify `context/UrbanContext.jsx`.

**Interfaces:** `buildPocito()` returns the existing box-list structure. `replacesPocitoVolume({ p })` identifies generic volumes within the parcel. `Pocito` renders a stable memoized landmark.

- [ ] Write failing tests for parcel replacement (including the school boundary), actual first-tower placement/height, unfinished second tower, and bounded merged geometry cost.
- [ ] Implement the static procedural geometry and opaque material palette; add a small canvas sign.
- [ ] Filter only replaced context volumes and render the landmark within UrbanContext.
- [ ] Run the full Node suite and changed-file lint.

### Task 2: Visual and delivery verification

- [ ] Check the actual app from a view toward Belgrano/Pocito, including day/night and ordinary VIVRA views.
- [ ] Run a production build, compare compressed chunk size, and check for new shader errors.
- [ ] Obtain an independent review of the isolated change, addressing important findings before completion.

## Sources

- https://www.openstreetmap.org/way/1352630863 — constructed first tower footprint and 105 m height.
- https://www.openstreetmap.org/way/689232652 — construction parcel.
- https://sites.google.com/view/POCITO/ — latest September 2026 report: first tower finishing; second tower level +29; basamento B1 construction.
- https://www.anodal.com.ar/obras/pocito-social-life — current aerial photographs and glass facade.
- https://grupoproaco.com/emprendimientos/pocito — official development identity and project layout.
