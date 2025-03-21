"use client";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { Environment } from "@react-three/drei";
import { Model } from "./model";

const Scene = () => {
  return (
    <Canvas
      shadows
      camera={{
        fov: 10,
        position: [40, 20, 33],
      }}
    >
      <Model />
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} color={"#0461ec"} />
      <pointLight position={[0, 0, 15]} color={"#555"} />
    </Canvas>
  );
};

export default Scene;
