"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

function DataCluster() {
  const points = useRef<THREE.Group>(null);
  const { scrollYProgress } = useScroll();

  // Transform scroll into a "clumping" factor
  const spread = useTransform(scrollYProgress, [0.6, 0.9], [5, 1]);

  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += 0.01;
      const s = spread.get();
      points.current.children.forEach((child, i) => {
        child.position.set(
          Math.sin(i) * s,
          Math.cos(i) * s,
          Math.sin(i * 0.5) * s,
        );
      });
    }
  });

  return (
    <group ref={points}>
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Signature() {
  return (
    <section className="h-[150vh] flex flex-col items-center justify-center relative bg-transparent overflow-hidden">
      {/* Content Layer */}
      <motion.div className="sticky top-1/2 -translate-y-1/2 text-center z-10 pointer-events-none px-6">
        <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase mb-6 bg-linear-to-b from-white to-blue-500 bg-clip-text text-transparent">
          Intelligence <br /> That Adapts
        </h2>
        <p className="max-w-md mx-auto text-slate-400 text-lg md:text-xl font-light">
          Watch entropy becoming order. As you navigate, Xai’s engine clusters
          raw data into geometric certainty.
        </p>
      </motion.div>

      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <DataCluster />
        </Canvas>
      </div>
    </section>
  );
}
