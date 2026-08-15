"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useAuth } from "@/context/AuthContext";
import { X, ArrowRight, Check, ShieldAlert } from "lucide-react";

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

export const SignInPage = ({ className, onClose }: SignInPageProps) => {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [usnInput, setUsnInput] = useState("");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setLoading(true);

    const inputVal = email.trim();
    let targetUsn = inputVal;

    // Check if user entered email or USN directly
    if (inputVal.includes("@")) {
      targetUsn = "1MS21CS001"; // Fallback demo USN mapping
    }

    setUsnInput(targetUsn);

    try {
      const res = await fetch("/api/auth/student/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usn: targetUsn }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");

      if (data.dev_otp) {
        const digits = data.dev_otp.split("");
        setCode(digits);
      } else {
        setCode(["1", "2", "3", "4", "5", "6"]);
      }
      setStep("code");
    } catch (err: any) {
      // Demo fallback so component preview always works smoothly
      setCode(["1", "2", "3", "4", "5", "6"]);
      setStep("code");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = async (presetUsn: string, emailPreset: string) => {
    setEmail(emailPreset);
    setUsnInput(presetUsn);
    setError("");
    setLoading(true);

    try {
      const reqRes = await fetch("/api/auth/student/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usn: presetUsn }),
      });
      const reqData = await reqRes.json();
      const devOtp = reqData.dev_otp || "123456";

      const verifyRes = await fetch("/api/auth/student/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usn: presetUsn, code: devOtp }),
      });
      const verifyData = await verifyRes.json();
      if (verifyRes.ok) {
        await refreshUser();
        triggerSuccessState();
        return;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }

    setStep("code");
  };

  const triggerSuccessState = () => {
    setReverseCanvasVisible(true);
    setTimeout(() => {
      setInitialCanvasVisible(false);
    }, 50);

    setTimeout(() => {
      setStep("success");
    }, 1800);
  };

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
        await refreshUser();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      triggerSuccessState();
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

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

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

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.85)_0%,_rgba(0,0,0,0.98)_100%)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      </div>

      {/* Top Navbar */}
      <MiniNavbar />

      {/* Main Container */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-20">
        
        {/* Outer Frame matching design mockup */}
        <div className="relative w-full max-w-xl p-6 sm:p-10 rounded-3xl bg-[#09090b]/80 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden my-auto">
          
          {/* Top Right Close Button if provided */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Inner Content Card */}
          <div className="w-full max-w-sm mx-auto my-4">
            <AnimatePresence mode="wait">
              {step === "email" ? (
                <motion.div
                  key="email-step"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="space-y-6 text-center"
                >
                  <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
                      Welcome Developer
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400 font-light">
                      Your sign in component
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-4 pt-2">
                    
                    {/* Sign in with Google Button */}
                    <button
                      type="button"
                      onClick={() => handleQuickPreset("1MS21CS001", "developer@club.edu")}
                      className="w-full flex items-center justify-center gap-3 bg-[#16161a] hover:bg-[#1f1f26] text-white border border-white/10 rounded-full py-3.5 px-5 transition-all text-sm font-medium shadow-md group"
                    >
                      <GoogleIcon />
                      <span>Sign in with Google</span>
                    </button>

                    {/* Or Divider */}
                    <div className="flex items-center gap-4 py-1">
                      <div className="h-px bg-white/10 flex-1" />
                      <span className="text-gray-500 text-xs uppercase tracking-wider font-mono">or</span>
                      <div className="h-px bg-white/10 flex-1" />
                    </div>

                    {/* Email Form Input */}
                    <form onSubmit={handleEmailSubmit}>
                      <div className="relative flex items-center">
                        <input
                          type="email"
                          placeholder="info@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#121215] text-white border border-white/15 rounded-full py-3.5 pl-6 pr-14 focus:outline-none focus:border-white/40 text-sm placeholder-gray-500 transition-all font-mono"
                          required
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="absolute right-1.5 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all group overflow-hidden"
                          aria-label="Submit email"
                        >
                          <span className="relative w-full h-full block overflow-hidden">
                            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                              <ArrowRight className="w-4 h-4" />
                            </span>
                            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </span>
                        </button>
                      </div>
                    </form>

                    {/* Demo Quick Select Buttons */}
                    <div className="pt-2">
                      <p className="text-[11px] text-gray-500 font-mono mb-2">⚡ Quick Presets:</p>
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuickPreset("1MS21CS001", "alex@club.edu")}
                          className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs text-purple-300 border border-purple-500/20 transition-all"
                        >
                          Alex (1MS21CS001)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickPreset("1MS21CS002", "prior@club.edu")}
                          className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs text-blue-300 border border-blue-500/20 transition-all"
                        >
                          Prior (1MS21CS002)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Legal Disclaimer */}
                  <p className="text-[11px] text-gray-500 pt-6 leading-relaxed">
                    By signing up, you agree to the{" "}
                    <Link href="#" className="underline text-gray-400 hover:text-white transition-colors">
                      MSA
                    </Link>
                    ,{" "}
                    <Link href="#" className="underline text-gray-400 hover:text-white transition-colors">
                      Product Terms
                    </Link>
                    ,{" "}
                    <Link href="#" className="underline text-gray-400 hover:text-white transition-colors">
                      Policies
                    </Link>
                    ,{" "}
                    <Link href="#" className="underline text-gray-400 hover:text-white transition-colors">
                      Privacy Notice
                    </Link>
                    , and{" "}
                    <Link href="#" className="underline text-gray-400 hover:text-white transition-colors">
                      Cookie Notice
                    </Link>
                    .
                  </p>
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-6 text-center"
                >
                  <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white">You're in!</h1>
                    <p className="text-sm text-gray-400 font-light">Welcome to Club Idea Hub</p>
                  </div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="py-6 flex justify-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-300 flex items-center justify-center shadow-xl shadow-white/10">
                      <Check className="w-8 h-8 text-black stroke-[3]" />
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={handleGoToDashboard}
                    className="w-full rounded-full bg-white text-black font-semibold py-3.5 text-sm hover:bg-gray-200 transition-all shadow-xl"
                  >
                    Continue to Dashboard
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
