"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Sparkles,
  X,
  ArrowRight,
  Lock,
  Zap,
  Crown,
  GraduationCap,
  Users,
  Palette,
  CheckCircle2,
  ShieldCheck,
  Layers,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { OrbitalClock } from "@/components/ui/orbital-clock";

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

export type HorizonRole = 'PARTICIPANT' | 'FOUNDER' | 'MENTOR' | 'AMBASSADOR';

export interface HorizonSectionItem {
  id: string;
  title: string;
  badge: string;
  line1: string;
  line2: string;
  active: boolean;
  ctaText: string;
  modalTitle: string;
  modalSub: string;
  modalDetails: string[];
  actionRoute?: string;
}

export interface RoleConfigItem {
  id: HorizonRole;
  title: string;
  badge: string;
  icon: any;
  color: string;
  textColor: string;
  borderColor: string;
  bgGlow: string;
  tagline: string;
  sections: HorizonSectionItem[];
}

export const ROLE_CONFIG: Record<HorizonRole, RoleConfigItem> = {
  PARTICIPANT: {
    id: 'PARTICIPANT',
    title: 'Participant',
    badge: 'Student Explorer',
    icon: Users,
    color: 'from-blue-600 via-indigo-600 to-cyan-500',
    textColor: 'text-cyan-300',
    borderColor: 'border-cyan-500/40',
    bgGlow: 'rgba(56, 189, 248, 0.15)',
    tagline: 'Collegiate Student Arena & Active Challenges',
    sections: [
      {
        id: 'skill-barter',
        title: 'SKILL BARTER',
        badge: 'Peer Exchange',
        line1: 'Peer-to-peer skill exchange & micro-mentorship,',
        line2: 'trade knowledge and level up together',
        active: true,
        ctaText: 'Enter Skill Barter',
        modalTitle: 'Skill Barter Hub',
        modalSub: 'Peer-to-Peer Exchange System',
        modalDetails: [
          'Exchange design, web dev, and AI skills with peers',
          'Complete barter contracts and earn reputation points',
          'Request 1-on-1 micro-mentorship sessions',
        ],
        actionRoute: '/dashboard?tab=skillbarter',
      },
      {
        id: 'coding-challenge',
        title: 'CODING CHALLENGE',
        badge: 'Live Arena',
        line1: 'Algorithmic contests & real-time benchmarks,',
        line2: 'test your skills and climb the leaderboard',
        active: true,
        ctaText: 'Enter Coding Arena',
        modalTitle: 'Coding Challenge Arena',
        modalSub: 'Competitive Programming League',
        modalDetails: [
          'Solve data structure & algorithm problems in real time',
          'Submit code with automated unit test runner',
          'Climb collegiate leaderboard standings',
        ],
        actionRoute: '/dashboard?tab=competitions',
      },
      {
        id: 'soft-skills',
        title: 'SOFT SKILLS',
        badge: 'Mystery League',
        line1: 'Interactive workshops & communication challenges,',
        line2: 'master leadership, public speaking, and teamwork',
        active: true,
        ctaText: 'Enter Soft Skills Arena',
        modalTitle: 'Mystery Skill League',
        modalSub: 'Soft Skills Challenge Arena',
        modalDetails: [
          'Register for mystery speech & debate events',
          'Collaborate with AI mixed-year student squads',
          'Earn verified credit rewards and badges',
        ],
        actionRoute: '/soft-skills',
      },
      {
        id: 'idea-hub',
        title: 'IDEA HUB',
        badge: 'Launching Soon',
        line1: 'Student project incubator & founder collaboration,',
        line2: 'bring bold ideas to life with peer teams',
        active: false,
        ctaText: 'CHECK THIS',
        modalTitle: 'Idea Hub Incubator',
        modalSub: 'Student Innovation Platform',
        modalDetails: [
          'Incubate multi-disciplinary collegiate projects',
          'Connect with developers, designers, and mentors',
          'Prepare for campus demo day showcases',
        ],
        actionRoute: '/idea-hub',
      },
    ],
  },
  FOUNDER: {
    id: 'FOUNDER',
    title: 'Visual Architect',
    badge: 'Club Leadership',
    icon: Crown,
    color: 'from-purple-600 via-indigo-600 to-amber-500',
    textColor: 'text-purple-300',
    borderColor: 'border-purple-500/40',
    bgGlow: 'rgba(167, 139, 250, 0.15)',
    tagline: 'Visual Architect Executive Governance & Control',
    sections: [
      {
        id: 'skill-barter',
        title: 'SKILL BARTER',
        badge: 'Governance & Audits',
        line1: 'Exchange Oversight, Disputed Trades & Credit Audits,',
        line2: 'audit peer barter agreements and review credit transactions',
        active: true,
        ctaText: 'Open Barter Governance',
        modalTitle: 'Visual Architect • Barter Governance Desk',
        modalSub: 'Peer-to-Peer Market Oversight',
        modalDetails: [
          'Audit peer barter contracts and resolve escrow flags',
          'Review credit circulation metrics and user balances',
          'Approve certified skill badges for high-volume traders',
        ],
        actionRoute: '/dashboard?tab=skillbarter',
      },
      {
        id: 'coding-challenge',
        title: 'CODING CHALLENGE',
        badge: 'Tournament Director',
        line1: 'Tournament Director, Telemetry & Anti-Cheat Command,',
        line2: 'monitor anti-cheat integrity, verify test metrics and scoreboards',
        active: true,
        ctaText: 'Open Tournament Command',
        modalTitle: 'Visual Architect • Coding Tournament Director',
        modalSub: 'Hackathon & Contest Operations',
        modalDetails: [
          'Publish new algorithmic rounds and test suites',
          'Inspect live submission telemetry and anti-cheat flags',
          'Lock official tournament scoreboards and grant prize pools',
        ],
        actionRoute: '/dashboard?tab=competitions',
      },
      {
        id: 'soft-skills',
        title: 'SOFT SKILLS',
        badge: 'Mystery Command',
        line1: 'Mystery Skill League Founder Command Deck,',
        line2: 'approve AI mixed squads, trigger live challenge reveals, and ratify winners',
        active: true,
        ctaText: 'Open Founder Deck',
        modalTitle: 'Visual Architect • Skill League Command',
        modalSub: 'Mystery Event Orchestration',
        modalDetails: [
          'Generate & approve AI cross-year mixed squads',
          'Trigger official timestamped challenge reveals live',
          'Ratify judge winner results and trigger credit rewards',
        ],
        actionRoute: '/soft-skills',
      },
      {
        id: 'idea-hub',
        title: 'IDEA HUB',
        badge: 'Executive Innovation',
        line1: 'Executive Innovation Desk & Milestone Curation,',
        line2: 'curate student pitches, review milestone submissions, and allocate grants',
        active: true,
        ctaText: 'Open Innovation Desk',
        modalTitle: 'Visual Architect • Executive Innovation Desk',
        modalSub: 'Incubation Grant & Team Selection',
        modalDetails: [
          'Review submitted student project proposals and prototypes',
          'Allocate innovation project grants and club server resources',
          'Invite industry judges for campus Demo Day showcases',
        ],
        actionRoute: '/idea-hub',
      },
    ],
  },
  MENTOR: {
    id: 'MENTOR',
    title: 'Mentor',
    badge: 'Code & Skill Reviewer',
    icon: GraduationCap,
    color: 'from-emerald-600 via-teal-600 to-cyan-500',
    textColor: 'text-emerald-300',
    borderColor: 'border-emerald-500/40',
    bgGlow: 'rgba(52, 211, 153, 0.15)',
    tagline: 'Technical Review, Office Hours & Solution Jury',
    sections: [
      {
        id: 'skill-barter',
        title: 'SKILL BARTER',
        badge: 'Mentor Clinic',
        line1: '1-on-1 Office Hours & Skill Barter Clinic,',
        line2: 'offer expert mentoring sessions, verify competencies, and guide students',
        active: true,
        ctaText: 'Open Mentor Clinic',
        modalTitle: 'Mentor • 1-on-1 Mentorship Clinic',
        modalSub: 'Specialized Student Advisory',
        modalDetails: [
          'Publish available 1-on-1 micro-mentorship advisory slots',
          'Endorse student skill competencies and code portfolios',
          'Provide career guidance across Full-Stack, AI, and DevOps',
        ],
        actionRoute: '/dashboard?tab=skillbarter',
      },
      {
        id: 'coding-challenge',
        title: 'CODING CHALLENGE',
        badge: 'Solution Jury',
        line1: 'Algorithmic Solution Jury & Code Review Station,',
        line2: 'review student submission complexity, test cases, and clean code hygiene',
        active: true,
        ctaText: 'Review Submissions',
        modalTitle: 'Mentor • Code Review & Solution Jury',
        modalSub: 'Algorithmic Evaluation Desk',
        modalDetails: [
          'Analyze time/space complexity of top participant solutions',
          'Leave granular code review comments and refactoring tips',
          'Score competitive programming rounds on code quality',
        ],
        actionRoute: '/dashboard?tab=competitions',
      },
      {
        id: 'soft-skills',
        title: 'SOFT SKILLS',
        badge: 'Judge Evaluation',
        line1: 'Soft Skills Jury Evaluation Station,',
        line2: 'score student squad debates, evaluate rhetoric depth and confidence',
        active: true,
        ctaText: 'Open Judge Station',
        modalTitle: 'Mentor • Soft Skills Judge Station',
        modalSub: 'Criteria Scoring & Feedback',
        modalDetails: [
          'Score squads across Communication, Confidence, and Logic',
          'Provide live rubric evaluations during mystery round twists',
          'Submit official results directly to Visual Architect deck',
        ],
        actionRoute: '/soft-skills',
      },
      {
        id: 'idea-hub',
        title: 'IDEA HUB',
        badge: 'Architecture Review',
        line1: 'Technical Feasibility & Architecture Reviewer,',
        line2: 'evaluate student tech stack proposals, architectural diagrams, and scalability',
        active: true,
        ctaText: 'Review Architecture',
        modalTitle: 'Mentor • Technical Architecture Reviewer',
        modalSub: 'Engineering Feasibility Assessment',
        modalDetails: [
          'Evaluate database schema and backend architecture designs',
          'Recommend scalable cloud patterns, caching, and CI/CD pipelines',
          'Mentor student leads through MVP delivery milestones',
        ],
        actionRoute: '/idea-hub',
      },
    ],
  },
  AMBASSADOR: {
    id: 'AMBASSADOR',
    title: 'Community Ambassador',
    badge: 'Design & Outreach Lead',
    icon: Palette,
    color: 'from-pink-600 via-purple-600 to-amber-500',
    textColor: 'text-pink-300',
    borderColor: 'border-pink-500/40',
    bgGlow: 'rgba(244, 114, 182, 0.15)',
    tagline: 'Community Engagement, Pitch Nights & Live Hosting',
    sections: [
      {
        id: 'skill-barter',
        title: 'SKILL BARTER',
        badge: 'Matchmaking Hub',
        line1: 'Community Cohort Skill Matching Desk,',
        line2: 'facilitate cross-year cohort matchings, run onboarding workshops',
        active: true,
        ctaText: 'Open Matchmaking Hub',
        modalTitle: 'Ambassador • Skill Matchmaking Hub',
        modalSub: 'Community Cohort Facilitation',
        modalDetails: [
          'Host peer matching mixer sessions for new club members',
          'Guide junior students into their first skill barter trade',
          'Track community engagement and collaboration streaks',
        ],
        actionRoute: '/dashboard?tab=skillbarter',
      },
      {
        id: 'coding-challenge',
        title: 'CODING CHALLENGE',
        badge: 'Sprint Coordinator',
        line1: 'Live Hackathon Sprint & Check-in Coordinator,',
        line2: 'manage hackathon check-ins, sprint engagement, and live crowd cheers',
        active: true,
        ctaText: 'Coordinate Sprints',
        modalTitle: 'Ambassador • Sprint Coordination Desk',
        modalSub: 'Event Check-In & Engagement',
        modalDetails: [
          'Verify live participant check-ins and discord roles',
          'Distribute official sprint badges and digital collectibles',
          'Broadcast live leaderboard milestones to the club community',
        ],
        actionRoute: '/dashboard?tab=competitions',
      },
      {
        id: 'soft-skills',
        title: 'SOFT SKILLS',
        badge: 'Stage Host',
        line1: 'Live Mystery League Stage Host & Check-in,',
        line2: 'coordinate stage announcements, run participant check-ins, and surprise twists',
        active: true,
        ctaText: 'Open Live Stage Desk',
        modalTitle: 'Ambassador • Live Stage & Check-In Desk',
        modalSub: 'Tournament Master of Ceremonies',
        modalDetails: [
          'Facilitate live participant muster and roster verification',
          'Announce live round twists and countdown timers',
          'Document tournament highlights for club social channels',
        ],
        actionRoute: '/soft-skills',
      },
      {
        id: 'idea-hub',
        title: 'IDEA HUB',
        badge: 'Pitch Night Arena',
        line1: 'Community Pitch Night & Open-Mic Arena,',
        line2: 'host open-mic showcase nights, gather student crowd votes, and celebrate teams',
        active: true,
        ctaText: 'Open Pitch Arena',
        modalTitle: 'Ambassador • Community Pitch Night',
        modalSub: 'Demo Day Showcase Coordination',
        modalDetails: [
          'Host weekly open-mic 3-minute lightning pitch sessions',
          'Collect crowd choice votes and peer feedback',
          'Showcase rising student projects across campus',
        ],
        actionRoute: '/idea-hub',
      },
    ],
  },
};

