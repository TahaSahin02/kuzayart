"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

/* ── Dial codes — sorted: TR first, then alphabetical ── */
const DIAL_CODES = [
  { flag: "🇹🇷", code: "+90",  label: "TR +90" },
  { flag: "🇦🇫", code: "+93",  label: "AF +93" },
  { flag: "🇦🇱", code: "+355", label: "AL +355" },
  { flag: "🇩🇿", code: "+213", label: "DZ +213" },
  { flag: "🇦🇩", code: "+376", label: "AD +376" },
  { flag: "🇦🇴", code: "+244", label: "AO +244" },
  { flag: "🇦🇷", code: "+54",  label: "AR +54" },
  { flag: "🇦🇲", code: "+374", label: "AM +374" },
  { flag: "🇦🇺", code: "+61",  label: "AU +61" },
  { flag: "🇦🇹", code: "+43",  label: "AT +43" },
  { flag: "🇦🇿", code: "+994", label: "AZ +994" },
  { flag: "🇧🇭", code: "+973", label: "BH +973" },
  { flag: "🇧🇩", code: "+880", label: "BD +880" },
  { flag: "🇧🇾", code: "+375", label: "BY +375" },
  { flag: "🇧🇪", code: "+32",  label: "BE +32" },
  { flag: "🇧🇴", code: "+591", label: "BO +591" },
  { flag: "🇧🇦", code: "+387", label: "BA +387" },
  { flag: "🇧🇷", code: "+55",  label: "BR +55" },
  { flag: "🇧🇬", code: "+359", label: "BG +359" },
  { flag: "🇨🇦", code: "+1",   label: "CA +1" },
  { flag: "🇨🇱", code: "+56",  label: "CL +56" },
  { flag: "🇨🇳", code: "+86",  label: "CN +86" },
  { flag: "🇨🇴", code: "+57",  label: "CO +57" },
  { flag: "🇭🇷", code: "+385", label: "HR +385" },
  { flag: "🇨🇿", code: "+420", label: "CZ +420" },
  { flag: "🇩🇰", code: "+45",  label: "DK +45" },
  { flag: "🇪🇬", code: "+20",  label: "EG +20" },
  { flag: "🇪🇪", code: "+372", label: "EE +372" },
  { flag: "🇪🇹", code: "+251", label: "ET +251" },
  { flag: "🇫🇮", code: "+358", label: "FI +358" },
  { flag: "🇫🇷", code: "+33",  label: "FR +33" },
  { flag: "🇬🇪", code: "+995", label: "GE +995" },
  { flag: "🇩🇪", code: "+49",  label: "DE +49" },
  { flag: "🇬🇭", code: "+233", label: "GH +233" },
  { flag: "🇬🇷", code: "+30",  label: "GR +30" },
  { flag: "🇭🇺", code: "+36",  label: "HU +36" },
  { flag: "🇮🇸", code: "+354", label: "IS +354" },
  { flag: "🇮🇳", code: "+91",  label: "IN +91" },
  { flag: "🇮🇩", code: "+62",  label: "ID +62" },
  { flag: "🇮🇷", code: "+98",  label: "IR +98" },
  { flag: "🇮🇶", code: "+964", label: "IQ +964" },
  { flag: "🇮🇪", code: "+353", label: "IE +353" },
  { flag: "🇮🇱", code: "+972", label: "IL +972" },
  { flag: "🇮🇹", code: "+39",  label: "IT +39" },
  { flag: "🇯🇵", code: "+81",  label: "JP +81" },
  { flag: "🇯🇴", code: "+962", label: "JO +962" },
  { flag: "🇰🇿", code: "+7",   label: "KZ +7" },
  { flag: "🇰🇪", code: "+254", label: "KE +254" },
  { flag: "🇰🇷", code: "+82",  label: "KR +82" },
  { flag: "🇰🇼", code: "+965", label: "KW +965" },
  { flag: "🇰🇬", code: "+996", label: "KG +996" },
  { flag: "🇱🇻", code: "+371", label: "LV +371" },
  { flag: "🇱🇧", code: "+961", label: "LB +961" },
  { flag: "🇱🇾", code: "+218", label: "LY +218" },
  { flag: "🇱🇹", code: "+370", label: "LT +370" },
  { flag: "🇱🇺", code: "+352", label: "LU +352" },
  { flag: "🇲🇰", code: "+389", label: "MK +389" },
  { flag: "🇲🇾", code: "+60",  label: "MY +60" },
  { flag: "🇲🇻", code: "+960", label: "MV +960" },
  { flag: "🇲🇱", code: "+223", label: "ML +223" },
  { flag: "🇲🇹", code: "+356", label: "MT +356" },
  { flag: "🇲🇦", code: "+212", label: "MA +212" },
  { flag: "🇲🇽", code: "+52",  label: "MX +52" },
  { flag: "🇲🇩", code: "+373", label: "MD +373" },
  { flag: "🇲🇨", code: "+377", label: "MC +377" },
  { flag: "🇲🇳", code: "+976", label: "MN +976" },
  { flag: "🇲🇪", code: "+382", label: "ME +382" },
  { flag: "🇳🇱", code: "+31",  label: "NL +31" },
  { flag: "🇳🇿", code: "+64",  label: "NZ +64" },
  { flag: "🇳🇬", code: "+234", label: "NG +234" },
  { flag: "🇳🇴", code: "+47",  label: "NO +47" },
  { flag: "🇴🇲", code: "+968", label: "OM +968" },
  { flag: "🇵🇰", code: "+92",  label: "PK +92" },
  { flag: "🇵🇸", code: "+970", label: "PS +970" },
  { flag: "🇵🇱", code: "+48",  label: "PL +48" },
  { flag: "🇵🇹", code: "+351", label: "PT +351" },
  { flag: "🇶🇦", code: "+974", label: "QA +974" },
  { flag: "🇷🇴", code: "+40",  label: "RO +40" },
  { flag: "🇷🇺", code: "+7",   label: "RU +7" },
  { flag: "🇸🇦", code: "+966", label: "SA +966" },
  { flag: "🇷🇸", code: "+381", label: "RS +381" },
  { flag: "🇸🇬", code: "+65",  label: "SG +65" },
  { flag: "🇸🇰", code: "+421", label: "SK +421" },
  { flag: "🇸🇮", code: "+386", label: "SI +386" },
  { flag: "🇿🇦", code: "+27",  label: "ZA +27" },
  { flag: "🇪🇸", code: "+34",  label: "ES +34" },
  { flag: "🇸🇪", code: "+46",  label: "SE +46" },
  { flag: "🇨🇭", code: "+41",  label: "CH +41" },
  { flag: "🇸🇾", code: "+963", label: "SY +963" },
  { flag: "🇹🇼", code: "+886", label: "TW +886" },
  { flag: "🇹🇯", code: "+992", label: "TJ +992" },
  { flag: "🇹🇿", code: "+255", label: "TZ +255" },
  { flag: "🇹🇭", code: "+66",  label: "TH +66" },
  { flag: "🇹🇳", code: "+216", label: "TN +216" },
  { flag: "🇹🇲", code: "+993", label: "TM +993" },
  { flag: "🇺🇦", code: "+380", label: "UA +380" },
  { flag: "🇦🇪", code: "+971", label: "AE +971" },
  { flag: "🇬🇧", code: "+44",  label: "GB +44" },
  { flag: "🇺🇸", code: "+1",   label: "US +1" },
  { flag: "🇺🇾", code: "+598", label: "UY +598" },
  { flag: "🇺🇿", code: "+998", label: "UZ +998" },
  { flag: "🇻🇪", code: "+58",  label: "VE +58" },
  { flag: "🇻🇳", code: "+84",  label: "VN +84" },
  { flag: "🇾🇪", code: "+967", label: "YE +967" },
];

