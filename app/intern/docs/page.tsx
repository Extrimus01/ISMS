"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/global/Toast";

interface IDocument {
  type: string;
  data: string;
  uploadedAt: string;
}

interface IIntern {
  documents: IDocument[];
  recommendation?: string;
  collegeId?: string;
}

export default function DocumentsPage() {
  const [intern, setIntern] = useState<IIntern | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchIntern = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/intern/me", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch intern data");
        const data: IIntern = await res.json();
        setIntern(data);
      } catch (err) {
        console.error(err);
        setToast({ message: "Failed to load documents", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchIntern();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!intern) return <p className="text-center mt-10">No documents found.</p>;

  const allDocs: IDocument[] = [
    ...(intern.documents || []),
    ...(intern.recommendation
      ? [
          {
            type: "Recommendation",
            data: intern.recommendation,
            uploadedAt: new Date().toISOString(),
          },
        ]
      : []),
    ...(intern.collegeId
      ? [
          {
            type: "College ID",
            data: intern.collegeId,
            uploadedAt: new Date().toISOString(),
          },
        ]
      : []),
  ];

  const viewDocument = (doc: IDocument) => {
    const blob = new Blob(
      [Uint8Array.from(atob(doc.data), (c) => c.charCodeAt(0))],
      { type: "application/pdf" }
    );
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">My Documents</h2>
      {allDocs.length === 0 ? (
        <p>No documents available.</p>
      ) : (
        <div className="space-y-4">
          {allDocs.map((doc, idx) => (
            <div
              key={idx}
              className="glass-card p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{doc.type}</p>
                <p className="text-sm text-gray-500">
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => viewDocument(doc)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View PDF
              </button>
            </div>
          ))}
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
