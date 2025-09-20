"use client";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;
  return (
    <header
      className="fixed top-0 left-0 w-full px-4 sm:px-6 py-3 flex items-center justify-between 
                       bg-[var(--background)]/70 backdrop-blur-md shadow-md z-50"
    >
      <div className="flex items-center space-x-3">
        <Image
          alt="Logo"
          width={48}
          height={48}
          src="/logo.png"
          className="rounded-full object-contain"
          priority
        />
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <Link
          href="/auth"
          className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--foreground)]/30 
                     text-[var(--foreground)] hover:bg-[var(--foreground)]/10 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/auth"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white 
                     hover:bg-blue-500 dark:bg-green-500 dark:hover:bg-green-400 transition-colors"
        >
          Signup
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex items-center md:hidden space-x-2">
        <ThemeToggle />
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="p-2 rounded-lg hover:bg-[var(--foreground)]/10 transition-colors"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div
          className="absolute top-full right-4 mt-2 flex flex-col items-end bg-[var(--background)] 
                        rounded-lg shadow-lg p-4 space-y-3 md:hidden"
        >
          <Link
            href="/login"
            className="w-full text-right px-4 py-2 text-sm font-medium rounded-lg 
                       hover:bg-[var(--foreground)]/10 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="w-full text-right px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white 
                       hover:bg-blue-500 dark:bg-green-500 dark:hover:bg-green-400 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Signup
          </Link>
        </div>
      )}
    </header>
  );
}
