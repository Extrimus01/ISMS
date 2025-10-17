"use client";
import { motion } from "framer-motion";
import { Globe, CheckCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import animationData from "@/public/animation/Learning.json";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths, setHours, setMinutes } from "date-fns";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Contact() {
  const [form, setForm] = useState({
    fullName: "",
    college: "",
    course: "",
    department: "",
    semester: "",
    refNo: "",

    email: "",
    phone: "",
    otp: "",
    interview: "",
  });

  const [files, setFiles] = useState<{
    recommendation?: File | null;
    collegeId?: File | null;
  }>({ recommendation: null, collegeId: null });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [interview, setInterview] = useState<Date | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleInput =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleFileChange =
    (field: "recommendation" | "collegeId") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0])
        setFiles({ ...files, [field]: e.target.files[0] });
    };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const handleSendOtp = async () => {
    if (!form.email) return showToast("Enter a valid email first.", "error");
    setOtpSending(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "OTP sent!", "success");
        setOtpCountdown(30);
      } else showToast(data.error || "Failed to send OTP", "error");
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!form.otp) return showToast("Enter OTP first.", "error");
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: form.otp }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "OTP verified!", "success");
        setOtpVerified(true);
      } else showToast(data.error || "OTP verification failed", "error");
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    }
  };

  const holidays = [new Date("2025-10-20"), new Date("2025-10-25")];

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    const isHoliday = holidays.some(
      (h) => h.toDateString() === date.toDateString()
    );
    return day !== 0 && !isHoliday;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpVerified) return showToast("Please verify OTP first", "error");

    if (!form.fullName.trim() || !form.college.trim() || !form.course.trim())
      return showToast("Please fill all required fields", "error");

    if (!/^\d{10}$/.test(form.phone))
      return showToast("Enter a valid 10-digit phone number", "error");

    if (!/\S+@\S+\.\S+/.test(form.email))
      return showToast("Enter a valid email address", "error");

    if (!interview) return showToast("Select interview schedule", "error");

    form.interview = interview.toISOString();

    const day = interview.getDay();
    const hours = interview.getHours();
    if (day === 0 || day === 6)
      return showToast("Weekends are not allowed", "error");

    const isHoliday = holidays.some(
      (h) => h.toDateString() === interview.toDateString()
    );
    if (isHoliday) return showToast("Selected date is a holiday", "error");

    if (hours < 9 || hours >= 17)
      return showToast("Time must be between 09:00 and 17:00", "error");

    if (files.recommendation && files.recommendation.type !== "application/pdf")
      return showToast("Recommendation must be a PDF", "error");

    if (files.collegeId && files.collegeId.type !== "application/pdf")
      return showToast("College ID must be a PDF", "error");

    setLoading(true);

    try {
      const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (typeof reader.result === "string")
              resolve(reader.result.split(",")[1]);
            else reject("Failed to convert file");
          };
          reader.onerror = (error) => reject(error);
        });

      const recommendationBase64 = files.recommendation
        ? await fileToBase64(files.recommendation)
        : null;
      const collegeIdBase64 = files.collegeId
        ? await fileToBase64(files.collegeId)
        : null;

      const payload = {
        ...form,
        recommendation: recommendationBase64,
        collegeId: collegeIdBase64,
      };

      console.log(payload);

      const res = await fetch("/api/auth/intern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        showToast(
          "Registration successful! Please Check Your Mail For Further Details",
          "success"
        );
        setForm({
          fullName: "",
          college: "",
          course: "",
          department: "",
          semester: "",
          refNo: "",

          email: "",
          phone: "",
          otp: "",
          interview: "",
        });
        setFiles({ recommendation: null, collegeId: null });
        setOtpVerified(false);
        setInterview(null);
      } else {
        showToast(
          result?.error || "Registration failed. Please try again.",
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="register"
      className="bg-[var(--background)] text-[var(--foreground)] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {toast && (
        <div
          className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-lg font-medium text-white z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 flex flex-col items-center justify-center text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Apply for Internship
          </h2>
          <div className="w-72 sm:w-96 h-72 sm:h-96">
            <Lottie animationData={animationData} loop />
          </div>
          <Link
            href="/auth"
            className="mt-3 inline-block text-sm text-[var(--foreground-secondary)] hover:text-[var(--accent)] transition-colors"
          >
            Already have an account? Login here
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-md"
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleInput("fullName")}
                required
                className="input"
              />
              <input
                type="text"
                placeholder="College"
                value={form.college}
                onChange={handleInput("college")}
                required
                className="input"
              />
              <input
                type="text"
                placeholder="Course"
                value={form.course}
                onChange={handleInput("course")}
                required
                className="input"
              />
              <input
                type="text"
                placeholder="Department"
                value={form.department}
                onChange={handleInput("department")}
                required
                className="input"
              />
              <input
                type="text"
                placeholder="Semester"
                value={form.semester}
                onChange={handleInput("semester")}
                required
                className="input"
              />
              <input
                type="text"
                placeholder="Reference No / Date"
                value={form.refNo}
                onChange={handleInput("refNo")}
                required
                className="input"
              />

              <div className="col-span-full flex flex-col sm:flex-row border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--background)] focus-within:ring-2 focus-within:ring-[var(--accent)] transition-all">
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleInput("email")}
                  required
                  className="flex-1 px-4 py-3 bg-transparent text-[var(--foreground)] placeholder-[var(--foreground-secondary)] outline-none"
                  disabled={otpVerified}
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpCountdown > 0 || otpVerified || otpSending}
                  className="bg-[var(--accent)] text-white px-4 sm:px-6 py-3 font-medium hover:bg-[var(--accent-hover)] transition-all w-full sm:w-auto"
                >
                  {otpCountdown > 0
                    ? `Resend in ${otpCountdown}s`
                    : otpVerified
                    ? "Verified"
                    : otpSending
                    ? "Sending..."
                    : "Send OTP"}
                </button>
              </div>

              <div className="col-span-full flex flex-col sm:flex-row border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--background)] focus-within:ring-2 focus-within:ring-[var(--accent)] transition-all">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={handleInput("otp")}
                  required
                  className="flex-1 px-4 py-3 bg-transparent text-[var(--foreground)] placeholder-[var(--foreground-secondary)] outline-none"
                  disabled={otpVerified}
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpVerified}
                  className="bg-[var(--accent)] text-white px-4 sm:px-6 py-3 font-medium hover:bg-[var(--accent-hover)] transition-all w-full sm:w-auto"
                >
                  {otpVerified && (
                    <CheckCircle className="inline-block mr-2" size={18} />
                  )}
                  {otpVerified ? "Verified" : "Verify"}
                </button>
              </div>

              <div className="col-span-full flex flex-col sm:flex-row gap-3">
                <div className="flex flex-col flex-1">
                  <label className="text-xs text-[var(--foreground-secondary)] mb-1">
                    Phone
                  </label>
                  <div className="flex items-center border border-[var(--border)] rounded-xl bg-[var(--background)] px-4 py-3">
                    <Globe
                      className="mr-2 text-[var(--foreground-secondary)]"
                      size={16}
                    />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={handleInput("phone")}
                      className="bg-transparent outline-none w-full text-[var(--foreground)]"
                      required
                      placeholder="Contact"
                    />
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <label className="text-xs text-[var(--foreground-secondary)] mb-1">
                    Interview Schedule
                  </label>
                  <div className="flex items-center border border-[var(--border)] rounded-xl bg-[var(--background)] px-4 py-3">
                    <DatePicker
                      selected={interview}
                      onChange={(date) => setInterview(date)}
                      showTimeSelect
                      timeIntervals={60}
                      minTime={setHours(setMinutes(new Date(), 0), 9)}
                      maxTime={setHours(setMinutes(new Date(), 0), 18)}
                      minDate={new Date()}
                      maxDate={addMonths(new Date(), 1)}
                      filterDate={isWeekday}
                      dateFormat="yyyy-MM-dd HH:mm"
                      placeholderText="Select date and time"
                      className="bg-transparent outline-none w-full text-[var(--foreground)]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--foreground-secondary)] mb-1 block">
                  Recommendation Letter (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange("recommendation")}
                  required
                  className="file-input"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--foreground-secondary)] mb-1 block">
                  College ID (PDF)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange("collegeId")}
                  required
                  className="file-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !otpVerified}
              className="btn-primary w-full mt-3"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
