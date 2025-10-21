"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  MenuIcon,
  AlertCircle,
  Calendar,
  Package,
  CheckCircle,
} from "lucide-react";
import Sidebar from "@/components/intern/Sidebar";
import { useRouter } from "next/navigation";

interface User {
  fullName: string;
  verified: boolean;
  offerLetter?: string;
}

const StudentDashboardPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const entries = [
    {
      icon: Package,
      title: "Upload Documents",
      subtitle: "Step 1",
      description:
        "Upload all required documents to start your verification process.",
      items: ["Passport / ID Proof", "Resume / CV", "Other required documents"],
      image: "/images/t1.png",
    },
    {
      icon: Calendar,
      title: "Schedule Interview",
      subtitle: "Step 2",
      description:
        "Schedule your interview with the MRSAC team at a convenient date and time.",
      items: ["Choose available date", "Confirm schedule", "Prepare documents"],
      image: "/images/t2.png",
    },
    {
      icon: AlertCircle,
      title: "Attend Interview & Verification",
      subtitle: "Step 3",
      description:
        "Complete your interview and document verification to get full account access.",
      items: [
        "Attend the interview",
        "Document verification by MRSAC",
        "Receive confirmation",
      ],
      image: "/images/t3.png",
    },
  ];

  const setSentinelRef = (el: HTMLDivElement | null, i: number) => {
    sentinelRefs.current[i] = el;
  };

  useEffect(() => {
    const handleScroll = () => {
      let bestIndex = 0;
      sentinelRefs.current.forEach((node, i) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight / 3) bestIndex = i;
      });
      setActiveIndex(bestIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);


  return (
    <div className="flex-1 p-6 overflow-auto scrollbar-hide">
      <div className="relative overflow-hidden bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 md:p-8 mb-8 border border-slate-200 dark:border-gray-800 max-w-7xl mx-auto">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            Welcome, {user?.fullName || "Student"}!
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
            You’re all set! Explore internships, manage your applications, and
            stay updated.
          </p>
        </div>
      </div>

      {!user?.verified ? (
        <section className="py-16 max-w-4xl mx-auto relative space-y-16">
          <div className="absolute left-5 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700 hidden md:block" />
          {entries.map((entry, index) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;

            return (
              <div
                key={index}
                className="relative flex flex-col md:flex-row gap-8 items-start md:items-center"
                ref={(el) => setSentinelRef(el, index)}
                aria-current={isActive ? "true" : "false"}
              >
                <div className="absolute left-5 md:left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-gray-950 border-2 border-gray-300 dark:border-gray-700 z-10" />

                <div className="md:sticky md:top-24 flex items-center gap-4 md:w-64 md:justify-end md:text-right pr-8">
                  <div
                    className={`p-3 rounded-full flex items-center justify-center transition-transform duration-500 ${
                      isActive
                        ? "bg-green-500 text-white scale-125 shadow-lg"
                        : isPast
                        ? "bg-green-300 text-white scale-110"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-600"
                    }`}
                  >
                    <entry.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-semibold transition-colors duration-300 ${
                        isActive || isPast
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {entry.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      {entry.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex-1 pl-16 md:pl-8">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-slate-200 dark:border-gray-800">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      {entry.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {entry.description}
                    </p>
                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                      {entry.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    {entry.image && (
                      <img
                        src={entry.image}
                        alt={entry.title}
                        className="mt-4 w-full h-64 rounded-lg object-contain transition-transform duration-500 transform hover:scale-105"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <div className="animate-fade-in-up flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-lg max-w-4xl mx-auto">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            Verification Complete!
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Your dashboard is ready. Welcome aboard!
          </p>
          {user?.offerLetter && (
            <div className="w-full mt-6">
              <iframe
                src={`data:application/pdf;base64,${user.offerLetter}`}
                className="w-full h-[600px] border rounded-lg"
                title="Offer Letter"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboardPage;
