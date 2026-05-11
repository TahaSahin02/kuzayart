"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LanguageContext";
import { useCurrency, Currency } from "@/contexts/CurrencyContext";
import type { Lang } from "@/lib/i18n";

/* ─── Mini Dropdown ──────────────────────────────────────────── */
function Dropdown({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 transition-colors duration-200"
        style={{
          color: "rgba(200,192,176,0.85)",
          fontSize: "11px",
          letterSpacing: "0.08em",
          padding: "5px 7px",
          background: open ? "rgba(255,255,255,0.05)" : "transparent",
          border: "1px solid",
          borderColor: open ? "rgba(201,169,110,0.25)" : "rgba(255,255,255,0.08)",
        }}
      >
        {trigger}
        {/* chevron */}
        <svg
          width="8"
          height="8"
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{
            opacity: 0.5,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <polyline points="1 1 5 5 9 1" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full flex flex-col overflow-hidden"
          style={{
            marginTop: "6px",
            background: "rgba(12,12,12,0.97)",
            border: "1px solid rgba(255,255,255,0.09)",
            backdropFilter: "blur(20px)",
            minWidth: "90px",
            zIndex: 200,
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-full text-left transition-colors duration-150"
      style={{
        padding: "9px 14px",
        fontSize: "11px",
        letterSpacing: "0.08em",
        color: active ? "#c9a96e" : "rgba(200,192,176,0.7)",
        background: active ? "rgba(201,169,110,0.07)" : "transparent",
        borderLeft: active ? "2px solid #c9a96e" : "2px solid transparent",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Language options ───────────────────────────────────────── */
const LANG_OPTIONS: { value: Lang; flag: string; label: string }[] = [
  { value: "tr", flag: "🇹🇷", label: "TR" },
  { value: "en", flag: "🇬🇧", label: "EN" },
];

/* ─── Currency options ───────────────────────────────────────── */
const CURRENCY_OPTIONS: { value: Currency; symbol: string; label: string }[] = [
  { value: "EUR", symbol: "€", label: "EUR" },
  { value: "USD", symbol: "$", label: "USD" },
  { value: "TRY", symbol: "₺", label: "TRY" },
];

/* ─── Header ─────────────────────────────────────────────────── */
export default function Header() {
  const { items } = useCart();
  const { lang, setLang, t } = useLang();
  const { currency, setCurrency, rates } = useCurrency();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kz_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const navLinks = [
    { label: t("nav.collection"), href: "/#collection" },
    { label: t("nav.about"), href: "/hakkinda" },
    { label: t("nav.contact"), href: "/iletisim" },
  ];

  const currentLang = LANG_OPTIONS.find((l) => l.value === lang)!;
  const currentCurrency = CURRENCY_OPTIONS.find((c) => c.value === currency)!;

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
      <div
        className="max-w-[1400px] mx-auto h-[72px] flex items-center justify-between"
        style={{ paddingLeft: "48px", paddingRight: "48px" }}
      >
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

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* ── Language Dropdown ── */}
          <Dropdown
            trigger={
              <span className="flex items-center gap-1.5">
                <span style={{ fontSize: "15px", lineHeight: 1 }}>{currentLang.flag}</span>
                <span style={{ fontWeight: 500 }}>{currentLang.label}</span>
              </span>
            }
          >
            {LANG_OPTIONS.map((opt) => (
              <DropdownItem
                key={opt.value}
                active={lang === opt.value}
                onClick={() => setLang(opt.value)}
              >
                <span style={{ fontSize: "14px" }}>{opt.flag}</span>
                <span>{opt.label}</span>
              </DropdownItem>
            ))}
          </Dropdown>

          {/* ── Currency Dropdown ── */}
          <Dropdown
            trigger={
              <span className="flex items-center gap-1">
                <span style={{ color: "#c9a96e", fontWeight: 600 }}>{currentCurrency.symbol}</span>
                <span style={{ fontWeight: 500 }}>{currentCurrency.label}</span>
              </span>
            }
          >
            {CURRENCY_OPTIONS.map((opt) => {
              // Show live rate for non-EUR currencies
              const rateLabel =
                rates && opt.value !== "EUR"
                  ? ` · ${opt.value === "USD" ? rates.USD.toFixed(2) : rates.TRY.toFixed(0)}`
                  : "";
              return (
                <DropdownItem
                  key={opt.value}
                  active={currency === opt.value}
                  onClick={() => setCurrency(opt.value)}
                >
                  <span style={{ color: "#c9a96e", fontWeight: 600, minWidth: "14px" }}>
                    {opt.symbol}
                  </span>
                  <span>
                    {opt.label}
                    {rateLabel && (
                      <span style={{ opacity: 0.45, fontSize: "10px" }}>{rateLabel}</span>
                    )}
                  </span>
                </DropdownItem>
              );
            })}
          </Dropdown>

          {/* ── User ── */}
          <Link
            href={user ? "/panel" : "/giris"}
            aria-label={user ? t("nav.account") : t("nav.login")}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#c8c0b0] hover:text-[#c9a96e] hover:bg-white/5 transition-all duration-300"
            title={user ? user.name : t("nav.login")}
          >
            <UserIcon className="w-5 h-5" />
          </Link>

          {/* ── Cart ── */}
          <Link
            href="/sepet"
            aria-label={t("nav.cart")}
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#c8c0b0] hover:text-[#c9a96e] hover:bg-white/5 transition-all duration-300"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            {items.length > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-medium flex items-center justify-center text-black"
                style={{ background: "#c9a96e" }}
              >
                {items.length}
              </span>
            )}
          </Link>

          {/* ── Mobile menu toggle ── */}
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

          {/* Mobile language + currency row */}
          <div className="flex items-center gap-3 py-1">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLang(opt.value)}
                className="flex items-center gap-1.5 text-xs tracking-wider uppercase py-1 px-2 transition-colors"
                style={{
                  color: lang === opt.value ? "#c9a96e" : "rgba(200,192,176,0.5)",
                  border: "1px solid",
                  borderColor: lang === opt.value ? "rgba(201,169,110,0.3)" : "rgba(255,255,255,0.07)",
                }}
              >
                <span style={{ fontSize: "13px" }}>{opt.flag}</span>
                {opt.label}
              </button>
            ))}
            <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
            {CURRENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setCurrency(opt.value)}
                className="text-xs tracking-wider uppercase py-1 px-2 transition-colors"
                style={{
                  color: currency === opt.value ? "#c9a96e" : "rgba(200,192,176,0.5)",
                  border: "1px solid",
                  borderColor: currency === opt.value ? "rgba(201,169,110,0.3)" : "rgba(255,255,255,0.07)",
                }}
              >
                {opt.symbol} {opt.label}
              </button>
            ))}
          </div>

          <Link
            href={user ? "/panel" : "/giris"}
            onClick={() => setMenuOpen(false)}
            className="text-sm tracking-[0.2em] uppercase py-1"
            style={{ color: "#c9a96e" }}
          >
            {user ? `${t("nav.account")} (${user.name})` : t("nav.login")}
          </Link>
          <Link
            href="/sepet"
            onClick={() => setMenuOpen(false)}
            className="text-sm tracking-[0.2em] uppercase text-[#c8c0b0] py-1"
          >
            {t("nav.cart")} {items.length > 0 && `(${items.length})`}
          </Link>
        </div>
      )}
    </header>
  );
}
