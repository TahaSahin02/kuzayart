"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/contexts/LanguageContext";

export default function Hakkinda() {
  const { t } = useLang();

  const approach = [
    { no: "01", titleKey: "about.t1.title", bodyKey: "about.t1.body" },
    { no: "02", titleKey: "about.t2.title", bodyKey: "about.t2.body" },
    { no: "03", titleKey: "about.t3.title", bodyKey: "about.t3.body" },
  ];

  return (
    <>
      <Header />
      <main style={{ background: "#0a0a0a" }}>

        {/* Hero */}
        <section className="relative w-full flex items-end overflow-hidden" style={{ height: "100svh" }}>
          <Image
            src="/paintings/tarama3.png"
            alt="Didem Kuzay"
            fill
            quality={100}
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.3) 50%, rgba(10,10,10,0.2) 100%)",
            }}
          />
          <div
            className="relative z-10 w-full"
            style={{
              maxWidth: "1400px",
              marginLeft: "auto",
              marginRight: "auto",
              paddingLeft: "24px",
              paddingRight: "24px",
              paddingBottom: "80px",
            }}
          >
            <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "#c9a96e", opacity: 0.9 }}>
              {t("about.artist")}
            </p>
            <h1
              className="font-light leading-none"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(3.5rem, 10vw, 8rem)",
                color: "#f0ece4",
                letterSpacing: "0.02em",
              }}
            >
              Didem Kuzay
            </h1>
            <p className="mt-5 text-sm tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
              {t("about.painter")}
            </p>
          </div>
        </section>

        {/* Quote */}
        <section style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingTop: "96px", paddingBottom: "96px" }}>
          <div style={{ maxWidth: "900px", marginLeft: "auto", marginRight: "auto", paddingLeft: "24px", paddingRight: "24px" }}>
            <blockquote
              className="font-light leading-relaxed text-center"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
                color: "#f0ece4",
                letterSpacing: "0.01em",
              }}
            >
              {t("about.quote")}
            </blockquote>
          </div>
        </section>

        {/* Biography */}
        <section style={{ paddingTop: "100px", paddingBottom: "100px" }}>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start"
            style={{ maxWidth: "1400px", marginLeft: "auto", marginRight: "auto", paddingLeft: "24px", paddingRight: "24px" }}
          >
            <div className="md:sticky top-32">
              <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                {t("about.bio.label")}
              </p>
              <h2
                className="font-light leading-tight"
                style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#f0ece4" }}
              >
                {t("about.bio.title").split("\n").map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </h2>
              <div className="mt-8 w-12" style={{ height: "1px", background: "#c9a96e", opacity: 0.5 }} />
            </div>

            <div className="flex flex-col gap-6 text-sm leading-loose" style={{ color: "rgba(255,255,255,0.55)" }}>
              <p>{t("about.bio.p1")}</p>
              <p>{t("about.bio.p2")}</p>
              <p>{t("about.bio.p3")}</p>
              <p>{t("about.bio.p4")}</p>
            </div>
          </div>
        </section>

        {/* Approach */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "100px", paddingBottom: "100px" }}>
          <div style={{ maxWidth: "1400px", marginLeft: "auto", marginRight: "auto", paddingLeft: "24px", paddingRight: "24px" }}>
            <p className="text-xs tracking-[0.35em] uppercase mb-16" style={{ color: "rgba(255,255,255,0.3)" }}>
              {t("about.approach.label")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {approach.map((item) => (
                <div key={item.no}>
                  <p className="text-xs tracking-[0.2em] mb-5" style={{ color: "#c9a96e", opacity: 0.7 }}>
                    {item.no}
                  </p>
                  <h3
                    className="font-light mb-4"
                    style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", color: "#f0ece4" }}
                  >
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {t(item.bodyKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "100px", paddingBottom: "120px" }}>
          <div
            className="text-center"
            style={{ maxWidth: "600px", marginLeft: "auto", marginRight: "auto", paddingLeft: "24px", paddingRight: "24px" }}
          >
            <p className="text-xs tracking-[0.35em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
              {t("about.cta.label")}
            </p>
            <h2
              className="font-light mb-8"
              style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#f0ece4" }}
            >
              {t("about.cta.title")}
            </h2>
            <p className="text-sm leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>
              {t("about.cta.body")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:info@kuzayart.com"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:bg-[#c9a96e] hover:border-[#c9a96e] hover:text-black"
                style={{ border: "1px solid rgba(201,169,110,0.5)", color: "#c9a96e" }}
              >
                {t("about.cta.email")}
              </a>
              <a
                href="tel:+905332760897"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.25em] uppercase transition-colors duration-300 hover:text-white/80"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                +90 533 276 08 97
              </a>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
