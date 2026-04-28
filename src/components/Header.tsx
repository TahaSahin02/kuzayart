"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Galeri", href: "#gallery" },
    { label: "Hakkında", href: "/hakkinda" },
    { label: "Koleksiyon", href: "#collection" },
    { label: "İletişim", href: "#contact" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(10,10,10,0.92)"
          : "linear-gradient(to bottom, rgba(10,10,10,0.7), transparent)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(201,169,110,0.12)" : "none",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <span
            className="text-xl tracking-[0.2em] uppercase font-light text-[#f0ece4] group-hover:text-[#c9a96e] transition-colors duration-300"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            KuzayArt
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs tracking-[0.2em] uppercase text-[#c8c0b0] hover:text-[#c9a96e] transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c9a96e] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Kullanıcı"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#c8c0b0] hover:text-[#c9a96e] hover:bg-white/5 transition-all duration-300"
          >
            <UserIcon className="w-5 h-5" />
          </button>
          <button
            aria-label="Sepet"
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#c8c0b0] hover:text-[#c9a96e] hover:bg-white/5 transition-all duration-300"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-medium flex items-center justify-center text-black"
              style={{ background: "#c9a96e" }}
            >
              0
            </span>
          </button>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-[#c8c0b0]"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menü"
          >
            {menuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-white/10 px-6 py-4 flex flex-col gap-4"
          style={{ background: "rgba(10,10,10,0.97)", backdropFilter: "blur(16px)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-[0.2em] uppercase text-[#c8c0b0] hover:text-[#c9a96e] transition-colors duration-300 py-1"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
