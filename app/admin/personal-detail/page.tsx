"use client";

import Toast from "@/components/global/Toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BouncingDots } from "@/components/global/Loader";

interface IAdmin {
  _id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  lastLogin?: string;
  createdAt?: string;
}

export default function AdminPersonalDetailsPage() {
  const [admin, setAdmin] = useState<IAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Redirecting to login.");
        router.push("/auth");
        return;
      }

      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setToast({ message: "No logged-in user found", type: "error" });
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const adminId = parsedUser._id;

      if (!adminId) {
        setToast({ message: "Admin ID not found", type: "error" });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/admin", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id: adminId }),
        });

        if (res.status === 401) {
          console.error("Unauthorized. Token might be invalid or expired.");
          localStorage.removeItem("token");
          router.push("/auth");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch admin data");

        const data: IAdmin = await res.json();
        setAdmin(data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setToast({ message: "Failed to load admin data", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [router]);

  const handleChange = (field: keyof IAdmin, value: string) => {
    if (!admin) return;
    setAdmin({ ...admin, [field]: value });
  };

  const handleSave = async () => {
    if (!admin) return;
    setSaving(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setToast({
        message: "Token missing. Please login again.",
        type: "error",
      });
      router.push("/auth");
      return;
    }

    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: admin._id,
          fullName: admin.fullName,
          companyName: admin.companyName,
          email: admin.email,
          phone: admin.phone,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const data: IAdmin = await res.json();
      setAdmin(data);
      setToast({ message: "Details updated successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to update details", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );

  if (!admin) return <p className="text-center mt-10">No data found.</p>;

  return (
    <div className="p-6 space-y-8">
      <div className="glass-card p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">Personal Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              value={admin.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Company Name</label>
            <input
              type="text"
              value={admin.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={admin.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="text"
              value={admin.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Joined On</label>
            <input
              type="text"
              value={
                admin.createdAt
                  ? new Date(admin.createdAt).toLocaleDateString()
                  : "N/A"
              }
              disabled
              className="w-full border p-2 rounded bg-gray-100 text-gray-600"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

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
