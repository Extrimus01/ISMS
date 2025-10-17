"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Intern {
  _id: string;
  fullName: string;
  college: string;
  course: string;
  department: string;
  semester: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export default function StudentPage() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editIntern, setEditIntern] = useState<Intern | null>(null);

  const fetchInterns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/interns");
      const data: Intern[] = await res.json();
      setInterns(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch interns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const handleChange = (field: string, value: string) => {
    if (!editIntern) return;
    setEditIntern({ ...editIntern, [field]: value });
  };

  const handleSave = async () => {
    if (!editIntern) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/interns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editIntern),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update intern");

      toast.success("Intern updated successfully");
      setEditIntern(null);
      fetchInterns();
    } catch (err: any) {
      toast.error(err.message || "Error updating intern");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (_id: string) => {
    if (!confirm("Are you sure you want to delete this intern?")) return;
    try {
      const res = await fetch("/api/admin/interns", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete intern");

      toast.success("Intern deleted successfully");
      fetchInterns();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete intern");
    }
  };

  if (loading) return <p>Loading interns...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Active Interns</h1>

      <table className="w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-black">Name</th>
            <th className="p-2 border text-black">College</th>
            <th className="p-2 border text-black">Course</th>
            <th className="p-2 border text-black">Department</th>
            <th className="p-2 border text-black">Semester</th>
            <th className="p-2 border text-black">Email</th>
            <th className="p-2 border text-black">Phone</th>
            <th className="p-2 border text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {interns.map((i) => (
            <tr key={i._id} className="hover:bg-gray-50">
              <td className="p-2 border">{i.fullName}</td>
              <td className="p-2 border">{i.college}</td>
              <td className="p-2 border">{i.course}</td>
              <td className="p-2 border">{i.department}</td>
              <td className="p-2 border">{i.semester}</td>
              <td className="p-2 border">{i.email}</td>
              <td className="p-2 border">{i.phone}</td>
              <td className="p-2 border flex gap-2">
                <button
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => setEditIntern(i)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(i._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editIntern && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Intern</h2>
            <div className="space-y-2">
              {[
                "fullName",
                "college",
                "course",
                "department",
                "semester",
                "email",
                "phone",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field}
                  value={(editIntern as any)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  className="w-full p-2 border rounded"
                />
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditIntern(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
