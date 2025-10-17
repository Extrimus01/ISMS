"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/global/Toast";

interface IProject {
  _id: string;
  title: string;
  description?: string;
}

interface IProjectAssignment {
  project?: IProject | string;
  startDate: string;
  endDate: string;
  status: "assigned" | "in-progress" | "completed";
}

export default function ProjectDetailsPage() {
  const [projects, setProjects] = useState<IProjectAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  const internId = user?._id;

  const fetchProjects = async () => {
    if (!internId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/intern/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: internId }),
      });
      if (!res.ok) throw new Error("Failed to fetch projects");

      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to load projects", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [internId]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Assigned Projects</h2>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects assigned yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Project</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border p-2">
                  {typeof p.project === "string" ? p.project : p.project?.title ?? "-"}
                </td>
                <td className="border p-2">{new Date(p.startDate).toLocaleDateString()}</td>
                <td className="border p-2">{new Date(p.endDate).toLocaleDateString()}</td>
                <td className="border p-2">{p.status}</td>
                <td className="border p-2">{typeof p.project === "object" ? p.project?.description ?? "-" : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
