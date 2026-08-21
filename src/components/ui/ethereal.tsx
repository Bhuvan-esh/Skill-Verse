'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useRouter } from 'next/navigation';
import AboutUsSection from '@/components/ui/about-us-section';
import { ContactPage } from '@/components/ui/contact-page';
import { SignInPage } from '@/components/ui/sign-in-flow-1';
import LoginModal from '@/components/LoginModal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface SectionItem {
  id: string;
  headline: string;
  subheadline: string;
  body: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  dark: string;
}

export interface ScrollHeroProps {
  sections?: SectionItem[];
  colorPalette?: ColorPalette;
  logo?: string;
  menuItems?: string[];
}

const paletteGLSL = `
  vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
    return a + b*cos(6.28318*(c*t + d));
  }
`;

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vDist;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uScrollProgress;
  uniform float uScrollVelocity;
  uniform float uSectionT;

  vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0*floor(p*ns.z*ns.z);
    vec4 x_ = floor(j*ns.z);
    vec4 y_ = floor(j - 7.0*x_);
    vec4 x = x_*ns.x + ns.yyyy;
    vec4 y = y_*ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1),
                                   dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1),
                            dot(x2,x2), dot(x3,x3)), 0.0);
    m = m*m;
    return 42.0*dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }

  float fbm(vec3 p){
    float v = 0.0;
    float a = 0.5;
    for(int i=0;i<3;i++){
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main(){
    vUv = uv;

    vec3 pos = position;

    vec3 p = pos * 1.1;
    float t = uTime * 0.25;
    float warp1 = fbm(p + vec3(t, -t, t*0.5));
    float warp2 = snoise(p*2.0 + vec3(-t*0.7, t*0.9, t*0.2));
    float warp = warp1*0.25 + warp2*0.1;

    float twist = uScrollVelocity * 0.6;
    float angle = pos.y * twist;
    mat2 R = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    pos.xz = R * pos.xz;

    float ridge = max(0.0, 1.0 - abs(snoise(p*1.5)));
    float disp = warp + ridge*0.15;
    vDist = disp;
    pos += normal * disp;

    vec4 world = modelMatrix * vec4(pos,1.0);
    vWorldPos = world.xyz;

    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying float vDist;

  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uSectionIndex;
  uniform vec2  uMouse;

  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uAccent;

  ${paletteGLSL}

  float saturate(float x){ return clamp(x,0.0,1.0); }

  vec3 normalFromDerivatives(vec3 p){
    vec3 dx = dFdx(p);
    vec3 dy = dFdy(p);
    return normalize(cross(dx,dy));
  }

  vec3 F_Schlick(float cosTheta, vec3 F0){
    return F0 + (1.0 - F0)*pow(1.0 - cosTheta, 5.0);
  }

  float D_GGX(float NdotH, float rough){
    float a = rough*rough;
    float a2 = a*a;
    float d = (NdotH*NdotH)*(a2 - 1.0) + 1.0;
    return a2 / (3.14159 * d * d);
  }

  float G_SchlickGGX(float NdotV, float rough){
    float r = rough + 1.0;
    float k = (r*r)/8.0;
    return NdotV / (NdotV*(1.0 - k) + k);
  }

  float G_Smith(float NdotV, float NdotL, float rough){
    return G_SchlickGGX(NdotV, rough) * G_SchlickGGX(NdotL, rough);
  }

  vec3 envGradient(vec3 r, vec3 skyA, vec3 skyB, vec3 ground){
    float h = r.y * 0.5 + 0.5;
    vec3 sky = mix(skyB, skyA, h);
    return mix(ground, sky, saturate(h*1.2));
  }

  float gradParam(vec2 uv, float time){
    vec2 q = uv*2.0 - 1.0;
    q.x *= 1.2;
    float a = sin(q.x*2.5 + time*0.25);
    float b = cos(q.y*3.0 - time*0.2);
    return saturate(0.5 + 0.5*(a*0.6 + b*0.4));
  }

  void main(){
    vec3 N = normalFromDerivatives(vWorldPos);
    vec3 V = normalize(cameraPosition - vWorldPos);

    float t = uTime*0.6;
    vec3 L1pos = vec3( 6.0*sin(t*0.7),  4.0,  6.0*cos(t*0.7));
    vec3 L2pos = vec3(-5.0*cos(t*0.5), -3.5, 5.0*sin(t*0.45));
    vec3 L3pos = vec3( 0.0,  6.0*sin(t*0.25), -6.0);

    vec3 L1 = normalize(L1pos - vWorldPos);
    vec3 L2 = normalize(L2pos - vWorldPos);
    vec3 L3 = normalize(L3pos - vWorldPos);

    float gp = gradParam(vUv, uTime) + vDist*0.6;
    float sectionMix = clamp(uSectionIndex/3.0, 0.0, 1.0);

    vec3 palA = cosPalette(
      gp,
      vec3(0.55,0.55,0.58),
      vec3(0.45,0.35,0.35),
      vec3(0.95,0.80,0.70),
      vec3(0.00,0.35,0.55)
    );

    vec3 palB = cosPalette(
      gp + 0.15*sin(uTime*0.25),
      vec3(0.55,0.56,0.58),
      vec3(0.35,0.45,0.55),
      vec3(0.90,0.55,0.75),
      vec3(0.25,0.10,0.60)
    );

    vec3 baseAlbedo = mix(palA, palB, sectionMix);
    baseAlbedo = mix(baseAlbedo, uColor1, 0.15);
    baseAlbedo = mix(baseAlbedo, uColor2, 0.10);

    float metallic = 0.25 + 0.15*sin(uTime*0.2 + gp*3.0);
    float rough    = clamp(0.18 + 0.12*sin(gp*6.283 + uTime*0.35), 0.06, 0.6);

    vec3 F0 = mix(vec3(0.04), baseAlbedo, metallic);

    vec3 H1 = normalize(V + L1);
    vec3 H2 = normalize(V + L2);
    vec3 H3 = normalize(V + L3);

    float NdotV = saturate(dot(N,V));
    float NdotL1= saturate(dot(N,L1));
    float NdotL2= saturate(dot(N,L2));
    float NdotL3= saturate(dot(N,L3));

    float NdotH1= saturate(dot(N,H1));
    float NdotH2= saturate(dot(N,H2));
    float NdotH3= saturate(dot(N,H3));

    float D1 = D_GGX(NdotH1, rough);
    float D2 = D_GGX(NdotH2, rough);
    float D3 = D_GGX(NdotH3, rough);

    float G1 = G_Smith(NdotV, NdotL1, rough);
    float G2 = G_Smith(NdotV, NdotL2, rough);
    float G3 = G_Smith(NdotV, NdotL3, rough);

    vec3  F1 = F_Schlick(saturate(dot(V,H1)), F0);
    vec3  F2 = F_Schlick(saturate(dot(V,H2)), F0);
    vec3  F3 = F_Schlick(saturate(dot(V,H3)), F0);

    vec3 spec1 = (D1*G1*F1) / max(4.0*NdotV*NdotL1, 0.001);
    vec3 spec2 = (D2*G2*F2) / max(4.0*NdotV*NdotL2, 0.001);
    vec3 spec3 = (D3*G3*F3) / max(4.0*NdotV*NdotL3, 0.001);

    vec3 kS = F_Schlick(NdotV, F0);
    vec3 kD = (vec3(1.0) - kS) * (1.0 - metallic);

    vec3 diffuse = baseAlbedo / 3.14159;

    vec3 c1 = vec3(1.0);
    vec3 c2 = mix(uColor3, vec3(0.9,0.95,1.0), 0.6);
    vec3 c3 = mix(uAccent, vec3(1.0,0.9,0.75), 0.5);

    vec3 direct =
      (kD*diffuse + spec1) * c1 * NdotL1 * 0.9 +
      (kD*diffuse + spec2) * c2 * NdotL2 * 0.6 +
      (kD*diffuse + spec3) * c3 * NdotL3 * 0.5;

    vec3 R = reflect(-V, N);
    vec3 env = envGradient(R,
      vec3(0.12,0.16,0.25),
      vec3(0.04,0.06,0.10),
      vec3(0.01,0.01,0.012)
    );
    vec3 Fenv = F_Schlick(saturate(dot(N,V)), F0);
    vec3 envSpec = Fenv * env * (1.0 - rough) * 0.6;

    float rim = pow(1.0 - saturate(dot(N,V)), 2.0);
    vec3 rimCol = mix(uAccent, uColor3, 0.4) * rim * 0.35;

    vec3 glow = mix(uAccent, uColor3, 0.5) * abs(vDist) * 0.25;

    vec3 color = direct + envSpec + rimCol + glow;

    float pattern = sin(vUv.x*40.0 + uTime) * sin(vUv.y*38.0 - uTime);
    color += pattern * 0.015;

    color = clamp(color, 0.0, 4.0);
    gl_FragColor = vec4(color, 1.0 - uScrollProgress*0.12);
  }
`;

const cinematicPostShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uTemperature: { value: 0.08 },
    uTint: { value: 0.02 },
    uContrast: { value: 1.06 },
    uSaturation: { value: 1.05 },
    uVignette: { value: 0.35 },
    uAberration: { value: 0.0018 },
    uGrain: { value: 0.22 },
    uLetterbox: { value: 0.6 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2  uResolution;
    uniform float uTemperature, uTint, uContrast, uSaturation, uVignette, uAberration, uGrain, uLetterbox;

    float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }

    vec3 aces(vec3 x){
      float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14;
      return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0);
    }

    vec3 tempTint(vec3 c, float temp, float tint){
      c.r += temp*0.2;
      c.b -= temp*0.2;
      c.g += tint*0.15;
      return c;
    }

    vec3 satContrast(vec3 c, float sat, float con){
      vec3 g = vec3(dot(c, vec3(0.299,0.587,0.114)));
      c = mix(g, c, sat);
      c = (c - 0.5)*con + 0.5;
      return c;
    }

    void main(){
      vec2 p = vUv - 0.5;
      vec2 dir = normalize(p + 1e-6);
      float dist = length(p);
      vec2 off = dir * uAberration * dist;

      float r = texture2D(tDiffuse, vUv + off).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - off).b;
      vec3 col = vec3(r,g,b);

      float n = rand(vUv*vec2(uResolution.x, uResolution.y) + uTime*60.0) - 0.5;
      col += n * uGrain * 0.08;

      col = tempTint(col, uTemperature, uTint);
      col = satContrast(col, uSaturation, uContrast);

      float vig = smoothstep(0.85, 0.2, dist);
      col *= mix(1.0, vig, uVignette);

      float bar = smoothstep(uLetterbox, 0.0, abs(vUv.y - 0.5));
      col *= bar;

      col = aces(col);
      col = pow(col, vec3(1.0/2.2));

      gl_FragColor = vec4(col, 1.0);
    }
  `
};

export default function ScrollHero({
  sections = [
    { id: 'hero', headline: 'Ethereal', subheadline: 'Beyond Reality', body: 'Immersive experiences through computational artistry' },
    { id: 'about', headline: 'Innovation', subheadline: 'Through Design', body: 'Pushing boundaries of digital experiences' },
    { id: 'services', headline: 'Crafted', subheadline: 'With Purpose', body: 'Every pixel serves a greater vision' },
    { id: 'contact', headline: 'Connect', subheadline: 'Create Together', body: 'Let\'s build something extraordinary' }
  ],
  colorPalette = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    tertiary: '#ec4899',
    accent: '#06ffa5',
    dark: '#0a0a0a'
  },
  logo = 'STUDIO',
  menuItems = ['Work', 'About', 'Services', 'Contact']
}: ScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  const scrollRef = useRef({
    progress: 0,
    velocity: 0,
    targetRotationX: 0,
    targetRotationY: 0,
    currentRotationX: 0,
    currentRotationY: 0
  });
  const mouseRef = useRef({ x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 });

  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const handleTourEvent = (e: any) => {
      if (e.detail?.type === 'open-signin') {
        setIsAuthOpen(true);
      } else if (e.detail?.type === 'open-about') {
        setIsAboutOpen(true);
      } else if (e.detail?.type === 'open-contact') {
        setIsHelpOpen(true);
      }
    };
    window.addEventListener('anvaya-tour-event', handleTourEvent);
    return () => window.removeEventListener('anvaya-tour-event', handleTourEvent);
  }, []);

  // Initialize Three.js
  useEffect(() => {
    if (!canvasRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let composer: EffectComposer;
    let mesh: THREE.Mesh;
    let clock = new THREE.Clock();
    let frameId: number;

    const init = () => {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 5);

      let isVisible = true;
      let isAnimating = false;

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.0));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;

      if ('outputColorSpace' in renderer) {
        (renderer as any).outputColorSpace = (THREE as any).SRGBColorSpace || 'srgb';
      }

      const geometry = new THREE.IcosahedronGeometry(1.85, 2);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uScrollProgress: { value: 0 },
          uScrollVelocity: { value: 0 },
          uSectionT: { value: 0 },
          uSectionIndex: { value: 0 },
          uColor1: { value: new THREE.Color(colorPalette.primary) },
          uColor2: { value: new THREE.Color(colorPalette.secondary) },
          uColor3: { value: new THREE.Color(colorPalette.tertiary) },
          uAccent: { value: new THREE.Color(colorPalette.accent) }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide
      });

      mesh = new THREE.Mesh(geometry, material);
      meshRef.current = mesh;
      scene.add(mesh);

      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));

      const bloom = new UnrealBloomPass(
        new THREE.Vector2(256, 256),
        0.4,
        0.3,
        0.92
      );
      composer.addPass(bloom);

      const cinePass = new ShaderPass(cinematicPostShader);
      cinePass.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      composer.addPass(cinePass);

      composerRef.current = composer;
      setIsLoaded(true);

      const startAnimation = () => {
        if (!isAnimating) {
          isAnimating = true;
          animate();
        }
      };

      const stopAnimation = () => {
        isAnimating = false;
        if (frameId) cancelAnimationFrame(frameId);
      };

      const animate = () => {
        const t = clock.getElapsedTime();

        if (mesh && mesh.material) {
          const mat = mesh.material as THREE.ShaderMaterial;
          mat.uniforms.uTime.value = t;

          mouseRef.current.sx += (mouseRef.current.x - mouseRef.current.sx) * 0.1;
          mouseRef.current.sy += (mouseRef.current.y - mouseRef.current.sy) * 0.1;
          mat.uniforms.uMouse.value.set(mouseRef.current.sx, mouseRef.current.sy);

          mat.uniforms.uScrollProgress.value = scrollRef.current.progress;
          mat.uniforms.uScrollVelocity.value = scrollRef.current.velocity;

          // Buttery smooth lerp calculation (0 GC overhead)
          scrollRef.current.currentRotationX += (scrollRef.current.targetRotationX - scrollRef.current.currentRotationX) * 0.12;
          scrollRef.current.currentRotationY += (scrollRef.current.targetRotationY - scrollRef.current.currentRotationY) * 0.12;

          mesh.rotation.x = scrollRef.current.currentRotationX;
          mesh.rotation.y = scrollRef.current.currentRotationY;
          mesh.position.y = Math.sin(t * 0.45) * 0.05;
        }

        const lastPass = composer.passes[composer.passes.length - 1] as any;
        if (lastPass?.uniforms?.uTime) lastPass.uniforms.uTime.value = t;

        composer.render();
        frameId = requestAnimationFrame(animate);
      };

      startAnimation();

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        const lastPass = composer.passes[composer.passes.length - 1] as any;
        if (lastPass?.uniforms?.uResolution) {
          lastPass.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        }
      };
      window.addEventListener('resize', onResize);

      const handleVisibility = () => {
        if (document.hidden) {
          stopAnimation();
        } else if (isVisible) {
          startAnimation();
        }
      };
      document.addEventListener('visibilitychange', handleVisibility);

      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible && !document.hidden) {
              startAnimation();
            } else {
              stopAnimation();
            }
          });
        },
        { threshold: 0.05 }
      );

      if (canvasRef.current) {
        intersectionObserver.observe(canvasRef.current);
      }

      return () => {
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', handleVisibility);
        intersectionObserver.disconnect();
        stopAnimation();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    };

    init();
  }, [colorPalette]);

  // Scroll logic
  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    let lastY = window.scrollY;
    let vel = 0;
    let velTimeout: NodeJS.Timeout;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollRef.current.progress = self.progress;

        const y = window.scrollY;
        vel = (y - lastY) * 0.01;
        lastY = y;
        scrollRef.current.velocity = THREE.MathUtils.clamp(vel, -1, 1);

        scrollRef.current.targetRotationX = self.progress * Math.PI * 3.0;
        scrollRef.current.targetRotationY = self.progress * Math.PI * 4.5;

        clearTimeout(velTimeout);
        velTimeout = setTimeout(() => {
          scrollRef.current.velocity = 0;
        }, 120);

        if (progressRef.current) {
          progressRef.current.style.transform = `scaleY(${self.progress})`;
        }
      }
    });

    sections.forEach((section, idx) => {
      const el = sectionsRef.current[idx];
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) {
            setActiveSection(idx);
          }
        }
      });
    });

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isLoaded, sections]);

  // Mouse smoothing
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1 - (e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div ref={containerRef} className="scroll-hero bg-[#0a0a0a] min-h-screen relative w-full">
      <div className="sticky top-0 left-0 w-full h-screen pointer-events-none z-0 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="scroll-progress fixed top-0 right-4 w-1 h-full z-30 pointer-events-none">
        <div ref={progressRef} className="scroll-progress-bar w-full h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 origin-top transform scale-y-0" />
      </div>

      <nav className="nav-container fixed top-0 left-0 w-full p-6 z-20 pointer-events-auto backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="nav-inner max-w-7xl mx-auto flex items-center justify-between">
          <div className="nav-logo text-xl font-bold tracking-widest text-white font-heading">
            {logo ? logo : null}
          </div>
          <div className="nav-menu flex space-x-8 ml-auto">
            {menuItems.map((item, i) => {
              const itemKey = item.toLowerCase();
              const isAbout = itemKey.includes('about');
              const isHelp = itemKey.includes('help') || itemKey.includes('contact');
              const isSign = itemKey.includes('sign') || itemKey.includes('enter');
              let targetId = isAbout
                ? 'about'
                : isSign
                ? 'signup'
                : isHelp
                ? 'help'
                : (sections[i]?.id || itemKey.replace(/[^a-z0-9]/g, '-'));
              
              if (isAbout) {
                return (
                  <button
                    key={i}
                    onClick={() => setIsAboutOpen(true)}
                    className="nav-item text-xs font-mono-code uppercase tracking-wider text-slate-400 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    {item}
                  </button>
                );
              }

              if (isSign) {
                return (
                  <button
                    key={i}
                    onClick={() => setIsAuthOpen(true)}
                    className="nav-item text-xs font-mono-code uppercase tracking-wider text-slate-400 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    {item}
                  </button>
                );
              }

              if (isHelp) {
                return (
                  <button
                    key={i}
                    onClick={() => setIsHelpOpen(true)}
                    className="nav-item text-xs font-mono-code uppercase tracking-wider text-slate-400 hover:text-white transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    {item}
                  </button>
                );
              }

              return (
                <a
                  key={i}
                  href={`#${targetId}`}
                  className={`nav-item text-xs font-mono-code uppercase tracking-wider transition-all duration-300 ${
                    activeSection === i ? 'text-purple-400 font-bold scale-105' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Sticky centered text overlay - pinned in viewport center over 3D model */}
      <div className="sticky top-0 left-0 w-full h-screen pointer-events-none z-10 flex items-center justify-center px-6 -mt-[100vh]">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`absolute max-w-4xl mx-auto text-center space-y-6 transition-all duration-700 ${
              activeSection === index ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <h1 className="section-headline text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white font-heading tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
              {section.headline}
            </h1>
            <h2 className="section-subheadline text-xl sm:text-2xl lg:text-3xl font-semibold text-purple-400 font-mono-code tracking-wide">
              {section.subheadline}
            </h2>
            <p className="section-body text-slate-300 text-sm sm:text-base lg:text-lg max-w-xl mx-auto font-sans leading-relaxed">
              {section.body}
            </p>
          </div>
        ))}
      </div>

      {/* Invisible scroll triggers maintaining page height for scroll interactions */}
      <div className="relative z-0 pointer-events-none -mt-[100vh]">
        {sections.map((section, index) => (
          <div
            key={section.id}
            id={section.id}
            ref={el => { sectionsRef.current[index] = el; }}
            className="h-screen w-full"
          />
        ))}
      </div>

      {/* Separate About Us Modal Window */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0a0a0a] animate-in fade-in duration-300">
          <div className="relative w-full min-h-screen">
            <button
              onClick={() => setIsAboutOpen(false)}
              className="fixed top-6 right-6 z-[100] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-all duration-300 border border-white/20 hover:scale-110 shadow-2xl backdrop-blur-md"
              aria-label="Close About Window"
            >
              ✕
            </button>
            <div className="clear-both px-4 pb-12 w-full max-w-7xl mx-auto">
              <AboutUsSection />
            </div>
          </div>
        </div>
      )}

      {/* Contact Us Modal Window */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0a0a0a] animate-in fade-in duration-300">
          <div className="relative w-full min-h-screen flex flex-col justify-center">
            <button
              onClick={() => setIsHelpOpen(false)}
              className="fixed top-6 right-6 z-[100] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-all duration-300 border border-white/20 hover:scale-110 shadow-2xl backdrop-blur-md"
              aria-label="Close Help Window"
            >
              ✕
            </button>
            <div className="w-full max-w-7xl mx-auto px-4 py-12">
              <ContactPage />
            </div>
          </div>
        </div>
      )}

      {/* Separate Sign In / Up Modal Window */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-[999] overflow-y-auto bg-black flex items-center justify-center animate-in fade-in duration-300">
          <div className="relative w-full h-full min-h-screen">
            <button
              onClick={() => setIsAuthOpen(false)}
              className="fixed top-5 right-5 z-[1000] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-all duration-300 border border-white/20 hover:scale-110 cursor-pointer shadow-2xl backdrop-blur-md"
              aria-label="Close Sign In Window"
            >
              ✕
            </button>
            <SignInPage onClose={() => setIsAuthOpen(false)} />
          </div>
        </div>
      )}

      <div className={`loading-overlay fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center transition-opacity duration-700 pointer-events-none ${isLoaded ? 'opacity-0' : 'opacity-100'}`}>
        <div className="loading-text text-purple-400 font-mono-code text-sm uppercase tracking-widest animate-pulse flex items-center space-x-3">
          <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading Ethereal Canvas...</span>
        </div>
      </div>
    </div>
  );
}
