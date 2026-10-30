import { Environment, Lightformer, Sky } from '@react-three/drei'

function SkyDome({ sky, distance }) {
  return (
    <Sky
      distance={distance}
      sunPosition={sky.sun.toArray()}
      turbidity={sky.turbidity}
      rayleigh={sky.rayleigh}
      mieCoefficient={sky.mie}
      mieDirectionalG={sky.mieG}
    />
  )
}

/**
 * Cielo de fondo + luz ambiente/reflejos.
 * De día: HDRI urbano real (Poly Haven, CC0), sin mostrarlo como fondo para no
 * mezclar otra ciudad con Córdoba. Al atardecer y de noche el mapa de entorno
 * se genera con el mismo cielo (más un suelo y, de noche, el resplandor de la
 * ciudad), así los reflejos coinciden con el cielo sin descargar nada más.
 */
export function SceneEnvironment({ preset }) {
  const { sky, environment, fog } = preset
  return (
    <>
      <SkyDome sky={sky} distance={4000} />
      <fog attach="fog" args={[fog, 260, 780]} />
      {environment.file ? (
        <Environment
          key="hdri"
          files={environment.file}
          environmentIntensity={environment.intensity}
        />
      ) : (
        <Environment
          key={environment.key}
          frames={1}
          resolution={128}
          environmentIntensity={environment.intensity}
        >
          <SkyDome sky={sky} distance={400} />
          <mesh rotation-x={-Math.PI / 2} position-y={-2}>
            <circleGeometry args={[300, 24]} />
            <meshBasicMaterial color={environment.cityGlow ? '#151821' : '#5b4e45'} />
          </mesh>
          {environment.cityGlow ? (
            <>
              <Lightformer
                form="ring"
                intensity={1.6}
                color="#ffb867"
                scale={260}
                position={[0, -6, 0]}
                rotation-x={-Math.PI / 2}
              />
              <Lightformer
                form="rect"
                intensity={0.8}
                color="#ffcf8f"
                scale={[400, 12]}
                position={[0, 8, -180]}
              />
              <Lightformer
                form="rect"
                intensity={0.8}
                color="#ffcf8f"
                scale={[400, 12]}
                position={[0, 8, 180]}
                rotation-y={Math.PI}
              />
            </>
          ) : (
            <></>
          )}
        </Environment>
      )}
    </>
  )
}