const sectionData = ROLE_CONFIG.PARTICIPANT.sections;

interface ComponentProps {
  onLogout?: () => void;
}

export const Component = ({ onLogout }: ComponentProps = {}) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<HorizonRole>('PARTICIPANT');
  const [activeRoleModal, setActiveRoleModal] = useState<HorizonSectionItem | null>(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [lockedModalSection, setLockedModalSection] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [ideaHubNotified, setIdeaHubNotified] = useState(false);
  const [ideaHubNotifyLoading, setIdeaHubNotifyLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'FOUNDER') {
        setCurrentRole('FOUNDER');
      } else if ((user as any).role === 'MENTOR') {
        setCurrentRole('MENTOR');
      } else if (user.role === 'VOLUNTEER' || (user as any).role === 'AMBASSADOR') {
        setCurrentRole('AMBASSADOR');
      } else {
        setCurrentRole('PARTICIPANT');
      }
    }
  }, [user]);

  const activeRoleConfig = ROLE_CONFIG[currentRole] || ROLE_CONFIG.PARTICIPANT;
  const sectionData = activeRoleConfig.sections;

  const handleIdeaHubNotify = async () => {
    setIdeaHubNotifyLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setIdeaHubNotifyLoading(false);
    setIdeaHubNotified(true);
  };

  const sectionTabMap: Record<string, string> = {
    "skill-barter": "skillbarter",
    "coding-challenge": "competitions",
    "soft-skills": "soft-skills",
    "idea-hub": "ideas",
  };

  const handleNavigateSection = (sectionId: string) => {
    const secObj = sectionData.find((s) => s.id === sectionId);
    if (!secObj) return;

    // PARTICIPANT: Full access to active contents across all 4 pillars
    if (currentRole === 'PARTICIPANT') {
      if (sectionId === "soft-skills") {
        router.push("/soft-skills");
        return;
      }
      if (sectionId === "idea-hub") {
        setLockedModalSection("IDEA HUB");
        return;
      }
      const targetTab = sectionTabMap[sectionId] || "skillbarter";
      router.push(`/dashboard?tab=${targetTab}`);
      return;
    }

    // VISUAL ARCHITECT, MENTOR, COMMUNITY AMBASSADOR:
    // Opens dedicated empty role workspace for that pillar
    router.push(`/horizon/workspace?role=${currentRole.toLowerCase()}&section=${sectionId}`);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (onLogout) {
        onLogout();
      } else {
        await logout();
        router.push("/join");
      }
    } catch (e) {
      console.error(e);
      router.push("/join");
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 4;

  // Dispatch reach-horizon event so AI Assistant knows user is on Horizon page
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("anvaya-tour-event", { detail: { type: "reach-horizon" } }));
    }
    return () => {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("anvaya-tour-event", { detail: { type: "leave-horizon" } }));
      }
    };
  }, []);

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

  useEffect(() => {
    const handleTourEvent = (e: any) => {
      if (e.detail?.type === 'set-horizon-section') {
        const index = (e.detail.sectionIndex || 1) - 1;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const maxScroll = documentHeight - windowHeight;
        const targetScroll = (index / (totalSections - 1)) * maxScroll;
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    };
    window.addEventListener('anvaya-tour-event', handleTourEvent);
    return () => window.removeEventListener('anvaya-tour-event', handleTourEvent);
  }, [totalSections]);

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

      const scrollToSection = (index: number) => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const maxScroll = documentHeight - windowHeight;
        const targetScroll = (index / (totalSections - 1)) * maxScroll;
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      };

      // 1. Camera Positions for SKILL BARTER -> CODING CHALLENGE -> SOFT SKILLS -> IDEA HUB
      const cameraPositions = [
        { x: 0, y: 30, z: 300 },   // Section 1 - SKILL BARTER
        { x: 0, y: 40, z: -50 },   // Section 2 - CODING CHALLENGE
        { x: 0, y: 55, z: -450 },  // Section 3 - SOFT SKILLS
        { x: 0, y: 70, z: -900 },  // Section 4 - IDEA HUB
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

      // 3. Dynamic Environment Fog & Background Shift across 4 sections
      const color1 = new THREE.Color(0x060410); // SKILL BARTER
      const color2 = new THREE.Color(0x040c24); // CODING CHALLENGE
      const color3 = new THREE.Color(0x180224); // SOFT SKILLS
      const color4 = new THREE.Color(0x22081a); // IDEA HUB

      const targetFog = new THREE.Color();
      if (progress < 0.333) {
        targetFog.lerpColors(color1, color2, progress * 3);
      } else if (progress < 0.666) {
        targetFog.lerpColors(color2, color3, (progress - 0.333) * 3);
      } else {
        targetFog.lerpColors(color3, color4, (progress - 0.666) * 3);
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
        if (progress > 0.85) {
          mountain.position.z = 600000;
        }
        if (progress <= 0.85 && refs.locations && refs.locations[i] !== undefined) {
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
      <span
        key={i}
        className={char === " " ? "inline-block w-4 sm:w-7 md:w-9" : "title-char"}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  const scrollToSection = (index: number) => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = documentHeight - windowHeight;
    const targetScroll = (index / (totalSections - 1)) * maxScroll;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const getDynamicBgStyle = () => {
    if (scrollProgress < 0.333) {
      const t = scrollProgress * 3;
      return {
        background: `radial-gradient(ellipse at 50% 30%, rgba(${Math.round(18 + t * 10)}, ${Math.round(10 + t * 14)}, ${Math.round(36 + t * 30)}, 0.95) 0%, rgba(${Math.round(6 + t * 6)}, ${Math.round(4 + t * 8)}, ${Math.round(14 + t * 20)}, 1) 70%, #000 100%)`,
      };
    } else if (scrollProgress < 0.666) {
      const t = (scrollProgress - 0.333) * 3;
      return {
        background: `radial-gradient(ellipse at 50% 30%, rgba(${Math.round(28 + t * 10)}, ${Math.round(24 - t * 14)}, ${Math.round(66 - t * 16)}, 0.95) 0%, rgba(${Math.round(12 + t * 12)}, ${Math.round(12 - t * 8)}, ${Math.round(34 - t * 10)}, 1) 70%, #000 100%)`,
      };
    } else {
      const t = (scrollProgress - 0.666) * 3;
      return {
        background: `radial-gradient(ellipse at 50% 30%, rgba(${Math.round(38 + t * 10)}, ${Math.round(10 + t * 10)}, ${Math.round(50 + t * 20)}, 0.95) 0%, rgba(${Math.round(24 + t * 8)}, ${Math.round(4 + t * 4)}, ${Math.round(24 + t * 10)}, 1) 70%, #000 100%)`,
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

      {/* Interactive 4-Scroll Header Navigator with ROLE SWITCHER & LOG OUT Button */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 flex flex-wrap items-center justify-center gap-2 bg-slate-950/90 border border-purple-500/40 p-1.5 rounded-full backdrop-blur-2xl shadow-2xl pointer-events-auto max-w-[95vw]">
        {/* Role Locked Pill (Strictly Locked to Authenticated Section) */}
        <div className="relative">
          <div
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider font-bold flex items-center gap-1.5 shadow-sm border select-none ${
              currentRole === 'FOUNDER'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : currentRole === 'MENTOR'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : currentRole === 'AMBASSADOR'
                ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                : 'bg-blue-500/20 text-cyan-300 border-blue-500/40'
            }`}
            title={`Your session is locked to the ${activeRoleConfig.title} section.`}
          >
            {currentRole === 'FOUNDER' && <Crown className="w-3.5 h-3.5 text-purple-300" />}
            {currentRole === 'MENTOR' && <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />}
            {currentRole === 'AMBASSADOR' && <Palette className="w-3.5 h-3.5 text-pink-300" />}
            {currentRole === 'PARTICIPANT' && <Users className="w-3.5 h-3.5 text-cyan-300" />}
            <span>{activeRoleConfig.title}</span>
            <span className="text-[10px] opacity-75 font-mono ml-0.5" title="Section Locked">🔒</span>
          </div>
        </div>

        <div className="h-4 w-px bg-white/20 mx-0.5" />

        {/* 4 Pillars Navigation Buttons */}
        {sectionData.map((sec, idx) => {
          const isActive = currentSection === idx + 1;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                isActive
                  ? `bg-gradient-to-r ${activeRoleConfig.color} text-white font-extrabold shadow-lg shadow-purple-500/40 scale-105`
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {sec.title}
            </button>
          );
        })}

        <div className="h-4 w-px bg-white/20 mx-0.5" />

        {/* Dashboard Link */}
        <button
          onClick={() => router.push('/dashboard')}
          className="px-3 py-1.5 rounded-full text-xs font-mono tracking-wider text-purple-300 hover:text-white hover:bg-purple-500/20 border border-purple-500/40 transition-all duration-300 flex items-center gap-1 cursor-pointer shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span className="hidden sm:inline">DASHBOARD</span>
        </button>

        {/* Log Out Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="px-3 py-1.5 rounded-full text-xs font-mono tracking-wider text-rose-300 hover:text-white hover:bg-rose-500/20 border border-rose-500/30 transition-all duration-300 flex items-center gap-1 cursor-pointer shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">LOG OUT</span>
        </button>
      </div>

      {/* Role-Specific Interactive Pillar Modal */}
      <AnimatePresence>
        {activeRoleModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 pointer-events-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#0c0a14] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-5 overflow-hidden"
            >
              <div 
                className="absolute inset-0 pointer-events-none -z-10"
                style={{ background: `radial-gradient(circle at 50% 30%, ${activeRoleConfig.bgGlow} 0%, rgba(12, 10, 20, 0.98) 70%)` }}
              />

              <button
                type="button"
                onClick={() => setActiveRoleModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider">
                  <span className={activeRoleConfig.textColor}>● {activeRoleConfig.title}</span>
                  <span className="text-slate-400">• {activeRoleModal.badge}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white font-heading">
                  {activeRoleModal.modalTitle}
                </h3>
                <p className="text-xs text-purple-200/80 font-mono">
                  {activeRoleModal.modalSub}
                </p>
              </div>

              <div className="space-y-2.5 bg-black/40 p-4 rounded-2xl border border-white/10 text-xs text-slate-200">
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Role Capabilities & Responsibilities:
                </p>
                {activeRoleModal.modalDetails.map((detail, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const route = activeRoleModal.actionRoute || '/dashboard';
                    setActiveRoleModal(null);
                    router.push(route);
                  }}
                  className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${activeRoleConfig.color} hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer font-mono flex items-center justify-center gap-2`}
                >
                  <span>Launch {activeRoleModal.title} Deck →</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRoleModal(null)}
                  className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sleek Log Out Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-slate-950 border border-rose-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-5"
            >
              <button
                onClick={() => setShowLogoutModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <LogOut className="w-7 h-7 text-rose-400" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-white font-heading">
                  Confirm Log Out
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Are you sure you want to end your Horizon session and log out of the digital ecosystem?
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-all cursor-pointer font-sans"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLogout}
                  disabled={isLoggingOut}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer font-sans flex items-center justify-center gap-1.5"
                >
                  {isLoggingOut ? (
                    <span>Logging out...</span>
                  ) : (
                    <>
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
        <div className="scroll-text font-mono text-[10px] tracking-widest text-slate-300">
          PRESS SPACE ␣ OR SCROLL
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="section-counter font-mono text-xs font-bold text-purple-300">
          {String(currentSection).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}
        </div>
      </div>

      {/* Sleek Coming Soon / Event Locked Modal (Participant Idea Hub) */}
      <AnimatePresence>
        {lockedModalSection && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 pointer-events-auto">
            {lockedModalSection === "IDEA HUB" ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-lg bg-[#08070d]/95 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4 overflow-hidden"
              >
                <div 
                  className="absolute inset-0 pointer-events-none -z-10"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(167, 139, 250, 0.2) 0%, rgba(8, 7, 13, 0.98) 75%)' }}
                />

                <button
                  type="button"
                  onClick={() => setLockedModalSection(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <p className="text-[10px] uppercase tracking-[0.4em] text-purple-300/80 font-mono">
                  Club Idea Hub
                </p>

                <h1 className="font-playfair font-serif text-3xl sm:text-4xl text-center font-bold tracking-tight text-white">
                  Launching <span className="italic text-[color:var(--orb-primary,#a78bfa)]">soon.</span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 text-center max-w-md mx-auto leading-relaxed">
                  Where every student pitch, prototype, and half-formed 2am idea gets a real home.
                </p>

                <div className="py-2 flex items-center justify-center">
                  <OrbitalClock />
                </div>

                <p className="text-xs text-slate-400 font-mono tracking-wide">
                  [ local time ]
                </p>

                {/* Notify Card */}
                <div className="w-full max-w-[420px] mx-auto flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-5 py-4 text-left">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-mono text-purple-300 mb-1">
                      Status
                    </p>
                    <p className="font-serif text-base text-white">Building final modules</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleIdeaHubNotify}
                    disabled={ideaHubNotifyLoading || ideaHubNotified}
                    className={`shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-all
                      ${ideaHubNotified
                        ? "bg-emerald-400/90 text-black cursor-default"
                        : "bg-[color:var(--orb-primary,#a78bfa)] text-black hover:brightness-110 hover:-translate-y-0.5"
                      }
                      disabled:opacity-70`}
                  >
                    {ideaHubNotifyLoading ? "Adding…" : ideaHubNotified ? "You're on the list" : "Notify me"}
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLockedModalSection(null);
                      router.push('/idea-hub');
                    }}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-all cursor-pointer font-mono flex items-center justify-center gap-1.5"
                  >
                    <span>Open Standalone Launch Route →</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-md bg-slate-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-5"
              >
                <button
                  type="button"
                  onClick={() => setLockedModalSection(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-amber-400" />
                </div>

                <div className="space-y-1.5">
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider mb-1">
                    🔒 Coming Soon • Event Locked
                  </div>
                  <h3 className="text-xl font-extrabold text-white font-heading">
                    {lockedModalSection}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    This section is currently locked & coming soon for participants. Please enter active events to participate!
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLockedModalSection(null);
                      scrollToSection(0);
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer font-mono flex items-center justify-center gap-1.5"
                  >
                    <span>Go to Active Event →</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* High-Contrast Synchronized Wording Overlay with Double-Click & Button Entry */}
      <div 
        onDoubleClick={() => handleNavigateSection(activeData.id)}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center w-full max-w-5xl px-6 pointer-events-auto cursor-pointer select-none"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentRole}-${activeData.title}`}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* Role Header Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-900/90 border border-white/15 text-xs font-mono mb-3 shadow-xl backdrop-blur-md">
              <span className={`font-bold ${activeRoleConfig.textColor}`}>
                ● {activeRoleConfig.title}
              </span>
              <span className="text-slate-400">• {activeData.badge}</span>
            </div>

            {/* Title with Vibrant Gradient, High Contrast Text Glow, and Drop Shadow */}
            <h1 
              onDoubleClick={() => handleNavigateSection(activeData.id)}
              className="hero-title font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-amber-200 tracking-tight leading-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)] select-none hover:scale-[1.02] transition-transform"
            >
              {splitTitle(activeData.title)}
            </h1>

            {/* Subtitle Card Container with Backdrop Blur, Direct CTA Button and Double Click Indicator */}
            <div 
              onDoubleClick={() => handleNavigateSection(activeData.id)}
              className="mt-6 space-y-4 text-white font-sans max-w-3xl bg-slate-950/85 border border-purple-500/40 backdrop-blur-2xl px-8 py-6 rounded-3xl shadow-2xl cursor-pointer hover:border-purple-400/80 hover:bg-slate-950/90 transition-all group pointer-events-auto select-none"
            >
              <div className="space-y-1">
                <p className="text-lg sm:text-2xl font-medium tracking-wide text-purple-100 drop-shadow-md">
                  {activeData.line1}
                </p>
                <p className="text-base sm:text-xl font-normal tracking-wide text-amber-300 drop-shadow-md">
                  {activeData.line2}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigateSection(activeData.id);
                  }}
                  className={`px-7 py-3.5 rounded-2xl bg-gradient-to-r ${activeRoleConfig.color} hover:brightness-110 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-105 cursor-pointer font-mono`}
                >
                  <span>{activeData.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 text-xs font-mono text-purple-300">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
                    {activeData.active ? (
                      <span>⚡ {activeData.badge}</span>
                    ) : (
                      <span>🔒 {activeData.badge}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Invisible scroll track to enable natural wheel/trackpad scrolling across 4 sections */}
      <div className="scroll-sections relative z-10 opacity-0 pointer-events-none">
        <div className="h-screen" />
        <div className="h-screen" />
        <div className="h-screen" />
        <div className="h-screen" />
      </div>
    </div>
  );
};
