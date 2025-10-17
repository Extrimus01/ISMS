"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/global/Toast";

interface IAttendance {
  date: string;
  status: "pending" | "present" | "absent";
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<IAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  const internId = user?._id;

  const fetchAttendance = async () => {
    if (!internId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/intern/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: internId }),
      });
      if (!res.ok) throw new Error("Failed to fetch attendance");

      const data = await res.json();
      setAttendance(data.attendance || []);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to load attendance", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const markToday = async () => {
    if (!internId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/intern/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: internId, action: "mark" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to mark attendance");

      setAttendance(data.attendance || []);
      setToast({ message: "Attendance marked for today", type: "success" });
    } catch (err: any) {
      console.error(err);
      setToast({ message: err.message || "Failed to mark attendance", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [internId]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Attendance</h2>

      <button
        onClick={markToday}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {saving ? "Marking..." : "Mark Today"}
      </button>

      {loading ? (
        <p>Loading attendance...</p>
      ) : attendance.length === 0 ? (
        <p>No attendance records yet.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border text-black p-2">Date</th>
              <th className="border text-black p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border p-2">{new Date(a.date).toLocaleDateString()}</td>
                <td className="border p-2">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
