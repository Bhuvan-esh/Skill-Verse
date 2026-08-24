"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAuth } from "@/context/AuthContext";
import { X, ArrowRight, Check, ShieldAlert, ShieldCheck, Crown, Palette, GraduationCap, Users, ArrowLeft, Sparkles } from "lucide-react";
import { Component as HorizonHeroSection } from "@/components/ui/horizon-hero-section";

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}

interface SignInPageProps {
  className?: string;
  onClose?: () => void;
}

export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean;
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
            ${reverse ? "u_reverse_active" : "false"}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
      u_reverse: {
        value: shader.includes("u_reverse_active") ? 1 : 0,
        type: "uniform1i",
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes("x")
                ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            ${
              center.includes("y")
                ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }

            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            float animation_speed_factor = 0.5;
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);

            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                 opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                 opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                 opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                 opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }

            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};

const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60,
}: {
  source: string;
  hovered?: boolean;
  maxFps?: number;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    const material: any = ref.current.material;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = timestamp;
  });

  const getUniforms = () => {
    const preparedUniforms: any = {};

    for (const uniformName in uniforms) {
      const uniform: any = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
          break;
        case "uniform1i":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1i" };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value),
            type: "3f",
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: uniform.value.map((v: number[]) =>
              new THREE.Vector3().fromArray(v)
            ),
            type: "3fv",
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value),
            type: "2f",
          };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }

    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    };
    return preparedUniforms;
  };

  const material = useMemo(() => {
    const materialObject = new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });

    return materialObject;
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const defaultTextColor = "text-gray-400";
  const hoverTextColor = "text-white";
  const textSizeClass = "text-xs sm:text-sm font-medium";

  return (
    <a href={href} className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-300 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </a>
  );
};

