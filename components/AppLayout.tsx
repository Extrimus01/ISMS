"use client";

import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Header from "./landing/Header";
import Footer from "./landing/Footer";
import Chatbot from "./ChatBot";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      {children}

      <Chatbot />
    </>
  );
}
