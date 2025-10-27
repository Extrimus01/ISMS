"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/global/Toast";
import { BouncingDots } from "@/components/global/Loader";

interface ITask {
  _id: string;
  week: number;
  title: string;
  description: string;
  deadline: string;
  status: "pending" | "completed";
  feedback?: string;
  proofUrl?: string;
}

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
export default function WeeklyTaskPage() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [projects, setProjects] = useState<IProjectAssignment[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

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

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/intern/me", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to load tasks", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (taskId: string) => {
    try {
      const res = await fetch("/api/intern/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskId, action: "complete" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update task");
      setTasks(data.tasks);
      setToast({ message: "Task marked as completed!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    }
  };

  const handleUploadProof = async (taskId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];
      setUploading(taskId);
      try {
        const res = await fetch("/api/intern/task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ taskId, action: "upload", file: base64 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setTasks(data.tasks);
        setToast({ message: "Proof uploaded successfully!", type: "success" });
      } catch (err: any) {
        setToast({ message: err.message, type: "error" });
      } finally {
        setUploading(null);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.week]) acc[task.week] = [];
    acc[task.week].push(task);
    return acc;
  }, {} as Record<number, ITask[]>);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-xl font-semibold">Weekly Tasks</h2>

      {projects.length === 0 ? (
        <p>No projects assigned yet.</p>
      ) : Object.keys(groupedTasks).length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        Object.entries(groupedTasks).map(([week, weekTasks]) => (
          <div key={week} className="space-y-4">
            <h3 className="text-lg font-medium text-blue-700">Week {week}</h3>
            {weekTasks.map((task) => (
              <div
                key={task._id}
                className="glass-card p-4 rounded shadow space-y-2"
              >
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h4 className="font-semibold text-gray-800">{task.title}</h4>
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-xs text-gray-500">
                  Deadline: {new Date(task.deadline).toLocaleDateString()}
                </p>

                {task.feedback && (
                  <p className="text-sm text-blue-600">
                    💬 Feedback: {task.feedback}
                  </p>
                )}

                {task.proofUrl && (
                  <button
                    onClick={() => window.open(task.proofUrl!, "_blank")}
                    className="text-blue-600 underline text-sm"
                  >
                    View Uploaded Proof
                  </button>
                )}

                <div className="flex flex-wrap gap-3 mt-2">
                  {task.status === "pending" && (
                    <>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) =>
                          e.target.files &&
                          handleUploadProof(task._id, e.target.files[0])
                        }
                        disabled={uploading === task._id}
                        className="border p-2 rounded"
                      />
                      <button
                        onClick={() => handleMarkComplete(task._id)}
                        disabled={uploading === task._id}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        {uploading === task._id
                          ? "Uploading..."
                          : "Mark Completed"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
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
