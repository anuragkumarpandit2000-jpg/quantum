"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
}

export const HeroInteractiveBackground: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle pool for 60fps performance
    const particles: Particle[] = [];
    const maxParticles = 300;

    // Quantum chromatic spectrum for cursor emission (cyan, sky, cobalt, ice-blue)
    const colorPalette = [
      "rgba(56, 189, 248, ",   // Electric Cyan
      "rgba(14, 165, 233, ",   // Deep Sky Blue
      "rgba(34, 211, 238, ",   // Neon Aqua
      "rgba(2, 132, 199, ",    // Cobalt Sapphire
      "rgba(125, 211, 252, ",  // Ice Blue
      "rgba(255, 255, 255, ",  // Pure White
    ];

    let mouse = {
      x: width / 2,
      y: height / 2,
      prevX: width / 2,
      prevY: height / 2,
      speed: 0,
      isMoving: false,
    };

    let idleTimer: NodeJS.Timeout;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const spawnParticles = (x: number, y: number, count: number, speedMult = 1) => {
      for (let i = 0; i < count; i++) {
        if (particles.length >= maxParticles) {
          particles.shift();
        }

        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 3 + 1) * speedMult;
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed + (mouse.x - mouse.prevX) * 0.1,
          vy: Math.sin(angle) * speed + (mouse.y - mouse.prevY) * 0.1,
          size: Math.random() * 6 + 2,
          color,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.012,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.1,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const dx = currentX - mouse.x;
      const dy = currentY - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      mouse.speed = dist;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = currentX;
      mouse.y = currentY;
      mouse.isMoving = true;

      // Spawn burst of vibrant luminous particles scaled with cursor speed
      const spawnCount = Math.min(8, Math.max(2, Math.floor(dist * 0.35)));
      spawnParticles(mouse.x, mouse.y, spawnCount, Math.min(2.5, 1 + dist * 0.05));

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        mouse.isMoving = false;
      }, 120);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // High-velocity chromatic shockwave on click
      spawnParticles(x, y, 40, 3.5);
    };

    // Ambient floating 3D spatial grid / nebula effect
    let time = 0;

    const render = () => {
      time += 0.02;

      // Semi-transparent clearing for subtle optical motion blur
      ctx.fillStyle = "rgba(3, 7, 18, 0.28)";
      ctx.fillRect(0, 0, width, height);

      // Render 3D spatial field lines interacting with cursor
      ctx.save();
      ctx.lineWidth = 1;
      const gridSpacing = 80;
      const cols = Math.ceil(width / gridSpacing) + 1;
      const rows = Math.ceil(height / gridSpacing) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const gx = i * gridSpacing;
          const gy = j * gridSpacing;

          const dx = mouse.x - gx;
          const dy = mouse.y - gy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxInfluence = 260;

          if (dist < maxInfluence) {
            const force = (1 - dist / maxInfluence);
            const pullX = gx + (dx * force * 0.3);
            const pullY = gy + (dy * force * 0.3);

            const hue = (time * 40 + dist * 0.5) % 360;
            ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${force * 0.25})`;
            ctx.beginPath();
            ctx.arc(pullX, pullY, 1.5 + force * 2.5, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Render interactive luminous particles with additive glow
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw glowing particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Core bright glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
        gradient.addColorStop(0, `${p.color}${p.alpha})`);
        gradient.addColorStop(0.4, `${p.color}${p.alpha * 0.6})`);
        gradient.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      ctx.restore();

      // If mouse is near center, generate gentle chromatic beacon pulse
      if (!mouse.isMoving && Math.random() < 0.15) {
        spawnParticles(
          mouse.x + (Math.random() - 0.5) * 40,
          mouse.y + (Math.random() - 0.5) * 40,
          1,
          0.8
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto z-0 ${className || ""}`}
      style={{ touchAction: "none" }}
    />
  );
};

export default HeroInteractiveBackground;
