"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

/* ── Country dial codes ── */
const DIAL_CODES = [
  { flag: "🇹🇷", code: "+90",  label: "TR" },
  { flag: "🇺🇸", code: "+1",   label: "US" },
  { flag: "🇬🇧", code: "+44",  label: "GB" },
  { flag: "🇩🇪", code: "+49",  label: "DE" },
  { flag: "🇫🇷", code: "+33",  label: "FR" },
  { flag: "🇳🇱", code: "+31",  label: "NL" },
  { flag: "🇧🇪", code: "+32",  label: "BE" },
  { flag: "🇨🇭", code: "+41",  label: "CH" },
  { flag: "🇦🇹", code: "+43",  label: "AT" },
  { flag: "🇸🇪", code: "+46",  label: "SE" },
  { flag: "🇳🇴", code: "+47",  label: "NO" },
  { flag: "🇩🇰", code: "+45",  label: "DK" },
  { flag: "🇮🇹", code: "+39",  label: "IT" },
  { flag: "🇪🇸", code: "+34",  label: "ES" },
  { flag: "🇵🇱", code: "+48",  label: "PL" },
  { flag: "🇦🇪", code: "+971", label: "AE" },
  { flag: "🇦🇺", code: "+61",  label: "AU" },
  { flag: "🇨🇦", code: "+1",   label: "CA" },
  { flag: "🇯🇵", code: "+81",  label: "JP" },
];

const COUNTRIES = [
  "Türkiye","United States","United Kingdom","Germany","France","Netherlands",
  "Belgium","Switzerland","Austria","Sweden","Norway","Denmark","Italy","Spain",
  "Poland","United Arab Emirates","Australia","Canada","Japan","Other",
];

