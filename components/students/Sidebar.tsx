import React, { useState, useEffect, ComponentType } from "react";

import {
  BarChart3Icon,
  ChevronDownIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";

export interface SubNavItem {
  name: string;
  path: string;
}

export interface NavItem {
  name: string;
  icon: ComponentType<{ className?: string }>;
  path?: string;
  subItems?: SubNavItem[];
}

const navigationItems: NavItem[] = [
  {
    name: "Dashboard Types",
    icon: BarChart3Icon,
    subItems: [
      { name: "Overview", path: "#" },
      { name: "Executive Summary", path: "#" },
      { name: "Operations", path: "#" },
      { name: "Financial", path: "#" },
    ],
  },
  {
    name: "Report Summaries",
    icon: FileTextIcon,
    subItems: [
      { name: "Weekly Reports", path: "#" },
      { name: "Monthly Insights", path: "#" },
      { name: "Quarterly Analysis", path: "#" },
    ],
  },
  {
    name: "Business Intelligence",
    icon: SettingsIcon,
    subItems: [
      { name: "Performance Metrics", path: "#" },
      { name: "Predictive Analytics", path: "#" },
    ],
  },
];

interface SidebarProps {
  isMobile: boolean;
  mobileOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isExpanded: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobile,
  mobileOpen,
  onMouseEnter,
  onMouseLeave,
  isExpanded,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>("Dashboard Types");
  const [activeSubItem, setActiveSubItem] = useState<string>("Overview");

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const effectiveExpanded = isExpanded || mobileOpen;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out z-40
        ${
          isMobile
            ? mobileOpen
              ? "w-64"
              : "w-0 overflow-hidden"
            : isExpanded
            ? "w-64"
            : "w-20"
        }
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center h-16 border-b border-slate-800 px-4 shrink-0">
        <LayoutDashboardIcon
          className={`w-8 h-8 text-sky-400 transition-transform duration-300 ${
            effectiveExpanded ? "rotate-0" : "rotate-12"
          }`}
        />
        <span
          className={`text-lg font-bold text-slate-100 ml-3 transition-opacity duration-200 ${
            effectiveExpanded ? "opacity-100" : "opacity-0"
          }`}
        >
          Zenith
        </span>
      </div>

      <div
        className={`px-4 pt-4 pb-2 transition-all duration-300 ${
          effectiveExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2">
          <SearchIcon className="w-4 h-4 mr-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full placeholder-slate-500"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
        {navigationItems.map((item) => (
          <div key={item.name}>
            <button
              onClick={() => toggleMenu(item.name)}
              className="flex items-center w-full p-3 hover:bg-slate-800 rounded-lg text-left"
            >
              <item.icon className="w-5 h-5 mr-4 shrink-0" />
              <span
                className={`flex-1 text-sm font-medium transition-opacity duration-200 whitespace-nowrap ${
                  effectiveExpanded ? "opacity-100" : "opacity-0"
                }`}
              >
                {item.name}
              </span>
              {effectiveExpanded && (
                <ChevronDownIcon
                  className={`w-4 h-4 transition-transform duration-300 ${
                    openMenu === item.name ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </button>
            {effectiveExpanded && openMenu === item.name && (
              <div className="mt-1 space-y-1 pl-12 pr-2">
                {item.subItems?.map((subItem) => (
                  <a
                    key={subItem.name}
                    href={subItem.path}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSubItem(subItem.name);
                    }}
                    className={`block text-sm py-1.5 px-3 rounded-md transition-colors duration-200 ${
                      activeSubItem === subItem.name
                        ? "text-sky-400 font-semibold"
                        : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {subItem.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 shrink-0">
        <button className="flex items-center w-full p-3 text-sm hover:bg-slate-800 rounded-lg">
          <LogOutIcon className="w-5 h-5 mr-4" />
          <span
            className={`transition-opacity duration-200 whitespace-nowrap ${
              effectiveExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
