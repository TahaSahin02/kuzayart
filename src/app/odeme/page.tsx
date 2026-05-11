"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function Odeme() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { t } = useLang();
  const { format, toTRY } = useCurrency();

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [form, setForm] = useState({ address: "", phone: "" });
  const [iframeToken, setIframeToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("kz_user");
    if (!stored) {
      router.replace("/giris?next=/odeme");
      return;
    }
    setUser(JSON.parse(stored));
    if (items.length === 0) router.replace("/sepet");
  }, [router, items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Convert total EUR → TRY for PayTR (PayTR only accepts TRY)
    const totalTRYKurus = Math.round(toTRY(total) * 100);

    const res = await fetch("/api/paytr/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paintingIds: items.map((i) => i.id),
        address: form.address,
        phone: form.phone,
        totalTRYKurus,
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

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#f0ece4",
    width: "100%",
    padding: "14px 16px",
    fontSize: "14px",
    outline: "none",
  } as React.CSSProperties;

  if (!user || items.length === 0) return null;

  return (
    <>
      <Header />
      <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <div
          style={{
            maxWidth: "760px",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "24px",
            paddingRight: "24px",
            paddingTop: "130px",
            paddingBottom: "120px",
          }}
        >
          <p
            className="text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {t("checkout.payment")}
          </p>
          <h1
            className="font-light mb-10"
            style={{ fontFamily: "var(--font-cormorant)", fontSize: "2.8rem", color: "#f0ece4" }}
          >
            {t("checkout.title")}
          </h1>

          {/* Items */}
          <div
            className="flex flex-col gap-3 mb-8 pb-8"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm" style={{ color: "#f0ece4" }}>
                    {item.title}
                  </p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {item.medium} · {item.dimensions}
                  </p>
                </div>
                <p
                  className="font-light"
                  style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.2rem", color: "#f0ece4" }}
                >
                  {format(item.price)}
                </p>
              </div>
            ))}
            <div
              className="flex justify-between items-center mt-2 pt-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {t("checkout.total")}
              </p>
              <p
                className="font-light text-2xl"
                style={{ fontFamily: "var(--font-cormorant)", color: "#c9a96e" }}
              >
                {format(total)}
              </p>
            </div>
          </div>

          {/* PayTR iframe or form */}
          {iframeToken ? (
            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-4"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {t("checkout.securePay")}
              </p>
              <iframe
                src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
                style={{ width: "100%", height: "600px", border: "none" }}
                id="paytr-iframe"
                onLoad={() => clearCart()}
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label
                  className="block text-xs tracking-[0.15em] uppercase mb-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {t("checkout.name")}
                </label>
                <input
                  type="text"
                  disabled
                  value={user.name}
                  style={{ ...inputStyle, opacity: 0.5 }}
                />
              </div>
              <div>
                <label
                  className="block text-xs tracking-[0.15em] uppercase mb-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {t("checkout.email")}
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  style={{ ...inputStyle, opacity: 0.5 }}
                />
              </div>
              <div>
                <label
                  className="block text-xs tracking-[0.15em] uppercase mb-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {t("checkout.address")}
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder={t("checkout.addressPlaceholder")}
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              <div>
                <label
                  className="block text-xs tracking-[0.15em] uppercase mb-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {t("checkout.phone")}
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="05XX XXX XX XX"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              {error && (
                <p className="text-sm" style={{ color: "#f87171" }}>
                  {error}
                </p>
              )}

              <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="text-xs tracking-[0.3em] uppercase transition-all duration-300"
                  style={{
                    background: "transparent",
                    border: `1px solid ${loading ? "rgba(201,169,110,0.3)" : "#c9a96e"}`,
                    color: loading ? "rgba(201,169,110,0.4)" : "#c9a96e",
                    padding: "14px 56px",
                    fontWeight: 400,
                    cursor: loading ? "not-allowed" : "pointer",
                    letterSpacing: "0.3em",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#c9a96e";
                      e.currentTarget.style.color = "#0a0a0a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#c9a96e";
                    }
                  }}
                >
                  {loading ? t("checkout.loading") : t("checkout.proceed")}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