function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState("rounded-full");
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass("rounded-xl");
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass("rounded-full");
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const logoElement = (
    <Link href="/" className="relative w-5 h-5 flex items-center justify-center">
      <span className="absolute w-1.5 h-1.5 rounded-full bg-purple-400 top-0 left-1/2 transform -translate-x-1/2 opacity-90 shadow-sm shadow-purple-400"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-indigo-400 left-0 top-1/2 transform -translate-y-1/2 opacity-90 shadow-sm shadow-indigo-400"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 right-0 top-1/2 transform -translate-y-1/2 opacity-90 shadow-sm shadow-amber-400"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-white bottom-0 left-1/2 transform -translate-x-1/2 opacity-90"></span>
    </Link>
  );

  const navLinksData = [
    { label: "Home", href: "/" },
    { label: "Manifesto", href: "#1" },
    { label: "Discover", href: "#2" },
  ];

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center pl-6 pr-6 py-3 backdrop-blur-md ${headerShapeClass} border border-white/10 bg-[#12121680] w-[calc(100%-2rem)] sm:w-auto transition-[border-radius] duration-200 ease-in-out shadow-2xl`}>
      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center">
          {logoElement}
        </div>

        <nav className="hidden sm:flex items-center space-x-5 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          <Link href="/" className="px-4 py-1.5 text-xs font-semibold border border-white/15 bg-white/5 text-gray-200 rounded-full hover:border-white/40 hover:text-white transition-all">
            Home
          </Link>
          <div className="relative group">
            <div className="absolute inset-0 -m-1 rounded-full bg-purple-500 opacity-30 filter blur-md pointer-events-none transition-all group-hover:opacity-60"></div>
            <button className="relative z-10 px-4 py-1.5 text-xs font-bold text-black bg-gradient-to-br from-white to-gray-200 rounded-full hover:from-gray-100 hover:to-gray-300 transition-all">
              Join Club
            </button>
          </div>
        </div>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? "Close Menu" : "Open Menu"}>
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden ${isOpen ? "max-h-[300px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0 pointer-events-none"}`}>
        <nav className="flex flex-col items-center space-y-3 text-sm w-full">
          {navLinksData.map((link) => (
            <a key={link.href} href={link.href} className="text-gray-300 hover:text-white transition-colors w-full text-center">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

// Colored Google G Icon SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.65-.79 1.1-1.9 0.98-3.01-.95.04-2.12.63-2.8 1.43-.6.69-1.13 1.82-.99 2.91 1.07.08 2.17-.54 2.81-1.33z" />
  </svg>
);

const roleOptions = [
  {
    id: "founder",
    title: "Visual Architects",
    badge: "Club Leadership",
    icon: Crown,
    gradient: "from-purple-500/25 via-purple-600/10 to-transparent",
    border: "hover:border-purple-400/60 border-purple-500/30",
    iconBg: "bg-purple-500/20 text-purple-300",
    desc: "Oversee club operations, manage team requests, and direct strategy.",
  },
  {
    id: "architect",
    title: "Community Ambassador",
    badge: "Design & UX Lead",
    icon: Palette,
    gradient: "from-pink-500/25 via-pink-600/10 to-transparent",
    border: "hover:border-pink-400/60 border-pink-500/30",
    iconBg: "bg-pink-500/20 text-pink-300",
    desc: "Craft interactive 3D UI, design systems, and aesthetic direction.",
  },
  {
    id: "mentor",
    title: "Mentors",
    badge: "Guidance & Review",
    icon: GraduationCap,
    gradient: "from-emerald-500/25 via-emerald-600/10 to-transparent",
    border: "hover:border-emerald-400/60 border-emerald-500/30",
    iconBg: "bg-emerald-500/20 text-emerald-300",
    desc: "Provide technical mentorship, code reviews, and guide project teams.",
  },
  {
    id: "participant",
    title: "Participants",
    badge: "Student Builder",
    icon: Users,
    gradient: "from-blue-500/25 via-blue-600/10 to-transparent",
    border: "hover:border-blue-400/60 border-blue-500/30",
    iconBg: "bg-blue-500/20 text-blue-300",
    desc: "Brainstorm ideas, join hackathons, and build projects with club peers.",
  },
];

export const SignInPage = ({ className, onClose }: SignInPageProps) => {
  const router = useRouter();
  const { user, refreshUser, logout } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noMarketing, setNoMarketing] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [usnInput, setUsnInput] = useState("");
  const [socialProvider, setSocialProvider] = useState<"Google" | "Apple" | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("participant");
  const [step, setStep] = useState<"email" | "google-confirm" | "role" | "code" | "success">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [oauthStatus, setOauthStatus] = useState<string | null>(null);
  const [oauthRole, setOauthRole] = useState<string | null>(null);
  const [docModalTab, setDocModalTab] = useState<"terms" | "privacy" | null>(null);
  const [showInlineTerms, setShowInlineTerms] = useState<"terms" | "privacy" | null>(null);

  const handleSocialSignUp = async (provider: "Google" | "Apple") => {
    setSocialProvider(provider);
    setError("");
    setLoading(true);

    try {
      const { signInWithGoogle, signInWithApple } = await import("@/lib/authService");

      let result: any;
      if (provider === "Google") {
        result = await signInWithGoogle();
      } else {
        result = await signInWithApple();
      }

      if (result.email) setEmail(result.email);
      if (result.firstName) setFirstName(result.firstName);
      if (result.lastName) setLastName(result.lastName);
      setFirebaseUid(result.uid);
      setOauthStatus(result.status || "pending_role");
      setOauthRole(result.role || null);

      // Always show Google Account Confirmation with Terms agreement
      setStep("google-confirm");
    } catch (err: any) {
      console.error(`${provider} Auth Error:`, err);
      if (err?.code === "auth/popup-closed-by-user") {
        setError(`${provider} Sign-In popup was closed.`);
      } else if (err?.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized. Add 'localhost' to Firebase Console → Authentication → Settings → Authorized domains.");
      } else {
        setError(err?.message || `Failed to authenticate with ${provider}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleConfirmContinue = async () => {
    if (!termsAgreed) {
      setError("Please agree to the Terms and Services to continue.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const isDefaultArchitect = ["anushabhat2762@gmail.com", "bhuvanj06@gmail.com"].includes((email || "").toLowerCase());
      const isApproved = oauthStatus === "approved" || isDefaultArchitect;

      if (isApproved) {
        try {
          await fetch("/api/auth/select-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: oauthRole || (isDefaultArchitect ? "founder" : "participant"),
              email: email,
              name: `${firstName || ''} ${lastName || ''}`.trim() || email?.split('@')[0],
              firebase_uid: firebaseUid,
            }),
          });
        } catch (_) {}
        await refreshUser();
        triggerSuccessState();
      } else if (oauthStatus === "pending_approval") {
        router.push(
          `/pending-approval?role=participant&name=${encodeURIComponent(firstName || 'Student')}&email=${encodeURIComponent(email || '')}`
        );
      } else {
        // Proceed to role selection
        setStep("role");
      }
    } catch (err: any) {
      console.error("Google confirmation error:", err);
      setError(err?.message || "Failed to proceed.");
    } finally {
      setLoading(false);
    }
  };


  const handleRoleSelect = async (roleId: string) => {
    setSelectedRole(roleId);
    setLoading(true);
    setError("");

    const mappedRole =
      roleId === "founder" || roleId === "architect"
        ? "visual_architect"
        : roleId === "ambassador" || roleId === "volunteer"
        ? "community_ambassador"
        : roleId === "mentor"
        ? "mentor"
        : "participant";

    const displayName = firstName ? `${firstName} ${lastName}`.trim() : usnInput || "Student";
    const userEmail = email || "";

    // Firebase OAuth path (Google / Apple)
    if (firebaseUid) {
      try {
        const { chooseRole } = await import("@/lib/authService");
        const status = await chooseRole(
          firebaseUid,
          mappedRole as "visual_architect" | "community_ambassador" | "mentor" | "participant"
        );

        const res = await fetch("/api/auth/select-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: roleId,
            email: userEmail,
            name: displayName,
            firebase_uid: firebaseUid,
          }),
        });
        const data = await res.json();

        if (res.ok) {
          await refreshUser();
          if (status === "approved" || data.approval_status === "APPROVED" || mappedRole === "visual_architect") {
            triggerSuccessState();
          } else {
            const displayRole =
              mappedRole === "community_ambassador" ? "ambassador"
              : mappedRole === "visual_architect" ? "ambassador"
              : mappedRole;
            router.push(
              `/pending-approval?role=${displayRole}&name=${encodeURIComponent(displayName)}&email=${encodeURIComponent(userEmail)}`
            );
          }
        } else {
          setError(data.error || "Authentication failed");
        }
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Connection error. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Legacy path — non-Firebase users (USN/OTP flow)
    try {
      const res = await fetch("/api/auth/select-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: roleId,
          email: userEmail || (roleId === "founder" ? "architect@club.edu" : "participant@club.edu"),
          name: displayName,
          usn: usnInput || undefined,
          firebase_uid: undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        await refreshUser();
        if (roleId === "founder" || data.approval_status === "APPROVED") {
          triggerSuccessState();
          return;
        }
        const displayRole =
          roleId === "architect" || roleId === "ambassador" || roleId === "volunteer"
            ? "ambassador"
            : roleId === "mentor"
            ? "mentor"
            : "participant";
        router.push(
          `/pending-approval?role=${displayRole}&name=${encodeURIComponent(displayName)}&email=${encodeURIComponent(userEmail)}`
        );
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (e) {
      console.error(e);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!termsAgreed) {
      setError("Please agree to the Terms and Services to continue.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Direct Database Auth via select-role API
      const res = await fetch("/api/auth/select-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          email: email.trim().toLowerCase(),
          name: firstName ? `${firstName} ${lastName}`.trim() : email.split("@")[0],
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await refreshUser();
        if (data.approval_status === "APPROVED" || selectedRole === "founder" || selectedRole === "architect") {
          triggerSuccessState();
        } else {
          const displayName = firstName ? `${firstName} ${lastName}`.trim() : email.split("@")[0];
          window.location.href = `/pending-approval?role=${selectedRole}&name=${encodeURIComponent(displayName)}&email=${encodeURIComponent(email)}`;
        }
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err?.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  const handleQuickPreset = async (emailPreset: string, passwordPreset: string, rolePreset: string) => {
    setEmail(emailPreset);
    setPassword(passwordPreset);
    setSelectedRole(rolePreset);
    setTermsAgreed(true);
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/select-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: rolePreset,
          email: emailPreset,
          password: passwordPreset,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await refreshUser();
        if (data.approval_status === "APPROVED" || rolePreset === "founder" || rolePreset === "architect") {
          triggerSuccessState();
        } else {
          const nameToUse = data.user?.name || "Student";
          window.location.href = `/pending-approval?role=${rolePreset}&name=${encodeURIComponent(nameToUse)}&email=${encodeURIComponent(emailPreset)}`;
        }
      } else {
        setError(data.error || "Preset login failed.");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to log in with preset.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleTourEvent = (e: any) => {
      if (e.detail?.type === "skip-to-horizon") {
        triggerSuccessState();
      }
    };
    window.addEventListener("orzya-tour-event", handleTourEvent);
    return () => window.removeEventListener("orzya-tour-event", handleTourEvent);
  }, []);

  const triggerSuccessState = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("orzya-tour-event", { detail: { type: "auth-success" } }));
    }
    setReverseCanvasVisible(true);
    setTimeout(() => {
      setInitialCanvasVisible(false);
    }, 50);

    setTimeout(() => {
      setStep("success");
      router.push("/horizon");
    }, 1800);
  };

  useEffect(() => {
    if (step === "success") {
      router.push("/horizon");
    }
  }, [step, router]);

  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 300);
    }
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }

      if (index === 5 && value) {
        const isComplete = newCode.every((digit) => digit.length === 1);
        if (isComplete) {
          verifyOtpAndEnter(newCode.join(""));
        }
      }
    }
  };

  const verifyOtpAndEnter = async (enteredCode: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/student/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usn: usnInput || "1MS21CS001", code: enteredCode }),
      });
      const data = await res.json();
      if (res.ok) {
        let roleApproval = data.approval_status;

        if (selectedRole && selectedRole !== 'participant') {
          const roleRes = await fetch("/api/auth/select-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: selectedRole, usn: usnInput, name: firstName ? `${firstName} ${lastName}`.trim() : undefined }),
          });
          const roleData = await roleRes.json();
          if (roleData.approval_status) {
            roleApproval = roleData.approval_status;
          }
        }
        await refreshUser();

        // If approved (or founder), enter immediately:
        if (roleApproval === "APPROVED" || selectedRole === "founder") {
          triggerSuccessState();
          return;
        }

        // If first-time pending registration:
        const mappedRole =
          selectedRole === "architect" || selectedRole === "ambassador" || selectedRole === "volunteer"
            ? "ambassador"
            : selectedRole === "mentor"
            ? "mentor"
            : "participant";
        const displayName = firstName ? `${firstName} ${lastName}`.trim() : usnInput || "Student";
        router.push(`/pending-approval?role=${mappedRole}&name=${encodeURIComponent(displayName)}&email=${encodeURIComponent(email || '')}`);
        return;
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (e) {
      console.error(e);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setCode(["", "", "", "", "", ""]);
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
    setError("");
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
    setStep("email");
    setCode(["", "", "", "", "", ""]);
    if (onClose) {
      onClose();
    } else {
      window.location.reload();
    }
  };

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-[9999] bg-black text-white w-screen h-screen overflow-y-auto selection:bg-purple-500 selection:text-white pointer-events-auto">
        {/* 3D Horizon Hero Section */}
        <HorizonHeroSection onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col min-h-screen bg-black text-slate-100 relative selection:bg-purple-500 selection:text-white overflow-hidden", className)}>
      
      {/* 3D Canvas Background Layer */}
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[
                [255, 255, 255],
                [255, 255, 255],
              ]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}

        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-black"
              colors={[
                [255, 255, 255],
                [255, 255, 255],
              ]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16">
        
        {/* Content Card Container matching Image 2 design */}
        <div className="w-full max-w-md mx-auto my-auto p-6 sm:p-8 bg-[#09090b]/80 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl relative">
          
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all z-20"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.div
                key="email-step"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-5 text-left"
              >
                {/* Header */}
                <div className="space-y-1">
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                    Create an account
                  </h1>
                  <p className="text-sm text-slate-400 font-light font-sans">
                    Brainstorm in chat, build in cowork
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Social Sign Up Buttons */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSocialSignUp("Google")}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0f0f12]/90 hover:bg-[#1a1a22] text-white border border-white/15 hover:border-purple-400/50 rounded-xl py-2.5 px-3 transition-all text-xs sm:text-sm font-medium shadow-sm font-sans group cursor-pointer"
                  >
                    <GoogleIcon />
                    <span>Sign up with Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialSignUp("Apple")}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0f0f12]/90 hover:bg-[#1a1a22] text-white border border-white/15 hover:border-purple-400/50 rounded-xl py-2.5 px-3 transition-all text-xs sm:text-sm font-medium shadow-sm font-sans group cursor-pointer"
                  >
                    <AppleIcon />
                    <span>Sign up with Apple</span>
                  </button>
                </div>

                {/* Or Divider */}
                <div className="flex items-center gap-4 py-1">
                  <div className="h-px bg-white/10 flex-1" />
                  <span className="text-gray-400 text-sm font-sans">or</span>
                  <div className="h-px bg-white/10 flex-1" />
                </div>

                {/* Form Inputs matching Image 2 */}
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative flex items-center justify-between bg-[#0f0f12]/90 border border-white/15 focus-within:border-white/40 rounded-xl px-3.5 py-2.5 transition-all">
                      <input
                        type="text"
                        placeholder="Harshit"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none font-sans pr-2"
                      />
                      <span className="text-xs sm:text-sm text-slate-300 font-sans pointer-events-none whitespace-nowrap font-medium">
                        First Name
                      </span>
                    </div>
                    <div className="relative flex items-center justify-between bg-[#0f0f12]/90 border border-white/15 focus-within:border-white/40 rounded-xl px-3.5 py-2.5 transition-all">
                      <input
                        type="text"
                        placeholder="Sharma"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none font-sans pr-2"
                      />
                      <span className="text-xs sm:text-sm text-slate-300 font-sans pointer-events-none whitespace-nowrap font-medium">
                        Last Name
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative flex items-center justify-between bg-[#0f0f12]/90 border border-white/15 focus-within:border-white/40 rounded-xl px-3.5 py-2.5 transition-all">
                    <input
                      type="email"
                      placeholder="harshitlog@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none font-sans pr-2"
                      required
                    />
                    <span className="text-xs sm:text-sm text-slate-300 font-sans pointer-events-none font-medium">
                      Email
                    </span>
                  </div>

                  {/* Password */}
                  <div className="relative flex items-center justify-between bg-[#0f0f12]/90 border border-white/15 focus-within:border-white/40 rounded-xl px-3.5 py-2.5 transition-all">
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none font-sans pr-2"
                    />
                    <span className="text-xs sm:text-sm text-slate-300 font-sans pointer-events-none font-medium">
                      Password
                    </span>
                  </div>

                  {/* 4 Role Selector Options */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-semibold text-slate-300 font-sans">
                      Select Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {roleOptions.map((r) => {
                        const Icon = r.icon;
                        const isSelected = selectedRole === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setSelectedRole(r.id)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left font-sans cursor-pointer",
                              isSelected
                                ? "bg-purple-500/20 text-white border-purple-400/60 shadow-sm"
                                : "bg-[#0f0f12]/80 text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
                            )}
                          >
                            <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", isSelected ? "text-purple-300" : "text-slate-400")} />
                            <span className="truncate">{r.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2.5 pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 leading-snug">
                      <input
                        type="checkbox"
                        checked={noMarketing}
                        onChange={(e) => setNoMarketing(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded bg-[#0f0f12] border border-white/20 text-purple-500 focus:ring-0 cursor-pointer"
                      />
                      <span>I don&apos;t want to receive emails about solaceui feature updates</span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 leading-snug">
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded bg-[#0f0f12] border border-white/20 text-purple-500 focus:ring-0 cursor-pointer"
                        required
                      />
                      <span>
                        By creating an account, you agree to our{" "}
                        <a
                          href="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-white font-medium hover:text-purple-300 transition-colors cursor-pointer"
                        >
                          Terms and Services
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-white font-medium hover:text-purple-300 transition-colors cursor-pointer"
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>

                    {/* Embedded Inline Terms Preview Trigger & Accordion Box */}
                    <div className="pt-0.5">
                      <button
                        type="button"
                        onClick={() => setShowInlineTerms(showInlineTerms ? null : "terms")}
                        className="text-[11px] text-purple-300 hover:text-white font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{showInlineTerms ? "Hide Embedded Terms ▲" : "Read Embedded Club Terms & Policy ▼"}</span>
                      </button>

                      {showInlineTerms && (
                        <div className="mt-2 p-3 bg-[#07060c] border border-purple-500/30 rounded-2xl max-h-44 overflow-y-auto space-y-2 text-[11px] text-slate-300 font-sans leading-relaxed animate-in fade-in duration-200">
                          <div className="flex items-center justify-between border-b border-white/10 pb-1.5 font-mono text-[10px] uppercase text-purple-300">
                            <span>📜 Student Club Governance</span>
                            <div className="space-x-2">
                              <button type="button" onClick={() => setShowInlineTerms("terms")} className={showInlineTerms === "terms" ? "text-white font-bold underline" : "text-slate-400"}>Terms</button>
                              <span>·</span>
                              <button type="button" onClick={() => setShowInlineTerms("privacy")} className={showInlineTerms === "privacy" ? "text-white font-bold underline" : "text-slate-400"}>Privacy</button>
                            </div>
                          </div>
                          {showInlineTerms === "terms" ? (
                            <div className="space-y-1.5 text-slate-300">
                              <p><strong>1. Code of Conduct:</strong> Respectful behavior required across Idea Hub, Coding Arena, Skill Barter, and Soft Skills. Plagiarism or harassment results in restriction.</p>
                              <p><strong>2. Idea Hub Grants:</strong> Students retain 100% IP rights to project submissions. Credits issued by Visual Architects are non-monetary academic incubator points.</p>
                              <p><strong>3. Coding Integrity:</strong> Algorithmic contests require original logic. Scraping or multi-account exploitation is banned.</p>
                              <p><strong>4. Role Locking:</strong> User roles (Participant, Ambassador, Mentor, Visual Architect) are session-locked upon approval.</p>
                            </div>
                          ) : (
                            <div className="space-y-1.5 text-slate-300">
                              <p><strong>1. Data Collected:</strong> Name, USN, College Email, and Google OAuth UID for identity verification and leaderboard credits.</p>
                              <p><strong>2. Usage:</strong> Data is strictly used for authentication, contest verification, and automated security alerts.</p>
                              <p><strong>3. Confidentiality:</strong> Your personal data is never sold or shared with external third-party advertisers.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !termsAgreed}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-white via-slate-100 to-slate-200 hover:from-slate-200 hover:to-white text-black font-semibold rounded-xl py-3 text-sm shadow-xl transition-all cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span>Creating account...</span>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Presets */}
                <div className="pt-3 text-center border-t border-white/10 space-y-2">
                  <p className="text-[11px] text-slate-400 font-mono">⚡ Fresh Demo Presets (One-click Login & Email Confirmation):</p>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickPreset("ambassador@demo.com", "demo123", "ambassador")}
                      className="px-3 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-xs text-pink-300 border border-pink-500/30 transition-all cursor-pointer font-medium"
                    >
                      Community Ambassador
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickPreset("mentor@demo.com", "demo123", "mentor")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-xs text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer font-medium"
                    >
                      Mentor
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickPreset("participant@demo.com", "demo123", "participant")}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-xs text-blue-300 border border-blue-500/30 transition-all cursor-pointer font-medium"
                    >
                      Participant
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : step === "google-confirm" ? (
              <motion.div
                key="google-confirm-step"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-5 text-left"
              >
                {/* Header */}
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
                    Continue with Google
                  </h1>
                  <p className="text-sm text-slate-400 font-light font-sans">
                    You&apos;re signing in as:
                  </p>
                </div>

                {/* Google account info card */}
                <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/15 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {(firstName || email || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    {firstName && (
                      <p className="text-white font-semibold text-sm truncate font-sans">{firstName} {lastName}</p>
                    )}
                    <p className="text-slate-300 text-xs truncate font-mono">{email}</p>
                  </div>
                  <GoogleIcon />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Checkboxes for Google Auth */}
                <div className="space-y-2.5 pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 leading-snug">
                    <input
                      type="checkbox"
                      checked={noMarketing}
                      onChange={(e) => setNoMarketing(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded bg-[#0f0f12] border border-white/20 text-purple-500 focus:ring-0 cursor-pointer"
                    />
                    <span>I don&apos;t want to receive emails about solaceui feature updates</span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 leading-snug">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded bg-[#0f0f12] border border-white/20 text-purple-500 focus:ring-0 cursor-pointer"
                      required
                    />
                    <span>
                      By creating an account, you agree to our{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-white font-medium hover:text-purple-300 transition-colors cursor-pointer"
                      >
                        Terms and Services
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-white font-medium hover:text-purple-300 transition-colors cursor-pointer"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </label>

                  {/* Embedded Inline Terms Preview Trigger & Accordion Box */}
                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={() => setShowInlineTerms(showInlineTerms ? null : "terms")}
                      className="text-[11px] text-purple-300 hover:text-white font-mono flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{showInlineTerms ? "Hide Embedded Terms ▲" : "Read Embedded Club Terms & Policy ▼"}</span>
                    </button>

                    {showInlineTerms && (
                      <div className="mt-2 p-3 bg-[#07060c] border border-purple-500/30 rounded-2xl max-h-44 overflow-y-auto space-y-2 text-[11px] text-slate-300 font-sans leading-relaxed animate-in fade-in duration-200">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 font-mono text-[10px] uppercase text-purple-300">
                          <span>📜 Student Club Governance</span>
                          <div className="space-x-2">
                            <button type="button" onClick={() => setShowInlineTerms("terms")} className={showInlineTerms === "terms" ? "text-white font-bold underline" : "text-slate-400"}>Terms</button>
                            <span>·</span>
                            <button type="button" onClick={() => setShowInlineTerms("privacy")} className={showInlineTerms === "privacy" ? "text-white font-bold underline" : "text-slate-400"}>Privacy</button>
                          </div>
                        </div>
                        {showInlineTerms === "terms" ? (
                          <div className="space-y-1.5 text-slate-300">
                            <p><strong>1. Code of Conduct:</strong> Respectful behavior required across Idea Hub, Coding Arena, Skill Barter, and Soft Skills. Plagiarism or harassment results in restriction.</p>
                            <p><strong>2. Idea Hub Grants:</strong> Students retain 100% IP rights to project submissions. Credits issued by Visual Architects are non-monetary academic incubator points.</p>
                            <p><strong>3. Coding Integrity:</strong> Algorithmic contests require original logic. Scraping or multi-account exploitation is banned.</p>
                            <p><strong>4. Role Locking:</strong> User roles (Participant, Ambassador, Mentor, Visual Architect) are session-locked upon approval.</p>
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-slate-300">
                            <p><strong>1. Data Collected:</strong> Name, USN, College Email, and Google OAuth UID for identity verification and leaderboard credits.</p>
                            <p><strong>2. Usage:</strong> Data is strictly used for authentication, contest verification, and automated security alerts.</p>
                            <p><strong>3. Confidentiality:</strong> Your personal data is never sold or shared with external third-party advertisers.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Continue button */}
                <button
                  type="button"
                  disabled={loading || !termsAgreed}
                  onClick={handleGoogleConfirmContinue}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-white via-slate-100 to-slate-200 hover:from-slate-200 hover:to-white text-black font-semibold rounded-xl py-3 text-sm shadow-xl transition-all cursor-pointer font-sans disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? "Authenticating..." : `Continue as ${firstName || email?.split("@")[0] || "User"}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Not you? */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setEmail("");
                      setFirstName("");
                      setLastName("");
                      setFirebaseUid(null);
                      setSocialProvider(null);
                      setError("");
                    }}
                    className="text-xs text-slate-400 hover:text-white transition-colors font-sans underline cursor-pointer"
                  >
                    Not you? Use a different account
                  </button>
                </div>
              </motion.div>
            ) : step === "role" ? (
              <motion.div
                key="role-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-5 text-left"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
                      Select Your Role
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 font-light font-sans mt-0.5">
                      {socialProvider ? `Signing up with ${socialProvider}` : "Choose how you'll participate in the hub"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(socialProvider ? "google-confirm" : "email")}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-sans bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* 4 Role Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {roleOptions.map((r) => {
                    const Icon = r.icon;
                    const isSelected = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleRoleSelect(r.id)}
                        disabled={loading}
                        className={cn(
                          "relative text-left p-4 rounded-2xl border transition-all duration-300 group cursor-pointer overflow-hidden flex flex-col justify-between min-h-[120px]",
                          "bg-gradient-to-br bg-[#0f0f14]/90",
                          r.gradient,
                          isSelected
                            ? "border-purple-400 shadow-lg shadow-purple-500/25 ring-1 ring-purple-400/50"
                            : `border-white/10 ${r.border}`
                        )}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <div className={cn("p-2 rounded-xl border border-white/10", r.iconBg)}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/10 font-mono">
                            {r.badge}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold font-heading tracking-wide text-white group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">
                            <span>{r.title}</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
                          </h3>
                          <p className="text-[11px] text-slate-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                            {r.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="text-center pt-2">
                  <p className="text-[11px] text-slate-500 font-sans">
                    Clicking a role confirms your account with {socialProvider || "Club Idea Hub"}.
                  </p>
                </div>
              </motion.div>
            ) : step === "code" ? (
                <motion.div
                  key="code-step"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-6 text-center"
                >
                  <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white">We sent you a code</h1>
                    <p className="text-sm text-gray-400 font-light">Please enter it</p>
                  </div>

                  <div className="w-full">
                    <div className="relative rounded-full py-4 px-5 border border-white/15 bg-[#121215]">
                      <div className="flex items-center justify-center">
                        {code.map((digit, i) => (
                          <div key={i} className="flex items-center">
                            <div className="relative">
                              <input
                                ref={(el) => {
                                  codeInputRefs.current[i] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleCodeChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className="w-8 text-center text-xl font-mono text-white bg-transparent border-none focus:outline-none focus:ring-0 appearance-none"
                                style={{ caretColor: "transparent" }}
                              />
                              {!digit && (
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                                  <span className="text-xl text-gray-600 font-mono">0</span>
                                </div>
                              )}
                            </div>
                            {i < 5 && <span className="text-white/20 text-xl mx-0.5">|</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setCode(["1", "2", "3", "4", "5", "6"])}
                      className="text-gray-400 hover:text-white transition-colors text-xs font-mono"
                    >
                      Resend code
                    </button>
                  </div>

                  <div className="flex w-full gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleBackClick}
                      className="rounded-full bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 transition-colors text-sm w-[35%]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => verifyOtpAndEnter(code.join(""))}
                      className={cn(
                        "flex-1 rounded-full font-medium py-3 text-sm transition-all duration-300",
                        code.every((d) => d !== "")
                          ? "bg-white text-black hover:bg-gray-200 cursor-pointer shadow-lg"
                          : "bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed"
                      )}
                      disabled={!code.every((d) => d !== "")}
                    >
                      Continue
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-500 pt-6">
                    By signing up, you agree to the{" "}
                    <Link href="#" className="underline text-gray-400 hover:text-white transition-colors">
                      MSA
                    </Link>
                    ,{" "}
                    <Link href="#" className="underline text-gray-400 hover:text-white transition-colors">
                      Product Terms
                    </Link>
                    , and{" "}
                    <Link href="#" className="underline text-gray-400 hover:text-white transition-colors">
                      Privacy Notice
                    </Link>
                    .
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="success-step"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="fixed inset-0 z-50 bg-black overflow-y-auto"
                >
                  {/* 3D Cosmic Horizon Hero Section */}
                  <HorizonHeroSection onLogout={handleLogout} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Student Club Legal Terms & Privacy Policy Modal Overlay */}
        {docModalTab && (
          <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#0c0a14] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto flex flex-col justify-between">
              <div>
                {/* Header with Close button */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-bold text-white font-heading">
                      Student Club Legal & Governance
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDocModalTab(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center space-x-2 bg-slate-900/80 p-1 rounded-xl border border-white/10 mb-6">
                  <button
                    type="button"
                    onClick={() => setDocModalTab('terms')}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      docModalTab === 'terms'
                        ? 'bg-purple-600 text-white shadow-md font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    📜 Terms of Service
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocModalTab('privacy')}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      docModalTab === 'privacy'
                        ? 'bg-purple-600 text-white shadow-md font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🔒 Privacy Policy
                  </button>
                </div>

                {/* Content Body */}
                {docModalTab === 'terms' ? (
                  <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans pr-2">
                    <h3 className="text-sm font-bold text-white font-heading">Student Club Platform Terms of Service</h3>
                    <p>Welcome to the Student Club Platform (Idea Hub / SkillVerse / Orzya). By creating an account or signing in, you agree to comply with the following club regulations:</p>

                    <div className="space-y-3 pt-1">
                      <div>
                        <h4 className="font-bold text-purple-300 font-mono text-xs">1. Academic & Community Conduct</h4>
                        <p className="mt-0.5 text-slate-400">All student builders, mentors, and ambassadors must maintain respectful behavior. Malicious code submissions, plagiarism, or harassment across any of the 4 club pillars (Idea Hub, Coding Arena, Skill Barter, Soft Skills) will result in immediate account restriction.</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-purple-300 font-mono text-xs">2. Project Incubation & Grant Credits (Idea Hub)</h4>
                        <p className="mt-0.5 text-slate-400">Students retain full intellectual property of their original project submissions in the Idea Hub. Milestone grants and credit allocations issued by Visual Architects are non-transferable academic incentive points designated for project development.</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-purple-300 font-mono text-xs">3. Algorithmic Integrity & Coding Arena</h4>
                        <p className="mt-0.5 text-slate-400">Participants in coding challenges agree to submit original algorithmic solutions. Automated scraping, solution sharing, or multi-account manipulation is strictly prohibited.</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-purple-300 font-mono text-xs">4. Peer Skill Barter & Micro-Mentorship</h4>
                        <p className="mt-0.5 text-slate-400">Skill Barter sessions are non-monetary exchanges intended for peer learning and mentorship. Credits earned directly reflect collegiate leaderboard standing.</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-purple-300 font-mono text-xs">5. Membership Roles & Access Control</h4>
                        <p className="mt-0.5 text-slate-400">User roles (Participant, Community Ambassador, Mentor, Visual Architect) are assigned based on club leadership review. Access is bound to your authenticated session role.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans pr-2">
                    <h3 className="text-sm font-bold text-white font-heading">Student Club Privacy Policy</h3>
                    <p>Your privacy and data protection are fundamental to our Student Club platform. This policy outlines how your information is safeguarded:</p>

                    <div className="space-y-3 pt-1">
                      <div>
                        <h4 className="font-bold text-purple-300 font-mono text-xs">1. Information We Collect</h4>
                        <p className="mt-0.5 text-slate-400">We collect your Name, College Email Address, USN (Student ID), and Google OAuth Profile UID to verify student membership and track your leaderboard credits.</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-purple-300 font-mono text-xs">2. How We Use Your Data</h4>
                        <p className="mt-0.5 text-slate-400">Your data is strictly used to authenticate your session, verify contest submissions, send security alerts, and display collegiate achievements.</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-purple-300 font-mono text-xs">3. Data Protection & Confidentiality</h4>
                        <p className="mt-0.5 text-slate-400">We store your credentials securely using encrypted authentication tokens. We do NOT sell, rent, or trade student data with third-party advertisers.</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-purple-300 font-mono text-xs">4. Third-Party Authentication</h4>
                        <p className="mt-0.5 text-slate-400">We integrate with Firebase Authentication for secure Google OAuth single sign-on. Authentication is managed directly via Google&apos;s secure servers.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 mt-6 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Student Club Governance Board</span>
                <button
                  type="button"
                  onClick={() => {
                    setTermsAgreed(true);
                    setDocModalTab(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono transition-all shadow-lg cursor-pointer"
                >
                  Accept & Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