const COUNTRIES = [
  "Türkiye","Afghanistan","Albania","Algeria","Andorra","Angola","Argentina",
  "Armenia","Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Belarus",
  "Belgium","Bolivia","Bosnia and Herzegovina","Brazil","Bulgaria","Canada",
  "Chile","China","Colombia","Croatia","Czech Republic","Denmark","Egypt",
  "Estonia","Ethiopia","Finland","France","Georgia","Germany","Ghana","Greece",
  "Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel",
  "Italy","Japan","Jordan","Kazakhstan","Kenya","South Korea","Kuwait",
  "Kyrgyzstan","Latvia","Lebanon","Libya","Lithuania","Luxembourg",
  "North Macedonia","Malaysia","Maldives","Malta","Morocco","Mexico",
  "Moldova","Monaco","Mongolia","Montenegro","Netherlands","New Zealand",
  "Nigeria","Norway","Oman","Pakistan","Palestine","Poland","Portugal",
  "Qatar","Romania","Russia","Saudi Arabia","Serbia","Singapore","Slovakia",
  "Slovenia","South Africa","Spain","Sweden","Switzerland","Syria","Taiwan",
  "Tajikistan","Tanzania","Thailand","Tunisia","Turkmenistan","Ukraine",
  "United Arab Emirates","United Kingdom","United States","Uruguay",
  "Uzbekistan","Venezuela","Vietnam","Yemen",
];

