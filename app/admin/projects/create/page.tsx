"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Manager {
  _id: string;
  fullName: string;
}

const CreateProjectPage: React.FC = () => {
  const router = useRouter();
  const [managers, setManagers] = useState<Manager[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    deadline: "",
    managerId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await fetch("/api/admin/project-managers");
        const data = await res.json();
        if (res.ok) setManagers(data);
      } catch (error) {
        console.error("Error fetching managers", error);
      }
    };
    fetchManagers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/create-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Project created successfully!");
        router.push("/admin/projects");
      } else {
        alert("❌ " + data.error);
      }
    } catch (error) {
      console.error("Error creating project", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
        Create New Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Project Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Assign Manager</label>
          <select
            name="managerId"
            value={form.managerId}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-white"
          >
            <option value="">-- Select Manager --</option>
            {managers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.fullName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectPage;
