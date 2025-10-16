"use client";

import React, { useEffect, useState } from "react";
import MarkAttendance from "@/components/students/MarkAttendance";

interface AttendanceItem {
  _id: string;
  date: string;
  status: string;
  project?: { name: string };
  markedAt?: string;
}

const StudentAttendancePage: React.FC = () => {
  const [history, setHistory] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setLoading(false);
      return;
    }
    const user = JSON.parse(userData);
    const studentId = user._id;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `/api/student/attendence/history?studentId=${encodeURIComponent(
            studentId
          )}`
        );
        const data = await res.json();
        if (res.ok) setHistory(data);
        else console.error(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user.internship?.projectTitle)
      setProjectName(user.internship.projectTitle);

    fetchHistory();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Attendance</h2>
      <div className="mb-4">
        <MarkAttendance />
      </div>

      <h3 className="font-semibold mb-2">History</h3>
      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No attendance recorded yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left">
              <th className="py-2">Date</th>
              <th className="py-2">Project</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h._id} className="border-t">
                <td className="py-2">{h.date}</td>
                <td className="py-2">
                  {h.project?.name || projectName || "—"}
                </td>
                <td className="py-2 capitalize">{h.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentAttendancePage;
