"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  MeshDistortMaterial,
  Float,
  Stars,
  Sparkles,
} from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function AiCore() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Use delta for smooth rotation instead of deprecated clock
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? 1.3 : 1.1} // Increased size for better visibility
      >
        <sphereGeometry args={[2, 64, 64]} />
        <MeshDistortMaterial
          color={hovered ? "#ffd700" : "#8b5cf6"}
          attach="material"
          distort={0.5}
          speed={2.5}
          roughness={0.1}
          metalness={0.9} // More metallic for space look
          emissive={hovered ? "#fbbf24" : "#4c1d95"} // Glow effect
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Outer Energy Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.5, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Second Ring */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[4.2, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#60a5fa"
          emissiveIntensity={2}
          transparent
          opacity={0.4}
        />
      </mesh>
    </Float>
  );
}

function FloatingRock({
  position,
  scale,
  speed,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
}) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * speed;
    mesh.current.rotation.y += delta * speed * 0.5;
  });

  return (
    <Float speed={speed * 2} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={mesh} position={position} scale={scale}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} flatShading />
      </mesh>
    </Float>
  );
}

function ShootingStar() {
  const mesh = useRef<THREE.Mesh>(null!);
  const [active, setActive] = useState(false);
  const [startPos, setStartPos] = useState<[number, number, number]>([0, 0, 0]);

  useFrame((state, delta) => {
    if (!active) {
      if (Math.random() > 0.995) {
        // Random chance to start
        setActive(true);
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20 + 10;
        const z = (Math.random() - 0.5) * 10 - 5;
        mesh.current.position.set(x, y, z);
        setStartPos([x, y, z]);
      }
    } else {
      mesh.current.position.x -= delta * 15; // Move fast left
      mesh.current.position.y -= delta * 15; // Move fast down

      if (mesh.current.position.y < -15) {
        setActive(false);
      }
    }
  });

  return (
    <mesh ref={mesh} visible={active}>
      <cylinderGeometry args={[0.05, 0, 2]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </mesh>
  );
}

function Scene() {
  // Use lazy initializer to generate rocks only once without useEffect
  const [rocks] = useState(() => {
    // Only runs once on initial render (client-side)
    if (typeof window === "undefined") return [];
    return Array.from({ length: 15 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 10 - 5,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.5 + 0.2,
    }));
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        color="#e0f2fe"
      />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#f472b6" />
      <pointLight
        position={[0, 0, 5]}
        intensity={0.5}
        color="#fbbf24"
        distance={10}
      />

      {/* Background Atmosphere */}
      <color attach="background" args={["#050505"]} />
      <Stars
        radius={150}
        depth={50}
        count={7000}
        factor={4}
        saturation={1}
        fade
        speed={1.5}
      />

      {/* Galaxy Fog/Cloud effect - Removed Cloud component to fix type error, replaced with simple fog */}
      <fog attach="fog" args={["#050505", 5, 20]} />

      <group position={[0, 0, 0]}>
        <AiCore />
        {/* Core Sparkles */}
        <Sparkles
          count={150}
          scale={8}
          size={6}
          speed={0.6}
          opacity={0.8}
          color="#fbbf24"
        />
        {/* Wider Space Dust */}
        <Sparkles
          count={300}
          scale={25}
          size={2}
          speed={0.2}
          opacity={0.4}
          color="#ffffff"
        />
      </group>

      {/* Floating Asteroids */}
      {rocks.map((rock, i) => (
        <FloatingRock
          key={i}
          position={rock.position}
          scale={rock.scale}
          speed={rock.speed}
        />
      ))}

      {/* Shooting Stars */}
      <ShootingStar />
      <ShootingStar />
      <ShootingStar />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

export default function Hero3D() {
  const [hasError, setHasError] = useState(false);
  // Check if we're on client-side without useState + useEffect
  const [mounted, setMounted] = useState(() => typeof window !== "undefined");

  // Don't render 3D on server-side to avoid hydration issues
  if (!mounted) {
    return (
      <div className="w-full h-[100vh] absolute top-0 left-0 -z-10">
        <div className="w-full h-full bg-gradient-to-b from-purple-900/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(9,8,10,0.4)] to-[var(--bg-primary)] pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="w-full h-[100vh] absolute top-0 left-0 -z-10">
      {!hasError ? (
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
          frameloop="always" // Continuous rendering for smooth animations
          dpr={[1, 2]} // Device pixel ratio - responsive to screen quality
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
          }}
          onCreated={({ gl, scene }) => {
            // Optimize renderer settings
            gl.setClearColor(0x000000, 0);

            // Handle WebGL context loss gracefully
            const canvas = gl.domElement;
            canvas.addEventListener(
              "webglcontextlost",
              (e) => {
                e.preventDefault();
                console.warn("WebGL context lost. Restoring...");
                setHasError(true);
              },
              false,
            );

            canvas.addEventListener(
              "webglcontextrestored",
              () => {
                console.log("WebGL context restored");
                setHasError(false);
              },
              false,
            );
          }}
        >
          <Scene />
        </Canvas>
      ) : (
        // Fallback when WebGL fails
        <div className="w-full h-full bg-gradient-to-b from-purple-900/20 to-transparent">
          <div className="flex items-center justify-center h-full text-white/50 text-sm">
            3D scene temporarily unavailable
          </div>
        </div>
      )}
      {/* Gradient Overlay for smooth text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(9,8,10,0.4)] to-[var(--bg-primary)] pointer-events-none" />
    </div>
  );
}
