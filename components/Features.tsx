import { CheckCircleIcon, CompassIcon } from "lucide-react";
import React from "react";

const features = [
  "Create your free student profile in minutes",
  "Explore 1000+ cutting-edge internship opportunities",
  "Submit targeted applications with one click",
  "Monitor your application status in real-time",
];

const Features: React.FC = () => {
  return (
    <section
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-cover bg-center transition-all duration-500"
      style={{
        backgroundImage: "url('/internship-bg.jpg')",
      }}
    >
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      />

      <div
        className="relative z-10 max-w-2xl w-full backdrop-blur-2xl border rounded-3xl shadow-2xl overflow-hidden transition-colors duration-500"
        style={{
          backgroundColor: "var(--background)/70",
          borderColor: "var(--text-big)/10",
        }}
      >
        <div className="p-8 sm:p-12">
          <ul className="space-y-5 mb-10">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-4 transform opacity-0 translate-y-6 animate-fade-in-up"
                style={{
                  animationDelay: `${300 + index * 150}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <CheckCircleIcon
                  className="w-7 h-7 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: "var(--secondary)" }}
                />
                <span
                  className="text-base sm:text-lg font-medium"
                  style={{ color: "var(--text-big)" }}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <div
            className="rounded-2xl p-8 text-center transform opacity-0 animate-fade-in-up transition-colors duration-500"
            style={{
              animationDelay: "1000ms",
              animationFillMode: "forwards",
              backgroundColor: "var(--background)/90",
            }}
          >
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6 transition-colors duration-500"
              style={{ color: "var(--text-big)" }}
            >
              Your Internship Journey Starts Here
            </h2>
            <button
              className="group inline-flex items-center justify-center gap-4 px-6 py-4 w-full sm:w-auto rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)] focus:ring-[var(--secondary)]"
              style={{
                backgroundColor: "var(--secondary)/20",
                color: "var(--text-big)",
              }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white/50 dark:ring-gray-800 transition-transform duration-300 group-hover:scale-110"
                    src={`https://randomuser.me/api/portraits/${
                      i % 2 === 0 ? "men" : "women"
                    }/${i}.jpg`}
                    alt={`User ${i}`}
                  />
                ))}
              </div>
              <span
                style={{ color: "var(--text-big)" }}
                className="font-semibold"
              >
                See How Easy It Is
              </span>
              <CompassIcon
                className="w-6 h-6 transition-transform duration-500 group-hover:rotate-12"
                style={{ color: "var(--secondary)" }}
              />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease forwards;
        }
      `}</style>
    </section>
  );
};

export default Features;
