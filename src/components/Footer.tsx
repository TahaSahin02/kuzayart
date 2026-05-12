"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLang();
  const [email, setEmail] = useState("");

  const legalLinks = [
    { key: "footer.terms",    href: "/yasal/kullanim-sartlari" },
    { key: "footer.privacy",  href: "/yasal/gizlilik-politikasi" },
    { key: "footer.sales",    href: "/yasal/mesafeli-satis" },
    { key: "footer.returns",  href: "/yasal/iptal-iade" },
    { key: "footer.consumer", href: "/yasal/tuketici-haklari" },
    { key: "footer.payment",  href: "/yasal/odeme-teslimat" },
  ];

  return (
    <footer id="contact" style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div
        style={{
          maxWidth: "1400px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "72px",
          paddingBottom: "72px",
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/">
              <span
                className="text-xl tracking-[0.2em] uppercase font-light text-[#f0ece4]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                KuzayArt
              </span>
            </Link>
            <div style={{ marginTop: "20px" }}>
              <p className="text-xs tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                {t("contact.addressLabel")}
              </p>
              {t("contact.addressValue").split("\n").map((line, i) => (
                <p key={i} className="text-sm" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Collection */}
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
              {t("footer.collectionLabel")}
            </p>
            <ul className="flex flex-col gap-3">
              {(["footer.allWorks", "footer.seascapes", "footer.sky", "footer.night"] as const).map((key) => (
                <li key={key}>
                  <a
                    href="#"
                    className="text-sm transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >
                    {t(key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
              {t("footer.legalLabel")}
            </p>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
              {t("footer.newsletterLabel")}
            </p>
            <p className="text-sm leading-relaxed mb-5 max-w-[200px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              {t("footer.newsletterBody")}
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("footer.emailPlaceholder")}
              className="w-full text-sm px-4 py-3 mb-3 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }}
            />
            <button
              className="w-full py-3 text-sm font-medium tracking-wider transition-opacity duration-200 hover:opacity-80"
              style={{ background: "#f0ece4", color: "#0a0a0a" }}
            >
              {t("footer.subscribe")}
            </button>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
              {t("footer.socialLabel")}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Pinterest"
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
                style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} KuzayArt — {t("footer.copyright")}
          </p>
          <p className="text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.15)" }}>
            {t("footer.credit")}
          </p>
        </div>
      </div>
    </footer>
  );
}
