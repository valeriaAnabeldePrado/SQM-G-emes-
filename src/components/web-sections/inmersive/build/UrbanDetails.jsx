// Piso/suelo con textura
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, -2]} position={[0, -0.3, 0]} receiveShadow>
      <planeGeometry args={[1000, 10000]} />
      <meshStandardMaterial color="grey" roughness={0.9} metalness={0.1} />
    </mesh>
  )
}

// Componente principal con todos los detalles urbanos
export function UrbanDetails() {
  return (
    <>
      <Ground />
    </>
  )
}
