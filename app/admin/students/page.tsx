"use client";

import React, { useEffect, useState } from "react";

interface Student {
  _id: string;
  fullName: string;
  email: string;
  college?: string;
  phone?: string;
  verified: boolean;
}

const VerifiedStudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/admin/get-students");
        const data = await res.json();
        if (res.ok) {
          setStudents(data.filter((s: Student) => s.verified));
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
        Verified Students
      </h2>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No verified students found.</p>
      ) : (
        <table className="w-full border-collapse border border-slate-300 dark:border-slate-700">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">College</th>
              <th className="border px-4 py-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr
                key={s._id}
                className="text-center hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <td className="border px-4 py-2 font-medium">{s.fullName}</td>
                <td className="border px-4 py-2">{s.email}</td>
                <td className="border px-4 py-2">{s.college || "—"}</td>
                <td className="border px-4 py-2">{s.phone || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VerifiedStudentsList;
