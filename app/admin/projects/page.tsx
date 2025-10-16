"use client";

import { useEffect, useState } from "react";
import ProjectModal from "@/components/admin/ProjectModels";
import Toast from "@/components/global/Toast";

interface Project {
  _id: string;
  title: string;
  description: string;
  manager: { _id: string; fullName: string };
  interns: { _id: string; fullName: string }[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/project");
      const data: Project[] = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/project?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setToast({ message: "Project deleted successfully", type: "success" });
        fetchProjects();
      } else {
        throw new Error(data.error || "Failed to delete");
      }
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    }
  };

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <button
          onClick={() => { setEditProject(null); setModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Project
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Manager</th>
                <th className="p-2 border">Interns</th>
                <th className="p-2 border">Start Date</th>
                <th className="p-2 border">End Date</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{p.title}</td>
                  <td className="p-2 border">{p.manager?.fullName || "N/A"}</td>
                  <td className="p-2 border">{p.interns.map(i => i.fullName).join(", ") || "N/A"}</td>
                  <td className="p-2 border">{p.startDate ? new Date(p.startDate).toLocaleDateString() : "-"}</td>
                  <td className="p-2 border">{p.endDate ? new Date(p.endDate).toLocaleDateString() : "-"}</td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => { setEditProject(p); setModalOpen(true); }}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        // <ProjectModal
        //   project={editProject}
        //   onClose={() => setModalOpen(false)}
        //   onSave={fetchProjects}
        // />
      )}
    </div>
  );
}
