"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

const SmartConnections: React.FC = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:order-last flex justify-center"
        >
          <Player
            autoplay
            loop
            src="https://assets4.lottiefiles.com/packages/lf20_0yfsb3a1.json"
            className="w-full max-w-sm h-auto sm:max-w-md lg:max-w-none lg:w-[500px] lg:h-[500px]"
          />
        </motion.div>

        <motion.div
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text"
          >
            Smart Connections
          </motion.h2>

          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-xl sm:text-2xl font-semibold text-transparent dark:text-transparent 
             dark:text-white 
             stroke-text"
          >
            Transform Your Internship Journey with Smart Technology
          </motion.h3>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-400"
          >
            We{" "}
            <em className="font-semibold text-blue-500 dark:text-blue-400 not-italic">
              revolutionize
            </em>{" "}
            internship matching by creating powerful digital bridges between
            ambitious students and industry-leading companies.
          </motion.p>

          <motion.div variants={fadeUp} className="pt-4">
            <button className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 transform hover:scale-105 active:scale-95">
              Get Started
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SmartConnections;
