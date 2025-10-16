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
}

const AssignStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/get-students")
      .then((res) => res.json())
      .then(setStudents)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/admin/list-projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || selectedStudents.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/assign-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject,
          studentIds: selectedStudents,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Assigned ${selectedStudents.length} students successfully`);
        setSelectedProject("");
        setSelectedStudents([]);
      } else {
        alert("❌ " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Assign Students to Project</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Project</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            required
          >
            <option value="">-- Select Project --</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Students</label>
          <div className="max-h-60 overflow-y-auto border rounded p-2 dark:bg-gray-800">
            {students.map((s) => (
              <div key={s._id} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(s._id)}
                  onChange={() => toggleStudent(s._id)}
                  className="mr-2"
                />
                <span>
                  {s.fullName} ({s.email})
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Assigning..." : "Assign Students"}
        </button>
      </form>
    </div>
  );
};

export default AssignStudentsPage;
