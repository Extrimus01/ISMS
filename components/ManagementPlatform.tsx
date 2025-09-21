import { ArrowRightIcon } from "lucide-react";
import React from "react";

const platformFeatures = [
  {
    category: "Multi Role Access",
    title: "Smart Login for Different User Types",
    description:
      "Exclusive access portals for students, companies, and administrators with personalized dashboards and tailored functionality.",
    link: "Explore Access",
  },
  {
    category: "Internship Magic",
    title: "Dynamic Internship Listings and Tracking",
    description:
      "Comprehensive platform showcasing diverse internship opportunities with real-time application tracking and intelligent matching algorithms.",
    link: "View Listings",
  },
  {
    category: "Progress Insights",
    title: "Advanced Performance Monitoring System",
    description:
      "Track progress, manage feedback, and evaluate performance with our integrated monitoring tools, ensuring a valuable experience for both interns and mentors.",
    link: "Learn More",
    isHighlighted: true,
  },
  {
    category: "Communication Boost",
    title: "Instant Feedback and Notification Channels",
    description:
      "Revolutionary communication tools enabling instant feedback, notifications, and seamless interaction between students, mentors, and administrators.",
    link: "Enable Alerts",
  },
  {
    category: "Total Security",
    title: "Secure User-Friendly Dashboard Experience",
    description:
      "Highly secure, intuitive dashboard with advanced encryption, user-friendly interface, and robust data protection mechanisms.",
    link: "Enter Safely",
  },
];

const ManagementPlatform: React.FC = () => {
  return (
    <section
      className="w-full py-24 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl lg:text-5xl font-extrabold opacity-0 animate-fadeInUp animation-delay-0"
            style={{ color: "var(--foreground)" }}
          >
            Powerful Internship Management Platform
          </h2>
          <p
            className="mt-4 text-lg max-w-3xl mx-auto opacity-0 animate-fadeInUp animation-delay-200"
            style={{ color: "var(--foreground)" }}
          >
            Transform internship experiences with cutting-edge technology that
            connects students, companies, and administrators seamlessly and
            efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {platformFeatures.map((feature, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl transform transition-transform duration-500 ease-in-out hover:-translate-y-3 opacity-0 animate-fadeInUp ${
                feature.isHighlighted ? "sm:col-span-2 lg:col-span-3" : ""
              }`}
              style={{
                backgroundColor: feature.isHighlighted
                  ? "var(--primary)"
                  : "var(--foreground-light)",
                color: feature.isHighlighted
                  ? "var(--foreground-light)"
                  : "var(--foreground)",
                border: feature.isHighlighted
                  ? "1px solid var(--border)"
                  : "1px solid var(--border)",
                animationDelay: `${index * 150 + 400}ms`,
              }}
            >
              <span
                className="block text-sm font-semibold mb-2"
                style={{
                  color: feature.isHighlighted
                    ? "var(--primary-light)"
                    : "var(--primary)",
                }}
              >
                {feature.category}
              </span>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="mb-6">{feature.description}</p>
              <a
                href="#"
                className="group inline-flex items-center font-semibold transition-colors duration-300"
                style={{
                  color: feature.isHighlighted
                    ? "var(--foreground-light)"
                    : "var(--primary)",
                }}
              >
                {feature.link}
                <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s forwards;
        }
        .animation-delay-0 {
          animation-delay: 0ms;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </section>
  );
};

export default ManagementPlatform;
