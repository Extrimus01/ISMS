"use client";

import { ShieldCheck, AlertTriangle, Info, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function GuidelinesPage() {
  const guidelines = [
    "Monitor daily attendance and weekly progress reports of assigned students diligently.",
    "Provide timely feedback and assistance to student interns as needed.",
    "Maintain confidentiality of all student data and project details.",
    "Ensure all pending weekly reports are reviewed and approved before attendance finalization.",
    "Communicate updates and notices from Admin to students in your group effectively.",
    "Follow MRSAC’s HR policies and guidelines when managing projects and interns.",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Manager Guidelines
          </h1>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please review and follow these operational guidelines carefully to
          ensure smooth, secure, and compliant functioning of the internship
          management portal.
        </p>

        <ul className="space-y-4">
          {guidelines.map((line, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-4 bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/70 transition-colors"
            >
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
              <span className="text-gray-800 dark:text-gray-200">{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <AlertTriangle className="w-4 h-4" />
          <span>
            Non-compliance with these guidelines may result in restricted access
            or administrative action.
          </span>
        </div>
      </div>
    </motion.div>
  );
}
