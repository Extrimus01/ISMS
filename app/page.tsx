"use client";
import ContactUs from "@/components/ContactUs";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RevolutionizeSection from "@/components/RevolutionizeSection";
import SmartConnections from "@/components/SmartConnections";

export default function Page() {
  return (
    <main className="scroll-none">
      <Header />
      <Hero />
      <SmartConnections />
      <RevolutionizeSection />
      <Features />
      <ContactUs />
      <Footer />
    </main>
  );
}
