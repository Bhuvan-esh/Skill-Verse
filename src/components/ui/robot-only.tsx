"use client";

import React, { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

export interface RobotOnlyProps {
  color?: string;
  scale?: number;
  pantallaColor?: string;
  pantallaBrillo?: number;
  blinkCycle?: number;
  metalness?: number;
  className?: string;
}

// Procedural speckled texture generator for Glossy White Ceramic / Pearl finish
function useSpeckledTexture(baseColorHex: string = "#ffffff") {
  return useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Base pure white background
    ctx.fillStyle = baseColorHex;
    ctx.fillRect(0, 0, 128, 128);

    // Subtle white pearl noise
    const imgData = ctx.getImageData(0, 0, 128, 128);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 12;
      data[i] = Math.min(255, Math.max(225, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(225, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(225, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // Fine metallic pearl dots
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const r = Math.random() * 1.5 + 0.4;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }, [baseColorHex]);
}

// Custom Fresnel Shader for face screen glow
const FaceScreenShader = {
  uniforms: {
    uColor: { value: new THREE.Color("#06b6d4") },
    uBrightness: { value: 1.6 },
    uTime: { value: 0 },
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uBrightness;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.2);
      float pulse = 0.95 + 0.05 * sin(uTime * 3.5);
      vec3 finalColor = uColor * (0.5 + fresnel * 1.6) * uBrightness * pulse;
      gl_FragColor = vec4(finalColor, 0.8 + fresnel * 0.2);
    }
  `,
};

// 3D Heart Geometry for Heart Eyes on interaction
function createHeartGeometry() {
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  shape.moveTo(x, y + 0.05);
  shape.bezierCurveTo(x, y + 0.11, x - 0.09, y + 0.13, x - 0.09, y + 0.05);
  shape.bezierCurveTo(x - 0.09, y - 0.02, x - 0.05, y - 0.07, x, y - 0.12);
  shape.bezierCurveTo(x + 0.05, y - 0.07, x + 0.09, y - 0.02, x + 0.09, y + 0.05);
  shape.bezierCurveTo(x + 0.09, y + 0.13, x, y + 0.11, x, y + 0.05);

  const extrudeSettings = {
    depth: 0.04,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

interface RobotMeshProps {
  color: string;
  scale: number;
  pantallaColor: string;
  pantallaBrillo: number;
  blinkCycle: number;
  metalness: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

function RobotMesh({
  color,
  scale: baseScale,
  pantallaColor,
  pantallaBrillo,
  blinkCycle,
  metalness,
  containerRef,
}: RobotMeshProps) {
  const robotGroupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);

  const [isHeartEyes, setIsHeartEyes] = useState<boolean>(false);
  const heartTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeRef = useRef<number>(0);

  const speckledTexture = useSpeckledTexture(color);

  // Shader material reference
  const shaderMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: FaceScreenShader.vertexShader,
      fragmentShader: FaceScreenShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(FaceScreenShader.uniforms),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    mat.uniforms.uColor.value = new THREE.Color(pantallaColor);
    mat.uniforms.uBrightness.value = pantallaBrillo;
    return mat;
  }, [pantallaColor, pantallaBrillo]);

  // Update shader color/brightness when props change
  useEffect(() => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.uColor.value.set(pantallaColor);
      shaderMaterial.uniforms.uBrightness.value = pantallaBrillo;
    }
  }, [pantallaColor, pantallaBrillo, shaderMaterial]);

  // Heart Geometry
  const heartGeometry = useMemo(() => createHeartGeometry(), []);

  // Standard Pure White Body Material
  const bodyMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: color,
      map: speckledTexture || undefined,
      bumpMap: speckledTexture || undefined,
      bumpScale: 0.008,
      metalness: metalness,
      roughness: 0.15,
    });
  }, [color, speckledTexture, metalness]);

  // Dark Metallic Accent Material for Head/Joints
  const darkMetalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#0f172a",
      metalness: 0.9,
      roughness: 0.15,
    });
  }, []);

  // Glowing Eye/Accents Material
  const eyeGlowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: pantallaColor,
    });
  }, [pantallaColor]);

  // Heart Eye Material (Vibrant Pink/Cyan glow)
  const heartMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#ff2a85",
      emissive: "#ff1493",
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.5,
    });
  }, []);

  // Click handler to trigger heart eyes
  const handleBodyClick = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsHeartEyes(true);

    if (heartTimerRef.current) {
      clearTimeout(heartTimerRef.current);
    }

    heartTimerRef.current = setTimeout(() => {
      setIsHeartEyes(false);
    }, 2000);
  }, []);

  // Mouse tracking state for container scoping
  const mouseTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (
          rect.width > 0 &&
          rect.height > 0 &&
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          // Relative to container [-1, 1]
          const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
          mouseTargetRef.current = { x, y };
          return;
        }
      }

      // Default fallback to window normalized coordinates
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseTargetRef.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef]);

  // Frame animation loop
  useFrame((state, delta) => {
    timeRef.current += delta;

    // Update face shader uTime
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = timeRef.current;
    }

    const { x: targetX, y: targetY } = mouseTargetRef.current;

    // Smooth lerp body movement & rotation
    if (bodyRef.current) {
      // Body X drift
      bodyRef.current.position.x = THREE.MathUtils.lerp(
        bodyRef.current.position.x,
        targetX * 0.7,
        delta * 3.5
      );
      bodyRef.current.position.y = THREE.MathUtils.lerp(
        bodyRef.current.position.y,
        Math.sin(timeRef.current * 2) * 0.08, // Idle breathing hover
        delta * 3.5
      );

      // Body lean/rotations
      bodyRef.current.rotation.y = THREE.MathUtils.lerp(
        bodyRef.current.rotation.y,
        targetX * 0.35,
        delta * 3.5
      );
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(
        bodyRef.current.rotation.x,
        -targetY * 0.2,
        delta * 3.5
      );
      bodyRef.current.rotation.z = THREE.MathUtils.lerp(
        bodyRef.current.rotation.z,
        -targetX * 0.12,
        delta * 3.5
      );
    }

    // Smooth lerp head rotation (reacts faster)
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetX * 0.7,
        delta * 7.0
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -targetY * 0.45,
        delta * 7.0
      );
    }

    // Blink cycle calculation (~3s cycle, ~0.45s blink)
    const cycleTime = timeRef.current % blinkCycle;
    const isBlinking = cycleTime > blinkCycle - 0.45;
    const targetScaleY = isBlinking ? 0.08 : 1.0;

    if (leftEyeRef.current && rightEyeRef.current) {
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(
        leftEyeRef.current.scale.y,
        targetScaleY,
        delta * 20
      );
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(
        rightEyeRef.current.scale.y,
        targetScaleY,
        delta * 20
      );
    }
  });

  return (
    <group ref={robotGroupRef} scale={[baseScale, baseScale, baseScale]}>
      {/* Main Robot Body Group */}
      <group
        ref={bodyRef}
        onPointerDown={handleBodyClick}
      >
        {/* Torso (Partial Sphere Dome - Pure White) */}
        <mesh material={bodyMaterial} position={[0, 0, 0]}>
          <sphereGeometry args={[1.15, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
        </mesh>

        {/* Torso Bottom Cap */}
        <mesh material={bodyMaterial} position={[0, -0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.92, 32]} />
        </mesh>

        {/* Torus Belt Bevel */}
        <mesh material={darkMetalMaterial} position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.05, 0.08, 16, 64]} />
        </mesh>

        {/* Lathed Neck Ring */}
        <mesh material={darkMetalMaterial} position={[0, 0.72, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 0.22, 32]} />
        </mesh>

        {/* Neck Accent Ring */}
        <mesh material={eyeGlowMaterial} position={[0, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.58, 0.02, 16, 32]} />
        </mesh>

        {/* Head Group */}
        <group ref={headRef} position={[0, 1.45, 0]}>
          {/* Main Head Sphere - Pure White Ceramic */}
          <mesh material={bodyMaterial} position={[0, 0, 0]}>
            <sphereGeometry args={[0.82, 32, 32]} />
          </mesh>

          {/* Translucent Glowing Face Screen */}
          <mesh material={shaderMaterial} position={[0, 0.02, 0.44]} scale={[1.12, 0.85, 0.42]}>
            <sphereGeometry args={[0.62, 32, 32]} />
          </mesh>

          {/* Ears & Antennae */}
          {/* Left Ear */}
          <group position={[-0.85, 0, 0]}>
            <mesh material={darkMetalMaterial} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.16, 0.04, 16, 32]} />
            </mesh>
            <mesh material={darkMetalMaterial} position={[-0.05, 0.18, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.28, 16]} />
            </mesh>
            <mesh material={eyeGlowMaterial} position={[-0.05, 0.34, 0]}>
              <sphereGeometry args={[0.055, 16, 16]} />
            </mesh>
          </group>

          {/* Right Ear */}
          <group position={[0.85, 0, 0]}>
            <mesh material={darkMetalMaterial} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.16, 0.04, 16, 32]} />
            </mesh>
            <mesh material={darkMetalMaterial} position={[0.05, 0.18, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.28, 16]} />
            </mesh>
            <mesh material={eyeGlowMaterial} position={[0.05, 0.34, 0]}>
              <sphereGeometry args={[0.055, 16, 16]} />
            </mesh>
          </group>

          {/* Eyes Group */}
          {/* Left Eye */}
          <group ref={leftEyeRef} position={[-0.24, 0.06, 0.78]}>
            {isHeartEyes ? (
              <mesh geometry={heartGeometry} material={heartMaterial} scale={[0.8, 0.8, 0.8]} />
            ) : (
              <group>
                {/* Rounded Top Bracket */}
                <mesh material={eyeGlowMaterial} position={[0, 0.04, 0]}>
                  <torusGeometry args={[0.07, 0.02, 12, 24, Math.PI]} />
                </mesh>
                {/* Rounded Bottom Bracket */}
                <mesh material={eyeGlowMaterial} position={[0, -0.04, 0]} rotation={[0, 0, Math.PI]}>
                  <torusGeometry args={[0.07, 0.02, 12, 24, Math.PI]} />
                </mesh>
              </group>
            )}
          </group>

          {/* Right Eye */}
          <group ref={rightEyeRef} position={[0.24, 0.06, 0.78]}>
            {isHeartEyes ? (
              <mesh geometry={heartGeometry} material={heartMaterial} scale={[0.8, 0.8, 0.8]} />
            ) : (
              <group>
                {/* Rounded Top Bracket */}
                <mesh material={eyeGlowMaterial} position={[0, 0.04, 0]}>
                  <torusGeometry args={[0.07, 0.02, 12, 24, Math.PI]} />
                </mesh>
                {/* Rounded Bottom Bracket */}
                <mesh material={eyeGlowMaterial} position={[0, -0.04, 0]} rotation={[0, 0, Math.PI]}>
                  <torusGeometry args={[0.07, 0.02, 12, 24, Math.PI]} />
                </mesh>
              </group>
            )}
          </group>
        </group>
      </group>
    </group>
  );
}

export function RobotOnly({
  color = "#ffffff",
  scale = 1,
  pantallaColor = "#06b6d4",
  pantallaBrillo = 1.6,
  blinkCycle = 3,
  metalness = 0.5,
  className = "w-full h-full",
}: RobotOnlyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  if (!mounted) {
    return <div ref={containerRef} className={className} />;
  }

  return (
    <div ref={containerRef} className={`relative cursor-pointer ${className}`}>
      <Canvas
        frameloop={isVisible ? "always" : "never"}
        dpr={[1, 1.0]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.2, 6], fov: 40 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 8, 5]} intensity={0.9} color="#ffffff" />
        <directionalLight position={[-5, -2, -5]} intensity={0.4} color="#60a5fa" />
        <Environment preset="studio" />
        <RobotMesh
          color={color}
          scale={scale}
          pantallaColor={pantallaColor}
          pantallaBrillo={pantallaBrillo}
          blinkCycle={blinkCycle}
          metalness={metalness}
          containerRef={containerRef}
        />
      </Canvas>
    </div>
  );
}

export default RobotOnly;
