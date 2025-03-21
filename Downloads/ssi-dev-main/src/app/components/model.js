import React, { useRef } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import {
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshStandardMaterial,
} from "three";

export function Model(props) {
  const { nodes, materials } = useGLTF("models/interiorA.glb");
  return (
    <group {...props} dispose={null} position={(0, 0, 0)}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials.Material}
        position={[0, 0.133, -0.021]}
        scale={[6, 0.059, 1.648]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube001.geometry}
        material={materials["Material.020"]}
        position={[0, 1.39, -1.583]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[6, 0.059, 1.201]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube003.geometry}
        material={materials["Material.020"]}
        position={[1.257, 1.39, 0.05]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={[1.564, 0.059, 1.201]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004.geometry}
        material={materials.uveg}
        position={[0.24, 0.772, -1.089]}
        scale={0.309}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube005.geometry}
        material={materials["Material.002"]}
        position={[2.454, 2.203, -1.089]}
        scale={[1.082, 0.375, 0.441]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube006.geometry}
        material={materials["Material.055"]}
        position={[0.24, 1.122, -1.089]}
        scale={[0.249, 0.064, 0.249]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007.geometry}
        material={materials["Material.020"]}
        position={[-5.956, 1.39, 0.05]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={[1.564, 0.059, 1.201]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube011.geometry}
        material={materials["Material.002"]}
        position={[2.835, 0.658, -1.089]}
        scale={[0.693, 0.379, 0.441]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube012.geometry}
        material={materials["Material.025"]}
        position={[2.835, 0.236, -1.089]}
        scale={[0.651, 0.064, 0.414]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube013.geometry}
        material={materials.blanco}
        position={[2.835, 1.037, -1.089]}
        scale={[0.702, 0.015, 0.457]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube014.geometry}
        material={nodes.Cube014.material}
        position={[4.734, 1.399, -1.489]}
        rotation={[0, 0, -Math.PI]}
        scale={[-1.113, -1.128, -0.028]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube015.geometry}
        material={materials["Material.020"]}
        position={[5.954, 1.39, 0.05]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={[1.564, 0.059, 1.201]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube016.geometry}
        material={materials.Baseboard}
        position={[4.734, 1.002, -1.254]}
        rotation={[0, 0, -Math.PI]}
        scale={[-0.794, -0.038, -0.193]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube017.geometry}
        material={materials["Material.002"]}
        position={[4.734, 0.77, -1.294]}
        rotation={[0, 0, -Math.PI]}
        scale={[-0.826, -0.023, -0.19]}
      />
      <group
        position={[4.734, 1.646, -1.321]}
        rotation={[0, 0, -Math.PI]}
        scale={[-0.734, -0.419, -0.017]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube018_1.geometry}
          material={materials["Material.039"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube018_2.geometry}
          material={materials["Material.040"]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube019.geometry}
        material={materials["Material.021"]}
        position={[2.405, 1.399, -1.489]}
        rotation={[0, 0, -Math.PI]}
        scale={[-1.123, -0.49, -0.027]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube026.geometry}
        material={materials["Material.014"]}
        position={[-5.763, 0.577, 1.172]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={[-0.162, -0.145, -0.125]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube027.geometry}
        material={materials["Material.015"]}
        position={[-5.763, 0.716, 1.172]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={[-0.187, -0.166, -0.011]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube020.geometry}
        material={materials["Material.006"]}
        position={[0, 0.198, 0]}
        scale={[6, 0.013, 1.648]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder001.geometry}
        material={materials["Material.026"]}
        position={[0.24, 1.248, -1.295]}
        scale={[0.021, 0.095, 0.021]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder002.geometry}
        material={materials["Material.026"]}
        position={[0.24, 1.367, -1.225]}
        rotation={[Math.PI / 2, 0, Math.PI]}
        scale={[0.005, 0.053, 0.005]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube021.geometry}
        material={materials["Material.026"]}
        position={[0.24, 1.323, -1.188]}
        rotation={[-0.244, 0, 0]}
        scale={[0.014, 0.003, 0.083]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Toilet_Button_Cube012.geometry}
        material={materials.Toilet_Button}
        position={[1.002, 0.323, 0]}
        rotation={[Math.PI / 2, 0, -3.142]}
        scale={1.201}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Toilet_Seat_WC_Board_Cube003.geometry}
        material={materials.Toilet_Seat}
        position={[1.002, 0.323, 0]}
        rotation={[Math.PI / 2, 0, -3.142]}
        scale={1.201}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Toilet_WC_Cube002.geometry}
        material={materials.Toilet}
        position={[1.002, 0.323, 0]}
        rotation={[Math.PI / 2, 0, -3.142]}
        scale={1.201}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube022.geometry}
        material={materials["Material.020"]}
        position={[-1.575, 0.237, -0.872]}
        scale={[0.65, 0.057, 0.804]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube023.geometry}
        material={materials.lungo}
        position={[-1.562, 1.399, -1.52]}
        rotation={[0, 0, -Math.PI]}
        scale={[-0.638, -1.193, -0.033]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube024.geometry}
        material={materials["Material.026"]}
        position={[-0.914, 1.399, -1.489]}
        rotation={[0, 0, -Math.PI]}
        scale={[-0.012, -1.193, -0.033]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder003.geometry}
        material={materials["Material.026"]}
        position={[-1.641, 2.373, -1.45]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.021, 0.186, 0.021]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder004.geometry}
        material={materials["Material.026"]}
        position={[-1.452, 1.248, -1.509]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.021, 0.095, 0.021]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder005.geometry}
        material={materials["Material.026"]}
        position={[-1.683, 1.236, -1.509]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.021, 0.095, 0.021]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Semi-Sheer_Rod_Pocket_Curtains_-_Left"].geometry}
        material={materials["Semi-Sheer Rod Pocket Curtains"]}
        position={[-1.915, 1.115, -0.276]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.396, 0.905, 0.836]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Steel_Curtain_Rod001.geometry}
        material={materials["Material.019"]}
        position={[-0.231, 1.155, -1.457]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={[0.006, 0.031, 0.007]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane001.geometry}
        material={materials["Semi-Sheer Rod Pocket Curtains"]}
        position={[-0.503, 1.218, -1.457]}
        scale={[0.189, 0.377, 0.321]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube025.geometry}
        material={materials["Material.022"]}
        position={[3.193, 1.829, -0.628]}
        rotation={[0, 0, -Math.PI]}
        scale={[-0.369, -0.011, -0.008]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube028.geometry}
        material={materials["Material.023"]}
        position={[2.454, 1.829, -0.628]}
        rotation={[0, 0, -Math.PI]}
        scale={[-0.362, -0.011, -0.008]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube029.geometry}
        material={materials["Material.024"]}
        position={[1.715, 1.829, -0.628]}
        rotation={[0, 0, -Math.PI]}
        scale={[-0.369, -0.011, -0.008]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube030.geometry}
        material={materials["Material.055"]}
        position={[0.24, 0.963, -1.069]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={[0.286, 0.094, 0.286]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube031.geometry}
        material={materials["Material.055"]}
        position={[0.24, 0.769, -1.069]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={[0.286, 0.094, 0.286]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube032.geometry}
        material={materials["Material.055"]}
        position={[0.24, 0.575, -1.069]}
        rotation={[Math.PI, 0, Math.PI]}
        scale={[0.286, 0.094, 0.286]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder.geometry}
        material={materials["Material.026"]}
        position={[-1.869, 1.934, -0.278]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={[-0.009, -0.318, -0.009]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder006.geometry}
        material={materials["Material.032"]}
        position={[0.24, 0.967, -0.779]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.013, 0.01, 0.013]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder007.geometry}
        material={materials["Material.033"]}
        position={[0.24, 0.765, -0.779]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.013, 0.01, 0.013]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder008.geometry}
        material={materials["Material.034"]}
        position={[0.24, 0.569, -0.779]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.013, 0.01, 0.013]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube033.geometry}
        material={materials["Material.035"]}
        position={[-5.744, 0.632, 1.172]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={[-0.141, -0.126, -0.053]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube034.geometry}
        material={materials["Material.036"]}
        position={[-5.744, 0.522, 1.172]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={[-0.141, -0.126, -0.053]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder009.geometry}
        material={materials["Material.014"]}
        position={[-5.617, 0.634, 1.178]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={[0.012, 0.009, 0.012]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder010.geometry}
        material={materials["Material.014"]}
        position={[-5.617, 0.523, 1.178]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={[0.012, 0.009, 0.012]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder012.geometry}
        material={materials["Material.054"]}
        position={[5.964, 1.041, -0.128]}
        rotation={[Math.PI / 2, 0, 1.024]}
        scale={0.134}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube035.geometry}
        material={materials["Material.002"]}
        position={[4.734, 1.002, -1.295]}
        rotation={[0, 0, -Math.PI]}
        scale={[-0.818, -0.056, -0.23]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder013.geometry}
        material={materials["Material.016"]}
        position={[4.712, 1, -1.069]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.013, 0.01, 0.013]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube002.geometry}
        material={materials["Material.020"]}
        position={[-2.28, 1.39, 0.05]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={[1.564, 0.059, 1.201]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.back_Cube002.geometry}
        material={materials.wood}
        position={[-4.787, 0.17, -0.203]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.big_blanket_Cube003.geometry}
        material={materials["pilows/big_blanket"]}
        position={[-4.787, 0.17, -0.203]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.big_pillow02_Plane006.geometry}
        material={materials["pilows/big_blanket"]}
        position={[-4.787, 0.17, -0.203]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.big_pillow_Plane004.geometry}
        material={materials["pilows/big_blanket"]}
        position={[-4.787, 0.17, -0.203]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.frame_Cube001.geometry}
        material={materials.wood}
        position={[-4.787, 0.17, -0.203]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.legs02_Cylinder001.geometry}
        material={materials.metal}
        position={[-4.787, 0.17, -0.203]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.legs_Cylinder.geometry}
        material={materials.metal}
        position={[-4.787, 0.17, -0.203]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.matress_Plane001.geometry}
        material={materials["pilows/big_blanket"]}
        position={[-4.787, 0.17, -0.203]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.small_blanket_Plane010.geometry}
        material={materials.big_blanket}
        position={[-4.787, 0.17, -0.203]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.small_pillow01_Plane007.geometry}
        material={materials.big_blanket}
        position={[-4.787, 0.17, -0.203]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.small_pillow02_Plane008.geometry}
        material={materials.pilows_small}
        position={[-4.787, 0.17, -0.203]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.small_pillow03_Plane009.geometry}
        material={materials.big_blanket}
        position={[-4.787, 0.17, -0.203]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <OrbitControls
        maxPolarAngle={Math.PI / 2}
        maxDistance={100}
        minDistance={15}
      />
    </group>
  );
}

useGLTF.preload("models/interiorA.glb");
