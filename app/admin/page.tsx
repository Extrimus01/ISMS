"use client";

import React, { useState } from "react";
import { UserIcon, BriefcaseIcon, FileTextIcon } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

const AdminDashboardPage: React.FC = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isMobile={false}
        mobileOpen={mobileOpen}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        isExpanded={sidebarExpanded}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300`}
        style={{
          marginLeft: sidebarExpanded ? "16rem" : "5rem",
        }}
      >
        <header className="flex items-center justify-between h-16 bg-white shadow px-6">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="sr-only">Open sidebar</span>

            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-gray-600"></span>
              <span className="block w-6 h-0.5 bg-gray-600"></span>
              <span className="block w-6 h-0.5 bg-gray-600"></span>
            </div>
          </button>
          <h1 className="text-xl font-semibold text-gray-700">
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <UserIcon className="w-6 h-6 text-gray-700" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
              <UserIcon className="w-8 h-8 text-sky-500" />
              <div>
                <p className="text-gray-500 text-sm">Total Students</p>
                <p className="text-xl font-semibold">125</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
              <BriefcaseIcon className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-gray-500 text-sm">Active Internships</p>
                <p className="text-xl font-semibold">42</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
              <FileTextIcon className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-gray-500 text-sm">Pending Approvals</p>
                <p className="text-xl font-semibold">8</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                Recent Internship Activities
              </h2>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap">Google</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600">
                    Active
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600 cursor-pointer">
                    View
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Jane Smith</td>
                  <td className="px-6 py-4 whitespace-nowrap">Microsoft</td>
                  <td className="px-6 py-4 whitespace-nowrap text-yellow-600">
                    Pending
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600 cursor-pointer">
                    View
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Alice Johnson</td>
                  <td className="px-6 py-4 whitespace-nowrap">Amazon</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600">
                    Rejected
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-blue-600 cursor-pointer">
                    View
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
