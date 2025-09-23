"use client";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import animationData from "@/public/animation/bubble.json";
import Link from "next/link";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Contact() {
  const [form, setForm] = useState({
    fullName: "",
    college: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleInput =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(
          "Registration successful! Check your email for credentials.",
          "success"
        );
        setForm({
          fullName: "",
          college: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        showToast(data.error || "Registration failed.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong.", "error");
    }
    setLoading(false);
  };

  return (
    <section className="bg-[var(--background)] text-[var(--foreground)] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {toast && (
        <div
          className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg font-semibold text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="hidden md:flex lg:flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-8 relative"
          animate={{ y: [0, -10, 0] }}
        >
          <div className="w-full max-w-sm sm:max-w-md h-96 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--background)] rounded-2xl pointer-events-none"></div>
            <Lottie animationData={animationData} loop={true} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full lg:w-1/2 relative bg-[var(--background)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col justify-between backdrop-blur-sm bg-opacity-70 transition-all"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 relative inline-block">
            Apply for Internship
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleInput("fullName")}
                className="w-full sm:w-1/2 px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl placeholder-[var(--foreground-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all shadow-sm hover:shadow-md"
                required
              />
              <input
                type="text"
                placeholder="College Name"
                value={form.college}
                onChange={handleInput("college")}
                className="w-full sm:w-1/2 px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl placeholder-[var(--foreground-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all shadow-sm hover:shadow-md"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleInput("email")}
                className="w-full sm:w-1/2 px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl placeholder-[var(--foreground-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all shadow-sm hover:shadow-md"
                required
              />
              <div className="w-full sm:w-1/2 flex items-center border border-[var(--border)] rounded-xl bg-[var(--background)] px-4 py-3 transition-all shadow-sm hover:shadow-md">
                <Globe
                  className="mr-2 text-[var(--foreground-secondary)]"
                  size={16}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleInput("phone")}
                  className="bg-transparent outline-none w-full placeholder-[var(--foreground-secondary)] text-[var(--foreground)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-[var(--foreground-secondary)]">
                How can we help?
              </label>
              <textarea
                rows={4}
                placeholder="Briefly describe your interests or skills..."
                value={form.message}
                onChange={handleInput("message")}
                className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl resize-none placeholder-[var(--foreground-secondary)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all shadow-sm hover:shadow-md"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--accent)] text-white px-6 py-4 rounded-2xl font-semibold hover:bg-[var(--accent-hover)] hover:scale-105 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              <Link
                href="/auth"
                className="mt-4 inline-block text-sm text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                <p>Login if you already have an account!</p>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
