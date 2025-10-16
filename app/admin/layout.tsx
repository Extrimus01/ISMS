"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BouncingDots } from "@/components/global/Loader";
import Sidebar from "@/components/admin/Sidebar";
import { MenuIcon } from "lucide-react";
import { Providers } from "@/components/providers";

export default function AdminLayout({
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
      if (user.role !== "admin") {
        router.replace("/unauthorized");
        return;
      }
      setLoading(false);
    } catch {
      localStorage.removeItem("user");
      router.replace("/auth");
    }
  }, [router]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <BouncingDots />
      </div>
    );
  }

  const sidebarWidth = 16;

  return (
    <Providers>
      <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:to-gray-900 transition-colors">
        {/* Sidebar */}
        <Sidebar
          isMobile={isMobile}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main content area */}
        <div
          className="flex-1 flex flex-col transition-all duration-300"
          style={{
            marginLeft: !isMobile ? `${sidebarWidth}rem` : "0",
          }}
        >
          {/* Top Bar (visible only on mobile) */}
          {isMobile && (
            <header className="flex items-center justify-between h-16 px-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
              <div className="flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </button>
                <h1 className="ml-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Admin Dashboard
                </h1>
              </div>
            </header>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto ">
              {children}
            </div>
          </main>
        </div>
      </div>
    </Providers>
  );
}