export default function Odeme() {
  const router = useRouter();
  const { items, total, clearCart, hydrated } = useCart();
  const { t } = useLang();
  const { rates, format } = useCurrency();

  const [user, setUser]     = useState<{ name: string; email: string } | null>(null);
  const [iframeToken, setIframeToken] = useState<string | null>(null);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState({
    fullName:   "",
    dialCode:   "+90",
    phone:      "",
    address:    "",
    country:    "Türkiye",
    city:       "",
    postalCode: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const stored = localStorage.getItem("kz_user");
    if (!stored) { router.replace("/giris?next=/odeme"); return; }
    const u = JSON.parse(stored) as { name: string; email: string };
    setUser(u);
    setForm((f) => ({ ...f, fullName: u.name }));
  }, [router]);

  useEffect(() => {
    if (hydrated && items.length === 0 && !iframeToken) router.replace("/sepet");
  }, [hydrated, items, iframeToken, router]);

  /* Currency conversion helpers */
  const tryRate = rates?.TRY ?? 55;
  const usdRate = rates?.USD ?? 1.08;

  const fmtEur = (n: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  const fmtTry = (n: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);
  const fmtUsd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("Mesafeli satış sözleşmesini onaylamanız gerekmektedir."); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/paytr/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, type: i.type })),
        fullName:   form.fullName,
        phone:      `${form.dialCode} ${form.phone}`,
        address:    form.address,
        city:       form.city,
        postalCode: form.postalCode,
        country:    form.country,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Ödeme başlatılamadı.");
      setLoading(false);
      return;
    }
    setIframeToken(data.iframeToken);
    setLoading(false);
  };

  /* ── Styles ── */
  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#f0ece4",
    width: "100%",
    padding: "13px 14px",
    fontSize: "14px",
    outline: "none",
    borderRadius: "2px",
  } as React.CSSProperties;

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.35)",
    marginBottom: "8px",
  };

  const focusGold = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)");
  const blurGold  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)");

  if (!user || (hydrated && items.length === 0 && !iframeToken)) return null;

  /* ── PayTR iframe view ── */
  if (iframeToken) {
    return (
      <>
        <Header />
        <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
          <div style={{ maxWidth: "720px", margin: "0 auto", padding: "130px 24px 80px" }}>
            <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
              {t("checkout.securePay")}
            </p>
            <h1 className="font-light mb-8" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.2rem", color: "#f0ece4" }}>
              {t("checkout.title")}
            </h1>
            <iframe
              src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
              style={{ width: "100%", height: "640px", border: "none" }}
              id="paytr-iframe"
            />
          </div>
        </main>
      </>
    );
  }

  /* ── Two-column checkout ── */
  return (
    <>
      <Header />
      <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "130px 24px 100px" }}>

          {/* Page title */}
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
            {t("checkout.payment")}
          </p>
          <h1 className="font-light mb-10" style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.8rem", color: "#f0ece4" }}>
            {t("checkout.title")}
          </h1>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "48px", alignItems: "start" }}>

              {/* ──────── LEFT: Contact Info ──────── */}
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {t("checkout.contactInfo")}
                </p>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px" }} className="flex flex-col gap-5">

                  {/* Full Name */}
                  <div>
                    <label style={labelStyle}>{t("checkout.name")} *</label>
                    <input
                      required
                      type="text"
                      value={form.fullName}
                      onChange={set("fullName")}
                      style={inputStyle}
                      onFocus={focusGold} onBlur={blurGold}
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label style={labelStyle}>{t("checkout.email")}</label>
                    <input type="email" disabled value={user.email} style={{ ...inputStyle, opacity: 0.4, cursor: "not-allowed" }} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={labelStyle}>{t("checkout.phone")} *</label>
                    <div style={{ display: "flex", gap: "0" }}>
                      <select
                        value={form.dialCode}
                        onChange={set("dialCode")}
                        style={{
                          ...inputStyle,
                          width: "auto",
                          minWidth: "88px",
                          borderRight: "none",
                          borderRadius: "2px 0 0 2px",
                          cursor: "pointer",
                          paddingRight: "8px",
                        }}
                        onFocus={focusGold} onBlur={blurGold}
                      >
                        {DIAL_CODES.map((d) => (
                          <option key={d.label + d.code} value={d.code} style={{ background: "#1a1a1a" }}>
                            {d.flag} {d.code}
                          </option>
                        ))}
                      </select>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={set("phone")}
                        placeholder="5XX XXX XX XX"
                        style={{ ...inputStyle, flex: 1, borderRadius: "0 2px 2px 0" }}
                        onFocus={focusGold} onBlur={blurGold}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label style={labelStyle}>{t("checkout.address")} *</label>
                    <textarea
                      required
                      rows={3}
                      value={form.address}
                      onChange={set("address")}
                      placeholder={t("checkout.addressPlaceholder")}
                      style={{ ...inputStyle, resize: "none" }}
                      onFocus={focusGold} onBlur={blurGold}
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label style={labelStyle}>{t("checkout.country")} *</label>
                    <select
                      required
                      value={form.country}
                      onChange={set("country")}
                      style={{ ...inputStyle, cursor: "pointer" }}
                      onFocus={focusGold} onBlur={blurGold}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} style={{ background: "#1a1a1a" }}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* City + Postal */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={labelStyle}>{t("checkout.city")} *</label>
                      <input
                        required
                        type="text"
                        value={form.city}
                        onChange={set("city")}
                        style={inputStyle}
                        onFocus={focusGold} onBlur={blurGold}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>{t("checkout.postal")} *</label>
                      <input
                        required
                        type="text"
                        value={form.postalCode}
                        onChange={set("postalCode")}
                        style={inputStyle}
                        onFocus={focusGold} onBlur={blurGold}
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", marginTop: "4px" }}>
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      style={{ marginTop: "3px", accentColor: "#c9a96e", width: "16px", height: "16px", flexShrink: 0 }}
                    />
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                      {t("checkout.terms1")}{" "}
                      <a href="/yasal/mesafeli-satis" target="_blank" style={{ color: "#c9a96e", textDecoration: "underline" }}>
                        {t("checkout.termsLink1")}
                      </a>{" "}
                      {t("checkout.terms2")}{" "}
                      <a href="/yasal/iptal-iade" target="_blank" style={{ color: "#c9a96e", textDecoration: "underline" }}>
                        {t("checkout.termsLink2")}
                      </a>{" "}
                      {t("checkout.terms3")}
                    </span>
                  </label>

                  {error && <p style={{ color: "#f87171", fontSize: "13px" }}>{error}</p>}

                  {/* Submit */}
                  <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "8px" }}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="text-xs tracking-[0.3em] uppercase transition-all duration-300"
                      style={{
                        background:  loading ? "rgba(201,169,110,0.15)" : "transparent",
                        border:      `1px solid ${loading ? "rgba(201,169,110,0.3)" : "#c9a96e"}`,
                        color:       loading ? "rgba(201,169,110,0.4)" : "#c9a96e",
                        padding:     "15px 60px",
                        cursor:      loading ? "not-allowed" : "pointer",
                      }}
                      onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = "#c9a96e"; e.currentTarget.style.color = "#0a0a0a"; }}}
                      onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c9a96e"; }}}
                    >
                      {loading ? t("checkout.loading") : t("checkout.proceed")}
                    </button>
                  </div>

                </div>
              </div>

              {/* ──────── RIGHT: Order Summary ──────── */}
              <div style={{ position: "sticky", top: "120px" }}>
                <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {t("checkout.orderSummary")}
                </p>

                <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>

                  {/* Items */}
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.type}`}
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "center",
                        padding: "16px 20px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{ position: "relative", width: 64, height: 48, flexShrink: 0 }}>
                        <Image src={item.src} alt={item.title} fill className="object-cover" sizes="64px" style={{ borderRadius: "2px" }} />
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", fontWeight: 300, color: "#f0ece4", lineHeight: 1.3 }}>
                          {item.title}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                          <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                            {item.medium}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              padding: "1px 7px",
                              border: item.type === "original"
                                ? "1px solid rgba(201,169,110,0.4)"
                                : "1px solid rgba(255,255,255,0.15)",
                              color: item.type === "original" ? "#c9a96e" : "rgba(255,255,255,0.45)",
                            }}
                          >
                            {item.type === "original" ? t("product.original") : t("product.print")}
                          </span>
                        </div>
                      </div>
                      {/* Price */}
                      <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.15rem", fontWeight: 300, color: "#f0ece4", flexShrink: 0 }}>
                        {fmtEur(item.price)}
                      </p>
                    </div>
                  ))}

                  {/* Shipping note */}
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "12px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }}>
                      {t("checkout.shipping")}
                    </p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{t("checkout.shippingNote")}</p>
                  </div>

                  {/* Total */}
                  <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
                      <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                        {t("checkout.total")}
                      </p>
                      <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 300, color: "#f0ece4" }}>
                        {fmtEur(total)}
                      </p>
                    </div>

                    {/* Currency conversions */}
                    <div style={{ paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <p style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", marginBottom: "6px" }}>
                        {t("checkout.approxConversion")}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>USD</span>
                          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-cormorant)" }}>
                            {fmtUsd(total * usdRate)}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>TRY</span>
                          <span style={{ fontSize: "13px", color: "#c9a96e", fontFamily: "var(--font-cormorant)" }}>
                            {fmtTry(total * tryRate)}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", marginTop: "8px", lineHeight: 1.5 }}>
                        {t("checkout.paytrTryNote")}
                      </p>
                    </div>
                  </div>

                  {/* PayTR badge */}
                  <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)" }}>
                      Güvenli ödeme altyapısı: PayTR
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>
      </main>
    </>
  );
}