export default function Odeme() {
  const router = useRouter();
  const { items, total, clearCart, hydrated } = useCart();
  const { t } = useLang();
  const { rates } = useCurrency();

  const [user, setUser]     = useState<{ name: string; email: string } | null>(null);
  const [iframeToken, setIframeToken] = useState<string | null>(null);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [form, setForm] = useState({
    fullName:      "",
    dialCode:      "+90",
    dialOther:     "",   // manual dial code when "other" selected
    phone:         "",
    address:       "",
    country:       "Türkiye",
    countryOther:  "",  // manual country when "Other" selected
    city:          "",
    postalCode:    "",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
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
    if (!agreed) {
      setError(t("checkout.termsRequired"));
      return;
    }
    setLoading(true);
    setError("");

    const dialCode    = form.dialCode === "other" ? form.dialOther.trim() : form.dialCode;
    const countryVal  = form.country  === "Other"  ? form.countryOther.trim() : form.country;

    const res = await fetch("/api/paytr/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items:      items.map((i) => ({ id: i.id, type: i.type })),
        fullName:   form.fullName,
        phone:      `${dialCode} ${form.phone}`,
        address:    form.address,
        city:       form.city,
        postalCode: form.postalCode,
        country:    countryVal,
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

  /* ── Shared styles ── */
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

  const focusGold = (e: React.FocusEvent<HTMLElement>) =>
    ((e.currentTarget as HTMLElement).style.borderColor = "rgba(201,169,110,0.5)");
  const blurGold  = (e: React.FocusEvent<HTMLElement>) =>
    ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)");

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
                <p style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
                  {t("checkout.contactInfo")}
                </p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px" }} className="flex flex-col gap-5">

                  {/* Full Name */}
                  <div>
                    <label style={labelStyle}>{t("checkout.name")} *</label>
                    <input required type="text" value={form.fullName} onChange={set("fullName")}
                      style={inputStyle} onFocus={focusGold} onBlur={blurGold} />
                  </div>

                  {/* Email */}
                  <div>
                    <label style={labelStyle}>{t("checkout.email")}</label>
                    <input type="email" disabled value={user.email}
                      style={{ ...inputStyle, opacity: 0.4, cursor: "not-allowed" }} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={labelStyle}>{t("checkout.phone")} *</label>
                    <div style={{ display: "flex" }}>
                      <select value={form.dialCode} onChange={set("dialCode")}
                        style={{ ...inputStyle, width: "130px", flexShrink: 0, borderRight: "none", borderRadius: "2px 0 0 2px", cursor: "pointer" }}
                        onFocus={focusGold} onBlur={blurGold}>
                        {DIAL_CODES.map((d) => (
                          <option key={d.code + d.label} value={d.code} style={{ background: "#1a1a1a" }}>
                            {d.flag} {d.label}
                          </option>
                        ))}
                        <option value="other" style={{ background: "#1a1a1a" }}>✎ Other</option>
                      </select>
                      {form.dialCode === "other" ? (
                        <input required type="text" value={form.dialOther} onChange={set("dialOther")}
                          placeholder="+XXX" style={{ ...inputStyle, width: "90px", flexShrink: 0, borderRight: "none", borderRadius: 0 }}
                          onFocus={focusGold} onBlur={blurGold} />
                      ) : null}
                      <input required type="tel" value={form.phone} onChange={set("phone")}
                        placeholder="5XX XXX XX XX"
                        style={{ ...inputStyle, flex: 1, borderRadius: form.dialCode === "other" ? "0 2px 2px 0" : "0 2px 2px 0" }}
                        onFocus={focusGold} onBlur={blurGold} />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label style={labelStyle}>{t("checkout.address")} *</label>
                    <textarea required rows={3} value={form.address} onChange={set("address")}
                      placeholder={t("checkout.addressPlaceholder")}
                      style={{ ...inputStyle, resize: "none" }} onFocus={focusGold} onBlur={blurGold} />
                  </div>

                  {/* Country */}
                  <div>
                    <label style={labelStyle}>{t("checkout.country")} *</label>
                    <select required value={form.country} onChange={set("country")}
                      style={{ ...inputStyle, cursor: "pointer" }} onFocus={focusGold} onBlur={blurGold}>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c} style={{ background: "#1a1a1a" }}>{c}</option>
                      ))}
                      <option value="Other" style={{ background: "#1a1a1a" }}>✎ Other (manual)</option>
                    </select>
                    {form.country === "Other" && (
                      <input required type="text" value={form.countryOther} onChange={set("countryOther")}
                        placeholder="Enter your country..."
                        style={{ ...inputStyle, marginTop: "8px" }} onFocus={focusGold} onBlur={blurGold} />
                    )}
                  </div>

                  {/* City + Postal */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={labelStyle}>{t("checkout.city")} *</label>
                      <input required type="text" value={form.city} onChange={set("city")}
                        style={inputStyle} onFocus={focusGold} onBlur={blurGold} />
                    </div>
                    <div>
                      <label style={labelStyle}>{t("checkout.postal")} *</label>
                      <input required type="text" value={form.postalCode} onChange={set("postalCode")}
                        style={inputStyle} onFocus={focusGold} onBlur={blurGold} />
                    </div>
                  </div>

                  {/* Terms */}
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer", marginTop: "4px" }}>
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                      style={{ marginTop: "3px", accentColor: "#c9a96e", width: "16px", height: "16px", flexShrink: 0 }} />
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

                  {/* Submit — no CSS uppercase to avoid Turkish İ bug */}
                  <div style={{ marginTop: "8px" }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        background:    "transparent",
                        border:        `1px solid ${loading ? "rgba(201,169,110,0.3)" : "#c9a96e"}`,
                        color:         loading ? "rgba(201,169,110,0.4)" : "#c9a96e",
                        padding:       "15px 60px",
                        fontSize:      "12px",
                        letterSpacing: "0.28em",
                        cursor:        loading ? "not-allowed" : "pointer",
                        transition:    "all 0.3s",
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
                <p style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
                  {t("checkout.orderSummary")}
                </p>

                <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>

                  {/* Items */}
                  {items.map((item) => (
                    <div key={`${item.id}-${item.type}`} style={{
                      display: "flex", gap: "14px", alignItems: "center",
                      padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <div style={{ position: "relative", width: 60, height: 45, flexShrink: 0 }}>
                        <Image src={item.src} alt={item.title} fill className="object-cover" sizes="60px" style={{ borderRadius: "2px" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", fontWeight: 300, color: "#f0ece4", lineHeight: 1.3 }}>
                          {item.title}
                        </p>
                        <div style={{ display: "flex", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                            {item.medium}
                          </span>
                          <span style={{
                            fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
                            padding: "1px 7px",
                            border: item.type === "original" ? "1px solid rgba(201,169,110,0.4)" : "1px solid rgba(255,255,255,0.15)",
                            color:  item.type === "original" ? "#c9a96e" : "rgba(255,255,255,0.45)",
                          }}>
                            {item.type === "original" ? t("product.original") : t("product.print")}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", fontWeight: 300, color: "#f0ece4", flexShrink: 0 }}>
                        {fmtEur(item.price)}
                      </p>
                    </div>
                  ))}

                  {/* Shipping */}
                  <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{t("checkout.shipping")}</span>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{t("checkout.shippingNote")}</span>
                  </div>

                  {/* Total + conversions */}
                  <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
                      <p style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                        {t("checkout.total")}
                      </p>
                      <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.8rem", fontWeight: 300, color: "#f0ece4" }}>
                        {fmtEur(total)}
                      </p>
                    </div>

                    <div style={{ paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <p style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "8px" }}>
                        {t("checkout.approxConversion")}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontSize: "13px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)" }}>USD</span>
                          <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.7rem", fontWeight: 300, color: "rgba(255,255,255,0.7)" }}>
                            {fmtUsd(total * usdRate)}
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontSize: "13px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)" }}>TRY</span>
                          <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.7rem", fontWeight: 300, color: "#c9a96e" }}>
                            {fmtTry(total * tryRate)}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.18)", marginTop: "10px", lineHeight: 1.6 }}>
                        {t("checkout.paytrTryNote")}
                      </p>
                    </div>
                  </div>

                  {/* PayTR lock badge */}
                  <div style={{ padding: "13px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span style={{ fontSize: "11px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.18)" }}>
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
