"use client";

import Toast from "@/components/global/Toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BouncingDots } from "@/components/global/Loader";

interface IProject {
  _id: string;
  title: string;
}

interface IProjectAssignment {
  project?: IProject | string;
  startDate: string;
  endDate: string;
  status: "assigned" | "in-progress" | "completed";
  assignedAt: string;
}

interface IAttendance {
  date: string;
  status: "pending" | "present" | "absent";
  project?: IProject | string;
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

interface IIntern {
  fullName: string;
  college: string;
  course: string;
  department: string;
  semester: string;
  refNo: string;
  email: string;
  phone: string;
  projectsAssigned: IProjectAssignment[];
  attendance: IAttendance[];
}

export default function PersonalDetailsPage() {
  const [intern, setIntern] = useState<IIntern | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchIntern = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Redirecting to login.");
        router.push("/auth");
        return;
      }

      try {
        const res = await fetch("/api/intern/me", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          console.error("Unauthorized. Token might be invalid or expired.");
          localStorage.removeItem("token");
          router.push("/auth");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch intern data");

        const data: IIntern = await res.json();
        setIntern(data);
      } catch (err) {
        console.error("Error fetching intern data:", err);
        setToast({ message: "Failed to load intern data", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchIntern();
  }, [router]);

  const handleChange = (field: keyof IIntern, value: string) => {
    if (!intern) return;
    setIntern({ ...intern, [field]: value });
  };

  const handleSave = async () => {
    if (!intern) return;
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
      const res = await fetch("/api/intern/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: intern.fullName,
          course: intern.course,
          department: intern.department,
          semester: intern.semester,
          refNo: intern.refNo,
          phone: intern.phone,
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const data: IIntern = await res.json();
      setIntern(data);
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
  if (!intern) return <p className="text-center mt-10">No data found.</p>;

  return (
    <div className="p-6 space-y-8">
      <div className="glass-card p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">Personal Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              value={intern.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Course</label>
            <input
              type="text"
              value={intern.course}
              onChange={(e) => handleChange("course", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Department</label>
            <input
              type="text"
              value={intern.department}
              onChange={(e) => handleChange("department", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Semester</label>
            <input
              type="text"
              value={intern.semester}
              onChange={(e) => handleChange("semester", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Ref No</label>
            <input
              type="text"
              value={intern.refNo}
              onChange={(e) => handleChange("refNo", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="text"
              value={intern.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">College</label>
            <input
              type="text"
              value={intern.college}
              disabled
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="text"
              value={intern.email}
              disabled
              className="w-full border p-2 rounded"
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
