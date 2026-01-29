"use client";
import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

export default function ProfessionalSplash() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createSplash = (
      x: number,
      y: number,
      velocityX: number,
      velocityY: number,
      isClick: boolean,
    ) => {
      const count = isClick ? 20 : 2;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;

        const speed = Math.random() * (isClick ? 8 : 2);

        particles.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed + velocityX * 0.2,
          vy: Math.sin(angle) * speed + velocityY * 0.2,
          life: 1.0,
          size: isClick ? Math.random() * 3 + 1 : Math.random() * 2 + 0.5,
          color: i % 2 === 0 ? "#3b82f6" : "#ffffff",
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;

      const velocity = Math.sqrt(dx * dx + dy * dy);
      if (velocity > 10) {
        createSplash(e.clientX, e.clientY, dx, dy, false);
      }

      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = (e: MouseEvent) => {
      createSplash(e.clientX, e.clientY, 0, 0, true);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];

        // PHYSICS: Sharp deceleration (0.92 friction)
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;

        // LIFE: Fast fade (0.04 decay) makes it feel "snappy"
        p.life -= 0.04;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;

        // DRAWING: Small squares or sharp circles look more "data-driven"
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    handleResize();
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-9999"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
