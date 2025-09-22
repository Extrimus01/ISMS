"use client";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animationData from "@/public/animation/bubble.json";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-[var(--background)] text-[var(--foreground)] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="hidden md:flex lg:flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-8 relative"
          animate={{ y: [0, -10, 0] }}
        >
          <div className="w-full max-w-sm sm:max-w-md h-96 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)] rounded-2xl pointer-events-none"></div>
            <Lottie animationData={animationData} loop={true} />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2 relative bg-[var(--background)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col justify-between backdrop-blur-sm bg-opacity-70 transition-all"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 relative inline-block">
            Apply for Internship
          </h2>

          <form className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Full First"
                className="w-full sm:w-1/2 px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl placeholder-[var(--foreground-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all shadow-sm hover:shadow-md"
              />
              <input
                type="text"
                placeholder="Collage Name"
                className="w-full sm:w-1/2 px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl placeholder-[var(--foreground-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all shadow-sm hover:shadow-md"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full sm:w-1/2 px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl placeholder-[var(--foreground-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all shadow-sm hover:shadow-md"
              />
              <div className="w-full sm:w-1/2 flex items-center border border-[var(--border)] rounded-xl bg-[var(--background)] px-4 py-3 transition-all shadow-sm hover:shadow-md">
                <Globe
                  className="mr-2 text-[var(--foreground-secondary)]"
                  size={16}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="bg-transparent outline-none w-full placeholder-[var(--foreground-secondary)] text-[var(--foreground)]"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-[var(--foreground-secondary)]">
                How can we help?
              </label>
              <textarea
                rows={4}
                placeholder="Briefly describe your interests or skills..."
                className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl resize-none placeholder-[var(--foreground-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all shadow-sm hover:shadow-md"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-[var(--accent)] text-white px-6 py-4 rounded-2xl font-semibold hover:bg-[var(--accent-hover)] hover:scale-105 shadow-lg transition-all duration-300"
              >
                Submit
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
