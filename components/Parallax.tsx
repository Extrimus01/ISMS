"use client";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Parallax: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const mdRef = useRef<HTMLImageElement>(null);
  const fgRef = useRef<HTMLImageElement>(null);
  const slideshowRef = useRef<HTMLDivElement>(null);

  const multipliers = { bg: 10, md: 20, fg: 30 };

  const cards = [
    {
      id: 1,
      title: "Character Design",
      description:
        "Un piccolo frammento di me e del mio mondo, per darti un'idea precisa di ciò che realizzo!",
      image: "/cartoon-character-illustration-with-big-eyes.jpg",
    },
    {
      id: 2,
      title: "3D Modeling",
      description:
        "Creazioni tridimensionali che prendono vita attraverso tecniche avanzate di modellazione.",
      image: "/3d-rendered-colorful-objects-and-shapes.jpg",
    },
    {
      id: 3,
      title: "Digital Art",
      description:
        "Arte digitale che combina creatività e tecnologia per risultati straordinari.",
      image: "/digital-art-colorful-abstract-design.jpg",
    },
    {
      id: 4,
      title: "Animation",
      description:
        "Animazioni fluide che raccontano storie attraverso il movimento e la creatività.",
      image: "/animation-frames-colorful-characters.jpg",
    },
    {
      id: 5,
      title: "UI/UX Design",
      description:
        "Interfacce intuitive e coinvolgenti progettate per un'esperienza utente ottimale.",
      image: "/modern-ui-interface-design-mockup.jpg",
    },
  ];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setLoaded(true);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [mounted]);

  useEffect(() => {
    if (!loaded) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > 100) {
        setShowSlideshow(true);
      } else {
        setShowSlideshow(false);
        setSlideIndex(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loaded]);

  const nextSlide = () => {
    if (slideIndex < cards.length - 1) {
      const newIndex = slideIndex + 1;
      setSlideIndex(newIndex);
    }
  };

  const prevSlide = () => {
    if (slideIndex > 0) {
      const newIndex = slideIndex - 1;
      setSlideIndex(newIndex);
    }
  };

  useEffect(() => {
    if (!showSlideshow) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.deltaY > 0 && slideIndex < cards.length - 1) {
        nextSlide();
      } else if (e.deltaY < 0 && slideIndex > 0) {
        prevSlide();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [showSlideshow, slideIndex, cards.length]);

  useEffect(() => {
    if (!bgRef.current || !mdRef.current || !fgRef.current || !loaded) return;

    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

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
    <div className="relative min-h-[200vh]">
      <div
        ref={containerRef}
        className="fixed top-0 left-0 w-full h-screen overflow-hidden"
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
          src={bgImage || "/placeholder.svg"}
          alt="Background Layer"
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />

        <img
          ref={mdRef}
          src={mdImage || "/placeholder.svg"}
          alt="Middle Layer"
          className={`absolute top-0 left-0 w-full h-full object-cover opacity-90 transition-opacity duration-1000 delay-200 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />

        <img
          ref={fgRef}
          src={fgImage || "/placeholder.svg"}
          alt="Foreground Layer"
          className={`absolute top-0 left-0 w-full h-full object-contain sm:object-cover transition-opacity duration-1000 delay-400 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />

        <section
          className={`fixed inset-0 z-50 transition-all duration-500 ${
            showSlideshow ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="h-full flex items-center justify-center p-8 pt-32">
            <div className="w-full max-w-7xl">
              <div className="flex justify-center mb-12">
                <div className="flex gap-8">
                  <div className="w-80 h-96 rounded-2xl overflow-hidden shadow-2xl bg-[#ffffff]">
                    <img
                      src={cards[slideIndex]?.image || "/placeholder.svg"}
                      alt={cards[slideIndex]?.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6 bg-[#ffffff]">
                      <h3 className="text-xl font-semibold mb-2 text-[#111827] bg-[#ffffff]">
                        {cards[slideIndex]?.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#4b5563] bg-[#ffffff]">
                        {cards[slideIndex]?.description}
                      </p>
                    </div>
                  </div>
                  {slideIndex < cards.length - 1 && (
                    <div className="w-80 h-96 rounded-2xl overflow-hidden shadow-2xl opacity-60 bg-[#ffffff]">
                      <img
                        src={cards[slideIndex + 1]?.image || "/placeholder.svg"}
                        alt={cards[slideIndex + 1]?.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-6 bg-[#ffffff]">
                        <h3 className="text-xl font-semibold mb-2 text-[#111827] bg-[#ffffff]">
                          {cards[slideIndex + 1]?.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#4b5563] bg-[#ffffff]">
                          {cards[slideIndex + 1]?.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Parallax;

// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { useTheme } from "next-themes";

// const Parallax: React.FC = () => {
//   const { theme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [loaded, setLoaded] = useState(false);

//   const containerRef = useRef<HTMLDivElement>(null);
//   const bgRef = useRef<HTMLImageElement>(null);
//   const mdRef = useRef<HTMLImageElement>(null);
//   const fgRef = useRef<HTMLImageElement>(null);

//   const multipliers = { bg: 10, md: 20, fg: 30 };

//   useEffect(() => setMounted(true), []);

//   useEffect(() => {
//     if (!mounted) return;
//     let current = 0;
//     const interval = setInterval(() => {
//       current += 1;
//       setProgress(current);
//       if (current >= 100) {
//         clearInterval(interval);
//         setLoaded(true);
//       }
//     }, 30);
//     return () => clearInterval(interval);
//   }, [mounted]);

//   useEffect(() => {
//     if (!bgRef.current || !mdRef.current || !fgRef.current || !loaded) return;

//     let mouse = { x: 0, y: 0 };
//     let target = { x: 0, y: 0 };

//     const handleMouseMove = (e: MouseEvent) => {
//       const { innerWidth, innerHeight } = window;
//       target.x = -(e.clientX / innerWidth - 0.5) * 2;
//       target.y = -(e.clientY / innerHeight - 0.5) * 2;
//     };

//     const animate = () => {
//       mouse.x += (target.x - mouse.x) * 0.08;
//       mouse.y += (target.y - mouse.y) * 0.08;

//       const screenWidth = window.innerWidth;
//       const factor = screenWidth < 768 ? 0.4 : 1;

//       if (bgRef.current)
//         bgRef.current.style.transform = `translate(${
//           mouse.x * multipliers.bg * factor
//         }px, ${mouse.y * multipliers.bg * factor}px) scale(1.1)`;
//       if (mdRef.current)
//         mdRef.current.style.transform = `translate(${
//           mouse.x * multipliers.md * factor
//         }px, ${mouse.y * multipliers.md * factor}px) scale(1.1)`;
//       if (fgRef.current)
//         fgRef.current.style.transform = `translate(${
//           mouse.x * multipliers.fg * factor
//         }px, ${mouse.y * multipliers.fg * factor}px) scale(1.1)`;

//       requestAnimationFrame(animate);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     animate();

//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, [loaded]);

//   if (!mounted) return null;

//   const bgImage = theme === "dark" ? "/bg-dark.jpg" : "/bg-light.jpg";
//   const mdImage = "/md.jpg";
//   const fgImage = theme === "dark" ? "/fg-dark.jpg" : "/fg-light.jpg";

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full h-screen overflow-hidden"
//     >
//       {!loaded && (
//         <div
//           className={`absolute inset-0 flex flex-col items-center justify-center bg-black text-white text-8xl font-bold z-60
//       transition-opacity duration-700 ease-in-out
//       ${progress > 5 ? "opacity-100" : "opacity-0"}`}
//         >
//           {progress}%
//         </div>
//       )}

//       <div
//         className={`pointer-events-none absolute inset-0 z-40 bg-black transition-opacity duration-700 ease-in-out
//     ${loaded ? "opacity-0" : "opacity-100"}`}
//       />

//       <img
//         ref={bgRef}
//         src={bgImage}
//         alt="Background Layer"
//         className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
//           loaded ? "opacity-100" : "opacity-0"
//         }`}
//       />

//       <img
//         ref={mdRef}
//         src={mdImage}
//         alt="Middle Layer"
//         className={`absolute top-0 left-0 w-full h-full object-cover opacity-90 transition-opacity duration-1000 delay-200 ${
//           loaded ? "opacity-100" : "opacity-0"
//         }`}
//       />

//       <img
//         ref={fgRef}
//         src={fgImage}
//         alt="Foreground Layer"
//         className={`absolute top-0 left-0 w-full h-full object-contain sm:object-cover transition-opacity duration-1000 delay-400 ${
//           loaded ? "opacity-100" : "opacity-0"
//         }`}
//       />
//       <section>
//         {/* This section will have slider which will tell more about platform */}
//       </section>
//     </div>
//   );
// };

// export default Parallax;
