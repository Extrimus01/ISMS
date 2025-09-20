import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--background)] text-[var(--foreground)] border-t border-[var(--border)] px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-center md:text-left">
          &copy; 2024 Your Company. All rights reserved.
        </p>

        <div className="flex gap-4 text-sm">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>

        <div className="flex gap-4">
          <Link href="https://twitter.com" target="_blank">
            <Twitter className="w-5 h-5 hover:text-blue-500 transition-colors" />
          </Link>
          <Link href="https://linkedin.com" target="_blank">
            <Linkedin className="w-5 h-5 hover:text-blue-700 transition-colors" />
          </Link>
          <Link href="https://github.com" target="_blank">
            <Github className="w-5 h-5 hover:text-gray-500 transition-colors" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
