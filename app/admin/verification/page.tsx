"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  UserCheck,
  FileText,
  FileDown,
} from "lucide-react";

interface Intern {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  department: string;
  semester: string;
  refNo: string;
  recommendation: string;
  collegeId: string;
}

export default function PendingInternsPage() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterns = async () => {
      const res = await fetch("/api/admin/interns/pending");
      const data = await res.json();
      setInterns(data.interns || []);
    };
    fetchInterns();
  }, []);

  const openPdf = (base64Data: string, fileName: string) => {
    try {
      const byteCharacters = atob(base64Data.split(",")[1] || base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const newWindow = window.open(url, "_blank");
      if (!newWindow)
        alert("Popup blocked! Please allow popups to view the PDF.");

      setTimeout(() => URL.revokeObjectURL(url), 120000);
    } catch (err) {
      console.error("Error opening PDF:", err);
      alert("Failed to open PDF file.");
    }
  };

  const handleActivate = async (id: string) => {
    setLoadingId(id);
    const res = await fetch("/api/admin/interns/pending", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setInterns((prev) => prev.filter((i) => i._id !== id));
    }
    setLoadingId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        Pending Intern Activations
      </h1>

      {interns.length === 0 ? (
        <p className="text-gray-500">✅ All interns are active.</p>
      ) : (
        <div className="space-y-4">
          {interns.map((intern) => (
            <motion.div
              key={intern._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 border border-gray-200 dark:border-gray-700"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(intern._id)}
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {intern.fullName}
                </h2>
                {expandedId === intern._id ? (
                  <ChevronUp className="text-gray-500" />
                ) : (
                  <ChevronDown className="text-gray-500" />
                )}
              </div>

              {expandedId === intern._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-4 border-t pt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <p>
                      <strong>Email:</strong> {intern.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {intern.phone}
                    </p>
                    <p>
                      <strong>College:</strong> {intern.college}
                    </p>
                    <p>
                      <strong>Course:</strong> {intern.course}
                    </p>
                    <p>
                      <strong>Department:</strong> {intern.department}
                    </p>
                    <p>
                      <strong>Semester:</strong> {intern.semester}
                    </p>
                    <p>
                      <strong>Reference No:</strong> {intern.refNo}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() =>
                        openPdf(intern.recommendation, "recommendation.pdf")
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200"
                    >
                      <FileText size={18} /> View Recommendation
                    </button>

                    <button
                      onClick={() => openPdf(intern.collegeId, "collegeId.pdf")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200"
                    >
                      <FileDown size={18} /> View College ID
                    </button>

                    <button
                      onClick={() => handleActivate(intern._id)}
                      disabled={loadingId === intern._id}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow"
                    >
                      <UserCheck size={18} />
                      {loadingId === intern._id ? "Activating..." : "Activate"}
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
