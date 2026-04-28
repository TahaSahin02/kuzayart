"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Iletisim() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mailto fallback — backend entegrasyonu eklenene kadar
    const subject = encodeURIComponent(`KuzayArt İletişim — ${form.name}`);
    const body = encodeURIComponent(`Ad: ${form.name}\nE-posta: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:info@kuzayart.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#f0ece4",
    outline: "none",
    width: "100%",
    padding: "14px 16px",
    fontSize: "14px",
    transition: "border-color 0.2s",
  } as React.CSSProperties;

  return (
    <>
      <Header />
      <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>

        {/* Hero başlık */}
        <div
          style={{
            maxWidth: "1400px",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "48px",
            paddingRight: "48px",
            paddingTop: "140px",
            paddingBottom: "80px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            İletişim
          </p>
          <h1
            className="font-light leading-tight"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              color: "#f0ece4",
            }}
          >
            Bir sorunuz mu var?
          </h1>
        </div>

        {/* İçerik */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24"
          style={{
            maxWidth: "1400px",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "48px",
            paddingRight: "48px",
            paddingTop: "80px",
            paddingBottom: "140px",
          }}
        >

          {/* Sol — bilgiler */}
          <div className="flex flex-col gap-10">
            <p
              className="text-sm leading-loose"
              style={{ color: "rgba(255,255,255,0.45)", maxWidth: "420px" }}
            >
              Eserler hakkında soru sormak, ölçü veya teslimat detaylarını öğrenmek ya da
              sadece merhaba demek için yazın. En kısa sürede dönüş yaparım.
            </p>

            <div className="flex flex-col gap-6">
              {/* E-posta */}
              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-2"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  E-posta
                </p>
                <a
                  href="mailto:info@kuzayart.com"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#c9a96e" }}
                >
                  info@kuzayart.com
                </a>
              </div>

              {/* Telefon */}
              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-2"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  Telefon
                </p>
                <a
                  href="tel:+905332760897"
                  className="text-sm transition-colors duration-200"
                  style={{ color: "#c9a96e" }}
                >
                  +90 533 276 08 97
                </a>
              </div>

              {/* Sosyal */}
              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-3"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  Sosyal Medya
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
                    style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
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
                    style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ — form */}
          <div>
            {sent ? (
              <div
                className="flex flex-col items-start gap-4"
                style={{ paddingTop: "16px" }}
              >
                <p
                  className="font-light"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "2rem",
                    color: "#f0ece4",
                  }}
                >
                  Mesajınız iletildi.
                </p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  En kısa sürede size dönüş yapacağım.
                </p>
                <button
                  onClick={() => { setForm({ name: "", email: "", message: "" }); setSent(false); }}
                  className="mt-4 text-xs tracking-[0.2em] uppercase transition-colors duration-200"
                  style={{ color: "#c9a96e" }}
                >
                  Yeni mesaj →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label
                    className="block text-xs tracking-[0.15em] uppercase mb-2"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Adınız
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Adınız Soyadınız"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs tracking-[0.15em] uppercase mb-2"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    E-posta
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="ornek@email.com"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs tracking-[0.15em] uppercase mb-2"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    Mesajınız
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Sormak istediğiniz şeyi yazın..."
                    style={{ ...inputStyle, resize: "none" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 px-8 py-4 text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:bg-[#c9a96e] hover:border-[#c9a96e] hover:text-black"
                  style={{
                    border: "1px solid rgba(201,169,110,0.5)",
                    color: "#c9a96e",
                    alignSelf: "flex-start",
                  }}
                >
                  Gönder
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
