"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BouncingDots } from "@/components/global/Loader";
import Sidebar from "@/components/intern/Sidebar";
import { MenuIcon } from "lucide-react";

import type React from "react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      router.replace("/auth");
      return;
    }

    try {
      const user = JSON.parse(userData);

      if (!user.role || user.role !== "student") {
        router.replace("/unauthorized");
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error("Invalid user data", err);
      localStorage.removeItem("user");
      router.replace("/auth");
    }
  }, [router]);

  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );
  }

  return (
    <div className="flex">
      <main className="flex-1 ml-0 md:ml-64 p-6">
        <div className="flex h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-500">
          <Sidebar
            isMobile={isMobile}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />

          <div className="flex-1 flex flex-col overflow-hidden">
            {isMobile && (
              <div className="flex items-center h-16 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </button>
                <h1 className="ml-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Student Dashboard
                </h1>
              </div>
            )}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
