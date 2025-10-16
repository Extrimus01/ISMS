"use client";

import React, { useEffect, useState } from "react";

interface Manager {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

const ProjectManagersListPage: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await fetch("/api/admin/project-managers");
        const data = await res.json();
        if (res.ok) {
          setManagers(data);
        }
      } catch (error) {
        console.error("Failed to fetch managers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">
        Project Managers
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : managers.length === 0 ? (
        <p className="text-gray-500">No project managers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((m) => (
                <tr
                  key={m._id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-2">{m.fullName}</td>
                  <td className="px-4 py-2">{m.email}</td>
                  <td className="px-4 py-2">{m.phone}</td>
                  <td className="px-4 py-2">
                    {new Date(m.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectManagersListPage;
