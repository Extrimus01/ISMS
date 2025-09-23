"use client";

import React, { useState, useEffect, ElementType } from "react";
import {
  BarChart3Icon,
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  LibraryIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import ThemeToggle from "../global/ThemeToggle";

export interface SubNavItem {
  name: string;
  path: string;
}

export interface NavItem {
  name: string;
  icon: ElementType;
  path?: string;
  subItems?: SubNavItem[];
}

const navigationItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: BarChart3Icon,
    subItems: [
      { name: "Overview", path: "#/admin/dashboard/overview" },
      { name: "Internship Stats", path: "#/admin/dashboard/stats" },
      { name: "Placement Insights", path: "#/admin/dashboard/placements" },
    ],
  },
  {
    name: "Student Management",
    icon: UsersIcon,
    subItems: [
      { name: "All Students", path: "#/admin/students" },
      { name: "Approve Registrations", path: "#/admin/students/approve" },
      { name: "Student Reports", path: "#/admin/students/reports" },
    ],
  },
  {
    name: "Company Management",
    icon: LibraryIcon,
    subItems: [
      { name: "All Companies", path: "#/admin/companies" },
      { name: "Add New Company", path: "#/admin/companies/add" },
      { name: "Company Reports", path: "#/admin/companies/reports" },
    ],
  },
  {
    name: "Internship Management",
    icon: BriefcaseIcon,
    subItems: [
      { name: "Active Internships", path: "#/admin/internships/active" },
      { name: "Pending Approvals", path: "#/admin/internships/pending" },
      { name: "Completed Internships", path: "#/admin/internships/completed" },
    ],
  },
  {
    name: "System Settings",
    icon: SettingsIcon,
    subItems: [
      { name: "Roles & Permissions", path: "#/admin/settings/roles" },
      { name: "Notification Settings", path: "#/admin/settings/notifications" },
    ],
  },
];

interface SidebarProps {
  isMobile: boolean;
  isMobileMenuOpen: boolean;
  isExpanded: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  setIsSidebarExpanded: (isExpanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobile,
  isMobileMenuOpen,
  isExpanded,
  setIsSidebarExpanded,
  setIsMobileMenuOpen,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>("Dashboard");
  const [activeSubItem, setActiveSubItem] = useState<string>(
    "#/admin/dashboard/overview"
  );

  useEffect(() => {
    const handleHashChange = () => {
      setActiveSubItem(window.location.hash || "#/admin/dashboard/overview");
    };
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    console.log("User logged out");
    window.location.hash = "#/auth";
  };

  const effectiveExpanded = isExpanded || isMobileMenuOpen;

  return (
    <>
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-r border-gray-200 dark:border-gray-800 shadow-lg z-40
        transform transition-transform duration-300 ease-in-out
        ${
          isMobile
            ? isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : ""
        }
        ${!isMobile ? (effectiveExpanded ? "w-64" : "w-20") : "w-64"}
        `}
      >
        <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-800 px-4 shrink-0">
          <div className="flex items-center overflow-hidden">
            <img
              alt="Logo"
              width={32}
              height={32}
              src="/logo.png"
              className={`rounded-full object-cover transition-transform duration-300 flex-shrink-0 ${
                effectiveExpanded ? "scale-100" : "scale-90"
              }`}
            />
            <span
              className={`ml-3 text-lg font-bold whitespace-nowrap transition-opacity duration-300 ${
                effectiveExpanded ? "opacity-100" : "opacity-0"
              }`}
            >
              MRSAC Admin
            </span>
          </div>
          {!isMobile && (
            <button
              onClick={() => setIsSidebarExpanded(!isExpanded)}
              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              {isExpanded ? (
                <ChevronsLeftIcon className="w-4 h-4" />
              ) : (
                <ChevronsRightIcon className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        <div
          className={`px-4 pt-4 pb-2 transition-opacity duration-200 ${
            effectiveExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <SearchIcon className="w-4 h-4 mr-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-full placeholder-gray-500 dark:placeholder-gray-400"
            />
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
                <span
                  className={`flex-1 text-sm font-medium whitespace-nowrap transition-opacity duration-200 ${
                    effectiveExpanded
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  {item.name}
                </span>
                {item.subItems && (
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                      openMenu === item.name ? "rotate-180" : ""
                    } ${effectiveExpanded ? "opacity-100" : "opacity-0"}`}
                  />
                )}
                {!effectiveExpanded && (
                  <span className="absolute left-full ml-4 px-2 py-1 text-sm bg-gray-800 text-white rounded-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap transition-all duration-300 z-50">
                    {item.name}
                  </span>
                )}
              </button>

              {effectiveExpanded && (
                <div
                  className={`mt-1 overflow-hidden transition-[max-height] duration-300 ${
                    openMenu === item.name ? "max-h-96" : "max-h-0"
                  } pl-8 pr-2`}
                >
                  {item.subItems?.map((subItem) => (
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
                      ></span>
                      {subItem.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0 flex flex-col space-y-3">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="group flex items-center w-full p-3 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 relative"
          >
            <LogOutIcon className="w-5 h-5 mr-4" />
            <span
              className={`whitespace-nowrap transition-opacity duration-200 ${
                effectiveExpanded ? "opacity-100" : "opacity-0"
              }`}
            >
              Logout
            </span>
            {!effectiveExpanded && (
              <span className="absolute left-full ml-4 px-2 py-1 text-sm bg-gray-800 text-white rounded-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap transition-all duration-300">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
