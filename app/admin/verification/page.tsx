"use client";

import { useEffect, useState } from "react";
import { BouncingDots } from "@/components/global/Loader";
import { FileText, FileDown, UserCheck, X } from "lucide-react";
import { useTheme } from "next-themes";

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
  const [loading, setLoading] = useState(true);
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [internshipStart, setInternshipStart] = useState("");
  const [internshipEnd, setInternshipEnd] = useState("");

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [collegeData, setCollegeData] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [collegeSaved, setCollegeSaved] = useState(false);

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const res = await fetch("/api/admin/interns/pending");
        const data = await res.json();
        setInterns(data.interns || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterns();
  }, []);

  useEffect(() => {
    if (!selectedIntern) return;

    const fetchCollege = async () => {
      try {
        const res = await fetch("/api/colleges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: selectedIntern.college }),
        });
        if (res.ok) {
          const data = await res.json();
          setCollegeData(data.nameData || "");
        } else {
          setCollegeData("");
        }
      } catch (err) {
        console.error("Failed to fetch college data", err);
        setCollegeData("");
      }
    };
    fetchCollege();
  }, [selectedIntern]);

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
    if (!internshipStart || !internshipEnd) {
      alert("Please select both start and end dates before activation.");
      return;
    }
    setActivatingId(id);
    try {
      const res = await fetch("/api/admin/interns/pending", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, internshipStart, internshipEnd }),
      });
      if (res.ok) setInterns((prev) => prev.filter((i) => i._id !== id));
      setSelectedIntern(null);
      setInternshipStart("");
      setInternshipEnd("");
    } catch (err) {
      console.error(err);
    } finally {
      setActivatingId(null);
    }
  };

  const handleSaveCollegeData = async () => {
    if (!selectedIntern) return;
    try {
      const res = await fetch("/api/colleges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedIntern.college,
          nameData: collegeData,
        }),
      });
      if (!res.ok) throw new Error("Failed to save college data");
      setEditing(false);
      setCollegeSaved(true);
      setTimeout(() => setCollegeSaved(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Error saving college data");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BouncingDots />
      </div>
    );

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold mb-6">
        Pending Intern Activations
      </h1>

      {interns.length === 0 ? (
        <p className="text-gray-500">✅ All interns are active.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {interns.map((intern) => (
            <div
              key={intern._id}
              onClick={() => setSelectedIntern(intern)}
              className="cursor-pointer glass-card p-4 rounded-xl shadow hover:shadow-lg border border-gray-200 dark:border-gray-700 transition"
            >
              <p className="text-lg font-semibold">{intern.fullName}</p>
              <p className="text-sm">{intern.email}</p>
              <p className="text-sm">{intern.college}</p>
            </div>
          ))}
        </div>
      )}

      {selectedIntern && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            style={{
              backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              borderRadius: "1rem",
              padding: "1.5rem",
              width: "75%",
              maxWidth: "42rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelectedIntern(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                color: isDarkMode ? "#d1d5db" : "#4b5563",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: isDarkMode ? "#f9fafb" : "#1f2937",
              }}
            >
              {selectedIntern.fullName}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                fontSize: "0.875rem",
                color: isDarkMode ? "#d1d5db" : "#374151",
              }}
            >
              <p>
                <strong>Email:</strong> {selectedIntern.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedIntern.phone}
              </p>
              <p>
                <strong>College:</strong> {selectedIntern.college}
              </p>
              <p>
                <strong>Course:</strong> {selectedIntern.course}
              </p>
              <p>
                <strong>Department:</strong> {selectedIntern.department}
              </p>
              <p>
                <strong>Semester:</strong> {selectedIntern.semester}
              </p>
              <p>
                <strong>Ref No:</strong> {selectedIntern.refNo}
              </p>
              <p>
                <strong>College Dean:</strong>{" "}
                {collegeData && !editing ? (
                  <span>
                    {collegeData}{" "}
                    <button
                      onClick={() => setEditing(true)}
                      style={{
                        marginLeft: "0.5rem",
                        cursor: "pointer",
                        color: isDarkMode ? "#93c5fd" : "#1e40af",
                      }}
                    >
                      Edit
                    </button>
                    {collegeSaved && (
                      <span style={{ marginLeft: "0.5rem", color: "#10b981" }}>
                        Saved!
                      </span>
                    )}
                  </span>
                ) : !editing ? (
                  <span>
                    Not set{" "}
                    <button
                      onClick={() => setEditing(true)}
                      style={{
                        marginLeft: "0.5rem",
                        cursor: "pointer",
                        color: isDarkMode ? "#93c5fd" : "#1e40af",
                      }}
                    >
                      Add
                    </button>
                  </span>
                ) : (
                  <span>
                    <input
                      autoFocus
                      value={collegeData}
                      onChange={(e) => setCollegeData(e.target.value)}
                      style={{
                        padding: "0.25rem",
                        borderRadius: "0.25rem",
                        border: "1px solid #ccc",
                      }}
                    />
                    <button
                      onClick={handleSaveCollegeData}
                      style={{
                        marginLeft: "0.5rem",
                        cursor: "pointer",
                        color: isDarkMode ? "#f9fafb" : "#1f2937",
                      }}
                    >
                      Save
                    </button>
                  </span>
                )}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                marginTop: "1.5rem",
              }}
            >
              <div>
                <label
                  style={{
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "0.25rem",
                    color: isDarkMode ? "#f9fafb" : "#1f2937",
                  }}
                >
                  Internship Start Date:
                </label>
                <input
                  type="date"
                  value={internshipStart}
                  onChange={(e) => setInternshipStart(e.target.value)}
                  style={{
                    padding: "0.4rem 0.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontWeight: 500,
                    display: "block",
                    marginBottom: "0.25rem",
                    color: isDarkMode ? "#f9fafb" : "#1f2937",
                  }}
                >
                  Internship End Date:
                </label>
                <input
                  type="date"
                  value={internshipEnd}
                  onChange={(e) => setInternshipEnd(e.target.value)}
                  style={{
                    padding: "0.4rem 0.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                marginTop: "1.5rem",
              }}
            >
              <button
                onClick={() =>
                  openPdf(selectedIntern.recommendation, "recommendation.pdf")
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  backgroundColor: isDarkMode ? "#1e40af" : "#dbeafe",
                  color: isDarkMode ? "#93c5fd" : "#1e3a8a",
                  cursor: "pointer",
                }}
              >
                <FileText size={18} /> Recommendation
              </button>

              <button
                onClick={() =>
                  openPdf(selectedIntern.collegeId, "collegeId.pdf")
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  backgroundColor: isDarkMode ? "#064e3b" : "#d1fae5",
                  color: isDarkMode ? "#6ee7b7" : "#065f46",
                  cursor: "pointer",
                }}
              >
                <FileDown size={18} /> College ID
              </button>

              <button
                onClick={() => handleActivate(selectedIntern._id)}
                disabled={activatingId === selectedIntern._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#059669",
                  color: "#ffffff",
                  cursor:
                    activatingId === selectedIntern._id
                      ? "not-allowed"
                      : "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                <UserCheck size={18} />
                {activatingId === selectedIntern._id
                  ? "Activating..."
                  : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
