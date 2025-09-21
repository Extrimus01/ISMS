import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer
      className="w-full py-8 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div
          className="mt-6 text-center text-sm"
          style={{ color: "var(--foreground-secondary)" }}
        >
          &copy; {new Date().getFullYear()} ISMS. All rights reserved.
        </div>

        <div className="flex gap-4">
          <a
            href="#"
            className="hover:text-var-primary transition-colors duration-300"
          >
            <Facebook
              className="w-5 h-5"
              style={{ color: "var(--foreground)" }}
            />
          </a>
          <a
            href="#"
            className="hover:text-var-primary transition-colors duration-300"
          >
            <Twitter
              className="w-5 h-5"
              style={{ color: "var(--foreground)" }}
            />
          </a>
          <a
            href="#"
            className="hover:text-var-primary transition-colors duration-300"
          >
            <Instagram
              className="w-5 h-5"
              style={{ color: "var(--foreground)" }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
