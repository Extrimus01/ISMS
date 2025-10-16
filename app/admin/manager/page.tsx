"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import Toast from "@/components/global/Toast";

interface Manager {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export default function ManagerPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    setLoading(true);
    const res = await fetch("/api/manager");
    const data = await res.json();
    setManagers(data);
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingManager(null);
    setForm({ fullName: "", email: "", phone: "", password: "" });
    setModalOpen(true);
  };

  const openEditModal = (manager: Manager) => {
    setEditingManager(manager);
    setForm({ fullName: manager.fullName, email: manager.email, phone: manager.phone, password: "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingManager ? "PUT" : "POST";
    const url = editingManager ? `/api/manager/${editingManager._id}` : "/api/manager";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      await fetchManagers();
      setModalOpen(false);
      setToast({ message: editingManager ? "Manager updated successfully!" : "Manager created!", type: "success" });
    } else {
      const err = await res.json();
      setToast({ message: err.error || "An error occurred", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this manager?")) return;
    const res = await fetch(`/api/manager/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchManagers();
      setToast({ message: "Manager deleted successfully!", type: "success" });
    } else {
      setToast({ message: "Failed to delete manager", type: "error" });
    }
  };

  const toggleActive = async (manager: Manager) => {
    const res = await fetch(`/api/manager/${manager._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !manager.isActive }),
    });

    if (res.ok) {
      await fetchManagers();
      setToast({
        message: manager.isActive ? "Manager deactivated!" : "Manager activated!",
        type: "success",
      });
    } else {
      setToast({ message: "Action failed", type: "error" });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Manage Managers</h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <PlusCircle /> Add Manager
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center mt-10">Loading managers...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {managers.map((manager) => (
            <div
              key={manager._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex justify-between items-center hover:shadow-lg transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{manager.fullName}</h3>
                <p className="text-sm text-gray-500">{manager.email}</p>
                <p className="text-sm text-gray-500">{manager.phone}</p>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => toggleActive(manager)}
                  className={`px-3 py-1 rounded-md ${
                    manager.isActive ? "bg-green-500" : "bg-gray-400"
                  } text-white`}
                >
                  {manager.isActive ? "Active" : "Inactive"}
                </button>
                <button onClick={() => openEditModal(manager)} className="text-blue-500 hover:text-blue-600">
                  <Pencil />
                </button>
                <button onClick={() => handleDelete(manager._id)} className="text-red-500 hover:text-red-600">
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">
              {editingManager ? "Edit Manager" : "Add Manager"}
            </h3>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Full Name"
                className="border p-2 rounded-md bg-gray-50 dark:bg-gray-700"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded-md bg-gray-50 dark:bg-gray-700"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                className="border p-2 rounded-md bg-gray-50 dark:bg-gray-700"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              {!editingManager && (
                <input
                  type="password"
                  placeholder="Password"
                  className="border p-2 rounded-md bg-gray-50 dark:bg-gray-700"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editingManager ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
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
