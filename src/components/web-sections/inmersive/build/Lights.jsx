// Componente de luz direccional optimizado
export function DirectionalLight() {
  return (
    <directionalLight
      position={[10, 15, 10]}
      intensity={5}
      castShadow
      shadow-mapSize={window.innerWidth < 768 ? [512, 512] : [2048, 2048]}
      shadow-camera-far={50}
      shadow-camera-left={-15}
      shadow-camera-right={15}
      shadow-camera-top={15}
      shadow-camera-bottom={-15}
      shadow-bias={-0.0005}
      shadow-radius={4}
    />
  )
}

// Configuración de todas las luces de la escena
export function SceneLights() {
  return (
    <>
      {/* Luz ambiente base */}
      <ambientLight intensity={0.04} />

      {/* Luz direccional principal con sombras */}
      <DirectionalLight />

      {/* Luz hemisférica para simular cielo y tierra */}
      <hemisphereLight intensity={1} color="#ffffff" groundColor="#666666" />

      {/* Luz de relleno suave desde otro ángulo */}
      <directionalLight position={[-5, 8, -8]} intensity={0.1} color="#b8d4ff" />
    </>
  )
}
