"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { BouncingDots } from "@/components/global/Loader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Attendance {
  _id: string;
  date: string;
  status: string;
  confirmedByManager: boolean;
  intern: {
    _id: string;
    fullName: string;
    email: string;
    department: string;
  };
}

export default function AttendancePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/manager/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      toast.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  // Download whole table as PDF
  const downloadPDF = async () => {
    const element = document.querySelector("table");
    if (!element) return;
    const canvas = await html2canvas(element as HTMLElement);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("interns_attendance.pdf");
  };

  // Download PDF for a single intern record
  const downloadPDFForIntern = async (id: string, name: string) => {
    const element = document.querySelector(`[data-id="${id}"]`);
    if (!element) return;
    const canvas = await html2canvas(element as HTMLElement);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const safeName = name.replace(/\s+/g, "_");
    pdf.save(`${safeName}_attendance.pdf`);
  };

  const handleConfirm = async (id: string, confirmed: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/manager/attendance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, confirmed }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Attendance updated");
      setRecords((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, confirmedByManager: confirmed, status: confirmed ? "present" : "absent" }
            : r
        )
      );
    } catch {
      toast.error("Error updating attendance");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Attendance Records</h1>

      {/* Whole‑table download */}
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download Full PDF
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-md">
        <table
          className={`min-w-full ${isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}`}
        >
          <thead>
            <tr>
              {["Name", "Department", "Date", "Status", "Confirmation", "PDF"].map((h) => (
                <th key={h} className="p-3 text-left font-medium border-b">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr
                key={r._id}
                data-id={r._id}
                className={`border-b ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-gray-200 hover:bg-gray-100"}`}
              >
                <td className="p-3">{r.intern?.fullName}</td>
                <td className="p-3">{r.intern?.department}</td>
                <td className="p-3">{r.date}</td>
                <td className="p-3 capitalize">{r.status}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleConfirm(r._id, true)}
                    className={`px-3 py-1 rounded text-sm ${r.confirmedByManager ? "bg-green-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleConfirm(r._id, false)}
                    className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => downloadPDFForIntern(r._id, r.intern?.fullName || "intern")}
                    className="px-2 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4 mt-4">
        {records.map((r) => (
          <div
            key={r._id}
            data-id={r._id}
            className={`p-4 rounded-xl shadow ${isDark ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900"}`}
          >
            <p><strong>Name:</strong> {r.intern?.fullName}</p>
            <p><strong>Department:</strong> {r.intern?.department}</p>
            <p><strong>Date:</strong> {r.date}</p>
            <p><strong>Status:</strong> {r.status}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleConfirm(r._id, true)}
                className={`flex-1 py-2 rounded text-sm ${r.confirmedByManager ? "bg-green-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
              >
                Confirm
              </button>
              <button
                onClick={() => handleConfirm(r._id, false)}
                className="flex-1 py-2 rounded text-sm bg-red-500 text-white hover:bg-red-600"
              >
                Reject
              </button>
              <button
                onClick={() => downloadPDFForIntern(r._id, r.intern?.fullName || "intern")}
                className="flex-1 py-2 rounded text-sm bg-gray-300 hover:bg-gray-400"
              >
                PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
