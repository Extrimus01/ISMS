"use client";

import React, { useEffect, useState } from "react";

interface Student {
  _id: string;
  fullName: string;
  email: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  deadline?: string;
  status: string;
  assignedStudents: Student[];
}

const ManagerProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    try {
      const user = JSON.parse(userData);
      if (user.role === "project_manager") {
        setEmail(user.email);
      }
    } catch (err) {
      console.error("Invalid user data", err);
    }
  }, []);

  useEffect(() => {
    if (!email) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/project-manager/projects?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (res.ok) setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [email]);

  if (loading) return <p className="p-6 text-center">Loading projects...</p>;
  if (!email) return <p className="p-6 text-center">Unable to determine manager email.</p>;
  if (projects.length === 0) return <p className="p-6 text-center">No projects assigned.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
        My Projects
      </h2>

      {projects.map((project) => (
        <div key={project._id} className="mb-6 p-4 border rounded-md border-slate-300 dark:border-slate-700">
          <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">{project.name}</h3>
          <p className="mb-2 text-slate-600 dark:text-slate-300">{project.description}</p>
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
            Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString("en-GB") : "—"}
          </p>
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">Status: {project.status}</p>

          <div>
            <strong className="text-slate-700 dark:text-slate-200">Assigned Students:</strong>
            {project.assignedStudents.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300">
                {project.assignedStudents.map((s) => (
                  <li key={s._id}>
                    {s.fullName} ({s.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">No students assigned.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManagerProjectsPage;
