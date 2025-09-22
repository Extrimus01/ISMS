"use client";
import Apply from "@/components/Apply";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RevolutionizeSection from "@/components/RevolutionizeSection";
import AboutUs from "@/components/AboutUs";

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
