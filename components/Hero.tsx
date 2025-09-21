import { ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[var(--background)] text-gray-200 transition-colors duration-500">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        poster="https://picsum.photos/seed/internship/1920/1080"
      >
        <source
          src="https://cdn.dorik.com/65b8a0980c950f00116993f2/videos/aurora_borealis_-_74183-(540p)-5kt6t.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-black/40 dark:bg-black/60 z-10 transition-colors duration-500"></div>

      <div className="relative z-20 flex flex-col h-full">
        <main className="flex-grow flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-roboto-slab text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wide leading-tight"
          >
            STUDENT INTERNSHIPS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-4 text-lg sm:text-xl md:text-2xl text-[var(--foreground-secondary)] tracking-wider max-w-2xl"
          >
            Discover and apply to internships that elevate your career journey.
          </motion.p>
        </main>

        <footer className="w-full p-6 sm:p-8 lg:p-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end border-t border-[var(--border)] pt-4 gap-4 sm:gap-0">
              <p className="max-w-xs text-[var(--foreground-secondary)] text-center sm:text-left">
                AS A STUDENT, YOU CAN TRACK, APPLY, AND MANAGE YOUR INTERNSHIP
                OPPORTUNITIES SEAMLESSLY
              </p>
              <motion.button
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 w-16 h-16 border border-[var(--border)] rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <ArrowRightIcon className="text-[var(--foreground)]" />
              </motion.button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Hero;
