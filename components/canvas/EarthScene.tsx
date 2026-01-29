"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Stars, useTexture } from "@react-three/drei";
import { useScroll } from "framer-motion";
import * as THREE from "three";

// 1. GLOBAL SHADER DEFINITION
// Defined outside the component to ensure it is globally accessible and performant.
const CoronaShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#ffaa44") },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;

    // Simplex Noise for organic corona wispiness
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ * ns.x + ns.y;
      vec4 y = y_ * ns.x + ns.y;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      // Coordinate space for radial fade
      vec2 centerUv = vUv * 2.0 - 1.0;
      float dist = length(centerUv);

      // Noise-driven wispiness
      float angle = atan(centerUv.y, centerUv.x);
      float noise = snoise(vec3(cos(angle), sin(angle), uTime * 0.1)) * 0.15;
      float noise2 = snoise(vec3(centerUv * 2.5, uTime * 0.05)) * 0.1;

      // Realistic exponential falloff
      float glow = pow(smoothstep(1.0, 0.2, dist + noise + noise2), 5.0);
      
      // Masking the core sun area
      float mask = smoothstep(0.2, 0.25, dist);
      
      gl_FragColor = vec4(uColor, glow * mask);
    }
  `,
};

// 2. INTERNAL SCENE CONTENT
function SceneContent() {
  const earthGroupRef = useRef<THREE.Group>(null);
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const cloudMeshRef = useRef<THREE.Mesh>(null);
  const sunGroupRef = useRef<THREE.Group>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  const { scrollYProgress } = useScroll();

  // Loading all textures
  const [sunMap, nightMap, bumpMap, cloudMap] = useTexture([
    "/textures/2k_sun.jpg",
    "/textures/2k_earth_nightmap.jpg",
    "/textures/2k_earth_normal_map.jpg",
    "/textures/2k_earth_clouds.jpg",
  ]);

  useFrame((state) => {
    if (!earthGroupRef.current || !sunGroupRef.current || !shaderRef.current)
      return;

    const scroll = scrollYProgress.get();

    // Update shader time for organic corona movement
    shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;

    // ROTATION: Constant spin logic
    if (earthMeshRef.current) earthMeshRef.current.rotation.y += 0.0012;
    if (cloudMeshRef.current) cloudMeshRef.current.rotation.y += 0.0018;

    // MOVEMENT: Scroll reveal logic (Earth steps aside)
    const targetX = -scroll * 5;
    const targetY = scroll * 2;
    earthGroupRef.current.position.set(targetX, targetY, 0);
    earthGroupRef.current.scale.setScalar(1 + scroll * 0.3);

    // ALIGNMENT: Ensure corona always faces the camera
    sunGroupRef.current.lookAt(state.camera.position);
  });

  return (
    <>
      {/* THE SUN GROUP (Distant at Z: -150) */}
      <group position={[0, 0, -150]}>
        {/* Realistic Small Sun Core */}
        <mesh>
          <sphereGeometry args={[5, 64, 64]} />
          <meshBasicMaterial map={sunMap} />
        </mesh>

        {/* ORGANIC DIFFUSE CORONA (Plane-based fade) */}
        <group ref={sunGroupRef}>
          <mesh scale={[35, 35, 1]}>
            <planeGeometry />
            <shaderMaterial
              ref={shaderRef}
              args={[CoronaShaderMaterial]}
              transparent
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Global Point Light representing the Sun's radiance */}
        <pointLight intensity={2500} distance={800} color="#fff2cc" />
      </group>

      {/* THE EARTH GROUP (Foreground) */}
      <group ref={earthGroupRef}>
        {/* Main Earth Mesh */}
        <mesh ref={earthMeshRef}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial
            map={nightMap}
            emissiveMap={nightMap}
            emissive="#ffffff"
            emissiveIntensity={8}
            normalMap={bumpMap}
          />
        </mesh>

        {/* Atmosphere/Cloud Layer */}
        <mesh ref={cloudMeshRef} scale={1.015}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial
            alphaMap={cloudMap}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </>
  );
}

// 3. MAIN EXPORT
export default function EarthScene() {
  return (
    <div className="fixed inset-0 -z-10 bg-[#000105]">
      <Canvas shadows>
        {/* Adjusted Camera with high 'far' clipping for distant Sun */}
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 15]}
          fov={35}
          far={5000}
        />

        <Stars count={4000} factor={3} fade speed={0.4} />

        {/* Minimal space lighting */}
        <ambientLight intensity={0.1} />

        <SceneContent />
      </Canvas>
    </div>
  );
}
