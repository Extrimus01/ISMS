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
}

const FeatureBlock: React.FC<FeatureBlockProps> = ({
  overline,
  headline,
  description,
  imageUrl,
  imageAlt,
  reverse = false,
}) => {
  return (
    <AnimatedFeature>
      <div
        className={`mt-16 sm:mt-20 lg:mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center`}
      >
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
            <a
              href="#"
              className="text-[rgb(var(--accent))] font-semibold hover:text-[rgb(var(--accent-hover))] transition-colors group"
            >
              Learn More{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </div>
    </AnimatedFeature>
  );
};

const RevolutionizeSection: React.FC = () => (
  <section className="bg-[rgb(var(--bg-primary))] py-24 sm:py-32 overflow-x-hidden">
    <div className="container mx-auto px-6 lg:px-8">
      <AnimatedFeature>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black tracking-tight font-roboto-slab text-[rgb(var(--text-primary))] sm:text-6xl">
            Find Your Perfect Internship,{" "}
            <span className="text-[rgb(var(--accent))]">Faster.</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-[rgb(var(--text-secondary))]">
            Stop guessing. Our AI-powered platform analyzes your unique profile
            to connect you with internships where you'll not just fit in, but
            thrive.
          </p>
        </div>
      </AnimatedFeature>

      <FeatureBlock
        overline="Smart Matching"
        headline="Intelligent Internship Matching"
        description="Our breakthrough AI algorithm connects you with ideal internships based on your skills, interests, and career goals. Say goodbye to endless searching."
        imageUrl="https://picsum.photos/seed/intern1/800/600"
        imageAlt="Student collaborating with colleagues in a modern office"
      />

      <FeatureBlock
        overline="Stay Organized"
        headline="Real-Time Application Dashboard"
        description="Track every application from submitted to hired. Get instant updates, manage interviews, and view performance analytics all in one place."
        imageUrl="https://picsum.photos/seed/intern2/800/600"
        imageAlt="Dashboard with charts and graphs showing application analytics"
        reverse={true}
      />

      <FeatureBlock
        overline="Get Prepared"
        headline="AI-Powered Resume & Interview Prep"
        description="Optimize your resume for any job description and practice with an AI interview coach that provides instant, personalized feedback to help you land the offer."
        imageUrl="https://picsum.photos/seed/intern3/800/600"
        imageAlt="Person practicing for an interview in front of a laptop"
      />
    </div>
  </section>
);

export default RevolutionizeSection;
