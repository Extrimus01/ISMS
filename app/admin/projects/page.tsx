"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ----------------- Shared Types -----------------
interface Manager {
  _id: string;
  fullName: string;
}

interface Intern {
  _id: string;
  fullName: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  manager: Manager; // populated
  interns: Intern[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

// ----------------- Toast Component -----------------
interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-5 right-5 z-50 px-4 py-2 rounded-lg text-white font-semibold shadow-lg ${bgColor}`}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
}

// ----------------- Project Modal -----------------
interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSave: () => void;
}

function ProjectModal({ project, onClose, onSave }: ProjectModalProps) {
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [managerId, setManagerId] = useState(project?.manager._id || "");
  const [startDate, setStartDate] = useState(project?.startDate || "");
  const [endDate, setEndDate] = useState(project?.endDate || "");
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);

  // Fetch all managers for dropdown
  useEffect(() => {
    async function fetchManagers() {
      const res = await fetch("/api/manager");
      const data: Manager[] = await res.json();
      setManagers(data);
    }
    fetchManagers();
  }, []);

  const handleSubmit = async () => {
    if (!title || !description || !managerId) return alert("Fill all fields");
    setLoading(true);
    try {
      const url = project ? `/api/project?id=${project._id}` : "/api/project";
      const method = project ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          manager: managerId,
          startDate,
          endDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      onSave();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {project ? "Edit Project" : "Create Project"}
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Manager</option>
            {managers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.fullName}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate?.slice(0, 10)}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded w-1/2"
            />
            <input
              type="date"
              value={endDate?.slice(0, 10)}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded w-1/2"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {project ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------- Projects Page -----------------
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

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
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      setToast({ message: "Project deleted successfully", type: "success" });
      fetchProjects();
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    }
  };

  return (
    <div className="p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <button
          onClick={() => {
            setEditProject(null);
            setModalOpen(true);
          }}
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
                <th className="p-2 border text-black">Title</th>
                <th className="p-2 border text-black">Manager</th>
                <th className="p-2 border text-black">Interns</th>
                <th className="p-2 border text-black">Start Date</th>
                <th className="p-2 border text-black">End Date</th>
                <th className="p-2 border text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{p.title}</td>
                  <td className="p-2 border">{p.manager?.fullName || "N/A"}</td>
                  <td className="p-2 border">
                    {p.interns.map((i) => i.fullName).join(", ") || "N/A"}
                  </td>
                  <td className="p-2 border">
                    {p.startDate
                      ? new Date(p.startDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2 border">
                    {p.endDate ? new Date(p.endDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => {
                        setEditProject(p);
                        setModalOpen(true);
                      }}
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
        <ProjectModal
          project={editProject}
          onClose={() => setModalOpen(false)}
          onSave={fetchProjects}
        />
      )}
    </div>
  );
}
