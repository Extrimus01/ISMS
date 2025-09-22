"use client";

import LogoutButton from "@/components/Logout";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface BeamsBackgroundProps {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

const opacityMap = {
  subtle: 0.7,
  medium: 0.85,
  strong: 1,
};

const createBeam = (width: number, height: number): Beam => {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
};

export default function ProjectManagerPage({
  intensity = "strong",
}: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      beamsRef.current = Array.from({ length: 30 }, () =>
        createBeam(canvas.width, canvas.height)
      );
    };

    const resetBeam = (beam: Beam) => {
      beam.y = canvas.height + 100;
      beam.x = Math.random() * canvas.width;
    };

    const drawBeam = (b: Beam) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate((b.angle * Math.PI) / 180);
      const pulseOpacity =
        b.opacity * (0.8 + Math.sin(b.pulse) * 0.2) * opacityMap[intensity];
      const gradient = ctx.createLinearGradient(0, 0, 0, b.length);
      gradient.addColorStop(0, `hsla(${b.hue},85%,65%,0)`);
      gradient.addColorStop(0.4, `hsla(${b.hue},85%,65%,${pulseOpacity})`);
      gradient.addColorStop(1, `hsla(${b.hue},85%,65%,0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(-b.width / 2, 0, b.width, b.length);
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      beamsRef.current.forEach((b) => {
        b.y -= b.speed;
        b.pulse += b.pulseSpeed;
        if (b.y + b.length < -50) resetBeam(b);
        drawBeam(b);
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [intensity]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-950 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 blur-[15px] block w-full"
      />
      <motion.div
        className="absolute inset-0 bg-neutral-950/5 overflow-hidden"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ backdropFilter: "blur(50px)" }}
      />
      <main className="relative z-10 w-full max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row rounded-2xl shadow-2xl overflow-hidden bg-slate-800/30 backdrop-blur-xl border border-white/10"
        >
          <h1>Dashboard Comming Soon</h1>
          <LogoutButton />
        </motion.div>
      </main>
    </div>
  );
}
