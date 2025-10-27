"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/global/Toast";
import { BouncingDots } from "@/components/global/Loader";

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
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Assigned Projects</h2>

      {loading ? (
        <div className="p-6 space-y-8">
          <BouncingDots />
        </div>
      ) : projects.length === 0 ? (
        <p>No projects assigned yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-100 text-black">
                <th className="border p-2">Project</th>
                <th className="border p-2">Start Date</th>
                <th className="border p-2">End Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody className="md:table-row-group">
              {projects.map((p, idx) => (
                <tr
                  key={idx}
                  className="block md:table-row border-b md:border-none  md:mb-0 p-4 rounded-lg shadow-sm md:shadow-none bg-white dark:bg-gray-900 md:bg-transparent"
                >
                  <td className="block md:table-cell p-2">
                    <span className="font-semibold md:hidden">Project: </span>
                    {typeof p.project === "string"
                      ? p.project
                      : p.project?.title ?? "-"}
                  </td>
                  <td className="block md:table-cell p-2">
                    <span className="font-semibold md:hidden">Start Date: </span>
                    {new Date(p.startDate).toLocaleDateString()}
                  </td>
                  <td className="block md:table-cell p-2">
                    <span className="font-semibold md:hidden">End Date: </span>
                    {new Date(p.endDate).toLocaleDateString()}
                  </td>
                  <td className="block md:table-cell p-2">
                    <span className="font-semibold md:hidden">Status: </span>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="block md:table-cell p-2">
                    <span className="font-semibold md:hidden">Description: </span>
                    {typeof p.project === "object"
                      ? p.project?.description ?? "-"
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
