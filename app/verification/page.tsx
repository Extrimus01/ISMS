"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Building2,
  Lightbulb,
  CalendarDays,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function VerificationPage() {
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) {
      setError("Please enter a certificate ID.");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/verify-certificate?id=${certificateId}`);
      const data = await res.json();

      if (!res.ok || !data || Object.keys(data).length === 0) {
        setError("Invalid certificate ID. Please check and try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="flex flex-col items-center space-y-6 no-scrollbar">
        <main className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden px-4 sm:px-6 lg:px-8 ">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 "
          />

          <form
            onSubmit={handleVerify}
            className="relative w-full max-w-2xl flex flex-col sm:flex-row items-center 
             sm:bg-white/10 sm:backdrop-blur-lg sm:border sm:border-white/20 sm:shadow-lg
             rounded-full p-0  "
          >
            <div className="relative w-full sm:flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="Search certificate ID..."
                className="w-full pl-12 pr-4 py-3 sm:py-3 rounded-full bg-white/10 text-white placeholder-gray-400 border-none outline-none text-base sm:text-lg "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Search"
              )}
            </button>
          </form>

          <div className="w-full max-w-2xl mt-8 sm:mt-10 px-2 sm:px-0">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 text-red-400 bg-red-400/10 border border-red-400/30 p-3 rounded-2xl text-center"
                >
                  <XCircle />
                  <span>{error}</span>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl text-white w-full"
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-6 text-cyan-400">
                    <CheckCircle2 size={26} />
                    <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
                      Certificate Verified
                    </h2>
                  </div>

                  <div className="space-y-4 sm:space-y-5 text-gray-100 text-sm sm:text-base">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <GraduationCap className="text-cyan-400" size={18} />
                      <p>
                        <span className="font-semibold text-gray-300">
                          Student Name:
                        </span>{" "}
                        {result.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <Building2 className="text-cyan-400" size={18} />
                      <p>
                        <span className="font-semibold text-gray-300">
                          College Name:
                        </span>{" "}
                        {result.college}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <Lightbulb className="text-cyan-400" size={18} />
                      <p>
                        <span className="font-semibold text-gray-300">
                          Project Name:
                        </span>{" "}
                        {result.project}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <CalendarDays className="text-cyan-400" size={18} />
                      <p>
                        <span className="font-semibold text-gray-300">
                          Issued on:
                        </span>{" "}
                        {result.issueDate}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10 text-xs sm:text-sm text-gray-400 text-center">
                    Certificate ID:{" "}
                    <span className="text-gray-200 font-medium">
                      {result.certificateId}
                    </span>
                  </div>
                </motion.div>
              )}

              {!error && !result && (
                <motion.p
                  key="helper"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-400 text-center mt-6 sm:mt-8 text-xs sm:text-sm px-2"
                >
                  Type your certificate ID and press <strong>Enter</strong> to
                  verify authenticity.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </main>{" "}
      </main>
    </>
  );
}
