"use client";

import React, { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";
import Sidebar from "@/components/students/Sidebar";

const StudentDashboardPage: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col">
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

        <div className="flex-1 p-4 overflow-auto">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Welcome to the Student Dashboard
          </h2>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
