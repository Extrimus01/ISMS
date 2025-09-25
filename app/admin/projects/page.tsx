"use client";

import React, { useEffect, useState } from "react";

interface Project {
  _id: string;
  name: string;
  description: string;
  deadline?: string;
  status: string;
  manager: {
    fullName: string;
    email: string;
  };
}

const ProjectListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/admin/list-projects");
        const data = await res.json();
        console.log(data)
        if (res.ok) setProjects(data);
      } catch (error) {
        console.error("Error fetching projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
        Projects
      </h2>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <table className="w-full border-collapse border border-slate-300 dark:border-slate-700">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="border px-4 py-2">Project Name</th>
              <th className="border px-4 py-2">Manager</th>
              <th className="border px-4 py-2">Deadline</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id} className="text-center hover:bg-slate-50 dark:hover:bg-slate-800">
                <td className="border px-4 py-2 font-medium">{p.name}</td>
                <td className="border px-4 py-2">
                  {p.manager?.fullName} <br />
                  <span className="text-sm text-slate-500">{p.manager?.email}</span>
                </td>
                <td className="border px-4 py-2">
                  {p.deadline ? new Date(p.deadline).toLocaleDateString("en-GB") : "—"}
                </td>
                <td className="border px-4 py-2 capitalize">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProjectListPage;
