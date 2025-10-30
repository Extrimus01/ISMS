"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/global/Toast";
import { BouncingDots } from "@/components/global/Loader";

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
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState("College ID");
  const [file, setFile] = useState<File | null>(null);

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

  const viewDocument = (doc: IDocument) => {
    try {
      const base64Data = doc.data.split(",").pop()?.trim();

      if (!base64Data) {
        throw new Error("Invalid Base64 data");
      }

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error viewing document:", err);
      alert("This file is corrupted or not a valid PDF.");
    }
  };

  const handleUpload = async () => {
    if (!file || !intern) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const newDoc: IDocument = {
          type: docType,
          data: base64,
          uploadedAt: new Date().toISOString(),
        };

        const token = localStorage.getItem("token");
        const res = await fetch("/api/intern/me", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ documents: [newDoc] }),
        });

        if (!res.ok) throw new Error("Failed to upload document");
        const updatedIntern: IIntern = await res.json();
        setIntern(updatedIntern);
        setToast({
          message: "Document uploaded successfully!",
          type: "success",
        });
        setFile(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setToast({ message: "Upload failed", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">My Documents</h2>
        <div className="w-full max-w-lg">
          <label className="block font-medium mb-2">Upload Document</label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="px-3 py-2 border rounded sm:rounded-r-none sm:rounded-l focus:outline-none w-full sm:w-auto"
            >
              <option>College ID</option>
              <option>LOR</option>
              <option>Resume</option>
              <option>Joining Letter</option>
            </select>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="px-3 py-2 border rounded sm:rounded-none focus:outline-none flex-1 w-full"
            />

            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="bg-blue-600 text-white px-4 py-2 rounded sm:rounded-l-none hover:bg-blue-700 w-full sm:w-auto"
            >
              {uploading ? "Uploading..." : "Upload Doc"}
            </button>
          </div>
        </div>
      </div>

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
