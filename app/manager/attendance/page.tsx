
"use client";

import React, { useEffect, useState } from "react";

interface PendingItem {
  _id: string;
  date: string;
  student: { _id: string; fullName: string; email: string };
  project: { _id: string; name: string };
  status: string;
}

const ManagerAttendancePage: React.FC = () => {
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const fetchPending = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) return;
    const user = JSON.parse(userData);

    try {
      const res = await fetch(`/api/project-manager/attendence-pending?managerId=${encodeURIComponent(user._id)}`);
      const data = await res.json();
      if (res.ok) setPending(data);
      else console.error(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setLoading(false);
      return;
    }
    fetchPending().finally(() => setLoading(false));
  }, []);

  const handleApprove = async (attendanceId: string, approve: boolean) => {
    const userData = localStorage.getItem("user");
    if (!userData) return;
    const user = JSON.parse(userData);

    try {
      await fetch("/api/project-manager/attendence-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendanceId, managerId: user._id, approve }),
      });
      await fetchPending();
    } catch (err) {
      console.error(err);
    }
  };

  const loadStats = async (studentId: string, projectId: string) => {
    setSelectedStudent(studentId);
    try {
      const res = await fetch(`/api/project-manager/attendence-stats?studentId=${encodeURIComponent(studentId)}&projectId=${encodeURIComponent(projectId)}`);
      const data = await res.json();
      if (res.ok) setStats(data);
      else console.error(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ml-64 max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Pending Attendance</h2>

      {loading ? <p>Loading...</p> : pending.length === 0 ? <p>No pending attendance.</p> : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="py-2">Student</th>
              <th className="py-2">Project</th>
              <th className="py-2">Date</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map(p => (
              <tr key={p._id} className="border-t">
                <td className="py-2">
                  <button className="text-blue-600" onClick={() => loadStats(p.student._id, p.project._id)}>
                    {p.student.fullName}
                  </button>
                </td>
                <td className="py-2">{p.project?.name}</td>
                <td className="py-2">{p.date}</td>
                <td className="py-2 space-x-2">
                  <button onClick={() => handleApprove(p._id, true)} className="px-2 py-1 bg-green-600 text-white rounded">Approve</button>
                  <button onClick={() => handleApprove(p._id, false)} className="px-2 py-1 bg-red-600 text-white rounded">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {stats && selectedStudent && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-semibold">Attendance Stats</h3>
          <p>Total: {stats.total}</p>
          <p>Approved: {stats.approved}</p>
          <p>Pending: {stats.pending}</p>
          <p>Rejected: {stats.rejected}</p>
        </div>
      )}
    </div>
  );
};

export default ManagerAttendancePage;
