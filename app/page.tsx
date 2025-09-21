"use client";
import ContactUs from "@/components/ContactUs";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ManagementPlatform from "@/components/ManagementPlatform";
import Parallax from "@/components/Parallax";
import SmartConnections from "@/components/SmartConnections";

export default function Page() {
  return (
    <main className="scroll-none">
      <Header />
      <Parallax />
      <ManagementPlatform />
      <Features />
      <SmartConnections />
      <ContactUs />
      <Footer />
    </main>
  );
}
