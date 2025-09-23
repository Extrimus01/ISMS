"use client";
import Apply from "@/components/landing/Apply";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import RevolutionizeSection from "@/components/landing/RevolutionizeSection";
import AboutUs from "@/components/landing/AboutUs";

export default function Page() {
  return (
    <main className=" no-scrollbar">
      <Header />
      <Hero />
      <AboutUs />
      <RevolutionizeSection />
      <Features />
      <Apply />
      <Footer />
    </main>
  );
}
