import * as THREE from 'three'
import { getFloor, OFFICE_FLOORS, TOWER_FLOORS } from './catalog'
import floorUnits from './floorUnits.json'
import { readPlan } from './planImage'

// Leer una planta (muros, ventanas, solados) lleva tiempo de CPU: se hace una
// sola vez por imagen y, apenas carga la escena, se adelanta en segundo plano
// para que abrir un piso no congele la transición de cámara.

const cache = new Map()
const keyOf = (url, align) => `${url}|${align.front ?? ''}|${align.rear ?? ''}`

export function cachedPlan(url, image, align) {
  const key = keyOf(url, align)
  if (!cache.has(key)) cache.set(key, readPlan(image, align))
  return cache.get(key)
}

const idle = (fn) =>
  window.requestIdleCallback
    ? window.requestIdleCallback(fn, { timeout: 1500 })
    : setTimeout(fn, 60)

/** Precarga todas las plantas, de a una por momento libre del navegador. */
export function prewarmPlans(onTexture) {
  const jobs = [...TOWER_FLOORS, ...OFFICE_FLOORS].map((f) => ({
    url: floorUnits.floors[getFloor(f.id).plan].image,
    align: f.align
  }))
  const loader = new THREE.TextureLoader()
  let cancelled = false
  const next = (i) => {
    if (cancelled || i >= jobs.length) return
    const { url, align } = jobs[i]
    if (cache.has(keyOf(url, align))) return next(i + 1)
    loader.load(url, (texture) => {
      onTexture?.(url)
      idle(() => {
        if (cancelled) return
        cachedPlan(url, texture.image, align)
        texture.dispose()
        idle(() => next(i + 1))
      })
    })
  }
  idle(() => next(0))
  return () => {
    cancelled = true
  }
}
