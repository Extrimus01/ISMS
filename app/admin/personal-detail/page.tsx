"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AdminDetails {
  _id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  lastLogin?: string;
  createdAt?: string;
}

export default function AdminPage() {
  const [admin, setAdmin] = useState<AdminDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("No logged-in user found");
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    const adminId = parsedUser._id;

    if (!adminId) {
      toast.error("Admin ID not found");
      setLoading(false);
      return;
    }

    async function fetchAdmin() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/detail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: adminId }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to load admin details");
        }

        const data: AdminDetails = await res.json();
        setAdmin(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch admin");
      } finally {
        setLoading(false);
      }
    }

    fetchAdmin();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdmin((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSave = async () => {
    if (!admin) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/detail`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: admin._id,
          fullName: admin.fullName,
          companyName: admin.companyName,
          email: admin.email,
          phone: admin.phone,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save changes");
      }

      const updatedAdmin: AdminDetails = await res.json();
      setAdmin(updatedAdmin);
      toast.success("Details updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Error updating details");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );

  if (!admin) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
        Personal Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Full Name", name: "fullName", type: "text" },
          { label: "Company Name", name: "companyName", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone", name: "phone", type: "text" },
        ].map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="font-medium text-gray-700 dark:text-gray-200 mb-2">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={admin[field.name as keyof AdminDetails] ?? ""}
              onChange={handleChange}
              className="p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        ))}

        <div className="md:col-span-2 mt-4 text-gray-600 dark:text-gray-300 space-y-1">
          {admin.lastLogin && (
            <p>
              <span className="font-medium">Last Login:</span>{" "}
              {new Date(admin.lastLogin).toLocaleString()}
            </p>
          )}
          {admin.createdAt && (
            <p>
              <span className="font-medium">Joined On:</span>{" "}
              {new Date(admin.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
