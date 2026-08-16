"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { motion, AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ThreeRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  stars: THREE.Points[];
  nebula: THREE.Mesh | null;
  sun: THREE.Mesh | null;
  sunGlow: THREE.Mesh | null;
  mountains: THREE.Mesh[];
  animationId: number | null;
  targetCameraX?: number;
  targetCameraY?: number;
  targetCameraZ?: number;
  targetSunX?: number;
  targetSunY?: number;
  targetSunZ?: number;
  targetFogColor?: THREE.Color;
  locations?: number[];
}

const sectionData = [
  {
    title: "HORIZON",
    line1: "Where vision meets reality,",
    line2: "we shape the future of tomorrow",
  },
  {
    title: "COSMOS",
    line1: "Beyond the boundaries of imagination,",
    line2: "lies the universe of possibilities",
  },
  {
    title: "INFINITY",
    line1: "In the space between thought and creation,",
    line2: "we find the essence of true innovation",
  },
];

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 3;

  const threeRefs = useRef<ThreeRefs>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    sun: null,
    sunGlow: null,
    mountains: [],
    animationId: null,
  });

  // Initialize Three.js
  useEffect(() => {
    if (!canvasRef.current) return;

    const createStarField = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      const starCount = 5000;

      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.7) {
            color.setHSL(0, 0, 0.8 + Math.random() * 0.2);
          } else if (colorChoice < 0.9) {
            color.setHSL(0.08, 0.5, 0.8);
          } else {
            color.setHSL(0.6, 0.5, 0.8);
          }

          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i },
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;

      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          progress: { value: 0 },
          color1: { value: new THREE.Color(0x0033ff) },
          color2: { value: new THREE.Color(0xff0066) },
          opacity: { value: 0.35 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          uniform float progress;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            vec3 c1 = mix(vec3(0.0, 0.2, 0.8), vec3(0.0, 0.8, 1.0), smoothstep(0.0, 0.5, progress));
            c1 = mix(c1, vec3(0.7, 0.1, 0.9), smoothstep(0.5, 1.0, progress));

            vec3 c2 = mix(vec3(0.8, 0.1, 0.5), vec3(0.5, 0.1, 1.0), smoothstep(0.0, 0.5, progress));
            c2 = mix(c2, vec3(1.0, 0.2, 0.6), smoothstep(0.5, 1.0, progress));

            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(c1, c2, mixFactor * 0.5 + 0.5);
            
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      nebula.rotation.x = 0;
      refs.scene.add(nebula);
      refs.nebula = nebula;
    };

    const createSun = () => {
      const { current: refs } = threeRefs;
      const scene = refs.scene;
      if (!scene) return;

      const sunGeo = new THREE.SphereGeometry(140, 64, 64);
      const sunMat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          progress: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform float progress;
          varying vec3 vNormal;
          varying vec3 vPosition;

          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
            
            vec3 warmSun = vec3(1.0, 0.55, 0.2);   
            vec3 neonCosmos = vec3(0.15, 0.55, 1.0); 
            vec3 deepInfinity = vec3(0.9, 0.35, 1.0); 
            
            vec3 sunColor = mix(warmSun, neonCosmos, smoothstep(0.0, 0.5, progress));
            sunColor = mix(sunColor, deepInfinity, smoothstep(0.5, 1.0, progress));
            
            float pulse = sin(time * 3.0) * 0.08 + 0.92;
            vec3 finalColor = mix(sunColor * 2.0, vec3(1.0), intensity * 0.8) * pulse;

            gl_FragColor = vec4(finalColor, 0.95);
          }
        `,
        transparent: true,
      });

      const sun = new THREE.Mesh(sunGeo, sunMat);
      sun.position.set(0, -20, -400);
      scene.add(sun);
      refs.sun = sun;

      const glowGeo = new THREE.SphereGeometry(280, 32, 32);
      const glowMat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          progress: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform float progress;
          varying vec3 vNormal;

          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            
            vec3 colorA = vec3(1.0, 0.45, 0.15);
            vec3 colorB = vec3(0.2, 0.65, 1.0);
            vec3 colorC = vec3(0.85, 0.25, 1.0);

            vec3 glowColor = mix(colorA, colorB, smoothstep(0.0, 0.5, progress));
            glowColor = mix(glowColor, colorC, smoothstep(0.5, 1.0, progress));

            float pulse = sin(time * 2.0) * 0.15 + 0.85;
            gl_FragColor = vec4(glowColor * intensity * pulse, intensity * 0.65);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });

      const sunGlow = new THREE.Mesh(glowGeo, glowMat);
      sunGlow.position.set(0, -20, -400);
      scene.add(sunGlow);
      refs.sunGlow = sunGlow;
    };

    const createMountains = () => {
      const { current: refs } = threeRefs;
      const scene = refs.scene;
      if (!scene) return;

      const layers = [
        { distance: -50, height: 60, color: 0x1a1a2e, opacity: 1 },
        { distance: -100, height: 80, color: 0x16213e, opacity: 0.8 },
        { distance: -150, height: 100, color: 0x0f3460, opacity: 0.6 },
        { distance: -200, height: 120, color: 0x0a4668, opacity: 0.4 },
      ];

      layers.forEach((layer, index) => {
        const points: THREE.Vector2[] = [];
        const segments = 50;

        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1000;
          const y =
            Math.sin(i * 0.1) * layer.height +
            Math.sin(i * 0.05) * layer.height * 0.5 +
            Math.random() * layer.height * 0.2 -
            100;
          points.push(new THREE.Vector2(x, y));
        }

        points.push(new THREE.Vector2(5000, -300));
        points.push(new THREE.Vector2(-5000, -300));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide,
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance;
        mountain.userData = { baseZ: layer.distance, index };
        scene.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    const createAtmosphere = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;

      const geometry = new THREE.SphereGeometry(600, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
            
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            
            gl_FragColor = vec4(atmosphere, intensity * 0.25);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });

      const atmosphere = new THREE.Mesh(geometry, material);
      refs.scene.add(atmosphere);
    };

    const getLocation = () => {
      const { current: refs } = threeRefs;
      const locations: number[] = [];
      refs.mountains.forEach((mountain, i) => {
        locations[i] = mountain.position.z;
      });
      refs.locations = locations;
    };

    const animate = () => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Update stars
      refs.stars.forEach((starField) => {
        if (starField.material && (starField.material as THREE.ShaderMaterial).uniforms) {
          (starField.material as THREE.ShaderMaterial).uniforms.time.value = time;
        }
      });

      // Update nebula
      if (refs.nebula && refs.nebula.material && (refs.nebula.material as THREE.ShaderMaterial).uniforms) {
        (refs.nebula.material as THREE.ShaderMaterial).uniforms.time.value = time * 0.5;
      }

      // Smooth sun position easing & time updates
      if (refs.sun && refs.targetSunX !== undefined) {
        const easing = 0.05;
        refs.sun.position.x += (refs.targetSunX - refs.sun.position.x) * easing;
        refs.sun.position.y += ((refs.targetSunY ?? -20) - refs.sun.position.y) * easing;
        refs.sun.position.z += ((refs.targetSunZ ?? -400) - refs.sun.position.z) * easing;

        if (refs.sunGlow) {
          refs.sunGlow.position.copy(refs.sun.position);
        }
      }

      if (refs.sun && refs.sun.material) {
        (refs.sun.material as THREE.ShaderMaterial).uniforms.time.value = time;
      }
      if (refs.sunGlow && refs.sunGlow.material) {
        (refs.sunGlow.material as THREE.ShaderMaterial).uniforms.time.value = time;
      }

      // Smooth fog color lerp
      if (refs.scene && refs.scene.fog && refs.targetFogColor) {
        (refs.scene.fog as THREE.FogExp2).color.lerp(refs.targetFogColor, 0.05);
        if (refs.renderer) {
          refs.renderer.setClearColor((refs.scene.fog as THREE.FogExp2).color, 1);
        }
      }

      // Smooth camera movement with easing
      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.05;

        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += ((refs.targetCameraY ?? 30) - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += ((refs.targetCameraZ ?? 100) - smoothCameraPos.current.z) * smoothingFactor;

        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;

        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      // Parallax mountains with subtle animation
      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5;
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor;
        mountain.position.y = 50 + Math.cos(time * 0.15) * 1 * parallaxFactor;
      });

      if (refs.composer) {
        refs.composer.render();
      }
    };

    const initThree = () => {
      const { current: refs } = threeRefs;

      refs.scene = new THREE.Scene();
      const initialFogColor = new THREE.Color(0x060410);
      refs.scene.fog = new THREE.FogExp2(initialFogColor.getHex(), 0.00025);

      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.z = 100;
      refs.camera.position.y = 20;

      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: true,
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.setClearColor(initialFogColor, 1);
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.5;

      refs.composer = new EffectComposer(refs.renderer);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.8,
        0.4,
        0.85
      );
      refs.composer.addPass(bloomPass);

      createStarField();
      createNebula();
      createSun();
      createMountains();
      createAtmosphere();
      getLocation();

      animate();
      setIsReady(true);
    };

    initThree();

    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      const { current: refs } = threeRefs;

      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }

      window.removeEventListener("resize", handleResize);

      refs.stars.forEach((starField) => {
        starField.geometry.dispose();
        (starField.material as THREE.Material).dispose();
      });

      refs.mountains.forEach((mountain) => {
        mountain.geometry.dispose();
        (mountain.material as THREE.Material).dispose();
      });

      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        (refs.nebula.material as THREE.Material).dispose();
      }

      if (refs.sun) {
        refs.sun.geometry.dispose();
        (refs.sun.material as THREE.Material).dispose();
      }

      if (refs.sunGlow) {
        refs.sunGlow.geometry.dispose();
        (refs.sunGlow.material as THREE.Material).dispose();
      }

      if (refs.renderer) {
        refs.renderer.dispose();
      }
    };
  }, []);

  // Keyboard (Spacebar / Arrow keys / PageDown) listener for wording & section navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " " || e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const windowHeight = window.innerHeight;
        const currentScroll = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const maxScroll = documentHeight - windowHeight;

        // Cycle through 0 -> 1 -> 2 -> 0 on Spacebar
        const nextSecIdx = currentSection < totalSections ? currentSection : 0;
        const targetScroll = (nextSecIdx / (totalSections - 1)) * maxScroll;

        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const windowHeight = window.innerHeight;
        const currentScroll = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const maxScroll = documentHeight - windowHeight;

        const prevSecIdx = currentSection > 1 ? currentSection - 2 : totalSections - 1;
        const targetScroll = (prevSecIdx / (totalSections - 1)) * maxScroll;

        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSection, totalSections]);

  // GSAP Animations
  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    gsap.set(
      [menuRef.current, scrollProgressRef.current],
      { visibility: "visible" }
    );

    const tl = gsap.timeline();

    if (menuRef.current) {
      tl.from(menuRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }

    if (scrollProgressRef.current) {
      tl.from(
        scrollProgressRef.current,
        {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5"
      );
    }

    return () => {
      tl.kill();
    };
  }, [isReady]);

  // Scroll handling & Dynamic Background / Fog / Sun Trajectory Animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      const progress = Math.min(Math.max(scrollY / (maxScroll || 1), 0), 1);

      setScrollProgress(progress);

      const sectionIdx = Math.min(
        Math.floor(progress * totalSections),
        totalSections - 1
      );
      setCurrentSection(sectionIdx + 1);

      const { current: refs } = threeRefs;

      const totalProgress = progress * (totalSections - 1);
      const currentSecIdx = Math.min(Math.floor(totalProgress), totalSections - 2);
      const sectionProgress = totalProgress - currentSecIdx;

      // 1. Camera Positions for HORIZON -> COSMOS -> INFINITY
      const cameraPositions = [
        { x: 0, y: 30, z: 300 },   // Section 1 - HORIZON
        { x: 0, y: 40, z: -50 },   // Section 2 - COSMOS
        { x: 0, y: 50, z: -700 },  // Section 3 - INFINITY
      ];

      const currentPos = cameraPositions[currentSecIdx] || cameraPositions[0];
      const nextPos = cameraPositions[currentSecIdx + 1] || currentPos;

      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

      // 2. Dynamic 3D Sun & Corona Trajectory as you scroll down
      const sunTargetX = -140 + progress * 280;
      const sunTargetY = -20 + Math.sin(progress * Math.PI) * 320 + progress * 120;
      const sunTargetZ = -400 - progress * 900;

      refs.targetSunX = sunTargetX;
      refs.targetSunY = sunTargetY;
      refs.targetSunZ = sunTargetZ;

      if (refs.sun && refs.sun.material) {
        (refs.sun.material as THREE.ShaderMaterial).uniforms.progress.value = progress;
      }
      if (refs.sunGlow && refs.sunGlow.material) {
        (refs.sunGlow.material as THREE.ShaderMaterial).uniforms.progress.value = progress;
      }
      if (refs.nebula && refs.nebula.material) {
        (refs.nebula.material as THREE.ShaderMaterial).uniforms.progress.value = progress;
      }

      // 3. Dynamic Environment Fog & Background Shift (Horizon -> Cosmos -> Infinity)
      const colorHorizon = new THREE.Color(0x060410);
      const colorCosmos = new THREE.Color(0x040c24);
      const colorInfinity = new THREE.Color(0x180224);

      const targetFog = new THREE.Color();
      if (progress < 0.5) {
        targetFog.lerpColors(colorHorizon, colorCosmos, progress * 2);
      } else {
        targetFog.lerpColors(colorCosmos, colorInfinity, (progress - 0.5) * 2);
      }

      refs.targetFogColor = targetFog;

      // 4. Parallax Mountains & Nebula Updates
      refs.mountains.forEach((mountain, i) => {
        const speed = 1 + i * 0.9;
        const targetZ = mountain.userData.baseZ + scrollY * speed * 0.5;
        if (refs.nebula) {
          refs.nebula.position.z = targetZ + progress * speed * 0.01 - 100;
        }

        mountain.userData.targetZ = targetZ;
        if (progress > 0.6) {
          mountain.position.z = 600000;
        }
        if (progress <= 0.6 && refs.locations && refs.locations[i] !== undefined) {
          mountain.position.z = refs.locations[i];
        }
      });

      if (refs.nebula && refs.mountains[3]) {
        refs.nebula.position.z = refs.mountains[3].position.z;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalSections]);

  const splitTitle = (text: string) => {
    return text.split("").map((char, i) => (
      <span key={i} className="title-char">
        {char}
      </span>
    ));
  };

  const getDynamicBgStyle = () => {
    if (scrollProgress < 0.5) {
      const t = scrollProgress * 2;
      return {
        background: `radial-gradient(ellipse at 50% 30%, rgba(${Math.round(18 + t * 10)}, ${Math.round(10 + t * 14)}, ${Math.round(36 + t * 30)}, 0.95) 0%, rgba(${Math.round(6 + t * 6)}, ${Math.round(4 + t * 8)}, ${Math.round(14 + t * 20)}, 1) 70%, #000 100%)`,
      };
    } else {
      const t = (scrollProgress - 0.5) * 2;
      return {
        background: `radial-gradient(ellipse at 50% 30%, rgba(${Math.round(28 + t * 24)}, ${Math.round(24 - t * 14)}, ${Math.round(66 - t * 16)}, 0.95) 0%, rgba(${Math.round(12 + t * 12)}, ${Math.round(12 - t * 8)}, ${Math.round(34 - t * 10)}, 1) 70%, #000 100%)`,
      };
    }
  };

  const activeSecIndex = Math.min(Math.max(currentSection - 1, 0), totalSections - 1);
  const activeData = sectionData[activeSecIndex];

  return (
    <div
      ref={containerRef}
      className="hero-container cosmos-style transition-colors duration-500 relative"
      style={getDynamicBgStyle()}
    >
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* Side menu */}
      <div ref={menuRef} className="side-menu" style={{ visibility: "hidden" }}>
        <div className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="vertical-text">SPACE</div>
      </div>

      {/* Scroll & Keyboard progress indicator */}
      <div ref={scrollProgressRef} className="scroll-progress" style={{ visibility: "hidden" }}>
        <div className="scroll-text font-mono text-[10px] tracking-widest text-slate-400">
          PRESS SPACE ␣ OR SCROLL
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="section-counter font-mono text-xs text-purple-300">
          {String(currentSection).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}
        </div>
      </div>

      {/* Synchronized Centered Wording Overlay (Shifts dynamically on Scroll & Spacebar) */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center w-full max-w-5xl px-6 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeData.title}
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -40, scale: 1.05, filter: "blur(12px)" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center"
          >
            <h1 className="hero-title font-extrabold text-white tracking-tight leading-none">
              {splitTitle(activeData.title)}
            </h1>

            <div className="hero-subtitle cosmos-subtitle mt-6 space-y-1.5 text-slate-200 font-sans max-w-3xl">
              <p className="subtitle-line text-lg sm:text-2xl font-light tracking-wide drop-shadow-md">
                {activeData.line1}
              </p>
              <p className="subtitle-line text-lg sm:text-2xl font-light tracking-wide drop-shadow-md">
                {activeData.line2}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Invisible scroll track to enable natural wheel/trackpad scrolling across 3 sections */}
      <div className="scroll-sections relative z-10 opacity-0 pointer-events-none">
        <div className="h-screen" />
        <div className="h-screen" />
        <div className="h-screen" />
      </div>
    </div>
  );
};
