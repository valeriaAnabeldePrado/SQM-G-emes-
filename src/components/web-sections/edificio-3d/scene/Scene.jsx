import { memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { BakeShadows, Bvh } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { MaterialsProvider } from '../architecture/Materials'
import Building from '../buildings/vivra-guemes/Building'
import { floorAtPoint, getFloor } from '../interiors/catalog'
import { FloorHighlight } from '../interiors/FloorHighlight'
import { FloorInterior } from '../interiors/FloorInterior'
import { Prewarm } from '../interiors/Prewarm'
import { StreetLabels } from '../context/StreetLabels'
import { UrbanContext } from '../context/UrbanContext'
import { CameraRig } from './CameraRig'
import { Lighting } from './Lighting'
import { DynamicResolution, QualityMonitor } from './Performance'
import { QUALITY_TIERS } from './quality'
import { SceneEnvironment } from './SceneEnvironment'
import { ViewCorridor } from './ViewCorridor'
import { skyState } from './timeOfDay'

/**
 * Post-procesado: oclusión ambiental (oscurece encuentros, bajo-balcones y
 * juntas, que es lo que más realismo da en arquitectura), bloom solo para las
 * luces de la noche, tone mapping ACES y SMAA (mucho más barato que MSAA).
 */
function Effects({ ao, bloom, smaa }) {
  return (
    <EffectComposer multisampling={0}>
      {ao ? (
        <N8AO
          aoRadius={1.6}
          distanceFalloff={0.8}
          intensity={2.4}
          quality={ao.quality}
          halfRes={ao.halfRes}
        />
      ) : (
        <></>
      )}
      {bloom > 0 ? (
        <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.3} intensity={bloom} />
      ) : (
        <></>
      )}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      {smaa ? <SMAA /> : <></>}
    </EffectComposer>
  )
}

/**
 * Avisa cuando todo lo de su Suspense terminó de cargar, después del primer
 * cuadro dibujado con eso (para que la pantalla de carga no deje ver un hueco).
 */
function ReadySignal({ onReady }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    invalidate()
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(onReady)
    })
    return () => cancelAnimationFrame(frame)
  }, [invalidate, onReady])
  return null
}

// Al mover la hora la escena se re-renderiza seguido: lo pesado solo cuando cambia
const MemoBuilding = memo(Building)
const MemoUrbanContext = memo(UrbanContext)
const MemoStreetLabels = memo(StreetLabels)

export function Scene({
  rigRef,
  isMobile,
  quality,
  onTooSlow,
  onReady,
  date,
  hour,
  floor,
  hoverFloor,
  onHoverFloor,
  onOpenFloor,
  availability,
  selectedUnit,
  onSelectUnit
}) {
  const [tier, setTier] = useState(quality.tier)
  const decline = useCallback(() => setTier((t) => Math.max(0, t - 1)), [])
  const { dpr, ao, far, smaa, shadow } = QUALITY_TIERS[tier]
  const preset = useMemo(() => skyState(date, hour), [date, hour])
  // El bloom solo hace falta cuando hay luces encendidas, y no en calidades bajas
  const bloom = QUALITY_TIERS[tier].bloom ? preset.night * 0.8 : 0
  // Piso abierto: se recorta todo lo que está arriba de su losa, dentro del
  // volumen de la torre o del bloque de oficinas
  const open = getFloor(floor)
  const cut = open ? { y: open.base + 0.03, ...open.box } : null
  const cutY = cut?.y ?? null

  // Piso bajo el puntero (lo que está por encima del corte no cuenta: está recortado)
  const floorUnder = (e) => {
    const n = floorAtPoint(e.point)
    if (n == null || (cutY != null && e.point.y > cutY)) return null
    return n
  }

  return (
    <>
      <QualityMonitor
        enabled={!quality.forced}
        lowest={tier === 0}
        onDecline={decline}
        onTooSlow={onTooSlow}
      />
      <DynamicResolution dpr={dpr} />
      <CameraRig ref={rigRef} />
      <ViewCorridor />
      <Suspense fallback={null}>
        <SceneEnvironment preset={preset} />
        <MaterialsProvider night={preset.night} cut={cut}>
          <Lighting preset={preset} shadowMapSize={isMobile ? shadow / 2 : shadow} />
          {/* BVH: el puntero sobre el edificio (hover de pisos) sale barato */}
          <Bvh firstHitOnly>
            <group
              onPointerMove={(e) => {
                const n = floorUnder(e)
                if (n == null) return
                e.stopPropagation()
                onHoverFloor(n)
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={() => {
                onHoverFloor(null)
                document.body.style.cursor = ''
              }}
              onClick={(e) => {
                const n = floorUnder(e)
                if (n == null || n === floor) return
                e.stopPropagation()
                onOpenFloor(n)
              }}
            >
              <MemoBuilding />
            </group>
          </Bvh>
          <MemoUrbanContext night={preset.night} showFar={far} />
        </MaterialsProvider>
        <MemoStreetLabels night={preset.night} />
        <FloorHighlight id={hoverFloor === floor ? null : hoverFloor} availability={availability} />
        {floor == null ? null : (
          <Suspense fallback={null}>
            <FloorInterior
              key={floor}
              id={floor}
              availability={availability}
              selectedKey={selectedUnit ? `${selectedUnit.floor}-${selectedUnit.letter}` : null}
              onSelect={onSelectUnit}
            />
          </Suspense>
        )}
        {/* La escena es estática: las sombras se calculan una sola vez por momento del día */}
        <BakeShadows />
        <Effects ao={ao} bloom={bloom} smaa={smaa} />
        <Prewarm />
        <ReadySignal onReady={onReady} />
      </Suspense>
    </>
  )
}
