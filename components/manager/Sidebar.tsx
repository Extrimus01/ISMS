"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  CalendarCheck,
  ChevronDownIcon,
  ClipboardList,
  FileUser,
  GanttChart,
  GraduationCap,
  Group,
  ListTodo,
  LogOutIcon,
  User,
  Users2,
} from "lucide-react";
import ThemeToggle from "../global/ThemeToggle";
import { useRouter } from "next/navigation";

export interface SubNavItem {
  name: string;
  path: string;
}

export interface NavItem {
  name: string;
  icon: React.ElementType;
  path?: string;
  subItems?: SubNavItem[];
}

export const navigationItems: NavItem[] = [
  {
    name: "Profile",
    icon: User,
    subItems: [
      {
        name: "Personal Details",
        path: "/manager/personal-details",
      },
    ],
  },
  {
    name: "Interns",
    icon: GraduationCap,
    subItems: [
      {
        name: "Interns List",
        path: "/manager/interns-list",
      },
      {
        name: "Attendance",
        path: "/manager/interns-attendance",
      },
    ],
  },
  {
    name: "Project",
    icon: GanttChart,
    subItems: [
      {
        name: "Project Details",
        path: "/manager/project-details",
      },
      {
        name: "Weekly Task Report",
        path: "/manager/weekly-tasks",
      },
    ],
  },
  {
    name: "Guidelines",
    icon: BookOpen,
    subItems: [
      {
        name: "Guidelines",
        path: "/manager/guidelines",
      },
    ],
  },
];

interface SidebarProps {
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobile,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>("Dashboard");
  const [activeSubItem, setActiveSubItem] = useState<string>("/manager");
  const router = useRouter();

  useEffect(() => {
    const handleHashChange = () => {
      setActiveSubItem(window.location.hash || "/manager");
    };
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth");
  };

  const sidebarWidthClass = isMobile
    ? isMobileMenuOpen
      ? "translate-x-0 w-64"
      : "-translate-x-full w-64"
    : "w-64";

  return (
    <>
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-800 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${sidebarWidthClass}`}
      >
        <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-800 px-4 shrink-0">
          <div className="flex items-center overflow-hidden">
            <img
              alt="Logo"
              width={32}
              height={32}
              src="/logo.png"
              className="rounded-full object-cover flex-shrink-0"
            />
            <span className="ml-3 text-lg font-bold whitespace-nowrap">
              Manager Panel
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1 scrollbar-none">
          {navigationItems.map((item) => (
            <div key={item.name} className="relative">
              <button
                onClick={() => toggleMenu(item.name)}
                className="group flex items-center w-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 text-left"
              >
                <item.icon className="w-5 h-5 mr-4 shrink-0 text-gray-500 dark:text-gray-400" />
                <span className="flex-1 text-sm font-medium whitespace-nowrap">
                  {item.name}
                </span>
                {item.subItems && (
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                      openMenu === item.name ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {item.subItems && openMenu === item.name && (
                <div className="mt-1 pl-8 pr-2">
                  {item.subItems.map((subItem) => (
                    <a
                      key={subItem.name}
                      href={subItem.path}
                      className={`relative flex items-center text-sm py-2 px-4 rounded-md transition-all duration-200 ${
                        activeSubItem === subItem.path
                          ? "text-sky-600 dark:text-sky-400 font-semibold bg-sky-100 dark:bg-sky-900/30"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span
                        className={`absolute left-0 h-full w-1 rounded-r-full transition-all duration-200 ${
                          activeSubItem === subItem.path
                            ? "bg-sky-500"
                            : "bg-transparent"
                        }`}
                      />
                      {subItem.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0 flex content-center items-center space-x-3">
          <button
            onClick={handleLogout}
            className="group flex items-center w-full p-3 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 relative"
          >
            <LogOutIcon className="w-5 h-5 mr-4" />
            <span className="whitespace-nowrap">Logout</span>
          </button>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
