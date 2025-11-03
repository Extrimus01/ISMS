"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#e5e7eb" : "#111827",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: isDark
            ? "0 4px 16px rgba(255,255,255,0.1)"
            : "0 4px 16px rgba(0,0,0,0.15)",
          width: "90%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <p style={{ marginBottom: "20px", fontSize: "16px", fontWeight: 500 }}>
          {message}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              backgroundColor: isDark ? "#374151" : "#e5e7eb",
              color: isDark ? "#fff" : "#111",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface Project {
  _id: string;
  title: string;
}

interface Assignment {
  project: Project;
  startDate: string;
  endDate: string;
  status: string;
}

interface Intern {
  _id: string;
  fullName: string;
  projectsAssigned: Assignment[];
}

export default function InternProjectDashboard() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [interns, setInterns] = useState<Intern[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editAssignment, setEditAssignment] = useState<Assignment | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    id: string;
    projectid: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const internsRes = await fetch("/api/admin/interns");
      const internsData: Intern[] = await internsRes.json();
      setInterns(internsData);

      const projectsRes = await fetch("/api/project");
      const projectsData: Project[] = await projectsRes.json();
      setProjects(projectsData);
    }
    fetchData();
  }, []);

  const fetchInterns = async () => {
    const res = await fetch("/api/admin/interns");
    const data: Intern[] = await res.json();
    setInterns(data);
  };

  const handleAssign = async () => {
    if (!selectedIntern || !selectedProject || !startDate || !endDate)
      return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/interns/assign-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internId: selectedIntern,
          projectId: selectedProject,
          startDate,
          endDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign project");

      toast.success("Project assigned successfully");
      setSelectedIntern("");
      setSelectedProject("");
      setStartDate("");
      setEndDate("");
      fetchInterns();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssignment = async () => {
    if (!selectedIntern || !editAssignment) return;

    try {
      const res = await fetch("/api/intern/project", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internId: selectedIntern,
          projectId: editAssignment.project._id,
          startDate: editAssignment.startDate,
          endDate: editAssignment.endDate,
          status: editAssignment.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update assignment");

      toast.success("Assignment updated successfully");
      setEditAssignment(null);
      fetchInterns();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteAssignment = async (
    internId: string,
    projectId: string
  ) => {
    try {
      const res = await fetch("/api/intern/project", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internId, projectId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete assignment");

      toast.success("Assignment removed");
      fetchInterns();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: "1.5rem",
        maxWidth: "1100px",
        margin: "0 auto",
        color: isDarkMode ? "#f3f4f6" : "#1f2937",
      }}
    >
      {" "}
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={() => {
            handleDeleteAssignment(confirmModal.id, confirmModal.projectid);
            setConfirmModal(null);
          }}
          onCancel={() => setConfirmModal(null)}
        />
      )}
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: "600",
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        Intern Project Management
      </h1>
      <div
        style={{
          background: isDarkMode ? "#1f2937" : "#ffffff",
          border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
          borderRadius: "1rem",
          padding: "1.5rem",
          boxShadow: isDarkMode
            ? "0 2px 6px rgba(0,0,0,0.4)"
            : "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontWeight: "600", marginBottom: "1rem" }}>
          Assign New Project
        </h2>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          <select
            value={selectedIntern}
            onChange={(e) => setSelectedIntern(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
              background: isDarkMode ? "#374151" : "#f9fafb",
              color: isDarkMode ? "#f3f4f6" : "#1f2937",
            }}
          >
            <option value="">Select Intern</option>
            {interns.map((i) => (
              <option key={i._id} value={i._id}>
                {i.fullName}
              </option>
            ))}
          </select>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
              background: isDarkMode ? "#374151" : "#f9fafb",
              color: isDarkMode ? "#f3f4f6" : "#1f2937",
            }}
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "0.5rem",
                border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
              }}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "0.5rem",
                border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
              }}
            />
          </div>

          <button
            onClick={handleAssign}
            disabled={loading}
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Assigning..." : "Assign Project"}
          </button>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "700px",
          }}
        >
          <thead
            style={{
              background: isDarkMode ? "#111827" : "#f3f4f6",
              color: isDarkMode ? "#e5e7eb" : "#111827",
            }}
          >
            <tr>
              {["Intern", "Project", "Start", "End", "Status", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    style={{
                      padding: "0.75rem",
                      border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                      textAlign: "left",
                      fontWeight: "600",
                    }}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {interns.flatMap((i) =>
              i.projectsAssigned.map((a) => (
                <tr
                  key={`${i._id}-${a.project._id}`}
                  style={{
                    background: isDarkMode ? "#1f2937" : "#ffffff",
                    borderBottom: `1px solid ${
                      isDarkMode ? "#374151" : "#e5e7eb"
                    }`,
                    transition: "background 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = isDarkMode
                      ? "#374151"
                      : "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = isDarkMode
                      ? "#1f2937"
                      : "#ffffff")
                  }
                >
                  <td style={{ padding: "0.75rem" }}>{i.fullName}</td>
                  <td style={{ padding: "0.75rem" }}>{a.project.title}</td>
                  <td style={{ padding: "0.75rem" }}>
                    {new Date(a.startDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    {new Date(a.endDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "0.75rem" }}>{a.status}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <button
                      style={{
                        background: "#facc15",
                        color: "#000",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        marginRight: "0.5rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSelectedIntern(i._id);
                        setEditAssignment(a);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setConfirmModal({
                          id: i._id,
                          projectid: a.project._id,
                          message:
                            "Are you sure you want to remove this assignment?",
                        })
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {editAssignment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: isDarkMode ? "#1f2937" : "#ffffff",
              color: isDarkMode ? "#f3f4f6" : "#1f2937",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>
              Edit Assignment
            </h2>
            <p style={{ margin: "0.5rem 0 1rem" }}>
              <strong>Project:</strong> {editAssignment.project.title}
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="date"
                value={editAssignment.startDate?.slice(0, 10)}
                onChange={(e) =>
                  setEditAssignment({
                    ...editAssignment,
                    startDate: e.target.value,
                  })
                }
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
                }}
              />
              <input
                type="date"
                value={editAssignment.endDate?.slice(0, 10)}
                onChange={(e) =>
                  setEditAssignment({
                    ...editAssignment,
                    endDate: e.target.value,
                  })
                }
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
                }}
              />
            </div>
            <select
              value={editAssignment.status}
              onChange={(e) =>
                setEditAssignment({ ...editAssignment, status: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
                marginTop: "0.75rem",
              }}
            >
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <button
                onClick={() => setEditAssignment(null)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #9ca3af",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAssignment}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
