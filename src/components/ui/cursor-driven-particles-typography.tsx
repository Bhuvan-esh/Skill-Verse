"use client";

import React, { useEffect, useRef } from "react";

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export interface CursorDrivenParticleTypographyProps {
  className?: string;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  particleSize?: number;
  particleDensity?: number;
  dispersionStrength?: number;
  returnSpeed?: number;
  color?: string;
}

class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  dispersion: number;
  returnSpd: number;

  constructor(
    x: number,
    y: number,
    size: number,
    color: string,
    dispersion: number,
    returnSpd: number
  ) {
    this.x = x + (Math.random() - 0.5) * 10;
    this.y = y + (Math.random() - 0.5) * 10;
    this.originX = x;
    this.originY = y;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpd = returnSpd;
  }

  update(mouseX: number, mouseY: number) {
    if (mouseX >= 0 && mouseY >= 0) {
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distSq = dx * dx + dy * dy;
      const interactionRadius = 120;
      const radSq = interactionRadius * interactionRadius;

      if (distSq < radSq) {
        const distance = Math.sqrt(distSq) || 0.001;
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (interactionRadius - distance) / interactionRadius;

        const repulsionX = forceDirectionX * force * this.dispersion;
        const repulsionY = forceDirectionY * force * this.dispersion;

        this.vx -= repulsionX;
        this.vy -= repulsionY;
      }
    }

    this.vx += (this.originX - this.x) * this.returnSpd;
    this.vy += (this.originY - this.y) * this.returnSpd;

    this.vx *= 0.85;
    this.vy *= 0.85;

    const dxOrigin = this.x - this.originX;
    const dyOrigin = this.y - this.originY;
    if (dxOrigin * dxOrigin + dyOrigin * dyOrigin < 1 && Math.random() > 0.95) {
      this.vx += (Math.random() - 0.5) * 0.2;
      this.vy += (Math.random() - 0.5) * 0.2;
    }

    this.x += this.vx;
    this.y += this.vy;
  }
}

export function CursorDrivenParticleTypography({
  className,
  text,
  fontSize = 120,
  fontFamily = "Inter, sans-serif",
  particleSize = 1.5,
  particleDensity = 6,
  dispersionStrength = 15,
  returnSpeed = 0.08,
  color,
}: CursorDrivenParticleTypographyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let isVisible = true;

    let mouseX = -1000;
    let mouseY = -1000;

    let containerWidth = 0;
    let containerHeight = 0;

    const init = () => {
      const container = containerRef.current;
      if (!container) return;

      containerWidth = container.clientWidth;
      containerHeight = container.clientHeight;
      if (containerWidth === 0 || containerHeight === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = containerWidth * dpr;
      canvas.height = containerHeight * dpr;
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const computedStyle = window.getComputedStyle(container);
      const textColor = color || computedStyle.color || "#ffffff";

      ctx.clearRect(0, 0, containerWidth, containerHeight);

      const effectiveFontSize = Math.min(fontSize, containerWidth * 0.15);
      ctx.fillStyle = textColor;
      ctx.font = `bold ${effectiveFontSize}px ${fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(text, containerWidth / 2, containerHeight / 2);

      const textCoordinates = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      particles = [];

      const step = Math.max(3, Math.floor(particleDensity * dpr));

      for (let y = 0; y < textCoordinates.height; y += step) {
        for (let x = 0; x < textCoordinates.width; x += step) {
          const index = (y * textCoordinates.width + x) * 4;
          const alpha = textCoordinates.data[index + 3] || 0;

          if (alpha > 128) {
            particles.push(
              new Particle(
                x / dpr,
                y / dpr,
                particleSize,
                textColor,
                dispersionStrength,
                returnSpeed
              )
            );
          }
        }
      }
    };

    let isAnimating = false;

    const startAnimation = () => {
      if (!isAnimating && isVisible) {
        isAnimating = true;
        animate();
      }
    };

    const stopAnimation = () => {
      isAnimating = false;
      cancelAnimationFrame(animationFrameId);
    };

    const animate = () => {
      if (!isVisible) {
        isAnimating = false;
        return;
      }
      ctx.clearRect(0, 0, containerWidth, containerHeight);

      const count = particles.length;
      let activeMovement = false;

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.update(mouseX, mouseY);

        if (!activeMovement) {
          if (
            Math.abs(p.vx) > 0.01 ||
            Math.abs(p.vy) > 0.01 ||
            Math.abs(p.x - p.originX) > 0.1 ||
            Math.abs(p.y - p.originY) > 0.1
          ) {
            activeMovement = true;
          }
        }
      }

      // Single batched draw call for all particles
      if (count > 0) {
        ctx.fillStyle = particles[0].color;
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const p = particles[i];
          ctx.moveTo(p.x + p.size, p.y);
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // If mouse is away and all particles are resting, pause RAF loop
      if (mouseX < 0 && !activeMovement) {
        isAnimating = false;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      startAnimation();
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
      startAnimation();
    };

    const handleResize = () => {
      init();
      startAnimation();
    };

    const timeoutId = setTimeout(() => {
      init();
      startAnimation();
    }, 100);

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startAnimation();
          } else {
            stopAnimation();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      intersectionObserver.observe(containerRef.current);
    }

    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      stopAnimation();
    };
  }, [
    text,
    fontSize,
    fontFamily,
    particleSize,
    particleDensity,
    dispersionStrength,
    returnSpeed,
    color,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full flex items-center justify-center relative touch-none",
        className
      )}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
