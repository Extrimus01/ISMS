"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/global/Toast";
import { BouncingDots } from "@/components/global/Loader";

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
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const internId = user?._id;

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

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
      setToast({
        message: err.message || "Failed to mark attendance",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [internId]);

  const handlePrevMonth = () => {
    setCurrentMonth(({ year, month }) => {
      const prevMonth = month - 1;
      return prevMonth < 0
        ? { year: year - 1, month: 11 }
        : { year, month: prevMonth };
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(({ year, month }) => {
      const nextMonth = month + 1;
      return nextMonth > 11
        ? { year: year + 1, month: 0 }
        : { year, month: nextMonth };
    });
  };

  const { year, month } = currentMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleString("default", {
    month: "long",
  });

  const getStatusForDate = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().split("T")[0];
    const record = attendance.find((a) => a.date.split("T")[0] === dateStr);
    return record ? record.status : "none";
  };

  const getColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500";
      case "absent":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-400";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h2 className="text-xl font-semibold">
          {monthName} {year} Attendance
        </h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handlePrevMonth}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            Previous
          </button>
          <button
            onClick={handleNextMonth}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            Next
          </button>
          <button
            onClick={markToday}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {saving ? "Marking..." : "Mark Today"}
          </button>
        </div>
      </div>

      {loading ? (
        <BouncingDots />
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {[...Array(daysInMonth)].map((_, idx) => {
            const day = idx + 1;
            const status = getStatusForDate(day);
            return (
              <div
                key={day}
                className={`flex flex-col items-center justify-center p-2 rounded cursor-pointer ${getColor(
                  status
                )} text-white`}
                title={status}
              >
                {day}
              </div>
            );
          })}
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
