"use client";
import { useEffect, useState } from "react";
import ThemeToggle from "../global/ThemeToggle";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 w-full px-4 sm:px-6 py-3 flex items-center justify-between 
                       bg-[#111827]/30 backdrop-blur-md shadow-md z-50"
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
          className="px-4 py-2 text-sm font-medium rounded-lg border border-[#f3f4f6]/30 
                     text-[#f3f4f6] hover:bg-[#f3f4f6]/10 transition-colors"
        >
          Login
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex items-center md:hidden space-x-2">
        <ThemeToggle />
        <Link
          href="/auth"
          className="px-4 py-2 text-sm font-medium rounded-lg border border-[#f3f4f6]/30 
                     text-[#f3f4f6] hover:bg-[#f3f4f6]/10 transition-colors"
        >
          Login
        </Link>
      </div>
    </header>
  );
}
