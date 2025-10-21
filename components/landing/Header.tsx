"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../global/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/verification", label: "Verification" },
    { href: "/review", label: "Review" },
  ];
  // const uploadColleges = async () => {
  //   const res = await fetch("/api/colleges/upload", { method: "POST" });
  //   const data = await res.json();
  //   alert(data.message || data.error);
  // };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/20 dark:bg-[#111827]/40 backdrop-blur-lg border-b border-white/20 dark:border-gray-800 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={42}
            height={42}
            className="rounded-full object-contain"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map(({ href, label }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={href}
                      className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Button variant="outline" asChild>
            <Link href="/auth">Login</Link>
          </Button>
          {/* <button
            onClick={uploadColleges}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Upload College JSON
          </button> */}

          <ThemeToggle />
        </div>

        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex flex-col gap-6 p-6 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md transition-all duration-300 ease-in-out"
            >
              {" "}
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {label}
                </Link>
              ))}
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                asChild
                onClick={() => setMenuOpen(false)}
              >
                <Link href="/auth">Login</Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
