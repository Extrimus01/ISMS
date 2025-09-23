"use client";
import { useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import React from "react";

interface AnimatedFeatureProps {
  children: React.ReactNode;
}
const AnimatedFeature: React.FC<AnimatedFeatureProps> = ({ children }) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
  });
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
};

interface FeatureBlockProps {
  overline: string;
  headline: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  reverse?: boolean;
  onLearnMore: () => void;
}
const FeatureBlock: React.FC<FeatureBlockProps> = ({
  overline,
  headline,
  description,
  imageUrl,
  imageAlt,
  reverse = false,
  onLearnMore,
}) => {
  return (
    <AnimatedFeature>
      <div className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div
          className={`flex items-center justify-center ${
            reverse ? "md:order-last" : ""
          }`}
        >
          <img
            src={imageUrl}
            alt={imageAlt}
            className="rounded-xl shadow-2xl w-full h-auto max-w-md object-cover aspect-[4/3]"
          />
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="text-base font-semibold text-[rgb(var(--text-tertiary))] tracking-wider uppercase">
              {overline}
            </span>
            <h3 className="mt-2 text-3xl lg:text-4xl font-bold tracking-tight font-roboto-slab text-[rgb(var(--text-primary))]">
              {headline}
            </h3>
            <p className="mt-4 text-base lg:text-lg text-[rgb(var(--text-secondary))]">
              {description}
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={onLearnMore}
              className="text-[rgb(var(--accent))] font-semibold hover:text-[rgb(var(--accent-hover))] transition-colors group"
            >
              Learn More{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                &rarr;
              </span>
            </button>
          </div>
        </div>
      </div>
    </AnimatedFeature>
  );
};

const RevolutionizeSection: React.FC = () => {
  const [activeModal, setActiveModal] = useState<{
    title: string;
    content: string;
    image: string;
    imageAlt: string;
  } | null>(null);

  const features = [
    {
      overline: "All Your Files in One Place",
      headline: "Secure Document Management",
      description:
        "Students and mentors can upload, store, and access internship-related documents—like offer letters, progress reports, and certificates—all in one secure, cloud-based vault.",
      imageUrl: "/images/secure-vault.png",
      imageAlt: "Secure Vault",
      learnMore: `Secure Digital Document Vault
Effortlessly manage all your essential internship documents in one place.
Upload, organize, and access offer letters, progress reports, certificates, and more using a cloud-based digital vault fortified with bank-grade encryption and customizable folder structures. Benefit from instant search, controlled sharing permissions, and automated backup—ensuring files are both safe and always accessible.

Stay in control with advanced access management, version history, and audit trails, so every document is protected and accountable. Enjoy peace of mind knowing your internship records are available anytime, from any device—supporting smooth collaboration between students and mentors.`,
    },
    {
      overline: "Personalized Opportunities",
      headline: "Smart Internship Matching",
      description:
        "Our intelligent algorithm analyzes student profiles, interests, and academic backgrounds to recommend the most relevant internship opportunities—saving time and boosting placement success.",
      imageUrl: "/images/smart-matching.png",
      imageAlt: "AI Powered Matching",
      reverse: true,
      learnMore: `Smart Internship Recommendation
Effortlessly find your place with tailored guidance.
The platform evaluates each student’s unique background, skills, and interests to recommend the most suitable internship role offered by our partner company—saving time and adding clarity to the application journey. Get personalized suggestions, ensuring every applicant sees where they fit and how to best present their strengths.

Your bridge from classroom to career.
With just one trusted industry partner, students receive targeted support and actionable feedback at every application stage, from profile review to skill highlights. This transparent, step-by-step process helps maximize placement potential and prepares you for a meaningful internship experience.`,
    },
    {
      overline: "Effortless Planning",
      headline: "Stay Organized with Smart Scheduling",
      description:
        "Never miss a deadline! Our built-in calendar syncs internship milestones, mentor meetings, and report submissions. Real-time notifications keep everyone on track.",
      imageUrl: "/images/smart-scheduling.png",
      imageAlt: "Calendar Scheduling",
      learnMore: `Effortless internship organization for every milestone.
Plan out meetings, deadlines, and interviews in a unified calendar designed specifically for internship management. Students and mentors receive automated reminders about submissions, appointments, and tasks—keeping progress smooth and every participant informed.

Smart alerts for a stress-free experience.
With real-time notifications, everyone stays updated about last-minute changes, upcoming events, or new assignments. Customizable alerts and integrated scheduling ensure that no deadline slips through and communication flows easily across the team.`,
    },
  ];

  return (
    <section className="bg-[rgb(var(--bg-primary))] py-12 sm:py-24 overflow-x-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <AnimatedFeature>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-black tracking-tight font-roboto-slab text-[rgb(var(--text-primary))] sm:text-5xl">
              Find Your Perfect Internship,{" "}
              <span className="text-[rgb(var(--accent))]">Faster.</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-[rgb(var(--text-secondary))]">
              Stop guessing. Our AI-powered platform analyzes your unique
              profile to connect you with internships where you'll not just fit
              in, but thrive.
            </p>
          </div>
        </AnimatedFeature>

        {features.map((f, i) => (
          <FeatureBlock
            key={i}
            overline={f.overline}
            headline={f.headline}
            description={f.description}
            imageUrl={f.imageUrl}
            imageAlt={f.imageAlt}
            reverse={f.reverse}
            onLearnMore={() =>
              setActiveModal({
                title: f.headline,
                content: f.learnMore,
                image: f.imageUrl,
                imageAlt: f.imageAlt,
              })
            }
          />
        ))}

        {activeModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setActiveModal(null)}
          >
            <div
              className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 max-w-2xl w-full p-6 rounded-2xl shadow-xl overflow-y-auto no-scrollbar max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeModal.image}
                alt={activeModal.imageAlt}
                className="w-full h-50 rounded-xl mb-4 object-cover"
              />

              <h3 className="text-2xl font-bold mb-4">{activeModal.title}</h3>

              <p className="whitespace-pre-line text-base leading-relaxed">
                {activeModal.content}
              </p>

              <button
                onClick={() => setActiveModal(null)}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RevolutionizeSection;
