"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useLang } from "@/contexts/LanguageContext";

export default function OdemeHata() {
  const { t } = useLang();

  return (
    <>
      <Header />
      <main
        style={{ background: "#0a0a0a", minHeight: "100vh" }}
        className="flex items-center justify-center"
      >
        <div className="text-center" style={{ maxWidth: "500px", padding: "24px" }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{
              border: "1px solid rgba(248,113,113,0.3)",
              background: "rgba(248,113,113,0.05)",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f87171"
              strokeWidth="1.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <p
            className="text-xs tracking-[0.35em] uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {t("fail.subtitle")}
          </p>
          <h1
            className="font-light mb-5"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "2.5rem",
              color: "#f0ece4",
            }}
          >
            {t("fail.title")}
          </h1>
          <p
            className="text-sm leading-relaxed mb-10"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {t("fail.body")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sepet"
              className="px-8 py-3.5 text-xs tracking-[0.25em] uppercase transition-all"
              style={{ background: "#c9a96e", color: "#0a0a0a", fontWeight: 500 }}
            >
              {t("fail.backToCart")}
            </Link>
            <Link
              href="/iletisim"
              className="px-8 py-3.5 text-xs tracking-[0.25em] uppercase"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              {t("fail.contact")}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
