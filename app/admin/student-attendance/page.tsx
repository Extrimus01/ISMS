"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StudentAttendancePage() {
  const [interns, setInterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intern/attendance")
      .then((res) => res.json())
      .then((data) => {
        setInterns(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center text-lg">Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Intern Attendance Overview</h1>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
              <th className="p-3">Name</th>
              <th className="p-3">College</th>
              <th className="p-3">Course</th>
              <th className="p-3">Project</th>
              <th className="p-3">Mentor</th>
              <th className="p-3">Attendance Progress</th>
            </tr>
          </thead>
          <tbody>
            {interns.map((i) => {
              const total = i.present + i.absent + i.pending;
              const presentPct = ((i.present / total) * 100).toFixed(0);
              const absentPct = ((i.absent / total) * 100).toFixed(0);
              const pendingPct = ((i.pending / total) * 100).toFixed(0);

              return (
                <motion.tr
                  key={i.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="p-3">{i.name}</td>
                  <td className="p-3">{i.college}</td>
                  <td className="p-3">{i.course}</td>
                  <td className="p-3">{i.project}</td>
                  <td className="p-3">{i.mentor}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div className="bg-green-500 h-3" style={{ width: `${presentPct}%` }} />
                        <div className="bg-red-500 h-3" style={{ width: `${absentPct}%` }} />
                        <div className="bg-yellow-400 h-3" style={{ width: `${pendingPct}%` }} />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {presentPct}% Present
                      </span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
