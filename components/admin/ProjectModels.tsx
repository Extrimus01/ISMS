"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Toast from "@/components/global/Toast";

interface Intern {
  _id: string;
  fullName: string;
}

interface Manager {
  _id: string;
  fullName: string;
}

interface Project {
  _id?: string;
  title: string;
  description: string;
  manager: string;
  interns: string[];
  startDate?: string;
  endDate?: string;
}

export default function ProjectModal({
  project,
  onClose,
  onSave,
}: {
  project: Project | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [manager, setManager] = useState(project?.manager || "");
  const [interns, setInterns] = useState<string[]>(project?.interns || []);
  const [allManagers, setAllManagers] = useState<Manager[]>([]);
  const [allInterns, setAllInterns] = useState<Intern[]>([]);
  const [startDate, setStartDate] = useState(project?.startDate || "");
  const [endDate, setEndDate] = useState(project?.endDate || "");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Fetch managers & interns
  useEffect(() => {
    const fetchManagers = async () => {
      const res = await fetch("/api/manager");
      const data: Manager[] = await res.json();
      setAllManagers(data);
    };
    const fetchInterns = async () => {
      const res = await fetch("/api/intern?isActive=true");
      const data: Intern[] = await res.json();
      setAllInterns(data);
    };
    fetchManagers();
    fetchInterns();
  }, []);

  const handleSubmit = async () => {
    if (!title || !description || !manager) {
      setToast({ message: "Please fill all required fields", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        manager,
        interns,
        startDate,
        endDate,
      };
      const url = project?._id
        ? `/api/project?id=${project._id}`
        : "/api/project";
      const method = project?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setToast({
          message: `Project ${
            project?._id ? "updated" : "created"
          } successfully`,
          type: "success",
        });
        onSave();
        onClose();
      } else {
        throw new Error(data.error || "Failed");
      }
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg relative">
        <h2 className="text-xl font-semibold mb-4">
          {project?._id ? "Edit Project" : "Create Project"}
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block mb-1 font-medium">Title*</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description*</label>
            <textarea
              className="w-full p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Manager*</label>
            <select
              className="w-full p-2 border rounded"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
            >
              <option value="">Select manager</option>
              {allManagers.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Assign Interns</label>
            <select
              multiple
              className="w-full p-2 border rounded h-32"
              value={interns}
              onChange={(e) =>
                setInterns(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {allInterns.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Start Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={startDate?.split("T")[0] || ""}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">End Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={endDate?.split("T")[0] || ""}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
