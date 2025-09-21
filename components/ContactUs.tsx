import { MailIcon, PhoneIcon, LocationEdit } from "lucide-react";
import React from "react";

const contactDetails = [
  {
    icon: PhoneIcon,
    title: "Phone",
    info: "(239) 555-0108",
  },
  {
    icon: MailIcon,
    title: "E-mail",
    info: "tim.jennings@example.com",
  },
  {
    icon: LocationEdit,
    title: "Location",
    info: "6391 Elgin St. Celina, Delaware 10299",
  },
];

const ContactUs: React.FC = () => {
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
          <span
            className="text-lg font-semibold opacity-0 animate-fadeInUp animation-delay-0"
            style={{ color: "var(--primary)" }}
          >
            Contact Us
          </span>
          <h2
            className="mt-2 text-4xl lg:text-5xl font-extrabold opacity-0 animate-fadeInUp animation-delay-100"
            style={{ color: "var(--foreground)" }}
          >
            Let's stay connected
          </h2>
          <p
            className="mt-4 text-lg max-w-2xl mx-auto opacity-0 animate-fadeInUp animation-delay-200"
            style={{ color: "var(--foreground-secondary)" }}
          >
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {contactDetails.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center opacity-0 animate-fadeInUp"
              style={{ animationDelay: `${300 + index * 150}ms` }}
            >
              <div
                className="flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: "var(--primary-light)" }}
              >
                <item.icon
                  className="w-10 h-10"
                  style={{ color: "var(--primary)" }}
                />
              </div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                {item.title}
              </h3>
              <p
                className="text-lg"
                style={{ color: "var(--foreground-secondary)" }}
              >
                {item.info}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl overflow-hidden shadow-2xl opacity-0 animate-fadeInUp"
          style={{
            animationDelay: "800ms",
            border: "1px solid var(--border)",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.257584165686!2d144.9631623153167!3d-37.81421797975149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce7e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1684321234567!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Company Location Map"
          ></iframe>
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
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </section>
  );
};

export default ContactUs;
