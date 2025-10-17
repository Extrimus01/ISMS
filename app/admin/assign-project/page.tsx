"use client";

import { useEffect, useState } from "react";

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
  const [interns, setInterns] = useState<Intern[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editAssignment, setEditAssignment] = useState<Assignment | null>(null);

  // Fetch interns & projects
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
    if (!selectedIntern || !selectedProject || !startDate || !endDate) return alert("Fill all fields");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/interns/assign-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internId: selectedIntern, projectId: selectedProject, startDate, endDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign project");

      alert("Project assigned successfully");
      setSelectedIntern("");
      setSelectedProject("");
      setStartDate("");
      setEndDate("");
      fetchInterns();
    } catch (err: any) {
      alert(err.message);
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

      alert("Assignment updated");
      setEditAssignment(null);
      fetchInterns();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteAssignment = async (internId: string, projectId: string) => {
    if (!confirm("Are you sure to remove this assignment?")) return;
    try {
      const res = await fetch("/api/intern/project", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internId, projectId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete assignment");

      alert("Assignment removed");
      fetchInterns();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Intern Project Management</h1>

      {/* Assign New Project */}
      <div className="p-4 border rounded space-y-2">
        <h2 className="font-semibold">Assign New Project</h2>
        <select value={selectedIntern} onChange={(e) => setSelectedIntern(e.target.value)} className="p-2 border rounded w-full">
          <option value="">Select Intern</option>
          {interns.map((i) => <option key={i._id} value={i._id}>{i.fullName}</option>)}
        </select>
        <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="p-2 border rounded w-full">
          <option value="">Select Project</option>
          {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
        <div className="flex gap-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded w-1/2" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded w-1/2" />
        </div>
        <button onClick={handleAssign} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {loading ? "Assigning..." : "Assign Project"}
        </button>
      </div>

      {/* Interns Table */}
      <table className="w-full border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-black">Intern</th>
            <th className="p-2 border text-black">Project</th>
            <th className="p-2 border text-black">Start</th>
            <th className="p-2 border text-black">End</th>
            <th className="p-2 border text-black">Status</th>
            <th className="p-2 border text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {interns.map((i) =>
            i.projectsAssigned.map((a) => (
              <tr key={`${i._id}-${a.project._id}`} className="hover:bg-gray-50">
                <td className="p-2 border">{i.fullName}</td>
                <td className="p-2 border">{a.project.title}</td>
                <td className="p-2 border">{new Date(a.startDate).toLocaleDateString()}</td>
                <td className="p-2 border">{new Date(a.endDate).toLocaleDateString()}</td>
                <td className="p-2 border">{a.status}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                    onClick={() => { setSelectedIntern(i._id); setEditAssignment(a); }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDeleteAssignment(i._id, a.project._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-3">
            <h2 className="text-xl font-semibold">Edit Assignment</h2>
            <p><strong>Project:</strong> {editAssignment.project.title}</p>
            <div className="flex gap-2">
              <input type="date" value={editAssignment.startDate?.slice(0,10)} onChange={(e) => setEditAssignment({...editAssignment, startDate: e.target.value})} className="p-2 border rounded w-1/2" />
              <input type="date" value={editAssignment.endDate?.slice(0,10)} onChange={(e) => setEditAssignment({...editAssignment, endDate: e.target.value})} className="p-2 border rounded w-1/2" />
            </div>
            <select value={editAssignment.status} onChange={(e) => setEditAssignment({...editAssignment, status: e.target.value})} className="p-2 border rounded w-full">
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditAssignment(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleUpdateAssignment} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
