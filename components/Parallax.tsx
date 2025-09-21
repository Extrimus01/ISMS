"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const Parallax: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const mdRef = useRef<HTMLImageElement>(null);
  const fgRef = useRef<HTMLImageElement>(null);

  const multipliers = { bg: 10, md: 20, fg: 30 };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setLoaded(true);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [mounted]);

  useEffect(() => {
    if (!bgRef.current || !mdRef.current || !fgRef.current || !loaded) return;

    let mouse = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      target.x = -(e.clientX / innerWidth - 0.5) * 2;
      target.y = -(e.clientY / innerHeight - 0.5) * 2;
    };

    const animate = () => {
      mouse.x += (target.x - mouse.x) * 0.08;
      mouse.y += (target.y - mouse.y) * 0.08;

      const screenWidth = window.innerWidth;
      const factor = screenWidth < 768 ? 0.4 : 1;

      if (bgRef.current)
        bgRef.current.style.transform = `translate(${
          mouse.x * multipliers.bg * factor
        }px, ${mouse.y * multipliers.bg * factor}px) scale(1.1)`;
      if (mdRef.current)
        mdRef.current.style.transform = `translate(${
          mouse.x * multipliers.md * factor
        }px, ${mouse.y * multipliers.md * factor}px) scale(1.1)`;
      if (fgRef.current)
        fgRef.current.style.transform = `translate(${
          mouse.x * multipliers.fg * factor
        }px, ${mouse.y * multipliers.fg * factor}px) scale(1.1)`;

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [loaded]);

  if (!mounted) return null;

  const bgImage = theme === "dark" ? "/bg-dark.jpg" : "/bg-light.jpg";
  const mdImage = "/md.jpg";
  const fgImage = theme === "dark" ? "/fg-dark.jpg" : "/fg-light.jpg";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {!loaded && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-black text-white text-8xl font-bold z-60
      transition-opacity duration-700 ease-in-out
      ${progress > 5 ? "opacity-100" : "opacity-0"}`}
        >
          {progress}%
        </div>
      )}

      <div
        className={`pointer-events-none absolute inset-0 z-40 bg-black transition-opacity duration-700 ease-in-out
    ${loaded ? "opacity-0" : "opacity-100"}`}
      />

      <img
        ref={bgRef}
        src={bgImage}
        alt="Background Layer"
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

      <img
        ref={mdRef}
        src={mdImage}
        alt="Middle Layer"
        className={`absolute top-0 left-0 w-full h-full object-cover opacity-90 transition-opacity duration-1000 delay-200 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

      <img
        ref={fgRef}
        src={fgImage}
        alt="Foreground Layer"
        className={`absolute top-0 left-0 w-full h-full object-contain sm:object-cover transition-opacity duration-1000 delay-400 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_30%,rgba(0,0,0,2)_100%)]" />
    </div>
  );
};

export default Parallax;
